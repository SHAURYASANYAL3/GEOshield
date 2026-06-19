import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_squared_error

def calc_metrics(y_true, y_pred, p95_val, p99_val):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    
    true_95 = y_true > p95_val
    pred_95 = y_pred > p95_val
    recall_95 = np.sum(true_95 & pred_95) / np.sum(true_95) if np.sum(true_95) > 0 else 0
    
    true_99 = y_true > p99_val
    pred_99 = y_pred > p99_val
    recall_99 = np.sum(true_99 & pred_99) / np.sum(true_99) if np.sum(true_99) > 0 else 0
    
    return float(rmse), float(recall_95), float(recall_99)

def test_pretrained():
    print("PHASE 4: Evaluating Baseline Model on 11-Year GOES Historical Dataset")
    
    # 1. Load the Historical Features
    df = pd.read_parquet("data/goes_historical_features.parquet")
    df.sort_values("timestamp", inplace=True)
    p95 = df["Electron_Flux"].quantile(0.95)
    p99 = df["Electron_Flux"].quantile(0.99)
    
    # 2. We need the original GRASP model (recreate it quickly since it wasn't saved)
    print("Loading GRASP Frozen Baseline...")
    df_grasp = pd.read_parquet("data/engineered_features.parquet")
    p95_grasp = df_grasp["Electron_Flux"].quantile(0.95)
    p99_grasp = df_grasp["Electron_Flux"].quantile(0.99)
    
    features = [c for c in df_grasp.columns if c not in ["timestamp", "Target_45m", "Target_6h", "Target_12h", "Proton_Flux"]]
    
    # Train frozen GRASP model on 2017 data
    train_mask = (df_grasp["timestamp"] >= "2017-01-01") & (df_grasp["timestamp"] <= "2017-09-30")
    valid_rows = df_grasp["Target_12h"].notna()
    tr_df = df_grasp[train_mask & valid_rows].copy()
    y_tr_raw = tr_df["Target_12h"]
    weights = np.ones(len(tr_df))
    weights[y_tr_raw > p95_grasp] *= 5
    weights[y_tr_raw > p99_grasp] *= 15
    tr_df["_weight"] = weights
    
    storm_mask = y_tr_raw > p95_grasp
    quiet_mask = ~storm_mask
    num_storms = storm_mask.sum()
    target_quiet = num_storms * 4
    if num_storms > 0 and target_quiet < quiet_mask.sum():
        quiet_idx = tr_df[quiet_mask].sample(n=target_quiet, random_state=42).index
        final_train_idx = quiet_idx.union(tr_df[storm_mask].index)
    else:
        final_train_idx = tr_df.index
        
    X_tr = tr_df.loc[final_train_idx][features]
    y_tr = np.log10(tr_df.loc[final_train_idx]["Target_12h"] + 1)
    w_tr = tr_df.loc[final_train_idx]["_weight"]
    
    model_baseline = xgb.XGBRegressor(objective="reg:squarederror", max_depth=10, learning_rate=0.02, 
                                      subsample=0.85, colsample_bytree=0.85, min_child_weight=20, 
                                      gamma=0.5, reg_alpha=0.2, reg_lambda=2, n_estimators=1000, n_jobs=-1)
    model_baseline.fit(X_tr, y_tr, sample_weight=w_tr, verbose=False)
    
    # 3. Evaluate on GOES 11-year test period (2020)
    print("Evaluating on GOES 2020 Holdout...")
    df["year"] = df["timestamp"].dt.year
    test_mask = df["year"] == 2020
    X_test = df[test_mask][features]
    y_test_raw = df[test_mask]["Target_12h"]
    
    y_pred_log = model_baseline.predict(X_test)
    y_pred_raw = np.power(10, y_pred_log) - 1
    y_pred_raw = np.clip(y_pred_raw, 0, None)
    
    rmse, rec95, rec99 = calc_metrics(y_test_raw, y_pred_raw, p95, p99)
    print(f"BASELINE MODEL -> RMSE: {rmse:.2f} | PeakRecall95: {rec95*100:.2f}% | PeakRecall99: {rec99*100:.2f}%")
    
    if rec95 < 0.278:
        print("PHASE 5 DECISION: Baseline performance dropped on historical data. PROCEED with sequential training.")
    else:
        print("PHASE 5 DECISION: Baseline generalizes perfectly. STOP.")

if __name__ == "__main__":
    test_pretrained()
