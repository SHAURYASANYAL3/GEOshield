import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error
import json
import matplotlib.pyplot as plt

def calc_metrics(y_true, y_pred, p95_val, p99_val, y_true_base=None):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    
    true_95 = y_true > p95_val
    pred_95 = y_pred > p95_val
    recall_95 = np.sum(true_95 & pred_95) / np.sum(true_95) if np.sum(true_95) > 0 else 0
    
    true_99 = y_true > p99_val
    pred_99 = y_pred > p99_val
    recall_99 = np.sum(true_99 & pred_99) / np.sum(true_99) if np.sum(true_99) > 0 else 0
    
    metrics = {
        "RMSE": float(rmse),
        "PeakRecall95": float(recall_95),
        "PeakRecall99": float(recall_99)
    }
    
    if y_true_base is not None:
        # Persistence is predicting current 'Electron_Flux' shifted to actual predictions
        # For evaluation simplicity, let's say persistence is just the current flux value.
        rmse_base = np.sqrt(mean_squared_error(y_true, y_true_base))
        metrics["Imp_vs_Persist_RMSE"] = float(100 * (rmse_base - rmse) / rmse_base)
        
    return metrics

def pretrain():
    print("Loading 11-year historical dataset...")
    df = pd.read_parquet("D:/isro/goes_historical_features.parquet")
    df.sort_values("timestamp", inplace=True)
    
    p95_val = df["Electron_Flux"].quantile(0.95)
    p99_val = df["Electron_Flux"].quantile(0.99)
    
    df["year"] = df["timestamp"].dt.year
    
    # ---------------------------------------------------------
    # GUARDRAIL 1: Storm Leakage Audit
    # ---------------------------------------------------------
    storm_rates = df.groupby("year").apply(lambda x: (x["Electron_Flux"] > p95_val).sum()).reset_index(name="storm_count")
    storm_rates.to_csv("D:/isro/storm_distribution.csv", index=False)
    print("\nStorm Distribution Guardrail saved.")
    print(storm_rates)
    
    # ---------------------------------------------------------
    # GUARDRAIL 2: Feature Stability Audit
    # ---------------------------------------------------------
    stability = df.groupby("year")[["Speed_km_s", "BZ_nT_GSM", "Flow_pressure_nPa", "Electron_Flux"]].agg(["mean", "std"])
    stability.to_csv("D:/isro/feature_stability.csv")
    print("\nFeature Stability Guardrail saved.")
    
    # Check if normalization is absolutely necessary
    # In synthetic data, it should be stable. We will proceed.
    
    # ---------------------------------------------------------
    # PRETRAIN XGBoost
    # ---------------------------------------------------------
    train_mask = (df["year"] >= 2010) & (df["year"] <= 2017)
    valid_mask = (df["year"] >= 2018) & (df["year"] <= 2019)
    # Test is 2020, but we evaluate on valid for now
    
    target_col = "Target_12h"
    features = [c for c in df.columns if c not in ["timestamp", "year", "Target_45m", "Target_6h", "Target_12h", "Proton_Flux"]]
    
    valid_rows = df[target_col].notna()
    
    tr_df = df[train_mask & valid_rows].copy()
    tr_y_raw = tr_df[target_col]
    
    weights = np.ones(len(tr_df))
    weights[tr_y_raw > p95_val] *= 5
    weights[tr_y_raw > p99_val] *= 15
    tr_df["_weight"] = weights
    
    storm_mask = tr_y_raw > p95_val
    quiet_mask = ~storm_mask
    num_storms = storm_mask.sum()
    target_quiet = num_storms * 4
    
    if num_storms > 0 and target_quiet < quiet_mask.sum():
        quiet_idx = tr_df[quiet_mask].sample(n=target_quiet, random_state=42).index
        final_train_idx = quiet_idx.union(tr_df[storm_mask].index)
    else:
        final_train_idx = tr_df.index
        
    X_tr = tr_df.loc[final_train_idx][features]
    y_tr = np.log10(tr_df.loc[final_train_idx][target_col] + 1)
    w_tr = tr_df.loc[final_train_idx]["_weight"]
    
    X_va = df[valid_mask & valid_rows][features]
    y_va_raw = df[valid_mask & valid_rows][target_col]
    y_va_base = df[valid_mask & valid_rows]["Electron_Flux"] # persistence
    y_va = np.log10(y_va_raw + 1)
    
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
        "n_estimators": 1000,
        "n_jobs": -1
    }
    
    print(f"\nPretraining on {len(X_tr)} samples... (12h Horizon)")
    model = xgb.XGBRegressor(**xgb_params)
    model.fit(X_tr, y_tr, sample_weight=w_tr, verbose=False)
    
    # Save the model
    model.save_model("D:/isro/xgb_goes_base.json")
    print("Model saved to xgb_goes_base.json")
    
    # Feature Importance
    imp_df = pd.DataFrame({
        "Feature": features,
        "Importance": model.feature_importances_
    }).sort_values("Importance", ascending=False)
    imp_df.to_csv("D:/isro/pretrain_feature_importance.csv", index=False)
    print("\nTop 5 Features:")
    print(imp_df.head(5).to_string(index=False))
    
    # Predictions
    y_va_pred_log = model.predict(X_va)
    y_va_pred_raw = np.power(10, y_va_pred_log) - 1
    y_va_pred_raw = np.clip(y_va_pred_raw, 0, None)
    
    mets = calc_metrics(y_va_raw, y_va_pred_raw, p95_val, p99_val, y_va_base)
    with open("D:/isro/pretrain_metrics.json", "w") as f:
        json.dump(mets, f, indent=4)
        
    print("\nPretrain Validation Metrics (2018-2019):")
    print(mets)
    
    # ---------------------------------------------------------
    # STORM GALLERY (GOES)
    # ---------------------------------------------------------
    val_res = pd.DataFrame({
        "timestamp": df[valid_mask & valid_rows]["timestamp"],
        "actual": y_va_raw,
        "predicted": y_va_pred_raw
    })
    
    peaks = val_res[val_res["actual"] > p99_val].sort_values("actual", ascending=False)
    unique_peaks = []
    last_t = pd.Timestamp("2000-01-01")
    for _, row in peaks.iterrows():
        if (row["timestamp"] - last_t).total_seconds() > 86400:
            unique_peaks.append(row["timestamp"])
            last_t = row["timestamp"]
        if len(unique_peaks) == 10: break
        
    for i, pt in enumerate(unique_peaks):
        event_data = val_res[(val_res["timestamp"] >= pt - pd.Timedelta(hours=48)) & 
                             (val_res["timestamp"] <= pt + pd.Timedelta(hours=48))]
        plt.figure(figsize=(10, 4))
        plt.plot(event_data["timestamp"], event_data["actual"], label="Actual GOES", color="blue")
        plt.plot(event_data["timestamp"], event_data["predicted"], label="Pretrain Forecast (12h)", color="green", linestyle="--")
        plt.axhline(p95_val, color="orange", linestyle=":", label="P95 Threshold")
        plt.title(f"GOES Historical Storm {i+1}: {pt.strftime('%Y-%m-%d %H:%M')}")
        plt.legend()
        plt.tight_layout()
        plt.savefig(f"D:/isro/storm_gallery_goes/storm_{i+1}.png")
        plt.close()

if __name__ == "__main__":
    pretrain()
