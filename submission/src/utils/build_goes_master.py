import pandas as pd
import numpy as np
import json
import glob
import os

def load_real_historical_data():
    """Loads 11-year real OMNI and GOES-15 data and merges them."""
    print("Loading Real OMNI data (2010-2020)...")
    omni_files = glob.glob("data/omni/omni_5min*.asc")
    
    if not omni_files:
        raise ValueError("No OMNI data found in data/omni/omni_5min*.asc. Please run download_omni_robust.py first.")
        
    omni_dfs = []
    for f in omni_files:
        # Load specific columns:
        # 0: Year, 1: Day, 2: Hour, 3: Minute
        # 18: Bz_GSM, 21: Speed, 26: Temperature, 27: Pressure, 41: SYM_H
        df_o = pd.read_csv(f, sep=r'\s+', header=None, 
                           usecols=[0, 1, 2, 3, 18, 21, 26, 27, 41],
                           names=["Year", "Day", "Hour", "Minute", "BZ_nT_GSM", "Speed_km_s", 
                                  "Proton_Temperature_K", "Flow_pressure_nPa", "SYM_H_nT"])
        
        # Build UTC Timestamp
        df_o["timestamp"] = pd.to_datetime(df_o["Year"] * 1000 + df_o["Day"], format="%Y%j")
        df_o["timestamp"] = df_o["timestamp"] + pd.to_timedelta(df_o["Hour"], unit="h") + pd.to_timedelta(df_o["Minute"], unit="m")
        df_o.drop(columns=["Year", "Day", "Hour", "Minute"], inplace=True)
        
        # Convert fillers to NaN
        fillers = [99.99, 999.99, 9999.99, 9999.9, 99999, 99999.9, 9999999., 999999.9, 999999]
        df_o.replace(fillers, np.nan, inplace=True)
        
        omni_dfs.append(df_o)
        
    omni_df = pd.concat(omni_dfs, ignore_index=True)
    omni_df = omni_df.sort_values("timestamp").drop_duplicates(subset=["timestamp"])
    
    print(f"OMNI loaded: {len(omni_df)} rows")

    print("Loading Real GOES-15 data (2010-2020)...")
    goes_files = glob.glob("GEOShield_RealData_2010_2020/goes15/*_science_v1.0.0.csv")
    
    if not goes_files:
        raise ValueError("No GOES-15 data found.")
        
    goes_dfs = []
    for f in goes_files:
        try:
            skip = 0
            with open(f, 'r') as fp:
                for i, line in enumerate(fp):
                    if line.startswith('time_tag,'):
                        skip = i
                        break
            
            df_g = pd.read_csv(f, skiprows=skip)
            # Use E2W_COR_FLUX (>2 MeV electrons)
            df_g = df_g[["time_tag", "E2W_COR_FLUX"]].copy()
            df_g.rename(columns={"time_tag": "timestamp", "E2W_COR_FLUX": "Electron_Flux"}, inplace=True)
            df_g["timestamp"] = pd.to_datetime(df_g["timestamp"], errors="coerce")
            
            # Remove bad/missing values
            df_g.loc[df_g["Electron_Flux"] < -90000, "Electron_Flux"] = np.nan
            
            df_g.dropna(subset=["timestamp"], inplace=True)
            
            # GOES-15 is 1-minute data, OMNI is 5-minute. We resample GOES to 5-min by taking the mean.
            df_g.set_index("timestamp", inplace=True)
            df_g = df_g.resample("5min").mean()
            df_g.reset_index(inplace=True)
            
            goes_dfs.append(df_g)
        except Exception as e:
            print(f"Error loading {f}: {e}")
            
    goes_df = pd.concat(goes_dfs, ignore_index=True)
    goes_df = goes_df.sort_values("timestamp").drop_duplicates(subset=["timestamp"])
    
    print(f"GOES loaded: {len(goes_df)} rows")
    
    # Merge on timestamp
    df = pd.merge(omni_df, goes_df, on="timestamp", how="outer")
    df = df.sort_values("timestamp").reset_index(drop=True)
    
    print(f"Merged Data shape: {df.shape}")
    return df

def build_goes_master():
    df = load_real_historical_data()
    
    # Forward fill up to 6 hours (72 intervals)
    print("Applying missing data policy...")
    df.set_index("timestamp", inplace=True)
    df.interpolate(method='time', limit=6, inplace=True) # <= 30 min (6 intervals)
    df.ffill(limit=72, inplace=True) # 30 min to 6 hours
    df.reset_index(inplace=True)
    
    # Target 12h
    print("Generating Targets...")
    df["Target_12h"] = df["Electron_Flux"].shift(-144)
    
    # Lags & Rolling
    print("Generating Feature Engineering (lags & rolling)...")
    lag_intervals = {"45m": 9, "3h": 36, "6h": 72, "12h": 144, "24h": 288, "48h": 576}
    
    for col in ["Speed_km_s", "BZ_nT_GSM", "Flow_pressure_nPa", "SYM_H_nT", "Electron_Flux"]:
        # Lags
        for name, intervals in lag_intervals.items():
            df[f"{col}_lag_{name}"] = df[col].shift(intervals)
        
        # Rolling Means
        for name, intervals in [("3h", 36), ("24h", 288)]:
            df[f"{col}_mean_{name}"] = df[col].rolling(window=intervals, min_periods=1).mean()
            
    # Storm Context
    df["storm_candidate"] = ((df["Speed_km_s_mean_24h"] > 500) & (df["BZ_nT_GSM_mean_3h"] < 0)).astype(int)
    for col in ["Electron_Flux", "Speed_km_s", "BZ_nT_GSM"]:
        df[f"{col}_max_24h"] = df[col].rolling(window=288, min_periods=1).max()
        df[f"{col}_std_24h"] = df[col].rolling(window=288, min_periods=1).std().fillna(0)
        
    # Masking condition (drop rows where Target or crucial features are NaN)
    valid_mask = df["Target_12h"].notna() & df["Electron_Flux"].notna() & df["Speed_km_s"].notna()
    df = df[valid_mask].copy()
    
    # Save
    print(f"Saving {len(df)} rows to goes_historical_features.parquet...")
    df.to_parquet("data/goes_historical_features.parquet", index=False)
    
    # Coverage Report
    p95 = df["Electron_Flux"].quantile(0.95)
    storm_count = int(np.sum(df["Electron_Flux"] > p95))
    
    report = {
        "rows": len(df),
        "missing_filtered": int((~valid_mask).sum()),
        "storm_count": storm_count,
        "years": "2010-2020",
        "features": len(df.columns)
    }
    
    os.makedirs("outputs/reports", exist_ok=True)
    with open("outputs/reports/coverage_report.json", "w") as f:
        json.dump(report, f, indent=4)
        
    print("Coverage report generated.")

if __name__ == "__main__":
    build_goes_master()
