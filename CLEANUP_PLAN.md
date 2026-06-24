# Cleanup Plan

## Audit Results

| Path | Size | Referenced By | Delete Candidate | Risk | Reason | Recovery Impact |
|---|---|---|---|---|---|---|
| `dashboard/` | ~30MB | Vercel Deployment | NO | HIGH | Core web application | Site goes down |
| `public/` | ~1MB | Dashboard | NO | HIGH | Static assets | Site images break |
| `data/` | ~500MB | Notebooks / Tests | NO | HIGH | Core training data | Reproducibility fails |
| `models/` | ~10MB | Dashboard API | NO | HIGH | Inference models | Site features break |
| `src/` | ~500KB | Dashboard API / CLI | NO | HIGH | Core logic | Site features break |
| `outputs/` | ~2MB | Notebooks | NO | LOW | Generated analysis | Just need to rerun |
| `plots/` | ~5MB | README | NO | LOW | Markdown visual assets | Broken images in docs |
| `GEOShield_Colab_AllInOne.ipynb` | ~1MB | Users | NO | HIGH | Main reproducible notebook | End-user loss |
| `README.md` | ~25KB | Users | NO | HIGH | Main documentation | Landing page fails |
| `package.json` | ~2KB | Node / Vercel | NO | HIGH | Dependencies | Build fails |
| `requirements.txt` | ~1KB | Python Env | NO | HIGH | Dependencies | Scripts fail |
| `.vs/` | 0B (Deleted) | None | N/A | LOW | Already deleted safely | None |
| `.claude/` | 0B (Deleted) | None | N/A | LOW | Already deleted safely | None |
| `archive/` | 0B (Deleted) | None | N/A | LOW | Already deleted safely | None |
| `COMPETITIVE_EDGE.md` | 0B (Deleted) | None | N/A | LOW | Already deleted safely | None |
| `JUDGE_PANEL_REPORT.md` | 0B (Deleted) | None | N/A | LOW | Already deleted safely | None |

> *Note: Almost all "MOVE TO PRIVATE" and "DELETE ONLY IF UNREFERENCED" candidates were already permanently deleted and pushed to GitHub in the preceding automated steps per user instruction. No further deletions are necessary to ensure security.*
