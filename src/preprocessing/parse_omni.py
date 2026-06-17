import pandas as pd
import numpy as np

def parse_omni():
    print("Parsing OMNI data...")
    cols = [
        "Year", "Day", "Hour", "Minute",
        "Field_magnitude_average_nT",
        "BX_nT_GSE_GSM", "BY_nT_GSE", "BZ_nT_GSE",
        "BY_nT_GSM", "BZ_nT_GSM", "Speed_km_s",
        "Proton_Density_n_cc", "Flow_pressure_nPa",
        "AE_index_nT", "SYM_H_nT"
    ]

    file_path = "data/omni/omni_5min_def_dneZ2NWQwI.lst"

    df = pd.read_csv(file_path, sep=r'\s+', names=cols)

    # Convert fillers to NaN
    fillers = [99.99, 999.99, 9999.99, 9999.9, 99999, 99999.9]
    df.replace(fillers, np.nan, inplace=True)

    # Build UTC Timestamp
    # Year-Day mapped to Date
    df["timestamp"] = pd.to_datetime(df["Year"] * 1000 + df["Day"], format="%Y%j")
    df["timestamp"] = df["timestamp"] + pd.to_timedelta(df["Hour"], unit="h") + pd.to_timedelta(df["Minute"], unit="m")

    # Drop intermediate columns
    df.drop(columns=["Year", "Day", "Hour", "Minute"], inplace=True)
    
    # Sort just in case
    df = df.sort_values("timestamp").drop_duplicates(subset=["timestamp"])

    output_file = "data/omni_parsed.parquet"
    df.to_parquet(output_file, index=False)
    print(f"OMNI data parsed and saved to {output_file}. Shape: {df.shape}")

if __name__ == "__main__":
    parse_omni()
