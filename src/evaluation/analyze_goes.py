import os
import glob
import pandas as pd
import numpy as np

goes_dir = "D:/isro/GOES-13andGOES-14"
csv_files = glob.glob(os.path.join(goes_dir, "*.csv"))
print(f"Found {len(csv_files)} CSV files.")

stats = []

for f in csv_files:
    fname = os.path.basename(f)
    print(f"Processing {fname}...")
    
    # Read first few lines to find where data starts
    skip_lines = 0
    with open(f, 'r') as file:
        for idx, line in enumerate(file):
            if line.startswith('data:'):
                skip_lines = idx + 1
                break
    
    if skip_lines == 0:
        print(f"Could not find 'data:' in {fname}")
        continue
    
    try:
        df = pd.read_csv(f, skiprows=skip_lines)
        num_records = len(df)
        cols = df.columns.tolist()
        
        # Check for missing/fill values
        # The metadata says missing_value = "-99999" or "99999"
        # We'll replace these with NaN
        df.replace(-99999.0, np.nan, inplace=True)
        df.replace(-99999, np.nan, inplace=True)
        df.replace(99999, np.nan, inplace=True)
        
        missing_pct = df.isnull().mean().mean() * 100
        
        # Find target column if it's electron flux e.g. E1E_COR_FLUX or E>0.8
        target_col = None
        for c in ['E1E_COR_FLUX', 'P1E_COR_FLUX', 'Hp', 'E1_FLUX']:
            if c in cols:
                target_col = c
                break
        
        target_max = df[target_col].max() if target_col else None
        target_mean = df[target_col].mean() if target_col else None
        
        stats.append({
            'file': fname,
            'records': num_records,
            'missing_pct': missing_pct,
            'target_col': target_col,
            'target_mean': target_mean,
            'target_max': target_max,
            'columns': len(cols)
        })
    except Exception as e:
        print(f"Error processing {fname}: {e}")

stats_df = pd.DataFrame(stats)
print("\nStats Summary:")
print(stats_df)

