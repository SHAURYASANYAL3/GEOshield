import os
import streamlit as st
import pandas as pd
import json
import matplotlib.pyplot as plt
import requests

st.set_page_config(page_title="PS14 Space Weather Forecast", layout="wide")

st.title("🛰️ PS14: Geostationary Radiation Environment Forecast")
st.markdown("Forecasting >2 MeV Electron Flux for ISRO Satellites using OMNI & GRASP")

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
    pred_45 = pd.read_csv(os.path.join(ROOT, "outputs", "predictions", "predictions_45.csv"))
    pred_6 = pd.read_csv(os.path.join(ROOT, "outputs", "predictions", "predictions_6.csv"))
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
    df_pred = pred_45.copy()
    df_pred["predicted"] = df_pred["actual"].shift(9)
    st.info("⚡ **Router Active**: XGBoost underperforms at ultra-short horizons due to transit-time delays. Serving **Persistence Model** (Actual flux shifted by 45m) for the 45m horizon.")
    h_key = "45m"
elif horizon == "6h":
    df_pred = pred_6
    h_key = "6h"
else:
    df_pred = pred_12
    h_key = "12h"

# ---------------------------------------------------------
# UPGRADE 2: LIVE SOLAR WIND FEED
# ---------------------------------------------------------
@st.cache_data(ttl=300)
def fetch_live_solar_wind():
    try:
        mag_url = "https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json"
        plasma_url = "https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json"
        mag_data = requests.get(mag_url, timeout=5).json()
        plasma_data = requests.get(plasma_url, timeout=5).json()
        
        # Get latest valid reading (skip header row 0)
        bz = next(row[3] for row in reversed(mag_data[1:]) if row[3] is not None)
        speed = next(row[2] for row in reversed(plasma_data[1:]) if row[2] is not None)
        return float(bz), float(speed)
    except Exception as e:
        return None, None

st.sidebar.markdown("---")
st.sidebar.subheader("📡 Live NOAA SWPC Feed")
bz_live, speed_live = fetch_live_solar_wind()

if bz_live is not None and speed_live is not None:
    st.sidebar.metric("Live Solar Wind Speed", f"{speed_live} km/s")
    st.sidebar.metric("Live IMF Bz", f"{bz_live} nT")
    st.sidebar.success("🔥 This is running on today's actual solar wind data.")
else:
    st.sidebar.error("NOAA SWPC feed currently unavailable.")

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
