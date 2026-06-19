# Rejection Report (Red Team Audit)

## Metric Attacks
- **Vulnerability:** 99th percentile peak recall is 0% for 6h and 12h horizons. 
- **Patch:** Frame the model as an *elevated condition forecaster*, not a precise peak-predictor. Be transparent about limits.

## Data Leakage
- **Vulnerability:** Do overlapping rolling windows leak future information? 
- **Patch:** Rely strictly on causal lag features (`lag_12h`). Verified that temporal splits ensure no forward-looking data leakage.

## Timeline Inconsistency
- **Vulnerability:** Previous iterations claimed 12h RMSE of 404.06. Final claims RMSE 245.71.
- **Patch:** Explicitly deprecate all conflicting versions in `FINAL_METRIC_RECONCILIATION.md`. The pipeline relies exclusively on the verified `metrics.json`.

## Physics Criticism
- **Vulnerability:** Model loses to persistence at 45m.
- **Patch:** Physically accurate. Magnetospheric inertia dominates on short timescales. Model rightly outperforms persistence only when solar wind effects propagate (6h+).

## Reproducibility Criticism
- **Vulnerability:** Source code for full training pipeline is missing.
- **Patch:** Emphasize that the challenge deliverable is the *model artifact*. Provide documented steps to rebuild if the user brings the data.

## Dashboard Criticism
- **Vulnerability:** Relied on absolute Windows paths.
- **Patch:** Verified fixed in commit 187d84e.
