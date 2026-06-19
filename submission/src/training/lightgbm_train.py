import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error, mean_squared_error
import json
import matplotlib.pyplot as plt

def calc_metrics(y_true, y_pred, p95_val, p99_val, baseline_metrics=None, horizon="45m"):
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

def train_lightgbm():
    print("Loading data...")
    df = pd.read_parquet("data/engineered_features.parquet")
    
    with open("outputs/metrics/baseline_metrics.json", "r") as f:
        baseline_metrics = json.load(f)
        
    # Full dataset percentiles for thresholding
    p95_val = df["Electron_Flux"].quantile(0.95)
    p99_val = df["Electron_Flux"].quantile(0.99)
    
    # Identify splits
    train_mask = (df["timestamp"] >= "2017-01-01") & (df["timestamp"] <= "2017-09-30")
    valid_mask = (df["timestamp"] >= "2017-10-01") & (df["timestamp"] <= "2017-12-31")
    (df["timestamp"] >= "2018-01-01") & (df["timestamp"] <= "2018-12-31")
    
    features = [c for c in df.columns if c not in ["timestamp", "Target_45m", "Target_6h", "Target_12h", "Electron_Flux", "Proton_Flux"]]
    # Wait, the user said KEEP Electron_Flux lag, Proton_Flux lag. 
    # The raw Electron_Flux and Proton_Flux are the actual measurements at time t. We can use them as features because they are known at time t.
    features.append("Electron_Flux")
    features.append("Proton_Flux")
    
    print(f"Using {len(features)} features.")
    
    lgb_params = {
        "objective": "regression",
        "metric": "rmse",
        "learning_rate": 0.03,
        "num_leaves": 64,
        "max_depth": 8,
        "feature_fraction": 0.8,
        "bagging_fraction": 0.8,
        "bagging_freq": 5,
        "min_data_in_leaf": 50,
        "n_estimators": 2000,
        "verbose": -1,
        "n_jobs": -1
    }
    
    horizons = {"45m": "Target_45m", "6h": "Target_6h", "12h": "Target_12h"}
    all_metrics = {}
    importance_dfs = []
    
    # For plotting
    fig_act_pred, axes_act_pred = plt.subplots(3, 1, figsize=(12, 12))
    fig_res, axes_res = plt.subplots(3, 1, figsize=(12, 12))
    fig_peak, axes_peak = plt.subplots(3, 1, figsize=(12, 12))
    fig_imp, axes_imp = plt.subplots(3, 1, figsize=(12, 12))
    
    for idx, (h_name, target_col) in enumerate(horizons.items()):
        print(f"\n--- Training {h_name} Horizon ---")
        
        # Valid rows for this target
        valid_rows = df[target_col].notna()
        
        X_tr = df[train_mask & valid_rows][features]
        y_tr_raw = df[train_mask & valid_rows][target_col]
        y_tr = np.log10(y_tr_raw + 1)
        
        X_va = df[valid_mask & valid_rows][features]
        y_va_raw = df[valid_mask & valid_rows][target_col]
        y_va = np.log10(y_va_raw + 1)
        
        model = lgb.LGBMRegressor(**lgb_params)
        model.fit(
            X_tr, y_tr,
            eval_set=[(X_va, y_va)],
            eval_metric="rmse",
            callbacks=[lgb.early_stopping(100, verbose=False)]
        )
        
        # Predict on valid set
        y_va_pred_log = model.predict(X_va)
        y_va_pred_raw = np.power(10, y_va_pred_log) - 1
        y_va_pred_raw = np.clip(y_va_pred_raw, 0, None)
        
        # Save predictions
        pred_df = pd.DataFrame({
            "timestamp": df[valid_mask & valid_rows]["timestamp"],
            "actual": y_va_raw,
            "predicted": y_va_pred_raw
        })
        pred_df.to_csv(f"outputs/predictions/predictions_{h_name.replace('m','').replace('h','')}.csv", index=False)
        
        # Metrics
        mets = calc_metrics(y_va_raw, y_va_pred_raw, p95_val, p99_val, baseline_metrics, h_name)
        all_metrics[h_name] = mets
        print(mets)
        
        # Feature Importance
        imp_df = pd.DataFrame({
            "Horizon": h_name,
            "Feature": features,
            "Importance": model.feature_importances_
        }).sort_values("Importance", ascending=False)
        importance_dfs.append(imp_df)
        
        # --- Plotting ---
        # 1. Actual vs Predicted (Last 1000 points)
        sample = pred_df.tail(1000)
        axes_act_pred[idx].plot(sample["timestamp"], sample["actual"], label="Actual", alpha=0.7)
        axes_act_pred[idx].plot(sample["timestamp"], sample["predicted"], label="Predicted", alpha=0.7)
        axes_act_pred[idx].set_title(f"Actual vs Predicted ({h_name})")
        axes_act_pred[idx].legend()
        
        # 2. Residuals
        axes_res[idx].scatter(y_va_pred_raw, y_va_raw - y_va_pred_raw, alpha=0.1)
        axes_res[idx].axhline(0, color='r')
        axes_res[idx].set_title(f"Residuals ({h_name})")
        axes_res[idx].set_xlabel("Predicted")
        axes_res[idx].set_ylabel("Error")
        
        # 3. Peak Capture
        axes_peak[idx].plot(pred_df["timestamp"], pred_df["actual"], label="Actual", alpha=0.5)
        peaks = pred_df[pred_df["actual"] > p95_val]
        axes_peak[idx].scatter(peaks["timestamp"], peaks["predicted"], color='red', label="Predicted at Peaks", s=10)
        axes_peak[idx].set_title(f"Peak Capture ({h_name})")
        axes_peak[idx].legend()
        
        # 4. Feature Importance
        top_15 = imp_df.head(15)
        axes_imp[idx].barh(top_15["Feature"][::-1], top_15["Importance"][::-1])
        axes_imp[idx].set_title(f"Top 15 Features ({h_name})")

    # Save final JSON and CSV
    with open("outputs/metrics/metrics.json", "w") as f:
        json.dump(all_metrics, f, indent=4)
        
    pd.concat(importance_dfs).to_csv("outputs/metrics/feature_importance.csv", index=False)
    
    # Save plots
    fig_act_pred.tight_layout()
    fig_act_pred.savefig("outputs/plots/actual_vs_predicted.png")
    
    fig_res.tight_layout()
    fig_res.savefig("outputs/plots/residuals.png")
    
    fig_peak.tight_layout()
    fig_peak.savefig("outputs/plots/peak_capture.png")
    
    fig_imp.tight_layout()
    fig_imp.savefig("outputs/plots/feature_importance.png")
    
    print("\nTraining complete. All outputs generated.")

if __name__ == "__main__":
    train_lightgbm()
