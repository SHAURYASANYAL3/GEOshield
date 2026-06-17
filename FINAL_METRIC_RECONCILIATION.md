# Final Metric Reconciliation

This document serves as the single source of truth for GEOShield's final metrics, derived directly from the verified raw JSON logs.

| Experiment | Dataset | Split | Metric Source | Final Horizon | RMSE | MAE | Peak Recall (95th) | Peak Recall (99th) |
| ---------- | ------- | ----- | ------------- | ------------- | ---- | --- | ------------------ | ------------------ |
| Baseline Persistence | GOES/OMNI/GRASP | Time-Series | `baseline_metrics.json` | 45m | 95.76 | 38.09 | 87.28% | 78.71% |
| Baseline Persistence | GOES/OMNI/GRASP | Time-Series | `baseline_metrics.json` | 6h | 350.03 | 171.58 | 36.18% | 19.03% |
| Baseline Persistence | GOES/OMNI/GRASP | Time-Series | `baseline_metrics.json` | 12h | 461.46 | 238.24 | 7.21% | 1.17% |
| GEOShield Finetuned | GRASP | Time-Series | `metrics.json` | 45m | 114.25 | 50.21 | 71.12% | 7.21% |
| GEOShield Finetuned | GRASP | Time-Series | `metrics.json` | 6h | 285.30 | 156.88 | 8.15% | 0.00% |
| GEOShield Finetuned | GRASP | Time-Series | `metrics.json` | 12h | 245.71 | 117.36 | 11.47% | 0.00% |

**Reconciliation Notes:**
1. All earlier drafts containing conflicting 12h values (e.g., RMSE 404.06, PR95 31.0%) have been purged from the final report to correct version control drift.
2. The model relies on valid historical lag, specifically a horizon-aware historical state (`lag_12h` for 12h forecasting).
3. The baseline model is appropriately credited for winning at the 45-minute horizon, demonstrating that short-term physical persistence dominates immediate forecasting windows.
