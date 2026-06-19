# GEOShield: Future Operational Roadmap

While the current GEOShield model successfully establishes an "elevated condition forecaster" with strong 12-hour lead times (71% 95th-percentile recall at 45m), migrating from "submission-ready" to "high-confidence operational" requires addressing several known structural gaps. 

This document outlines the systematic engineering roadmap to achieve that.

## 1. 99% Peak-Recall Improvement
- **Current State:** 0% capture rate for the most extreme 99th-percentile storms.
- **Next Steps:** Introduce a custom loss component (e.g., focal loss, weighted recall) that directly penalizes false-negatives in the 99% tail. Implement oversampling for rare Carrington-class storm events or dynamically learned extreme thresholds instead of fixed cutoffs.

## 2. Probabilistic / Confidence Scores
- **Current State:** Deterministic point-forecasts.
- **Next Steps:** Transition to prediction intervals. Providing a calibrated probability of exceeding a specific flux threshold (e.g., "75% probability of >10k pfu") makes alerts significantly more actionable for satellite operators executing protective protocols.

## 3. Explicit Temporal Leakage Guard Rails
- **Current State:** Implicit causality via lagged features.
- **Next Steps:** Formalize and document a strict temporal validation split (e.g., a hard hold-out year). Implement continuous CI/CD pipeline tests that enforce causality to guarantee absolutely zero future-data leakage into rolling windows.

## 4. Feature-Importance Audit
- **Current State:** Physics relies on global model training.
- **Next Steps:** Implement automated SHAP/Gain value logging. By logging the top-K most important features for each horizon, we can operationally verify that the physics variables (SYM-H, Bz, Solar Wind Speed) are truly driving the predictions under different regimes.

## 5. Storm-Severity Categorization (Multi-Class)
- **Current State:** Binary condition based on a single 95% threshold.
- **Next Steps:** Expand to a multi-severity matrix (Moderate, Severe, Extreme) with independent recall tracking per category. This provides a much finer-grained picture of systemic performance.

## 6. Robustness & Out-of-Distribution Checks
- **Current State:** Validated on overlapping solar cycle data.
- **Next Steps:** Evaluate model decay against entirely unseen solar cycles or prolonged sensor data gaps. Implementing a "hold-out cycle" test will surface hidden weaknesses related to long-term drift.

---

### Actionable Development Checklist

| ✅ Implemented | ❌ Needs Development |
| :--- | :--- |
| ✔ Peak-Recall 95% metric | ✖ 99% Peak-Recall optimization |
| ✔ RMSE & MAE per horizon | ✖ Probabilistic confidence intervals |
| ✔ Baseline persistence comparison | ✖ Automated SHAP feature-importance reporting |
| ✔ Storm visualization (95% threshold) | ✖ Multi-severity storm categorical metrics |
| ✔ Reproducible metric scripts | ✖ Explicit, automated temporal leakage guard rails |
| ✔ Documented JSON metrics | ✖ Automated alert threshold optimization |
