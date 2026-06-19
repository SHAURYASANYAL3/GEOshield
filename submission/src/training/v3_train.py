import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_squared_error
import os
import json

def v3_train():
    print("V3.0 High-Confidence Operational System Pipeline")
    print("------------------------------------------------")
    
    # Load GRASP dataset
    df = pd.read_parquet("data/engineered_features.parquet")
    df.sort_values("timestamp", inplace=True)
    
    model_tmp = xgb.XGBRegressor()
    model_tmp.load_model("models/pretrained/model_phase1_pretrained.json")
    features = model_tmp.get_booster().feature_names
    
    for f in features:
        if f not in df.columns:
            df[f] = np.nan
            
    p95_val = df["Electron_Flux"].quantile(0.95)
    p99_val = df["Electron_Flux"].quantile(0.99)
    
    n_rows = len(df)
    train_end = int(n_rows * 0.8)
    
    target_col = "Target_12h"
    valid_rows = df[target_col].notna()
    
    tr_df = df.iloc[:train_end][valid_rows[:train_end]].copy()
    test_df = df.iloc[train_end:][valid_rows[train_end:]].copy()
    
    X_tr = tr_df[features]
    y_tr = np.log10(tr_df[target_col] + 1)
    
    X_test = test_df[features]
    y_test_raw = test_df[target_col]
    
    os.makedirs("models/v3", exist_ok=True)
    
    print("1. Training Multi-Quantile Probabilistic Models...")
    quantiles = [0.1, 0.5, 0.9, 0.99]
    models = {}
    preds = {}
    
    for q in quantiles:
        print(f"   -> Training Quantile alpha={q}...")
        params = {
            "objective": "reg:quantileerror",
            "quantile_alpha": q,
            "max_depth": 8,
            "learning_rate": 0.05,
            "n_estimators": 100,
            "n_jobs": -1
        }
        model = xgb.XGBRegressor(**params)
        model.fit(X_tr, y_tr)
        models[q] = model
        model.save_model(f"models/v3/xgb_q{q}.json")
        
        y_pred_log = model.predict(X_test)
        y_pred_log = np.clip(y_pred_log, -10, 10)
        y_pred_raw = np.power(10, y_pred_log) - 1
        preds[q] = np.clip(y_pred_raw, 0, None)
    
    print("\n2. Computing Feature Importance (SHAP approximation via Gain)...")
    gain = models[0.5].get_booster().get_score(importance_type="gain")
    sorted_gain = {k: v for k, v in sorted(gain.items(), key=lambda item: item[1], reverse=True)[:10]}
    with open("models/v3/feature_importance.json", "w") as f:
        json.dump(sorted_gain, f, indent=4)
    print("   -> Top 3 drivers:", list(sorted_gain.keys())[:3])
    
    print("\n3. Calculating Advanced Multi-Severity Metrics...")
    rmse_median = np.sqrt(mean_squared_error(y_test_raw, preds[0.5]))
    
    # Recall on 95% using Median
    true_95 = y_test_raw > p95_val
    pred_median_95 = preds[0.5] > p95_val
    recall_95 = np.sum(true_95 & pred_median_95) / np.sum(true_95)
    
    # Recall on 99% using Q0.99 Model (Extreme Tail Catcher)
    true_99 = y_test_raw > p99_val
    pred_extreme_99 = preds[0.99] > p99_val
    recall_99 = np.sum(true_99 & pred_extreme_99) / np.sum(true_99)
    
    print(f"   -> Median RMSE: {rmse_median:.2f}")
    print(f"   -> Median PeakRecall95: {recall_95*100:.1f}%")
    print(f"   -> Extreme Tail (Q0.99) PeakRecall99: {recall_99*100:.1f}%")
    
    print("\n4. Generating Final Operational Outputs...")
    pred_df = pd.DataFrame({
        "timestamp": test_df["timestamp"],
        "actual": y_test_raw,
        "predicted_lower": preds[0.1],
        "predicted_median": preds[0.5],
        "predicted_upper": preds[0.9],
        "predicted_extreme": preds[0.99]
    })
    pred_df.to_csv("submission/outputs_v3_probabilistic.csv", index=False)
    print("   -> Probabilistic outputs saved to submission/outputs_v3_probabilistic.csv")

if __name__ == "__main__":
    v3_train()
