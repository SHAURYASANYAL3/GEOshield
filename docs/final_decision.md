# FINAL DECISION LOG: GEOShield Architecture

**Documenting the strategic path to the final model architecture.**

## 1. The Trap of Persistence
**Hypothesis:** An autoregressive model predicting future flux based heavily on recent flux will yield the lowest general error.
**Result:** **FAILED.** While overall Mean Absolute Error (MAE) was low during "quiet" times, the model exhibited **Memory Collapse** during storms. It merely echoed the current state into the future, lagging behind actual sudden enhancements by exactly the forecast horizon.
**Decision:** Penalize or heavily drop autoregressive rolling features. Force the model to learn from upstream solar wind (OMNI).

## 2. Deep Learning vs. Gradient Boosting
**Hypothesis:** LSTMs or Transformers will better capture the temporal dynamics.
**Result:** **REJECTED.** Tree-based models (XGBoost/LightGBM) trained significantly faster, handled missing/noisy space weather data natively, and allowed for explicit extraction of Feature Importances (critical for scientific defensibility). Deep learning models tended to overfit to quiet periods without massive, perfectly continuous datasets.
**Decision:** Proceed with XGBoost.

## 3. Data Scarcity on Target
**Hypothesis:** Training exclusively on the provided GRASP dataset will yield the most accurate model for the target satellite.
**Result:** **FAILED.** The GRASP dataset, while accurate to the target instrument, represented specific, short-duration storm events. The phase space of magnetospheric physics is too vast to learn from isolated storms. The model failed to generalize.
**Decision:** Adopt a Transfer Learning / Warm-Start approach.

## 4. The Final Decision: Physics-Aware Transfer Learning
**Action:** 
1. Build a massive historical database (GOES 13/14 + OMNI from 2010–2020).
2. Train an XGBoost model on 1.15 million rows to learn the fundamental, underlying physics of Solar Wind $\rightarrow$ Magnetosphere energy transfer.
3. Save the weights (`xgb_goes_physics.json`).
4. Load the weights, and run a low-learning-rate adaptation pass on the GRASP dataset.

**Outcome:** **SUCCESS.** The final model retains the physical causality learned from a decade of data but is calibrated to the specific baseline fluxes and sensor characteristics of the GRASP periods. This approach yielded a 12-hour Peak Recall of **31.0%** (a 4.3x improvement over baseline) and completely bypassed the limitations of small-sample target datasets and autoregressive memory collapse.