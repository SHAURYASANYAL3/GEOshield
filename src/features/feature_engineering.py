import pandas as pd

def engineer_features():
    print("Engineering features...")
    df = pd.read_parquet("data/final_merged_data.parquet")
    df.sort_values("timestamp", inplace=True)
    
    # ---------------------------------------------------------
    # 1. Define Targets
    # ---------------------------------------------------------
    # Target is the future value of Electron_Flux
    df["Target_45m"] = df["Electron_Flux"].shift(-9)   # 45m
    df["Target_6h"]  = df["Electron_Flux"].shift(-72)  # 6h
    df["Target_12h"] = df["Electron_Flux"].shift(-144) # 12h
    
    # ---------------------------------------------------------
    # 2. OMNI Features
    # ---------------------------------------------------------
    omni_cols = ["BZ_nT_GSM", "Speed_km_s", "Flow_pressure_nPa", "SYM_H_nT"]
    
    # Lags (intervals: 9=45m, 36=3h, 72=6h, 144=12h, 288=24h, 576=48h)
    lag_steps = {"45m": 9, "3h": 36, "6h": 72, "12h": 144, "24h": 288, "48h": 576}
    
    for col in omni_cols:
        # Lags
        for name, steps in lag_steps.items():
            df[f"{col}_lag_{name}"] = df[col].shift(steps)
            
        # Rolling
        df[f"{col}_mean_3h"]  = df[col].rolling(window=36, min_periods=1).mean()
        df[f"{col}_mean_24h"] = df[col].rolling(window=288, min_periods=1).mean()
        df[f"{col}_std_24h"]  = df[col].rolling(window=288, min_periods=1).std()
        
    # ---------------------------------------------------------
    # 3. GRASP Features
    # ---------------------------------------------------------
    grasp_lags = {"45m": 9, "3h": 36, "6h": 72, "12h": 144, "24h": 288}
    
    # Electron Flux
    for name, steps in grasp_lags.items():
        df[f"Electron_Flux_lag_{name}"] = df["Electron_Flux"].shift(steps)
        
    # Proton Flux (Optional/Experimental)
    for name, steps in grasp_lags.items():
        df[f"Proton_Flux_lag_{name}"] = df["Proton_Flux"].shift(steps)

    # ---------------------------------------------------------
    # 4. Filter missing according to policy
    # ---------------------------------------------------------
    # We want a universal mask where AT LEAST ONE target is valid,
    # OR we can just keep rows where the features are valid, and 
    # train dynamically dropping NaNs for the specific target horizon later.
    # The rule stated: train_mask = target.notna() & features.notna().all(axis=1)
    
    feature_cols = [c for c in df.columns if c not in [
        "timestamp", "Target_45m", "Target_6h", "Target_12h"
    ]]
    
    # Mask: features must be valid
    features_valid = df[feature_cols].notna().all(axis=1)
    
    # Mask: at least one target is valid
    target_valid = df[["Target_45m", "Target_6h", "Target_12h"]].notna().any(axis=1)
    
    train_mask = target_valid & features_valid
    
    final_df = df[train_mask].copy()
    
    print(f"Original shape: {df.shape}")
    print(f"Final shape after masks: {final_df.shape}")
    
    output_file = "data/engineered_features.parquet"
    final_df.to_parquet(output_file, index=False)
    print(f"Engineered features saved to {output_file}")

if __name__ == "__main__":
    engineer_features()
