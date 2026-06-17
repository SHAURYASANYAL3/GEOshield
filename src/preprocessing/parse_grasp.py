import zipfile
import glob
import pandas as pd
import re

def parse_grasp():
    print("Parsing GRASP data...")
    zip_files = glob.glob("D:/isro/datasets/*.zip")
    
    all_data = []
    
    for zf in zip_files:
        # Extract the year from the filename using regex (e.g., ..._2018.zip)
        match = re.search(r'-(\d{4})', zf)
        if not match:
            print(f"Warning: Could not find year in filename {zf}")
            continue
        year = int(match.group(1))
        
        with zipfile.ZipFile(zf, 'r') as z:
            for filename in z.namelist():
                if filename.endswith(".txt"):
                    with z.open(filename) as f:
                        # Skip the first line as it's the header
                        df = pd.read_csv(f, sep='\t', skiprows=1, names=["DOY", "Electron_Flux", "Proton_Flux", "Junk"])
                        # Drop the trailing tab column
                        if "Junk" in df.columns:
                            df = df.drop(columns=["Junk"])
                        
                        df["DOY"] = pd.to_numeric(df["DOY"], errors="coerce")
                        df["Electron_Flux"] = pd.to_numeric(df["Electron_Flux"], errors="coerce")
                        df["Proton_Flux"] = pd.to_numeric(df["Proton_Flux"], errors="coerce")
                        
                        df.dropna(subset=["DOY"], inplace=True)
                        
                        # Convert fractional DOY to UTC Datetime
                        # DOY is 1-indexed (1.0 = Jan 1 00:00)
                        base_time = pd.to_datetime(f"{year}-01-01 00:00:00", format="%Y-%m-%d %H:%M:%S")
                        df["timestamp"] = base_time + pd.to_timedelta(df["DOY"] - 1, unit="D")
                        
                        # Round to nearest minute to drop tiny floating point offsets
                        df["timestamp"] = df["timestamp"].dt.round("min")
                        
                        all_data.append(df[["timestamp", "Electron_Flux", "Proton_Flux"]])

    full_df = pd.concat(all_data, ignore_index=True)
    
    # Sort and drop any exact duplicates that might arise from zip file duplicates like "(1).zip"
    full_df = full_df.sort_values("timestamp").drop_duplicates(subset=["timestamp"])
    
    output_file = "D:/isro/grasp_parsed.parquet"
    full_df.to_parquet(output_file, index=False)
    print(f"GRASP data parsed and saved to {output_file}. Shape: {full_df.shape}")

if __name__ == "__main__":
    parse_grasp()
