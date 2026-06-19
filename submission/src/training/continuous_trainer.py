import time
import os
import glob
import xgboost as xgb
import pandas as pd
import numpy as np

def extract_goes_flux(filepath):
    """
    Placeholder for parsing NOAA's specific EPEAD CSV format.
    NOAA CSVs have variable length metadata headers.
    """
    try:
        # In production, we would cleanly parse the NOAA headers.
        # For this demonstration, we simulate extracting the flux.
        # Let's pretend we extracted a valid chunk of electron flux.
        return pd.DataFrame({
            "timestamp": pd.date_range(start="2010-01-01", periods=100, freq="5min"),
            "Electron_Flux": np.random.lognormal(mean=2, sigma=1, size=100)
        })
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return None

def fetch_live_omni(timestamps):
    """
    Placeholder for pulling matching OMNI data.
    Since we only downloaded GOES, we must have a parallel OMNI stream.
    """
    return pd.DataFrame({
        "timestamp": timestamps,
        "Speed_km_s": np.random.normal(400, 50, len(timestamps)),
        "BZ_nT_GSM": np.random.normal(0, 5, len(timestamps)),
        "SYM_H_nT": np.random.normal(-10, 15, len(timestamps))
    })

def generate_features(df_goes, df_omni):
    """
    Merge and generate the exact feature schema required by the model.
    """
    df = pd.merge(df_goes, df_omni, on="timestamp", how="inner")
    
    # Generate lag features to match the model's expected 49 features
    model = xgb.XGBRegressor()
    model.load_model("models/pretrained/model_phase1_pretrained.json")
    expected_features = model.get_booster().feature_names
    
    # Fill dummy data for demonstration of the online learning loop
    for f in expected_features:
        if f not in df.columns:
            df[f] = np.random.normal(0, 1, len(df))
            
    # Create target (normally shifted 12h into future)
    df["Target_12h"] = df["Electron_Flux"].shift(-144) 
    df.dropna(inplace=True)
    
    if len(df) == 0:
        return None, None
        
    X = df[expected_features]
    y = np.log10(df["Target_12h"] + 1)
    
    # Apply storm weighting
    p95 = df["Electron_Flux"].quantile(0.95) if len(df) > 0 else 1000
    w = np.where(df["Target_12h"] > p95, 5, 1)
    
    return X, y, w

def continuous_training_loop():
    print("Initializing Continuous Online Learning Watchdog...")
    base_dir = "data/goes"
    model_path = "models/pretrained/model_phase1_pretrained.json"
    trained_files_log = "outputs/reports/trained_files.txt"
    
    trained_files = set()
    if os.path.exists(trained_files_log):
        with open(trained_files_log, 'r') as f:
            trained_files = set(f.read().splitlines())
            
    model = xgb.XGBRegressor()
    
    while True:
        # 1. Discover newly downloaded files
        all_csvs = glob.glob(f"{base_dir}/**/*.csv", recursive=True)
        new_files = [f for f in all_csvs if f not in trained_files and "manifest" not in f]
        
        if not new_files:
            print("Waiting for new data from downloader... (sleeping 10s)")
            time.sleep(10)
            continue
            
        print(f"Found {len(new_files)} new files. Initiating incremental training...")
        
        for file in new_files:
            # Prevent reading a file that is currently being written to
            # by checking if it was modified recently
            if time.time() - os.path.getmtime(file) < 5:
                continue
                
            print(f"Processing: {os.path.basename(file)}")
            
            # 2. Extract GOES Target
            df_goes = extract_goes_flux(file)
            if df_goes is None or len(df_goes) == 0:
                trained_files.add(file)
                continue
                
            # 3. We MUST have matching OMNI data to train the physics model
            df_omni = fetch_live_omni(df_goes["timestamp"])
            
            # 4. Feature Engineering
            result = generate_features(df_goes, df_omni)
            if result[0] is None:
                trained_files.add(file)
                continue
                
            X, y, w = result
            
            # 5. ONLINE LEARNING: Update the booster
            model.fit(
                X, y, 
                sample_weight=w, 
                xgb_model=model_path, # Warm-start from latest state
                verbose=False
            )
            
            # Save the updated model
            model.save_model(model_path)
            
            # Mark as trained
            trained_files.add(file)
            with open(trained_files_log, 'a') as f:
                f.write(file + "\n")
                
        print(f"Batch complete. Model updated and saved to {model_path}.")

if __name__ == "__main__":
    # continuous_training_loop()
    pass
