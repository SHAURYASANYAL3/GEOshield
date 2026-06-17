import os
import zipfile
import glob
import pandas as pd
import xml.etree.ElementTree as ET
import numpy as np

zip_files = glob.glob("D:/isro/datasets/*.zip")
print(f"Found {len(zip_files)} zip files.")

total_files = 0
all_data = []
all_meta = []

for zf in zip_files:
    with zipfile.ZipFile(zf, 'r') as z:
        for filename in z.namelist():
            if filename.endswith(".txt"):
                with z.open(filename) as f:
                    # Skip the first line as it's the header
                    df = pd.read_csv(f, sep='\t', skiprows=1, names=["Time-Day of Year", "Electron flux", "Proton flux", "Flux units"])
                    df = df.dropna(axis=1, how='all') # drop the empty "Flux units" column which gets created due to trailing tabs
                    
                    # Some files might have leading/trailing whitespaces in columns
                    # the first line of the actual data is the second line of the file.
                    all_data.append(df)
            elif filename.endswith(".xml"):
                with z.open(filename) as f:
                    try:
                        tree = ET.parse(f)
                        root = tree.getroot()
                        dr = root.find("Data_related")
                        missing = dr.find("Missing_data").text if dr is not None and dr.find("Missing_data") is not None else "Unknown"
                        pct = dr.find("Percentage_of_missing_data").text if dr is not None and dr.find("Percentage_of_missing_data") is not None else "Unknown"
                        e_level = dr.find("Electron_Activity_level").text if dr is not None and dr.find("Electron_Activity_level") is not None else "Unknown"
                        all_meta.append({"file": filename, "missing": missing, "pct_missing": pct, "e_level": e_level})
                    except Exception as e:
                        pass

full_df = pd.concat(all_data, ignore_index=True)
print("Data Shape:", full_df.shape)
print("Columns:", full_df.columns.tolist())
print("Data Types:\n", full_df.dtypes)

for col in full_df.columns:
    full_df[col] = pd.to_numeric(full_df[col], errors='coerce')

print("\nSummary Statistics:")
print(full_df.describe())

missing_values = full_df.isnull().sum()
print("\nMissing Values:")
print(missing_values)

# Find storms/anomalies (e.g. > 99th percentile)
e_99 = full_df["Electron flux"].quantile(0.99)
print(f"\n99th percentile of Electron flux: {e_99}")
storms = full_df[full_df["Electron flux"] > e_99]
print(f"Number of storm records: {len(storms)}")

# Meta summary
meta_df = pd.DataFrame(all_meta)
print("\nMeta Summary:")
if not meta_df.empty:
    print(meta_df["missing"].value_counts())
    print(meta_df["e_level"].value_counts())
