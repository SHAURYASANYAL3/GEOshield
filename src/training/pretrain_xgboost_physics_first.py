import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_squared_error

def calc_physics_ratio(imp_df):
    omni_imp = imp_df[imp_df["Feature"].str.contains("Speed|BZ|SYM_H", case=False, na=False)]["Importance"].sum()
    electron_imp = imp_df[imp_df["Feature"].str.contains("Electron_Flux", case=False, na=False)]["Importance"].sum()
    if electron_imp == 0:
        return float('inf')
    return float(omni_imp / electron_imp)

def pretrain_physics_first():
    print("Loading 11-year historical dataset...")
    df = pd.read_parquet("data/goes_historical_features.parquet")
    df.sort_values("timestamp", inplace=True)
    df["year"] = df["timestamp"].dt.year
    
    p95_val = df["Electron_Flux"].quantile(0.95)
    p99_val = df["Electron_Flux"].quantile(0.99)
    
    train_mask = (df["year"] >= 2010) & (df["year"] <= 2017)
    valid_mask = (df["year"] >= 2018) & (df["year"] <= 2019)
    
    target_col = "Target_12h"
    
    # ---------------------------------------------------------
    # INTERVENTION 1: Drop rolling target features
    # ---------------------------------------------------------
    # In my synthetic data, I only made mean_3h, mean_24h, max_24h, std_24h.
    # We will exclude any column that is in drop_cols or starts with Electron_Flux_mean/std/max
    features = []
    for c in df.columns:
        if c in ["timestamp", "year", "Target_45m", "Target_6h", "Target_12h", "Proton_Flux"]:
            continue
        if "Electron_Flux_mean" in c or "Electron_Flux_std" in c or "Electron_Flux_max" in c:
            continue
        features.append(c)
        
    print(f"Using {len(features)} features after dropping rolling electron history.")
    
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
    np.log10(y_va_raw + 1)
    
    # ---------------------------------------------------------
    # INTERVENTION 3: Feature Dropout (Approximation via feature_weights)
    # ---------------------------------------------------------
    # We set OMNI features to higher probability of being selected.
    # Setting Electron history probability to 0.7 represents ~30% suppression.
    feature_weights = []
    for f in features:
        if "Electron_Flux" in f:
            feature_weights.append(0.7)
        else:
            feature_weights.append(1.0)
            
    # ---------------------------------------------------------
    # INTERVENTION 2: Cap target-memory influence (colsample)
    # ---------------------------------------------------------
    xgb_params = {
        "objective": "reg:squarederror",
        "max_depth": 10,
        "learning_rate": 0.02,
        "subsample": 0.85,
        "colsample_bytree": 0.60,  # Updated
        "colsample_bylevel": 0.50, # Updated
        "min_child_weight": 20,
        "gamma": 0.5,
        "reg_alpha": 0.2,
        "reg_lambda": 2,
        "n_estimators": 1000,
        "n_jobs": -1
    }
    
    print("\nTraining Physics-First Pretrained Model...")
    model = xgb.XGBRegressor(**xgb_params)
    
    # fit with feature_weights
    model.fit(X_tr, y_tr, sample_weight=w_tr, feature_weights=feature_weights, verbose=False)
    
    # ---------------------------------------------------------
    # INTERVENTION 4: Physics Audit
    # ---------------------------------------------------------
    imp_df = pd.DataFrame({
        "Feature": features,
        "Importance": model.feature_importances_
    }).sort_values("Importance", ascending=False)
    
    physics_ratio = calc_physics_ratio(imp_df)
    
    print("\nTop 10 Features:")
    print(imp_df.head(10).to_string(index=False))
    print(f"\nPhysics Ratio: {physics_ratio:.3f}")
    
    if physics_ratio < 0.3:
        print("STOP: Physics Ratio < 0.3. The model is still a persistence machine.")
    else:
        print("SUCCESS: Physics Ratio is healthy.")
        
    # Metrics
    y_va_pred_log = model.predict(X_va)
    y_va_pred_raw = np.power(10, y_va_pred_log) - 1
    y_va_pred_raw = np.clip(y_va_pred_raw, 0, None)
    
    true_95 = y_va_raw > p95_val
    pred_95 = y_va_pred_raw > p95_val
    recall_95 = np.sum(true_95 & pred_95) / np.sum(true_95) if np.sum(true_95) > 0 else 0
    
    rmse = np.sqrt(mean_squared_error(y_va_raw, y_va_pred_raw))
    
    print(f"\nValidation PeakRecall95: {recall_95*100:.1f}%")
    print(f"Validation RMSE: {rmse:.1f}")
    print(f"Optimized Score (Recall * PhysicsRatio): {recall_95 * physics_ratio:.3f}")

    model.save_model("models/pretrained/xgb_goes_physics.json")
    print("\nModel saved to xgb_goes_physics.json")

if __name__ == "__main__":
    pretrain_physics_first()
