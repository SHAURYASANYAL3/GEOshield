import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_squared_error
import json

def calc_metrics(y_true, y_pred, p95_val, p99_val):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    
    true_95 = y_true > p95_val
    pred_95 = y_pred > p95_val
    recall_95 = np.sum(true_95 & pred_95) / np.sum(true_95) if np.sum(true_95) > 0 else 0
    
    true_99 = y_true > p99_val
    pred_99 = y_pred > p99_val
    recall_99 = np.sum(true_99 & pred_99) / np.sum(true_99) if np.sum(true_99) > 0 else 0
    
    return float(rmse), float(recall_95), float(recall_99)

def adapt_to_grasp():
    print("PHASE 7: Sequential Training (Warm-start adaptation) on GRASP 2017-2018...")
    
    # Load GRASP dataset
    df = pd.read_parquet("data/engineered_features.parquet")
    df.sort_values("timestamp", inplace=True)
    
    # ---------------------------------------------------------
    # INTERVENTION: Match pretraining feature set
    # ---------------------------------------------------------
    # We must match the EXACT features used in the pretrained model
    model_tmp = xgb.XGBRegressor()
    model_tmp.load_model("models/pretrained/xgb_goes_physics.json")
    
    # Get feature names from the booster
    features = model_tmp.get_booster().feature_names
    
    # Pad any missing features in GRASP with NaN
    for f in features:
        if f not in df.columns:
            print(f"Padding missing feature: {f}")
            df[f] = np.nan
            
    p95_val = df["Electron_Flux"].quantile(0.95)
    p99_val = df["Electron_Flux"].quantile(0.99)
    
    # Holdout last 20%
    n_rows = len(df)
    train_end = int(n_rows * 0.8)
    
    target_col = "Target_12h"
    valid_rows = df[target_col].notna()
    
    tr_df = df.iloc[:train_end][valid_rows[:train_end]].copy()
    test_df = df.iloc[train_end:][valid_rows[train_end:]].copy()
    
    tr_y_raw = tr_df[target_col]
    
    # Weighting (from XGBoost Storm Weighted configuration)
    weights = np.ones(len(tr_df))
    weights[tr_y_raw > p95_val] *= 5
    weights[tr_y_raw > p99_val] *= 15
    tr_df["_weight"] = weights
    
    # Oversampling storms
    storm_mask = tr_y_raw > p95_val
    quiet_mask = ~storm_mask
    num_storms = storm_mask.sum()
    target_quiet = num_storms * 4
    
    if num_storms > 0 and target_quiet < quiet_mask.sum():
        quiet_idx = tr_df[quiet_mask].sample(n=target_quiet, random_state=42).index
        final_train_idx = quiet_idx.union(tr_df[storm_mask].index)
    else:
        final_train_idx = tr_df.index
        
    # Now extract the exact features
    X_tr = tr_df.loc[final_train_idx][features]
    y_tr = np.log10(tr_df.loc[final_train_idx][target_col] + 1)
    w_tr = tr_df.loc[final_train_idx]["_weight"]
    
    X_test = test_df[features]
    y_test_raw = test_df[target_col]
    
    # ---------------------------------------------------------
    # Warm-start from xgb_goes_physics.json
    # ---------------------------------------------------------
    xgb_params = {
        "objective": "reg:squarederror",
        "max_depth": 10,
        "learning_rate": 0.01,  # Lower learning rate for fine-tuning
        "subsample": 0.85,
        "colsample_bytree": 0.60,
        "colsample_bylevel": 0.50,
        "min_child_weight": 20,
        "gamma": 0.5,
        "reg_alpha": 0.2,
        "reg_lambda": 2,
        "n_estimators": 500, # Number of *new* trees to add
        "n_jobs": -1
    }
    
    model = xgb.XGBRegressor(**xgb_params)
    
    # To warm-start, we use xgb_model argument in fit
    print(f"Sequential training on {len(X_tr)} GRASP samples...")
    model.fit(X_tr, y_tr, sample_weight=w_tr, xgb_model="models/pretrained/xgb_goes_physics.json", verbose=False)
    
    # Test Predictions
    y_pred_log = model.predict(X_test)
    y_pred_raw = np.power(10, y_pred_log) - 1
    y_pred_raw = np.clip(y_pred_raw, 0, None)
    
    # Generate predictions_finetuned.csv
    pred_df = pd.DataFrame({
        "timestamp": test_df["timestamp"],
        "actual": y_test_raw,
        "predicted_12h": y_pred_raw
    })
    pred_df.to_csv(\"predictions_finetuned.csv\", index=False)
    
    # Calculate metrics
    rmse, rec95, rec99 = calc_metrics(y_test_raw, y_pred_raw, p95_val, p99_val)
    
    mets = {
        "RMSE": rmse,
        "PeakRecall95": rec95,
        "PeakRecall99": rec99
    }
    with open("outputs/metrics/metrics_finetuned.json", "w") as f:
        json.dump(mets, f, indent=4)
        
    print("\n--- PHASE 7: ADAPTATION METRICS (12h Horizon / GRASP 20% Holdout) ---")
    print(f"RMSE: {rmse:.1f}")
    print(f"PeakRecall95: {rec95*100:.1f}%")
    print(f"PeakRecall99: {rec99*100:.1f}%")
    
    # Save final model
    model.save_model(\"submission/xgb_final_adapted.json\")
    print("Saved final sequentially trained model to D:/isro/submission/xgb_final_adapted.json")

if __name__ == "__main__":
    adapt_to_grasp()
