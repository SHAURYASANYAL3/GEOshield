# GEOShield

## Project
GEOShield is a physics-aware machine learning pipeline for forecasting energetic electron fluxes (>2 MeV) at geostationary orbit.

## Problem
Geostationary satellites face severe operational hazards from energetic electron fluxes driven by solar storms. Traditional autoregressive models often fail to capture sudden storm-induced flux enhancements in a timely manner.

## Architecture
- **Phase 1 (Pretraining):** XGBoost model trained on 10 years of historical GOES 13/14 and OMNI data to learn baseline physics.
- **Phase 2 (Adaptation):** Warm-start finetuning on highly volatile GRASP target events.

## Datasets
- **Historical (2010-2020):** GOES 13/14 (Electron Flux) + OMNI (Solar Wind)
- **Target (2017-2018):** GRASP Specific Storm Periods

## Pipeline
1. Ingestion: Download GOES and OMNI data
2. Preprocessing: Parsing netCDF/CSV, neutralising missing flags
3. Feature Engineering: Rolling windows and temporal lags
4. Training: Physics-first pretraining followed by target adaptation
5. Evaluation: Peak recall and RMSE analysis

## Results
The model demonstrates an operational event awareness that outpaces naive persistence at longer horizons (12h), anchoring on a horizon-aware historical state and applying upstream solar wind physics (Speed, Bz).

## Final Metrics
See `FINAL_METRIC_RECONCILIATION.md` for a complete breakdown of true metrics.

## Limitations
Results should be interpreted as demonstrating operational event awareness rather than precise peak magnitude estimation.

## Model Naming Migration
**Note:** The final model has been unified under the name `xgb_final_adapted.json`. Previous references to `xgb_goes_base.json`, `xgb_goes_physics.json`, and `model_phase2_adapted.json` have been deprecated and point to this canonical model.

## Reproducibility
Since `data/` may be empty upon fresh clone, use the provided `Makefile` to download and regenerate the dataset:

### Quickstart
```bash
make reproduce
```

### Manual Steps
1. **Download:** Fetch raw GOES and OMNI datasets.
   ```bash
   python src/ingestion/download_goes_robust.py
   python src/ingestion/download_omni_robust.py
   ```
2. **Preprocess:** Parse datasets into parquet format.
   ```bash
   python src/preprocessing/parse_omni.py
   ```
3. **Train:** Pretrain the baseline model on 11 years of data, then adapt to target GRASP events.
   ```bash
   python src/training/pretrain_xgboost.py
   python src/training/phase7_adapt_grasp.py mse
   ```
4. **Evaluate:** Generate evaluation metrics.
   ```bash
   python src/evaluation/baseline_persistence.py
   ```

## Installation
```bash
pip install -r requirements.txt
```

## Usage
Run the dashboard to interactively view storm onset alerts:
```bash
streamlit run src/dashboard/dashboard.py
```

## Repository Structure
Please refer to `PROJECT_INVENTORY.md` for the complete structure.

## Citation
ISRO PS14 Challenge - GEOShield Team

## Contributors
GEOShield Development Team
