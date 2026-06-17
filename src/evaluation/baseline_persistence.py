import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
import json

def calculate_metrics(y_true, y_pred, p95_val, p99_val):
    mask = y_true.notna() & y_pred.notna()
    y_t = y_true[mask]
    y_p = y_pred[mask]
    
    if len(y_t) == 0:
        return None
        
    mae = mean_absolute_error(y_t, y_p)
    rmse = np.sqrt(mean_squared_error(y_t, y_p))
    
    # Log-RMSE: add 1 to avoid log(0)
    log_yt = np.log10(y_t + 1)
    log_yp = np.log10(y_p + 1)
    log_rmse = np.sqrt(mean_squared_error(log_yt, log_yp))
    
    # Peak recall
    # True if the actual target exceeded the threshold
    # Predicted if the prediction also exceeded the threshold
    # Wait, "Peak Detection Recall": Out of all true > threshold, what % did we predict > threshold?
    
    # For P95
    true_95 = y_t > p95_val
    pred_95 = y_p > p95_val
    recall_95 = np.sum(true_95 & pred_95) / np.sum(true_95) if np.sum(true_95) > 0 else 0
    
    # For P99
    true_99 = y_t > p99_val
    pred_99 = y_p > p99_val
    recall_99 = np.sum(true_99 & pred_99) / np.sum(true_99) if np.sum(true_99) > 0 else 0
    
    return {
        "MAE": float(mae),
        "RMSE": float(rmse),
        "Log-RMSE": float(log_rmse),
        "Peak_Recall_95": float(recall_95),
        "Peak_Recall_99": float(recall_99),
        "Count": len(y_t)
    }

def run_baseline():
    print("Running baseline persistence...")
    df = pd.read_parquet("data/final_merged_data.parquet")
    
    # Ensure sorted by time
    df.sort_values("timestamp", inplace=True)
    
    target = df["Electron_Flux"]
    
    # Compute global percentiles from the entire target
    p95_val = target.quantile(0.95)
    p99_val = target.quantile(0.99)
    print(f"Global 95th Percentile: {p95_val}")
    print(f"Global 99th Percentile: {p99_val}")
    
    horizons = {
        "45m": 9,   # 45 mins / 5 = 9 steps
        "6h": 72,   # 6 hours = 360 mins / 5 = 72 steps
        "12h": 144  # 12 hours = 720 mins / 5 = 144 steps
    }
    
    results = []
    metrics_dict = {}
    
    for h_name, steps in horizons.items():
        # y(t+h) = target shifted backwards by steps
        # So we predict that future value will be the current value `target`
        # Thus, y_true for current row is target shifted backwards
        # y_pred is `target`
        
        y_true = target.shift(-steps)
        y_pred = target
        
        metrics = calculate_metrics(y_true, y_pred, p95_val, p99_val)
        if metrics:
            metrics_dict[h_name] = metrics
            
            # Flatten for CSV
            row = {"Horizon": h_name, **metrics}
            results.append(row)
            print(f"--- {h_name} Horizon ---")
            for k, v in metrics.items():
                print(f"  {k}: {v}")
                
    # Save results
    res_df = pd.DataFrame(results)
    res_df.to_csv("outputs/predictions/baseline_results.csv", index=False)
    
    with open("outputs/metrics/baseline_metrics.json", "w") as f:
        json.dump(metrics_dict, f, indent=4)
        
    print("\nBaseline metrics saved to baseline_results.csv and baseline_metrics.json")

if __name__ == "__main__":
    run_baseline()
