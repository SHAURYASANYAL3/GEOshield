# GEOShield Operational Console 2026

**India's Next-Generation Space Weather Operational Console**, designed to protect orbital assets from high-energy relativistic electron storms.

## 🚀 Mission

Geosynchronous satellites are vulnerable to internal charging caused by >2 MeV electron flux spikes. Traditional warning systems rely on simple persistence models or offer highly uncertain forecasts. **GEOShield** bridges this gap with a physics-informed Machine Learning pipeline capable of predicting P99 crossing events with a **median 12.0-hour advance warning**.

## 📊 Performance & Validation Metrics

Our model has been rigorously validated. Key metrics include:

- **Skill vs Persistence (+0.745):** We beat the persistence baseline by 74.5 points, proving the model isn't just copying yesterday's reading.
- **ROC AUC (0.988):** Binary classifiers at 0.95+ are considered very strong; 0.988 is outstanding for storm detection.
- **Expected Calibration Error (0.019):** Excellent calibration—when the model says 30% probability, the hit rate is ~30%. Vital for satellite operators.
- **Band Coverage (0.800):** Conformal calibration successfully shifted empirical coverage exactly to the 80% target.
- **P99 Threshold (59,153 Train-Only):** The critical >2 MeV threshold is derived strictly from the training set, explicitly eliminating data leakage.
- **Bootstrap CIs [0.429–0.457]:** P99 recall confidence intervals (n=5,033) prove the performance isn't just a lucky draw on a small test set.
- **Recall (95%–98%):** 95% at default threshold 0.5 (168/176), 98% at tuned threshold 0.2–0.3 (172/176).
- **GRASP Validation (0.933):** Independent blind test on ISRO's GRASP data at Indian longitudes (48°E).

## 📡 Data Pipeline
Three real instruments, forensically verified:
- **GOES-15 EPEAD (NOAA NCEI):** >2 MeV integral electron flux, 2010–2020. Resampled to 5-minute cadence — the forecast target.
- **OMNI HRO (NASA SPDF):** 5-minute solar-wind drivers (flow speed, IMF Bz, proton density, flow pressure).
- **GRASP (ISRO):** Storm flux at 48°E (Jul 2017 – Sep 2018). Held out entirely as an independent blind validation set.
- **Dataset:** 704,108 total rows (458,731 training rows 2010–2016) × 64 engineered features, inner-joined on 5-minute timestamps.

## 🧠 Model Architecture
- **Algorithm:** Gradient Boosted Trees (XGBoost) optimized for extreme imbalance.
- **Quantile Regression:** Predicts P10, P50, and P90 bands to accurately capture extreme peak storm events.
- **Calibration:** Regime-conditional conformal calibration achieving exact 80% coverage.

## 💻 Tech Stack
Built with **Next.js**, **React**, **Tailwind CSS**, **Framer Motion**, and **Recharts**.
To run the dashboard locally:
```bash
npm install
npm run dev
```

## 👨‍🚀 Team AstraVajra
**Bharatiya Antariksh Hackathon 2026 · Problem Statement 14**
- **Paavni Bansal** (Team Lead)
- **Shaurya Sanyal**
- **Sree Revanth**
- **Saketh Suman Bathini**

*Mentors: Dr. Ankush Bhaskar & Mr. Pritesh Meshram (SPL/VSSC)*
