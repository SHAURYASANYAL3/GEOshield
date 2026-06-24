# Reference Graph

## Dependency Checks

- **Vercel / Dashboard:**
  - `dashboard/package.json` -> all Next.js / React dependencies
  - `dashboard/src/app/page.tsx` -> requires `recharts` and static assets in `dashboard/public/`
- **Python / Inference:**
  - `src/` modules are referenced heavily by each other.
  - No markdown documents (`.md`) are imported by any `src/` file.
- **Documentation Links:**
  - `README.md` references the Colab Notebook (`GEOShield_Colab_AllInOne.ipynb`) and various shields/badges via external URLs.
- **Dead Links Scan:**
  - Since internal `.md` docs were not linked by the README or Dashboard, their prior deletion caused no dead links.
  - The live dashboard only fetches static datasets via explicit JSON or simulated APIs, which are fully intact.

**Conclusion:** All current files are strongly referenced by core components. All loose, unreferenced files were already removed.
