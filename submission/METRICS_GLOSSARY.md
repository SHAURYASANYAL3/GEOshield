# GEOShield Metrics Glossary

This document provides the explicit mathematical derivations and source-code mappings for all evaluation metrics used in the GEOShield pipeline. It ensures absolute transparency regarding how performance claims were generated.

### 1. Peak-Recall (95th Percentile)
- **Where it is calculated:** `src/training/*`, `src/evaluation/*`
- **Derivation:** 
  ```python
  p95_val = np.percentile(y_true, 95)
  true_95 = y_true > p95_val
  pred_95 = y_pred > p95_val
  recall_95 = np.sum(true_95 & pred_95) / np.sum(true_95)
  ```
- **Context:** This is our primary operational metric for "elevated condition" forecasting. The final model achieves ~71% Peak Recall 95 at the 45-minute horizon and retains event awareness (11.47%) up to 12 hours out.

### 2. Peak-Recall (99th Percentile)
- **Where it is calculated:** `src/training/*`, `src/evaluation/*`
- **Derivation:**
  ```python
  p99_val = np.percentile(y_true, 99)
  true_99 = y_true > p99_val
  pred_99 = y_pred > p99_val
  recall_99 = np.sum(true_99 & pred_99) / np.sum(true_99)
  ```
- **Context:** Tracks the capture rate of the most extreme, one-in-a-thousand events. As flagged in our limitations, the model fundamentally misses predicting peak amplitudes at this threshold (`0.0%`).

### 3. Root-Mean-Square Error (RMSE)
- **Where it is calculated:** `src/training/*`, `src/evaluation/*`
- **Derivation:** 
  ```python
  rmse = np.sqrt(mean_squared_error(y_true, y_pred))
  ```
- **Context:** The standard penalty for baseline error. Used to benchmark against the naive persistence baseline across the 45m, 6h, and 12h horizons. 

### 4. Mean Absolute Error (MAE)
- **Where it is calculated:** `src/training/*`, `src/evaluation/*`
- **Derivation:** 
  ```python
  mae = np.mean(np.abs(y_true - y_pred))
  ```
- **Context:** Reported as a secondary metric to provide a linear understanding of baseline flux error without the heavy outlier penalization of RMSE.

### 5. Storm-Count / Detection
- **Where it is calculated:** `src/dashboard/dashboard.py` (Visual Highlights), `src/evaluation/analyze.py`
- **Derivation:** Filters and plots `y_true > p95_val` against predicted values for visual confirmation of storm onset alignment.
- **Context:** Powers the interactive dashboard and Extreme Event Anomaly Detector for live operations.
