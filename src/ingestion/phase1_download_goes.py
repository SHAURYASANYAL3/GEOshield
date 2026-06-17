import os
import requests
from bs4 import BeautifulSoup
import pandas as pd

def download_goes_historical():
    base_url = "https://www.ncei.noaa.gov/data/goes-space-environment-monitor/access/avg/{year}/{month:02d}/goes13/csv/"
    out_dir = "data/goes"
    os.makedirs(out_dir, exist_ok=True)
    
    manifest_data = []
    
    print("Initiating Phase 1: Historical GOES Download (2010-2020)...")
    
    # FOR DEMONSTRATION IN HACKATHON CONTEXT:
    # We will simulate the downloading or only fetch a sample if it's too large,
    # but the logic here handles the full loop as requested.
    
    for year in range(2010, 2021):
        for month in range(1, 13):
            url = base_url.format(year=year, month=month)
            try:
                # In a real environment, we'd parse the HTML to find the exact CSV names
                # For this script, we'll try to fetch the directory listing
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    for link in soup.find_all('a'):
                        filename = link.get('href')
                        if filename.endswith('e05m.csv') or filename.endswith('.csv'):  # 5-minute electron data
                            file_url = url + filename
                            dest_path = os.path.join(out_dir, filename)
                            
                            # Download file if not exists
                            if not os.path.exists(dest_path):
                                file_resp = requests.get(file_url, timeout=15)
                                with open(dest_path, 'wb') as f:
                                    f.write(file_resp.content)
                            
                            # Log to manifest
                            size = os.path.getsize(dest_path)
                            manifest_data.append({
                                "file": filename,
                                "year": year,
                                "month": month,
                                "rows": "unknown", # will be counted in Phase 2
                                "status": "success" if size > 0 else "empty"
                            })
                            print(f"Downloaded: {filename}")
                            # time.sleep(0.1) # Be polite to NOAA servers
                else:
                    print(f"Skipping {year}-{month:02d}: Directory not found (HTTP {response.status_code})")
                    manifest_data.append({
                        "file": "none",
                        "year": year,
                        "month": month,
                        "rows": 0,
                        "status": f"failed_http_{response.status_code}"
                    })
            except Exception as e:
                print(f"Error fetching {year}-{month:02d}: {str(e)}")
                manifest_data.append({
                    "file": "none",
                    "year": year,
                    "month": month,
                    "rows": 0,
                    "status": "error"
                })
                
    manifest_df = pd.DataFrame(manifest_data)
    manifest_df.to_csv("data/download_manifest.csv", index=False)
    print(f"Download complete. Manifest saved with {len(manifest_df)} entries.")

if __name__ == "__main__":
    download_goes_historical()
