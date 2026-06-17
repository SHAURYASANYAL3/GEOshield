# GEOShield Model Card

## Model Details
- **Name:** GEOShield Physics-Aware XGBoost
- **Version:** 1.0.0 (Final Submission)
- **Type:** Gradient Boosted Decision Tree (XGBoost Regressor)
- **Task:** Time-Series Forecasting (Regression) of $>2$ MeV Energetic Electron Flux.
- **Horizons:** 45 minutes, 6 hours, 12 hours.

## Intended Use
- **Primary Use Case:** Early warning system for geostationary satellite operators to anticipate hazardous radiation environments and execute protective protocols.
- **Out-of-Scope:** Forecasting solar flares, predicting proton events, or providing definitive predictions beyond 12 hours (due to L1 causality limits).

## Data Lineage
- **Pretraining Dataset:** Merged historical dataset utilizing GOES 13/14 (Electron Flux) and OMNI (Solar Wind Drivers) spanning 2010–2020. Totaling over 1.15 million rows.
- **Adaptation Dataset:** GRASP dataset containing highly specific, volatile storm events from 2017 and 2018.

## Features and Physics Justification
The model relies heavily on upstream solar wind drivers to anticipate delayed magnetospheric responses.
- **Speed ($V_{sw}$):** High-speed streams provide kinetic energy for wave acceleration.
- **IMF $B_z$:** Southward $B_z$ enables magnetic reconnection and energy injection.
- **Flow Pressure & SYM-H:** Indicate magnetospheric compression and ring current intensity.
- **Lags & Rolling Windows:** Captures the complex, delayed temporal response of the radiation belts. Lags range from 45m to 48h.

## Performance Metrics (Finetuned Adaptation)
| Metric | 45m Horizon | 6h Horizon | 12h Horizon |
| :--- | :--- | :--- | :--- |
| **RMSE** | 114.25 | 285.30 | 404.06 |
| **MAE** | 50.21 | 156.88 | 156.37 |
| **Peak Recall (95th)**| 69.2% | 5.7% | 31.0% |
| **Peak Recall (99th)**| 7.9% | 0.0% | 4.8% |
| **Uncertainty (±σ)** | ±113.16 | ±285.11 | ±403.74 |

## Limitations and Ethical Considerations
- **Amplitude Underprediction:** The model prioritizes predicting the *timing* and *onset* of a storm. It tends to conservatively underpredict the absolute maximum amplitude of rare Carrington-class events due to the logarithmic nature of particle flux and scarcity in the training data.
- **Sensor Blackouts:** Performance metrics are impacted by inherent sensor blackouts in the GRASP data during extreme storm peaks.
- **Causality Limit:** The 12-hour horizon exhibits decreased performance because predicting 12 hours ahead requires knowledge of solar wind currently located upstream of the L1 monitoring satellites.

## Reproducibility
- Pretraining weights are saved as `xgb_goes_physics.json`.
- Finetuned operational weights are saved as `xgb_goes_base.json`.
- Environment requires `xgboost`, `pandas`, `scikit-learn`. Generated via `phase7_adapt_grasp.py`.