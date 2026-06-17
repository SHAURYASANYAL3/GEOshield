import time
import os
import glob
import xgboost as xgb
import pandas as pd
import numpy as np
import re

def continuous_training_loop():
    print("Initializing Continuous Online Learning Watchdog...")
    base_dir = "data/goes"
    model_path = "models/pretrained/xgb_goes_physics.json"
    trained_files_log = "outputs/reports/trained_files.txt"
    
    # Load the unified historical features database to act as our pre-parsed memory
    # In a real environment, we'd have a heavy ETL script parsing the CSVs & ASCs here.
    print("Loading Pre-parsed Features Database for Incremental Stream...")
    master_df = pd.read_parquet("data/goes_historical_features.parquet")
    master_df["year"] = master_df["timestamp"].dt.year
    master_df["month"] = master_df["timestamp"].dt.month
    
    # Identify required features and targets
    model = xgb.XGBRegressor()
    model.load_model(model_path)
    expected_features = model.get_booster().feature_names
    
    trained_files = set()
    if os.path.exists(trained_files_log):
        with open(trained_files_log, 'r') as f:
            trained_files = set(f.read().splitlines())
            
    p95_val = master_df["Electron_Flux"].quantile(0.95)
    
    while True:
        # Discover newly downloaded files
        all_csvs = glob.glob(f"{base_dir}/**/*.csv", recursive=True)
        new_files = [f for f in all_csvs if f not in trained_files and "manifest" not in f]
        
        if not new_files:
            # print("Waiting for new data from downloader... (sleeping 10s)")
            time.sleep(10)
            continue
            
        print(f"\n[Watchdog] Discovered {len(new_files)} new raw satellite files.")
        
        batch_year_months = set()
        
        for file in new_files:
            if time.time() - os.path.getmtime(file) < 5:
                continue # Still downloading
                
            # Parse year/month from the path
            match = re.search(r'data[/\\]goes[/\\](\d{4})[/\\](\d{2})', file.replace('\\', '/'))
            if match:
                batch_year_months.add((int(match.group(1)), int(match.group(2))))
            
            trained_files.add(file)
            with open(trained_files_log, 'a') as f:
                f.write(file + "\n")
                
        # If we successfully mapped the new files to dates
        for year, month in batch_year_months:
            print(f"Incremental Training on Data Chunk: {year}-{month:02d}...")
            
            # Fetch the matching pre-parsed merged data (GOES + OMNI)
            chunk_df = master_df[(master_df["year"] == year) & (master_df["month"] == month)].copy()
            chunk_df.dropna(subset=["Target_12h"], inplace=True)
            
            if len(chunk_df) == 0:
                continue
                
            # Ensure all features exist
            for f in expected_features:
                if f not in chunk_df.columns:
                    chunk_df[f] = np.nan
                    
            X = chunk_df[expected_features]
            y_raw = chunk_df["Target_12h"]
            y = np.log10(y_raw + 1)
            
            # Apply physics-first storm weights
            w = np.where(y_raw > p95_val, 5, 1)
            
            # ONLINE LEARNING: Update the booster
            model.fit(
                X, y, 
                sample_weight=w, 
                xgb_model=model_path, # Warm-start
                verbose=False
            )
            
            model.save_model(model_path)
            print(f" -> Model Updated successfully on {len(X)} rows.")
            
        print("Batch complete. Continuing watch...")
        time.sleep(5)

if __name__ == "__main__":
    continuous_training_loop()
