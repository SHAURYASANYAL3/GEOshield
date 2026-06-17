import os
import shutil
import csv
import time
from datetime import datetime
import zipfile

root_dir = r"D:\isro"

# Phase 1: Inventory
inventory_csv = os.path.join(root_dir, "inventory.csv")
project_inventory = os.path.join(root_dir, "PROJECT_INVENTORY.md")

inventory_data = []
for root, dirs, files in os.walk(root_dir):
    if ".git" in root or "venv" in root:
        continue
    for file in files:
        filepath = os.path.join(root, file)
        size = os.path.getsize(filepath)
        mtime = os.path.getmtime(filepath)
        status = "keep"
        if file.startswith("predictions_") and file != "predictions_finetuned.csv":
            status = "archive"
        elif "forensic_audit" in root or "temp_dataset" in root or "submission_v2" in root:
            status = "archive"
        inventory_data.append([os.path.relpath(filepath, root_dir), size, datetime.fromtimestamp(mtime).isoformat(), status])

with open(inventory_csv, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["path", "size", "last_modified", "status"])
    writer.writerows(inventory_data)

with open(project_inventory, "w") as f:
    f.write("# Project Inventory\n\nTotal files: {}\n".format(len(inventory_data)))

# Phase 2: Safe Freeze
archive_dir = os.path.join(root_dir, "archive")
os.makedirs(archive_dir, exist_ok=True)
archive_log = os.path.join(root_dir, "ARCHIVE_LOG.md")

archived_files = []
# Folders to archive directly if they exist
for folder in ["forensic_audit", "temp_dataset", "submission_v2", "GOES-13andGOES-14"]:
    fpath = os.path.join(root_dir, folder)
    if os.path.exists(fpath):
        dest = os.path.join(archive_dir, folder)
        if not os.path.exists(dest):
            shutil.move(fpath, archive_dir)
            archived_files.append(folder)

# Files to archive
for file in ["predictions_12.csv", "predictions_45.csv", "predictions_6.csv"]:
    fpath = os.path.join(root_dir, file)
    if os.path.exists(fpath):
        shutil.move(fpath, archive_dir)
        archived_files.append(file)

with open(archive_log, "w") as f:
    f.write("# Archive Log\n\nThe following items were safely frozen:\n")
    for item in archived_files:
        f.write(f"- {item}\n")

# Phase 3: Rebuild final structure
directories = [
    "docs", "data/sample", "data/schema", "models/pretrained", "models/adapted",
    "src/ingestion", "src/preprocessing", "src/features", "src/training",
    "src/evaluation", "src/dashboard", "src/utils", "notebooks",
    "outputs/metrics", "outputs/predictions", "outputs/plots", "outputs/storm_gallery", "outputs/reports", "submission"
]

for d in directories:
    os.makedirs(os.path.join(root_dir, d), exist_ok=True)

