# GEOShield Data Lineage & Pipeline Architecture

This document maps the exact flow of data from external sources into the final operational models, detailing the ingestion, preprocessing, and adaptation phases to guarantee full reproducibility.

### 1. OMNI Physics Variables (Solar Wind & Geomagnetic Indices)
- **What it contains:** High-resolution (5-minute) ASCII files (`.asc`) containing solar-wind speed ($V_{sw}$), density, IMF $B_z$, SYM-H, Dst, and aligned timestamps.
- **Ingestion Script:** `src/ingestion/download_omni_robust.py` automatically pulls yearly files (2010–2020) from NASA's Space Physics Data Facility (SPDF) archive into `data/omni/`.
- **Parsing:** `src/preprocessing/parse_omni.py` extracts the text structures into tabular data.
- **Pipeline Role:** These form the core physics-based predictor variables that grant the model predictive power during the 45m–12h latency window where GOES persistence fails.

### 2. GRASP Target-Event Periods (2017–2018)
- **What it contains:** Hand-curated lists of intense storm intervals defining the "high-impact" events required for extreme-event calibration.
- **Parsing:** `src/preprocessing/parse_grasp.py` converts the raw event boundary lists into usable time-series masks.
- **Pipeline Role:** Used exclusively in the fine-tuning stage (`src/training/phase7_adapt_grasp.py`). The model is warm-started on the massive 10-year GOES+OMNI baseline, then adapted on these rare GRASP storms to dramatically improve upper-tail recall.

### 3. Derived Master Time-Series (Feature Matrix)
- **What it contains:** A merged, cleaned, and heavily resampled time-indexed dataframe that perfectly aligns GOES electron flux targets with OMNI physics variables.
- **Generation Scripts:** `src/utils/build_goes_master.py` and `src/utils/build_master_time.py`.
- **Storage:** Saved as highly compressed columnar data (`data/engineered_features.parquet` / `final_merged_data.parquet`).
- **Pipeline Role:** This is the terminal feature matrix ingested directly by the XGBoost training scripts.

### Dataset Coverage Map
| Source | Purpose | Date Range | Volume / Cadence |
| :--- | :--- | :--- | :--- |
| **GOES-13/15** | Target Electron Flux | 2010 – 2020 | 5-minute resolution |
| **OMNI (SPDF)** | Physics Predictors | 2010 – 2020 | 5-minute resolution |
| **GRASP** | Adaptation Targeting | 2017 – 2018 | Curated Storm Intervals |
