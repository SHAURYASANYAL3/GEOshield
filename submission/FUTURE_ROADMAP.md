# GEOShield: Future Operational Roadmap & Data Architecture

While the current GEOShield model successfully establishes an "elevated condition forecaster" with strong 12-hour lead times (25.1% 95th-percentile recall and 10.5% 99th-percentile recall via V3.0), migrating to a flawless "high-confidence operational" system requires addressing known structural gaps and integrating upstream data.

This document outlines the systematic engineering roadmap to achieve the ultimate operational-grade model.

## 1. Algorithmic & Pipeline Roadmap

### A. Explicit Temporal Leakage Guard Rails
- **Current State:** Implicit causality via lagged features; static percentiles.
- **Next Steps:** Formalize a strict chronological validation split (e.g., train on 2010–2015, validate on 2016–2020) to ensure generalizability across unseen solar cycles. Move from static percentile thresholds to dynamic thresholding to prevent distribution leakage.

### B. Synthetic Storm Augmentation
- **Current State:** Natural occurrences of Carrington-class spikes are excessively rare.
- **Next Steps:** Generate artificial extreme-event examples using physics-based models (e.g., Space Weather Modeling Framework) or statistical spike injection. Create a separate augmented training set to aggressively balance the 99% tail.

### C. Storm-Severity Categorization (Multi-Class)
- **Current State:** Binary condition based on elevated thresholds.
- **Next Steps:** Expand to a multi-severity matrix (Moderate, Severe, Extreme) with independent recall tracking per category.

---

## 2. Future Data Architecture Expansion

To fundamentally predict the absolute extreme outliers, the model must transition from reactive flux measurements to proactive upstream measurements.

### High-Value Phase V Datasets

| Dataset | Source | Purpose / Integration Strategy |
| :--- | :--- | :--- |
| **High-Frequency (1-min) GOES Flux** | NOAA NCEI | Captures sharper peaks smoothed out by 5-min averages. Will be resampled or kept as an isolated high-variance feature. |
| **Solar-Wind Plasma & Magnetic Field** | NASA CDAWeb (ACE/DSCOVR) | Provides upstream density, temperature, and detailed IMF components. Known precursors of geomagnetic storms prior to GEO impact. |
| **Geomagnetic Indices (Kp, AE, Dst)** | OMNI2 / NOAA | Gives broader context of magnetospheric activity. Will be merged into `parse_omni.py` to broaden the physical basis for storm prediction. |
| **Solar Flare / CME Catalog** | NOAA SWPC | Directly encodes solar eruptions. Will be ingested as an event table to create binary `flare_today` or `CME_in_last_X_hours` features. |
| **Historical Satellite Proton Flux** | GOES-SEP | Proton events accompany severe disturbances. Will be joined on timestamps as an auxiliary extreme-event flag. |
| **Solar Radio Flux (F10.7) & Sunspots** | NOAA SOLAR | Long-term predictive proxies. Will be added as forward-filled low-frequency features to stabilize periods of sparse solar-wind data. |
| **Reanalysis Atmospheric Data** | WDC Kyoto | Provides independent Dst index measures to facilitate multi-task training (predicting both electron flux and Dst simultaneously). |

### Bottom Line
The V3.0 pipeline implemented class-balancing, probabilistic outputs, and a quantile-error loss function. The final gap preventing 99% accuracy is the lack of explicit upstream solar-wind precursor measurements and CME event encoding. Adding the datasets outlined above will finalize the transition to a markedly stronger, operational-grade space weather defense system.
