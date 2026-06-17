import pandas as pd

def merge_timeseries():
    print("Merging timeseries...")
    master_df = pd.read_parquet("D:/isro/master_time.parquet")
    grasp_df = pd.read_parquet("D:/isro/grasp_parsed.parquet")
    omni_df = pd.read_parquet("D:/isro/omni_parsed.parquet")
    
    # Ensure they are sorted and have exactly the same datetime precision
    master_df["timestamp"] = master_df["timestamp"].astype("datetime64[ns]")
    grasp_df["timestamp"] = grasp_df["timestamp"].astype("datetime64[ns]")
    omni_df["timestamp"] = omni_df["timestamp"].astype("datetime64[ns]")

    master_df.sort_values("timestamp", inplace=True)
    grasp_df.sort_values("timestamp", inplace=True)
    omni_df.sort_values("timestamp", inplace=True)
    
    # Merge GRASP
    merged = pd.merge_asof(
        master_df, 
        grasp_df, 
        on="timestamp", 
        direction="nearest", 
        tolerance=pd.Timedelta("5min")
    )
    
    # Merge OMNI
    merged = pd.merge_asof(
        merged, 
        omni_df, 
        on="timestamp", 
        direction="nearest", 
        tolerance=pd.Timedelta("5min")
    )
    
    print("Merged shape:", merged.shape)
    print("Missing Target (Electron Flux):", merged["Electron_Flux"].isnull().sum())
    
    # Drop rows where the target is missing
    # Since we can't train or validate without a target
    # Wait, the user instructions: "Missing policy: <=30 min interpolate, 30m-6h forward fill, >6h mask sequence"
    # That policy applies mostly to predictors (OMNI). For the target (Electron_Flux), we generally don't want to fake it too much,
    # but let's apply the exact policy to everything for now or just predictors.
    
    def apply_missing_policy(series):
        # 30 min = 6 intervals of 5 min
        # 6 hr = 72 intervals of 5 min
        
        # Identify gap sizes
        m = series.isnull()
        
        # Calculate consecutive missing blocks
        b = (m != m.shift()).cumsum()
        
        # Count the size of each block
        block_sizes = m.groupby(b).transform('sum')
        
        # Rule 1: <= 6 intervals (30 min) -> interpolate
        mask_interp = m & (block_sizes <= 6)
        
        # Rule 2: > 6 and <= 72 intervals (6 hr) -> forward fill
        mask_ffill = m & (block_sizes > 6) & (block_sizes <= 72)
        
        # Rule 3: > 72 intervals (6 hr) -> mask sequence (leave as NaN)
        # We handle this by applying interpolation and forward fill only where allowed.
        
        # Work on a copy
        res = series.copy()
        
        # To apply selectively:
        # First do interpolate on the whole series, but only keep where mask_interp is True
        res_interp = res.interpolate(method='linear')
        res.loc[mask_interp] = res_interp.loc[mask_interp]
        
        # Next do ffill, but only keep where mask_ffill is True
        res_ffill = res.ffill()
        res.loc[mask_ffill] = res_ffill.loc[mask_ffill]
        
        return res

    print("\nApplying missing data policy...")
    for col in merged.columns:
        if col != "timestamp":
            merged[col] = apply_missing_policy(merged[col])

    output_file = "D:/isro/final_merged_data.parquet"
    merged.to_parquet(output_file, index=False)
    print(f"Final merged dataframe saved to {output_file}. Shape: {merged.shape}")
    
    # Quick sanity check
    print("\nFinal Missing %:")
    print(merged.isnull().mean() * 100)

if __name__ == "__main__":
    merge_timeseries()
