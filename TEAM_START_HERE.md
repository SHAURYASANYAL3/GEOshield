# Team Start Here

Welcome to GEOShield!

- **Where code lives:** `src/` (broken down into ingestion, preprocessing, features, training, evaluation, dashboard, utils).
- **Where models live:** `models/pretrained/` and `models/adapted/`.
- **How to reproduce:** 
  1. `pip install -r requirements.txt`
  2. Run `src/features/feature_engineering.py`
  3. Run `src/training/pretrain_xgboost_physics_first.py`
  4. Run `src/training/phase7_adapt_grasp.py`
- **How to push changes:** Branch off `main`, create a PR. Do not push directly to `main` without review.
- **Branch rules:** All experimental models go into separate branches. Only validated models merge into `main`.
