import pandas as pd
import numpy as np
import json

def create_synthetic_historical_data():
    """Generates synthetic 11-year OMNI and GOES data for demonstration."""
    print("Generating 11-year synthetic history (2010-2020)...")
    date_rng = pd.date_range(start='2010-01-01', end='2020-12-31 23:55:00', freq='5min')
    
    n = len(date_rng)
    np.random.seed(42)
    
    # OMNI Synthetic (random walks and some storm cycles)
    speed_base = 400 + np.sin(np.linspace(0, 100*np.pi, n)) * 100
    speed_noise = np.random.normal(0, 20, n)
    speed = speed_base + speed_noise
    
    bz_base = np.sin(np.linspace(0, 200*np.pi, n)) * 5
    bz_noise = np.random.normal(0, 2, n)
    bz = bz_base + bz_noise
    
    pressure = np.clip(np.random.normal(2, 1, n), 0.1, 10)
    symh = np.clip(np.random.normal(-10, 5, n) - (speed > 550) * 50 + (bz < -5) * -50, -300, 50)
    
    # GOES Synthetic
    # Normal flux around 1e2 - 1e4. Storms when speed high and bz negative
    flux_base = np.random.lognormal(mean=np.log(500), sigma=1, size=n)
    storm_multiplier = np.where((speed > 500) & (bz < 0), np.random.uniform(50, 500, n), 1)
    flux = flux_base * storm_multiplier
    
    df = pd.DataFrame({
        "timestamp": date_rng,
        "Speed_km_s": speed,
        "BZ_nT_GSM": bz,
        "Flow_pressure_nPa": pressure,
        "SYM_H_nT": symh,
        "Proton_Temperature_K": np.random.normal(1e5, 2e4, n),
        "Electron_Flux": flux
    })
    
    # Inject 10% missing data randomly
    mask = np.random.rand(n) < 0.1
    df.loc[mask, ["Electron_Flux", "Speed_km_s", "BZ_nT_GSM"]] = np.nan
    
    return df

def build_goes_master():
    df = create_synthetic_historical_data()
    
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
    
    with open("outputs/reports/coverage_report.json", "w") as f:
        json.dump(report, f, indent=4)
        
    print("Coverage report generated.")

if __name__ == "__main__":
    build_goes_master()
