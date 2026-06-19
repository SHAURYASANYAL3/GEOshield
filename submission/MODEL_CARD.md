# GEOShield Model Card

## Model Details
- **Name:** GEOShield Physics-Aware XGBoost
- **Version:** 1.0.0 (Final Submission)
- **Type:** Gradient Boosted Decision Tree (XGBoost Regressor)
- **Task:** Time-Series Forecasting (Regression) of >2 MeV Energetic Electron Flux.
- **Horizons:** 45 minutes, 6 hours, 12 hours.

## Intended Use
- **Primary Use Case:** Early warning system for geostationary satellite operators to anticipate hazardous radiation environments and execute protective protocols.
- **Out-of-Scope:** Forecasting solar flares, predicting proton events, or providing definitive predictions beyond 12 hours (due to L1 causality limits).

## Data Lineage
- **Pretraining Dataset:** Merged historical dataset utilizing GOES 13/14 (Electron Flux) and OMNI (Solar Wind Drivers) spanning 2010–2020. Totaling over 1.15 million rows.
- **Adaptation Dataset:** GRASP dataset containing highly specific, volatile storm events from 2017 and 2018.

## Features and Physics Justification
The model relies heavily on upstream solar wind drivers to anticipate delayed magnetospheric responses.
- **Speed (V_{sw}):** High-speed streams provide kinetic energy for wave acceleration.
- **IMF B_z:** Southward B_z enables magnetic reconnection and energy injection.
- **Flow Pressure & SYM-H:** Indicate magnetospheric compression and ring current intensity.
- **Lags & Rolling Windows:** Captures the complex, delayed temporal response of the radiation belts. Lags range from 45m to 48h.

## Performance Metrics (Finetuned Adaptation)
| Metric | 45m Horizon | 6h Horizon | 12h Horizon |
| :--- | :--- | :--- | :--- |
| **RMSE** | 114.25 | 285.30 | 245.71 |
| **MAE** | 50.21 | 156.88 | 117.36 |
| **Peak Recall (95th)**| 71.12% | 8.15% | 11.47% |
| **Peak Recall (99th)**| 7.21% | 0.0% | 0.0% |

## ⚠️ Remaining Limitations
1. **Source Code Opacity:** Training preprocessing/pipeline code is computationally heavy and missing from the core submission tree. **Mitigation:** Documented steps to regenerate from the provided data are included.
2. **99th Percentile Peak Recall (0%):** The model underperforms for rare extreme events (PeakRecall99 is 0%). **Recommendation:** Frame the model strictly as an "elevated condition forecaster" to provide operators with early warnings without over-promising on exact peak magnitudes.
3. **Training Transparency:** No pretrained base model provided (`xgb_goes_base.json` deprecated). **Mitigation:** Model card explicitly states canonical `xgb_final_adapted.json` is the sole source of truth for deployment.

## Reproducibility
- The canonical, finetuned operational weights are saved and unified under `submission/xgb_final_adapted.json`.
- Environment requires strictly pinned versions of `xgboost`, `pandas`, `scikit-learn` as per `requirements.txt`.
