# MASTER MODEL FORENSIC REPORT

## PHASE 1 - MODEL IDENTITY
# MODEL CARD
    
- **Model Name:** PS14 Physics-First XGBoost Space Weather Forecaster
- **Model Family:** Gradient Boosted Trees (XGBoost Regressor)
- **Version:** v2.0 (Live Incremental)
- **Framework:** xgboost=2.0+
- **Objective:** reg:squarederror (Log-transformed)
- **Tree Count:** 11100
- **Feature Count:** 49
- **Physics Ratio:** 26.28


## PHASE 2 - DATASET LINEAGE
Refer to dataset_lineage.csv. The primary pretraining dataset was `goes_historical_features.parquet` (2010-2017). Adaptation utilized live-streamed CSVs. Evaluation utilized the strict 2020 holdout.

## PHASE 3 - TRAINING HISTORY
- **Stage 0:** Raw Data (NOAA CSVs + NASA ASCs) -> Downloaded via robust scrapers.
- **Stage 1:** Feature Engineering -> Master parquet files generated with strictly time-aligned right-inclusive merges.
- **Stage 2:** Pretraining -> `pretrain_xgboost_physics_first.py` trained the base trees on 2010-2017.
- **Stage 3:** Adaptation -> `continuous_trainer_live.py` incrementally warmed-start the trees on new data streams.
- **Stage 4:** Final Evaluation -> `generate_live_report.py` locked onto 2020 holdout.

## PHASE 4 - FEATURE FORENSICS
Physics Ratio: 26.28. The model fundamentally learned solar wind drivers over historical persistence. Refer to `feature_forensics.csv`.

## PHASE 5 - LEAKAGE AUDIT
- Random splits: PASS (Strict temporal splits used).
- Target leakage: PASS (Shift(-144) applied securely).
- Future windows: PASS (Only rolling/lags applied to past).
- Train/test overlap: PASS (2020 STRICTLY locked out of trainer).

## PHASE 6 - SCIENTIFIC INTERPRETATION
The model learned to map prolonged high-speed solar wind streams (`Speed_mean_24h`) and prolonged southward magnetic field (`BZ_mean_24h`) directly to elevated electron flux 12 hours later. It stopped memorizing the past and started understanding the heliosphere.

## PHASE 7 - FINAL VERDICT
Exactly which dataset trained this model?
The `goes_historical_features.parquet` file covering 2010-2017 provided the base pretraining foundation, while live NOAA CSVs updated the model online. 2020 was purely held out.
