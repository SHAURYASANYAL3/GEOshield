# Final Q&A Preparation

**1. Why XGBoost?**
Deep learning models like LSTMs offer complex temporal modeling but act as unexplainable black boxes and carry high operational risk for rapid retraining. XGBoost gave us extreme training efficiency on 10 years of data, allowed us to directly pass windowed physics features (like 12h lag and SYM-H) so the model could learn explicit physical relationships, and resulted in a highly portable 47MB artifact.

**2. Why not persistence?**
Persistence works perfectly—until it doesn't. At the 45-minute horizon, magnetospheric inertia dominates, and persistence rightly wins. But at 12 hours, persistence assumes a calm state remains calm forever, failing catastrophically when a solar storm arrives. Our model cuts the 12-hour RMSE error of persistence in half (245 vs 461) by responding to upstream solar wind forcing.

**3. Why GOES → GRASP?**
GOES and OMNI gave us 11 years of "baseline reality"—the normal ebb and flow of the magnetosphere. We used this massive dataset to teach the model basic physics. But operational hazards come from extreme volatility, not normal days. We warm-start adapted our pretrained model specifically on the GRASP target events to force it to care about sudden, violent enhancements.

**4. Why Peak Recall not RMSE?**
RMSE punishes being wrong on average, which encourages models to conservatively forecast the mean. But in space weather, missing a major storm destroys a satellite, while overestimating a quiet day only costs fuel. We optimized and measured against Peak Recall because operational event awareness (did we catch the storm?) matters far more than precise amplitude fitting.

**5. Biggest limitation?**
Our 99th percentile peak recall is zero. The model is an excellent "elevated condition forecaster"—it knows a storm is coming and provides a 12-hour operational window. However, it cannot predict the exact mathematical ceiling of the most violent, one-in-a-thousand events. We built a system that reliably warns you to raise the shields, not one that tells you exactly how hard the impact will be.
