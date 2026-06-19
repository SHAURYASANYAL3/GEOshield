# Reproducing GEOShield Data

To fully reproduce the GEOShield modeling environment from scratch, follow these exact steps. This will rebuild the full 10-year feature set from raw satellite data.

### Step 1: Download Raw Satellite Data
1. **GOES 13/15 Electron Flux (2010-2020)**
   - Download the science-quality 1-minute electron flux CSVs (`g15_epead_e13ew_1m_*_science_v1.0.0.csv`) from the official NOAA NCEI archive: `https://www.ncei.noaa.gov/data/goes-space-environment-monitor/access/avg/`
   - Place them in `data/datasets/goes15/`
2. **OMNI Solar Wind (2010-2020)**
   - Download high-resolution OMNI data from NASA CDAWeb.
   - Place it in `data/datasets/omni/`

### Step 2: Ingestion & Parsing
Run the ingestion scripts to parse the raw CSV/CDF files into clean, timestamp-aligned parquet files:
```bash
python src/ingestion/parse_omni.py
python src/ingestion/parse_goes.py
```

### Step 3: Feature Engineering
Run the rolling window and lag generator to build the physics-aware features (Bz, Speed, Pressure, and up to 48h temporal lags):
```bash
python src/features/feature_engineering.py
```
This generates `data/engineered_features.parquet` and `data/final_merged_data.parquet`.

### Verifying the Schema
If you do not want to download the 9GB of historical data, we have included a 1000-row sample of the final engineered dataset so you can instantly verify the schema and run a test pass.
You can find it here: `data/sample/final_merged_data_sample.parquet`
