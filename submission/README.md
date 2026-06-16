# PS14: Geostationary Radiation Environment Forecast

**Final Architecture Version:** `PS14_v1.0_final`

## Scientific Claim
> Incorporating upstream solar-wind forcing together with historical geostationary electron behavior enabled operationally useful 12-hour forecasting of energetic electron enhancements, improving storm-event detection while maintaining stable background predictions.

## Methodology & Decisions

We developed three distinct models to capture the physical reality of the radiation belts over varying forecast horizons:

| Horizon | Final Model            | Scientific Justification |
| :--- | :--- | :--- |
| **45m** | **Persistence** | System inertia dominates at ultra-short horizons. |
| **6h** | **Storm-weighted XGBoost** | Transitional regime; memory begins to collapse. |
| **12h** | **Storm-weighted XGBoost** | Solar-wind forcing and magnetospheric memory emerge as predictive. |

### Feature Engineering & Modeling

1. **Disproved Disguised Persistence**: Feature importance analysis showed `Electron_Flux_lag_12h` ranked 7th with only **1.7%** importance. The model physically learned solar-wind interaction, not just autoregressive cloning.
2. **SYM-H Domination**: The strongest predictors were `SYM_H_nT_mean_24h` and `SYM_H_nT_lag_6h`. The integrated magnetospheric state (SYM-H) acts as the ultimate memory index of previous Bz/Speed disruptions.
3. **Loss Function Design**: Standard tree boosting collapsed `Peak Recall` by ruthlessly optimizing RMSE on quiet periods. We solved this with asymmetric sample weighting (5x for >P95, 15x for >P99) and 1:4 storm oversampling.

### Ablation Study (12h Horizon)

| Model Architecture | RMSE | Peak Recall (95%) | Interpretation |
| :--- | :--- | :--- | :--- |
| **Combined (Full)** | **306.8** | **27.8%** | Balanced physics & memory. |
| **GRASP Only (No OMNI)** | 343.2 | 49.6% | Remembers state but blindly overfires. |
| **OMNI Only (No GRASP)** | 362.3 | 4.7% | Understands drivers but cannot ignite. |

*Conclusion:* OMNI provides the boundary constraints; GRASP provides the catalyst. Neither works alone.

## Repository Structure

*   `dashboard/`: Contains `dashboard.py` (Streamlit visualizer).
*   `models/`: Serialized model binaries.
*   `storm_gallery/`: Plots of Actual vs Predicted for the Top 10 >99th percentile validation storms.
*   `metrics.json`: Final serialized evaluation metrics.
*   `report.pdf` / `slides.pdf`: Project narrative.
*   `architecture.png`: Visual design diagram.

## Running the Dashboard

```bash
pip install streamlit
streamlit run dashboard/dashboard.py
```