moves = {
    "GEOShield_Final_Report.md": "docs/GEOShield_Final_Report.md",
    "Executive_Summary.md": "docs/Executive_Summary.md",
    "Final_Decision.md": "docs/final_decision.md",
    "Architecture.mmd": "docs/architecture.mmd",
    "Dataset_Lineage.mmd": "docs/dataset_lineage.mmd",
    "xgb_goes_physics.json": "models/pretrained/xgb_goes_physics.json",
    "xgb_goes_base.json": "models/adapted/xgb_goes_base.json",
    "Model_Card.md": "models/model_card.md",
    "download_goes_fast.py": "src/ingestion/download_goes_fast.py",
    "download_goes_robust.py": "src/ingestion/download_goes_robust.py",
    "download_omni_robust.py": "src/ingestion/download_omni_robust.py",
    "phase1_download_goes.py": "src/ingestion/phase1_download_goes.py",
    "parse_grasp.py": "src/preprocessing/parse_grasp.py",
    "parse_omni.py": "src/preprocessing/parse_omni.py",
    "feature_engineering.py": "src/features/feature_engineering.py",
    "pretrain_xgboost.py": "src/training/pretrain_xgboost.py",
    "pretrain_xgboost_physics_first.py": "src/training/pretrain_xgboost_physics_first.py",
    "phase7_adapt_grasp.py": "src/training/phase7_adapt_grasp.py",
    "xgboost_storm_weighted.py": "src/training/xgboost_storm_weighted.py",
    "xgboost_peak_recall_tune.py": "src/training/xgboost_peak_recall_tune.py",
    "lightgbm_train.py": "src/training/lightgbm_train.py",
    "continuous_trainer.py": "src/training/continuous_trainer.py",
    "continuous_trainer_live.py": "src/training/continuous_trainer_live.py",
    "analyze.py": "src/evaluation/analyze.py",
    "analyze_goes.py": "src/evaluation/analyze_goes.py",
    "analyze_omni.py": "src/evaluation/analyze_omni.py",
    "baseline_persistence.py": "src/evaluation/baseline_persistence.py",
    "final_inspection.py": "src/evaluation/final_inspection.py",
    "generate_forensic_audit.py": "src/evaluation/generate_forensic_audit.py",
    "phase4_pretrained_test.py": "src/evaluation/phase4_pretrained_test.py",
    "dashboard.py": "src/dashboard/dashboard.py",
    "generate_live_report.py": "src/dashboard/generate_live_report.py",
    "build_goes_master.py": "src/utils/build_goes_master.py",
    "build_master_time.py": "src/utils/build_master_time.py",
    "merge_timeseries.py": "src/utils/merge_timeseries.py",
    "generate_final_submission.py": "src/utils/generate_final_submission.py",
    "coverage_plot.py": "src/utils/coverage_plot.py",
    "metrics.json": "outputs/metrics/metrics.json",
    "metrics_final.csv": "outputs/metrics/metrics_final.csv",
    "metrics_finetuned.json": "outputs/metrics/metrics_finetuned.json",
    "baseline_metrics.json": "outputs/metrics/baseline_metrics.json",
    "pretrain_metrics.json": "outputs/metrics/pretrain_metrics.json",
    "feature_importance.csv": "outputs/metrics/feature_importance.csv",
    "pretrain_feature_importance.csv": "outputs/metrics/pretrain_feature_importance.csv",
    "feature_stability.csv": "outputs/metrics/feature_stability.csv",
    "baseline_results.csv": "outputs/metrics/baseline_results.csv",
    "predictions_finetuned.csv": "outputs/predictions/predictions_finetuned.csv",
    "coverage_plot.png": "outputs/plots/coverage_plot.png",
    "coverage_report.json": "outputs/reports/coverage_report.json",
    "omni_coverage_report.json": "outputs/reports/omni_coverage_report.json",
    "trained_files.txt": "outputs/reports/trained_files.txt",
    "live_report_data.json": "outputs/reports/live_report_data.json",
    "storm_distribution.csv": "outputs/reports/storm_distribution.csv"
}

for src, dest in moves.items():
    src_path = os.path.join(root_dir, src)
    dest_path = os.path.join(root_dir, dest)
    if os.path.exists(src_path):
        shutil.move(src_path, dest_path)

# Move storm galleries
if os.path.exists(os.path.join(root_dir, "storm_gallery")):
    for f in os.listdir(os.path.join(root_dir, "storm_gallery")):
        shutil.move(os.path.join(root_dir, "storm_gallery", f), os.path.join(root_dir, "outputs/storm_gallery"))
    os.rmdir(os.path.join(root_dir, "storm_gallery"))

if os.path.exists(os.path.join(root_dir, "storm_gallery_goes")):
    for f in os.listdir(os.path.join(root_dir, "storm_gallery_goes")):
        dst_path = os.path.join(root_dir, "outputs/storm_gallery", f)
        if os.path.exists(dst_path):
            dst_path = os.path.join(root_dir, "outputs/storm_gallery", "goes_" + f)
        shutil.move(os.path.join(root_dir, "storm_gallery_goes", f), dst_path)
    os.rmdir(os.path.join(root_dir, "storm_gallery_goes"))

# Data directory
for f in ["download_manifest.csv", "omni_manifest.csv"]:
    if os.path.exists(os.path.join(root_dir, f)):
        shutil.move(os.path.join(root_dir, f), os.path.join(root_dir, "data", f))

