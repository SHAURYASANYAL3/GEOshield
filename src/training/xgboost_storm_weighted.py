import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error
import json

def calc_metrics(y_true, y_pred, p95_val, p99_val, baseline_metrics=None, horizon="6h"):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    
    log_yt = np.log10(y_true + 1)
    log_yp = np.log10(np.clip(y_pred, 0, None) + 1)
    log_rmse = np.sqrt(mean_squared_error(log_yt, log_yp))
    
    true_95 = y_true > p95_val
    pred_95 = y_pred > p95_val
    recall_95 = np.sum(true_95 & pred_95) / np.sum(true_95) if np.sum(true_95) > 0 else 0
    
    true_99 = y_true > p99_val
    pred_99 = y_pred > p99_val
    recall_99 = np.sum(true_99 & pred_99) / np.sum(true_99) if np.sum(true_99) > 0 else 0
    
    metrics = {
        "MAE": float(mae),
        "RMSE": float(rmse),
        "LogRMSE": float(log_rmse),
        "PeakRecall95": float(recall_95),
        "PeakRecall99": float(recall_99)
    }
    
    if baseline_metrics and horizon in baseline_metrics:
        b_mae = baseline_metrics[horizon]["MAE"]
        b_rmse = baseline_metrics[horizon]["RMSE"]
        metrics["Imp_vs_Persist_MAE"] = float(100 * (b_mae - mae) / b_mae)
        metrics["Imp_vs_Persist_RMSE"] = float(100 * (b_rmse - rmse) / b_rmse)
        
    return metrics

def train_xgboost():
    print("Loading engineered features...")
    df = pd.read_parquet("data/engineered_features.parquet")
    df.sort_values("timestamp", inplace=True)
    
    # ---------------------------------------------------------
    # NEW FEATURES: Storm Context
    # ---------------------------------------------------------
    # Storm Candidate: Speed_24h > 500 & Bz_3h < 0
    # Since we have "Speed_km_s_mean_24h" and "BZ_nT_GSM_mean_3h" generated before:
    df["storm_candidate"] = ((df["Speed_km_s_mean_24h"] > 500) & (df["BZ_nT_GSM_mean_3h"] < 0)).astype(int)
    
    # Rolling max and std 24h (288 intervals)
    for col in ["Electron_Flux", "Speed_km_s", "BZ_nT_GSM"]:
        df[f"{col}_max_24h"] = df[col].rolling(window=288, min_periods=1).max()
        # std_24h was already created for some, but let's ensure it's there
        if f"{col}_std_24h" not in df.columns:
            df[f"{col}_std_24h"] = df[col].rolling(window=288, min_periods=1).std().fillna(0)
            
    with open("outputs/metrics/baseline_metrics.json", "r") as f:
        baseline_metrics = json.load(f)
        
    p95_val = df["Electron_Flux"].quantile(0.95)
    p99_val = df["Electron_Flux"].quantile(0.99)
    
    train_mask = (df["timestamp"] >= "2017-01-01") & (df["timestamp"] <= "2017-09-30")
    valid_mask = (df["timestamp"] >= "2017-10-01") & (df["timestamp"] <= "2017-12-31")
    
    features = [c for c in df.columns if c not in ["timestamp", "Target_45m", "Target_6h", "Target_12h", "Proton_Flux"]]
    print(f"Using {len(features)} features.")
    
    xgb_params = {
        "objective": "reg:squarederror",
        "max_depth": 10,
        "learning_rate": 0.02,
        "subsample": 0.85,
        "colsample_bytree": 0.85,
        "min_child_weight": 20,
        "gamma": 0.5,
        "reg_alpha": 0.2,
        "reg_lambda": 2,
        "n_estimators": 3000,
        "early_stopping_rounds": 100,
        "n_jobs": -1
    }
    
    horizons = {"6h": "Target_6h", "12h": "Target_12h"}
    all_metrics = {}
    
    for h_name, target_col in horizons.items():
        print(f"\n--- Training XGBoost {h_name} Horizon ---")
        
        valid_rows = df[target_col].notna()
        
        train_idx = df.index[train_mask & valid_rows]
        
        # ---------------------------------------------------------
        # Weighted Targets & Oversampling
        # ---------------------------------------------------------
        tr_df = df.loc[train_idx].copy()
        tr_y_raw = tr_df[target_col]
        
        # Calculate weights based on raw target flux
        weights = np.ones(len(tr_df))
        weights[tr_y_raw > p95_val] *= 5
        weights[tr_y_raw > p99_val] *= 15  # Total weight will be 5 * 15 = 75 for > p99
        tr_df["_weight"] = weights
        
        # Oversample storms (1:4 ratio)
        storm_mask = tr_y_raw > p95_val
        quiet_mask = ~storm_mask
        
        num_storms = storm_mask.sum()
        target_quiet = num_storms * 4
        
        if num_storms > 0 and target_quiet < quiet_mask.sum():
            quiet_idx = tr_df[quiet_mask].sample(n=target_quiet, random_state=42).index
            storm_idx = tr_df[storm_mask].index
            final_train_idx = quiet_idx.union(storm_idx)
        else:
            final_train_idx = tr_df.index
            
        print(f"Train size after oversampling: {len(final_train_idx)} (Storms: {num_storms})")
        
        X_tr = tr_df.loc[final_train_idx][features]
        y_tr_raw = tr_df.loc[final_train_idx][target_col]
        w_tr = tr_df.loc[final_train_idx]["_weight"]
        y_tr = np.log10(y_tr_raw + 1)
        
        X_va = df[valid_mask & valid_rows][features]
        y_va_raw = df[valid_mask & valid_rows][target_col]
        y_va = np.log10(y_va_raw + 1)
        
        model = xgb.XGBRegressor(**xgb_params)
        model.fit(
            X_tr, y_tr,
            sample_weight=w_tr,
            eval_set=[(X_va, y_va)],
            verbose=False
        )
        
        y_va_pred_log = model.predict(X_va)
        y_va_pred_raw = np.power(10, y_va_pred_log) - 1
        y_va_pred_raw = np.clip(y_va_pred_raw, 0, None)
        
        # Metrics
        mets = calc_metrics(y_va_raw, y_va_pred_raw, p95_val, p99_val, baseline_metrics, h_name)
        all_metrics[h_name] = mets
        print(mets)

if __name__ == "__main__":
    train_xgboost()
