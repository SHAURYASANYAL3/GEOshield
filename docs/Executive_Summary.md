# EXECUTIVE SUMMARY: GEOShield

**Project Title:** Forecasting Energetic Particle Radiation Environment for ISRO Geostationary Satellites using Physics-Aware Machine Learning

### The Problem
Geostationary (GEO) satellites operate in a hazardous radiation environment. Energetic electrons ($>2$ MeV) driven by solar storms can cause deep dielectric charging, leading to critical anomalies or complete satellite failure. Existing autoregressive forecasting models often fail to provide adequate warning for sudden flux enhancements because they rely too heavily on recent historical data rather than anticipating the physical impact of incoming solar wind.

### The GEOShield Solution
GEOShield is an operational forecasting pipeline that utilizes **Physics-Aware Machine Learning**. 
Instead of relying solely on the target dataset (GRASP), we designed a two-phase architecture:
1. **Physics-First Pretraining:** We trained an XGBoost model on a decade (2010–2020) of historical GOES satellite and upstream OMNI solar wind data. This taught the model the fundamental causal physics—how Solar Wind Speed, $B_z$, and Flow Pressure interact to inject and accelerate particles in the magnetosphere.
2. **Target Adaptation:** We then utilized warm-start transfer learning to adapt this "physics engine" to the specific highly volatile GRASP storm periods, aligning the model with target sensor characteristics.

### Final Results
The GEOShield model demonstrates superior performance over pure persistence baselines, successfully anticipating the timing and onset of major geomagnetic storms. 
- **45-Minute Horizon:** RMSE of **114.25**, successfully capturing short-term dynamics.
- **12-Hour Horizon:** Achieved a Peak Recall (95th percentile) of **31.0%** (up from 7.2% in baseline), highlighting the model's ability to map upstream solar wind conditions to delayed radiation belt responses.

### Final Scientific Claim
Energetic electron fluxes at geostationary orbit cannot be accurately predicted using persistence alone; upstream solar wind speed and $B_z$ conditions dictate sudden enhancements. GEOShield proves that a physics-aware tree-based model, explicitly denying recent electron flux leakage during peak storm events, outperforms pure autoregressive models by learning physically meaningful associations between solar wind drivers and radiation belt responses.

### Conclusion
GEOShield delivers a defensible, highly robust early-warning system. By prioritizing space physics over naive correlation, the model avoids "memory collapse" and provides satellite operators with the genuine anticipatory intelligence needed to safeguard critical ISRO orbital assets.