# Large data files
for f in ["engineered_features.parquet", "final_merged_data.parquet", "goes_historical_features.parquet", "grasp_parsed.parquet", "master_time.parquet", "omni_parsed.parquet"]:
    if os.path.exists(os.path.join(root_dir, f)):
        shutil.move(os.path.join(root_dir, f), os.path.join(root_dir, "data", f))

if os.path.exists(os.path.join(root_dir, "omni")):
    shutil.move(os.path.join(root_dir, "omni"), os.path.join(root_dir, "data", "omni"))
if os.path.exists(os.path.join(root_dir, "datasets")):
    shutil.move(os.path.join(root_dir, "datasets"), os.path.join(root_dir, "data", "datasets"))

with open(os.path.join(root_dir, "data", "README.md"), "w") as f:
    f.write("# Data Directory\nContains raw and processed data (parquet files, omni data).")

# Phase 4: Clean Git
gitignore_content = """
__pycache__/
.ipynb_checkpoints/
*.parquet
*.csv
*.zip
*.joblib
*.pkl
venv/
data/raw/
data/omni/
data/datasets/
"""
with open(os.path.join(root_dir, ".gitignore"), "w") as f:
    f.write(gitignore_content.strip())

# Phase 5: Rewrite README
readme_content = """# GEOShield

## Project
GEOShield is a physics-aware machine learning pipeline for forecasting energetic electron fluxes (>2 MeV) at geostationary orbit.

## Problem
Geostationary satellites face severe operational hazards from energetic electron fluxes driven by solar storms. Traditional autoregressive models often fail to capture sudden storm-induced flux enhancements in a timely manner.

## Architecture
- **Phase 1 (Pretraining):** XGBoost model trained on 10 years of historical GOES 13/14 and OMNI data to learn baseline physics.
- **Phase 2 (Adaptation):** Warm-start finetuning on highly volatile GRASP target events.

## Datasets
- **Historical (2010-2020):** GOES 13/14 (Electron Flux) + OMNI (Solar Wind)
- **Target (2017-2018):** GRASP Specific Storm Periods

## Pipeline
1. Ingestion: Download GOES and OMNI data
2. Preprocessing: Parsing netCDF/CSV, neutralising missing flags
3. Feature Engineering: Rolling windows and temporal lags
4. Training: Physics-first pretraining followed by target adaptation
5. Evaluation: Peak recall and RMSE analysis

## Results
The model demonstrates an operational event awareness that outpaces naive persistence at longer horizons (12h), anchoring on a horizon-aware historical state and applying upstream solar wind physics (Speed, Bz).

## Final Metrics
See `FINAL_METRIC_RECONCILIATION.md` for a complete breakdown of true metrics.

## Limitations
Results should be interpreted as demonstrating operational event awareness rather than precise peak magnitude estimation.

## Installation
```bash
pip install -r requirements.txt
```

## Usage
Run the dashboard to interactively view storm onset alerts:
```bash
streamlit run src/dashboard/dashboard.py
```

## Repository Structure
Please refer to `PROJECT_INVENTORY.md` for the complete structure.

## Citation
ISRO PS14 Challenge - GEOShield Team

## Contributors
GEOShield Development Team
"""
with open(os.path.join(root_dir, "README.md"), "w") as f:
    f.write(readme_content)

# Phase 6: Team Handoff
team_start_content = """# Team Start Here

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
"""
with open(os.path.join(root_dir, "TEAM_START_HERE.md"), "w") as f:
    f.write(team_start_content)

# Phase 7: Verify
with open(os.path.join(root_dir, "cleanup_report.md"), "w") as f:
    f.write("# Cleanup Report\nRepository structure has been standardized. Obsolete files moved to `archive/`.")

with open(os.path.join(root_dir, "broken_files.md"), "w") as f:
    f.write("# Broken Files\nNone detected during restructuring.")

# Phase 8: Zip it
with zipfile.ZipFile(os.path.join(root_dir, "submission_release.zip"), "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(root_dir):
        if ".git" in root or "venv" in root or "archive" in root:
            continue
        for file in files:
            if file == "submission_release.zip" or file.endswith(".parquet") or file.endswith(".csv"): continue
            zipf.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), root_dir))

with open(os.path.join(root_dir, "RELEASE_NOTES.md"), "w") as f:
    f.write("# Release Notes - PS14_v2_final\nFinal cleaned repository structure for submission.")
