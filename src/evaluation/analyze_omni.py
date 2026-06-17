import pandas as pd
import numpy as np

# Columns based on the fmt.txt file
cols = [
    "Year", "Day", "Hour", "Minute",
    "Field_magnitude_average_nT",
    "BX_nT_GSE_GSM", "BY_nT_GSE", "BZ_nT_GSE",
    "BY_nT_GSM", "BZ_nT_GSM", "Speed_km_s",
    "Proton_Density_n_cc", "Flow_pressure_nPa",
    "AE_index_nT", "SYM_H_nT"
]

file_path = "D:/isro/omni/omni_5min_def_dneZ2NWQwI.lst"

# Using delim_whitespace=True since it's a formatted fixed-width / space-separated file
df = pd.read_csv(file_path, delim_whitespace=True, names=cols)

print(f"Data shape: {df.shape}")
print(f"Date range: Year {df['Year'].min()} Day {df['Day'].min()} to Year {df['Year'].max()} Day {df['Day'].max()}")

# OMNI standard missing values are typically 999, 999.9, 9999, etc. Let's see what is used here.
# Typically: 99.99 for B-field, 9999.9 for Speed, 999.99 for density/pressure, 99999 for AE/SYM-H
df.replace([99.99, 999.99, 9999.99, 9999.9, 99999, 99999.9], np.nan, inplace=True)

print("\nMissing values per column:")
print(df.isnull().sum() / len(df) * 100)

print("\nSummary Stats:")
print(df.describe())

