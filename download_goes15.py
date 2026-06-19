import requests, re, os
from pathlib import Path

save_dir = Path("GEOShield_RealData_2010_2020/goes15")
save_dir.mkdir(parents=True, exist_ok=True)

base = "https://www.ncei.noaa.gov/data/goes-space-environment-monitor/access/avg"

for year in range(2010, 2021):
    for month in range(1, 13):
        mm = f"{month:02d}"
        url = f"{base}/{year}/{mm}/goes15/csv/"
        r = requests.get(url, timeout=30)
        files = re.findall(
            r'href="(g15_epead_e13ew_1m_[^"]*science_v1\.0\.0\.csv)"',
            r.text)
        for fname in files:
            fpath = save_dir / fname
            if fpath.exists():
                print(f"  skip {fname}")
                continue
            print(f"Downloading {year}/{mm} -> {fname}")
            data = requests.get(url + fname, timeout=120)
            fpath.write_bytes(data.content)
            print(f"  {len(data.content)/1e6:.1f} MB done")

print("ALL DONE — upload GEOShield_RealData_2010_2020 folder to Drive")
