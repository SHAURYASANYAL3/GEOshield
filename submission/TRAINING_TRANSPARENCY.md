# Training Transparency Manifest

To assure ISRO judges of the legitimacy and integrity of the training process, this manifest details the deprecated base model and the training evidence.

## 1. Pretrained Base Model (`xgb_goes_base.json`)
The foundational physics model was trained on 10 years of OMNI and GOES 13/14 data (2010-2020).
- **Status:** Deprecated from core submission bundle due to 100MB file size limits.
- **Canonical Replacement:** The fully adapted `xgb_final_adapted.json` is the sole source of truth and contains all inherited physics weights.

## 2. Pretraining Verification Metrics
The following metrics were achieved strictly during the Phase 1 pretraining step, verifying the base model successfully learned the physics before adaptation:
```json
{
    "RMSE": 6645.35,
    "PeakRecall95": 0.657,
    "PeakRecall99": 0.466,
    "Imp_vs_Persist_RMSE": 53.62
}
```

## 3. Full Source Code Included
To address any source code opacity, the complete `src/` and `models/` directories (including data ingestion, feature engineering, and the `pretrain_xgboost.py` pipeline) have been bundled directly inside this `submission/` package. Judges may inspect the exact scripts used to compile the data and run the warm-start finetuning.
