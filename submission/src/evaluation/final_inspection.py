import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_squared_error
import os
import matplotlib.pyplot as plt

def calc_metrics(y_true, y_pred, p95_val):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    true_95 = y_true > p95_val
    pred_95 = y_pred > p95_val
    recall_95 = np.sum(true_95 & pred_95) / np.sum(true_95) if np.sum(true_95) > 0 else 0
    return float(rmse), float(recall_95)

def run_inspection():
    print("Loading data...")
    df = pd.read_parquet("data/engineered_features.parquet")
    df.sort_values("timestamp", inplace=True)
    
    # Storm candidate features (frozen logic)
    df["storm_candidate"] = ((df["Speed_km_s_mean_24h"] > 500) & (df["BZ_nT_GSM_mean_3h"] < 0)).astype(int)
    for col in ["Electron_Flux", "Speed_km_s", "BZ_nT_GSM"]:
        df[f"{col}_max_24h"] = df[col].rolling(window=288, min_periods=1).max()
        if f"{col}_std_24h" not in df.columns:
            df[f"{col}_std_24h"] = df[col].rolling(window=288, min_periods=1).std().fillna(0)
            
    p95_val = df["Electron_Flux"].quantile(0.95)
    p99_val = df["Electron_Flux"].quantile(0.99)
    
    train_mask = (df["timestamp"] >= "2017-01-01") & (df["timestamp"] <= "2017-09-30")
    valid_mask = (df["timestamp"] >= "2017-10-01") & (df["timestamp"] <= "2017-12-31")
    
    all_features = [c for c in df.columns if c not in ["timestamp", "Target_45m", "Target_6h", "Target_12h", "Proton_Flux"]]
    omni_features = [c for c in all_features if "Speed" in c or "BZ" in c or "Pressure" in c or "SYMH" in c or "Temperature" in c]
    grasp_features = [c for c in all_features if c not in omni_features]
    
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
        "n_estimators": 1000, # Lower for fast inspection
        "n_jobs": -1
    }
    
    # ---------------------------------------------------------
    # 1. Feature Importance & Predictions for 12h
    # ---------------------------------------------------------
    target_col = "Target_12h"
    valid_rows = df[target_col].notna()
    
    train_idx = df.index[train_mask & valid_rows]
    tr_df = df.loc[train_idx].copy()
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
        
    X_tr = tr_df.loc[final_train_idx][all_features]
    y_tr = np.log10(tr_df.loc[final_train_idx][target_col] + 1)
    w_tr = tr_df.loc[final_train_idx]["_weight"]
    
    X_va = df[valid_mask & valid_rows][all_features]
    y_va_raw = df[valid_mask & valid_rows][target_col]
    np.log10(y_va_raw + 1)
    
    print("Training full 12h model...")
    model_full = xgb.XGBRegressor(**xgb_params)
    model_full.fit(X_tr, y_tr, sample_weight=w_tr, verbose=False)
    
    # Feature Importance Audit
    imp_df = pd.DataFrame({"Feature": all_features, "Importance": model_full.feature_importances_})
    imp_df = imp_df.sort_values("Importance", ascending=False).head(15)
    print("\n--- TOP 15 FEATURES (12h) ---")
    print(imp_df.to_string(index=False))
    
    y_va_pred = np.power(10, model_full.predict(X_va)) - 1
    rmse_full, rec_full = calc_metrics(y_va_raw, y_va_pred, p95_val)
    
    val_res = pd.DataFrame({"timestamp": df[valid_mask & valid_rows]["timestamp"], "actual": y_va_raw, "predicted": y_va_pred})
    
    # ---------------------------------------------------------
    # 2. Storm Event Gallery
    # ---------------------------------------------------------
    os.makedirs("outputs/storm_gallery", exist_ok=True)
    # Find peaks in validation set
    peaks = val_res[val_res["actual"] > p99_val].sort_values("actual", ascending=False)
    # To avoid plotting the same storm multiple times, take peaks at least 24h apart
    unique_peaks = []
    last_t = pd.Timestamp("2000-01-01")
    for _, row in peaks.iterrows():
        if (row["timestamp"] - last_t).total_seconds() > 86400:
            unique_peaks.append(row["timestamp"])
            last_t = row["timestamp"]
        if len(unique_peaks) == 10:
            break
        
    for i, pt in enumerate(unique_peaks):
        event_data = val_res[(val_res["timestamp"] >= pt - pd.Timedelta(hours=48)) & 
                             (val_res["timestamp"] <= pt + pd.Timedelta(hours=48))]
        plt.figure(figsize=(10, 4))
        plt.plot(event_data["timestamp"], event_data["actual"], label="Actual", color="blue")
        plt.plot(event_data["timestamp"], event_data["predicted"], label="Predicted (12h)", color="red", linestyle="--")
        plt.axhline(p95_val, color="orange", linestyle=":", label="P95 Threshold")
        plt.title(f"Storm Event {i+1}: {pt.strftime('%Y-%m-%d %H:%M')}")
        plt.legend()
        plt.tight_layout()
        plt.savefig(f"outputs/storm_gallery/storm_{i+1}.png")
        plt.close()
        
    print("\nStorm gallery generated.")
    
    # ---------------------------------------------------------
    # 3. Residual Audit
    # ---------------------------------------------------------
    val_res["error"] = val_res["predicted"] - val_res["actual"]
    plt.figure(figsize=(10, 5))
    plt.scatter(val_res["actual"], val_res["error"], alpha=0.1, s=5)
    plt.axhline(0, color="red")
    plt.xlabel("Actual Flux")
    plt.ylabel("Prediction Error (Predicted - Actual)")
    plt.title("Residuals vs Actual (12h Horizon)")
    plt.tight_layout()
    plt.savefig("outputs/plots/residual_audit.png")
    plt.close()
    
    # Calculate systematic lag manually: cross correlation
    # For a 12h horizon, if we predict well, max cross-corr should be at lag 0 between predictions and actual targets
    ccf = np.correlate(val_res["actual"] - val_res["actual"].mean(), 
                       val_res["predicted"] - val_res["predicted"].mean(), mode="full")
    lag = ccf.argmax() - (len(val_res) - 1)
    print(f"Systematic lag in predictions: {lag * 5} minutes")
    
    # ---------------------------------------------------------
    # 4. Ablation Study
    # ---------------------------------------------------------
    print("\n--- Ablation Study ---")
    print(f"FULL MODEL    -> RMSE: {rmse_full:.1f} | PeakRecall95: {rec_full*100:.1f}%")
    
    # No OMNI
    X_tr_no_omni = tr_df.loc[final_train_idx][grasp_features]
    X_va_no_omni = df[valid_mask & valid_rows][grasp_features]
    model_no_omni = xgb.XGBRegressor(**xgb_params)
    model_no_omni.fit(X_tr_no_omni, y_tr, sample_weight=w_tr, verbose=False)
    y_pred_no_omni = np.power(10, model_no_omni.predict(X_va_no_omni)) - 1
    rmse_no, rec_no = calc_metrics(y_va_raw, y_pred_no_omni, p95_val)
    print(f"NO OMNI MODEL -> RMSE: {rmse_no:.1f} | PeakRecall95: {rec_no*100:.1f}%")
    
    # No GRASP
    X_tr_no_grasp = tr_df.loc[final_train_idx][omni_features]
    X_va_no_grasp = df[valid_mask & valid_rows][omni_features]
    model_no_grasp = xgb.XGBRegressor(**xgb_params)
    model_no_grasp.fit(X_tr_no_grasp, y_tr, sample_weight=w_tr, verbose=False)
    y_pred_no_grasp = np.power(10, model_no_grasp.predict(X_va_no_grasp)) - 1
    rmse_ng, rec_ng = calc_metrics(y_va_raw, y_pred_no_grasp, p95_val)
    print(f"NO GRASP MODEL-> RMSE: {rmse_ng:.1f} | PeakRecall95: {rec_ng*100:.1f}%")

if __name__ == "__main__":
    run_inspection()
