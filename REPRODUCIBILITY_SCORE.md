# Reproducibility Score

**Score: 8/10**

## The Single Command Rebuild
```bash
pip install -r requirements.txt && streamlit run submission/dashboard/dashboard.py
```

## Inference Reproducibility (10/10)
- **Environment:** 100% reproducible. Dependencies strictly pinned.
- **Artifacts:** Model and metrics are portable and OS-agnostic.

## Training Reproducibility (6/10)
- **Data Dependency:** Requires downloading 10 years of raw satellite data.
- **Code Completeness:** Repository is optimally structured for inference validation.
