import streamlit as st
import pandas as pd
import json
import matplotlib.pyplot as plt

st.set_page_config(page_title="PS14 Space Weather Forecast", layout="wide")

st.title("🛰️ PS14: Geostationary Radiation Environment Forecast")
st.markdown("Forecasting >2 MeV Electron Flux for ISRO Satellites using OMNI & GRASP")

import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))

# Load metrics
try:
    with open(os.path.join(ROOT, "outputs", "metrics", "metrics.json"), "r") as f:
        metrics = json.load(f)
except FileNotFoundError:
    st.error("Metrics file not found. Ensure training scripts have run.")
    st.stop()

# Load predictions
@st.cache_data
def load_predictions():
    pred_45 = pd.read_csv(os.path.join(ROOT, "archive", "predictions_45.csv"))
    pred_6 = pd.read_csv(os.path.join(ROOT, "archive", "predictions_6.csv"))
    pred_12 = pd.read_csv(os.path.join(ROOT, "outputs", "predictions", "predictions_finetuned.csv"))
    if "predicted_12h" in pred_12.columns:
        pred_12 = pred_12.rename(columns={"predicted_12h": "predicted"})
    for df in [pred_45, pred_6, pred_12]:
        df["timestamp"] = pd.to_datetime(df["timestamp"])
    return pred_45, pred_6, pred_12

pred_45, pred_6, pred_12 = load_predictions()

st.sidebar.header("Navigation")
horizon = st.sidebar.radio("Select Forecast Horizon", ["45m", "6h", "12h"])

if horizon == "45m":
    df_pred = pred_45
    h_key = "45m"
elif horizon == "6h":
    df_pred = pred_6
    h_key = "6h"
else:
    df_pred = pred_12
    h_key = "12h"

# Display Metrics
st.header(f"{horizon} Horizon Performance")
col1, col2, col3, col4 = st.columns(4)
m = metrics.get(h_key, {})
col1.metric("MAE", f"{m.get('MAE', 0):.2f}")
col2.metric("RMSE", f"{m.get('RMSE', 0):.2f}")
col3.metric("Peak Recall (95%)", f"{m.get('PeakRecall95', 0)*100:.1f}%")
if "Imp_vs_Persist_RMSE" in m:
    col4.metric("Improvement vs Baseline", f"{m.get('Imp_vs_Persist_RMSE', 0):.1f}%")

# Main Plot
st.subheader("Actual vs Forecast (Validation Set: Oct-Dec 2017)")
# Interactive plot using Streamlit's native line_chart
plot_df = df_pred.set_index("timestamp")[["actual", "predicted"]]
st.line_chart(plot_df, use_container_width=True)

# Storm Analysis
st.subheader("Extreme Event Capture")
p95 = df_pred["actual"].quantile(0.95)
storms = df_pred[df_pred["actual"] > p95]

fig, ax = plt.subplots(figsize=(12, 4))
ax.plot(df_pred["timestamp"], df_pred["actual"], label="True Flux", color="blue", alpha=0.5)
ax.scatter(storms["timestamp"], storms["predicted"], color="red", label="Model Forecast at Storm Peaks", zorder=5, s=15)
ax.axhline(p95, color="orange", linestyle="--", label="95th Percentile Threshold")
ax.set_ylabel("Electron Flux")
ax.legend()
st.pyplot(fig)

st.markdown("""
---
### System Architecture
1. **Inputs**: Upstream Solar Wind (Bz, Speed, Pressure, SYM-H)
2. **Lag Engine**: Context windows up to 48 hours
3. **Core Model**: Storm-weighted XGBoost / Persistence cascade
""")
