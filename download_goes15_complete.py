"""
GEOShield — Complete GOES-15 Download Script
=============================================
Priority order per month:
  1. Science-quality 1-min CSV  (_science_v1.0.0.csv)  — best
  2. Science-quality 1-min NetCDF (_science_v1.0.0.nc)  — same data, diff format
  3. Operational 1-min CSV      (_1m.csv)               — real, no correction
  4. Operational 1-min NetCDF   (_1m.nc)                — same
  5. Operational 5-min CSV      (_5m.csv)               — lower resolution
  6. Operational 5-min NetCDF   (_5m.nc)                — same
  7. Nothing found              → genuine gap, skip

Run: python download_goes15_complete.py

Files land in: GEOShield_RealData_2010_2020/goes15/
Then upload that whole folder to Google Drive as-is.
"""

import requests
import re
from pathlib import Path

SAVE_DIR = Path("GEOShield_RealData_2010_2020/goes15")
SAVE_DIR.mkdir(parents=True, exist_ok=True)

BASE = "https://www.ncei.noaa.gov/data/goes-space-environment-monitor/access/avg"

# Download priority — science CSV first, then science NC,
# then operational CSV, then operational NC, then 5-min variants
PATTERNS = [
    ("science 1-min CSV",    r'href="(g15_epead_e13ew_1m_[^"]*science_v1\.0\.0\.csv)"'),
    ("science 1-min NetCDF", r'href="(g15_epead_e13ew_1m_[^"]*science_v1\.0\.0\.nc)"'),
    ("oper 1-min CSV",       r'href="(g15_epead_e13ew_1m_\d{8}_\d{8}\.csv)"'),
    ("oper 1-min NetCDF",    r'href="(g15_epead_e13ew_1m_\d{8}_\d{8}\.nc)"'),
    ("oper 5-min CSV",       r'href="(g15_epead_e13ew_5m_\d{8}_\d{8}\.csv)"'),
    ("oper 5-min NetCDF",    r'href="(g15_epead_e13ew_5m_\d{8}_\d{8}\.nc)"'),
]

downloaded = 0
skipped_gap = 0
already_had = 0

for year in range(2010, 2021):
    for month in range(1, 13):
        mm = f"{month:02d}"

        # Try CSV folder first, then NetCDF folder
        found_files = []
        found_label = ""

        for folder in ["csv", "netcdf"]:
            url = f"{BASE}/{year}/{mm}/goes15/{folder}/"
            try:
                r = requests.get(url, timeout=30)
                if r.status_code != 200:
                    continue
                page = r.text
            except Exception as e:
                continue

            for label, pattern in PATTERNS:
                files = re.findall(pattern, page)
                if files:
                    found_files = [(f, f"{BASE}/{year}/{mm}/goes15/{folder}/{f}")
                                   for f in files]
                    found_label = label
                    break

            if found_files:
                break  # stop checking folders once we have something

        if not found_files:
            print(f"  {year}/{mm}: genuine data gap - nothing on NOAA server")
            skipped_gap += 1
            continue

        for fname, furl in found_files:
            fpath = SAVE_DIR / fname
            if fpath.exists():
                print(f"  {year}/{mm}: already have {fname}")
                already_had += 1
                continue

            print(f"Downloading {year}/{mm} [{found_label}] -> {fname}")
            try:
                resp = requests.get(furl, timeout=180)
                if resp.status_code == 200:
                    fpath.write_bytes(resp.content)
                    size_mb = len(resp.content) / 1e6
                    print(f"  [OK] {size_mb:.1f} MB saved")
                    downloaded += 1
                else:
                    print(f"  HTTP {resp.status_code} - skipping")
            except Exception as e:
                print(f"  Error: {e}")

print()
print("=" * 50)
print("DOWNLOAD COMPLETE")
print(f"  Downloaded:   {downloaded} new files")
print(f"  Already had:  {already_had} files")
print(f"  True gaps:    {skipped_gap} months (no data on NOAA)")
print(f"  Saved to:     {SAVE_DIR.resolve()}")
print()
print("Next step: upload GEOShield_RealData_2010_2020 to Google Drive")
print("=" * 50)
