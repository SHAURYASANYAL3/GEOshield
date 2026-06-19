# Canonical State

- Final Model: `xgb_final_adapted.json` (warm-start adapted physics-driven XGBoost)
- Final Metrics: `outputs/metrics/metrics.json` (Reconciled in `FINAL_METRIC_RECONCILIATION.md`)
- Final Dataset: GOES 13/14/15 Electron Flux (2010-2020) + OMNI Solar Wind (2010-2020), Target: GRASP Specific Storm Periods (2017-2018)
- Final Horizon: 12h (Best operational horizon), 45m (Weakest relative to persistence), 6h
- Final Dashboard: `submission/dashboard/dashboard.py`
- Rejected Versions: All previous 12h metric values (e.g., RMSE 404.06, PR95 31.0%), `xgb_goes_base.json`, `xgb_goes_physics.json`, `model_phase2_adapted.json`
