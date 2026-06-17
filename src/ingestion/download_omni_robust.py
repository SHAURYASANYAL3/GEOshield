import os
import requests
import time
import pandas as pd
import json

def download_file(url, dest_path, max_retries=3):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        return True, "already_exists"
    
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, stream=True, timeout=15)
            if resp.status_code == 200:
                with open(dest_path, 'wb') as f:
                    for chunk in resp.iter_content(chunk_size=8192):
                        f.write(chunk)
                return True, "downloaded"
        except requests.RequestException:
            time.sleep(2)
            continue
    return False, "download_failed"

def run_omni_downloader():
    # NASA SPDF OMNI 5-minute High Resolution Data
    base_url = "https://spdf.gsfc.nasa.gov/pub/data/omni/high_res_omni/omni_5min{year}.asc"
    base_dir = "D:/isro/data/omni"
    os.makedirs(base_dir, exist_ok=True)
    
    manifest = []
    failed_downloads = 0
    total_files = 0
    
    print("Starting Parallel OMNI-5min Historical Downloader (2010-2020)...")
    
    for year in range(2010, 2021):
        url = base_url.format(year=year)
        filename = f"omni_5min{year}.asc"
        dest_path = os.path.join(base_dir, filename)
        
        print(f"Fetching OMNI solar wind physics for {year}...")
        success, status = download_file(url, dest_path)
        
        size_mb = 0
        if success:
            size_mb = os.path.getsize(dest_path) / (1024 * 1024)
            total_files += 1
            print(f"  -> Success: {filename} ({size_mb:.2f} MB)")
        else:
            failed_downloads += 1
            print(f"  -> Failed: {filename}")
            
        manifest.append({
            "filename": filename,
            "year": year,
            "size_mb": round(size_mb, 2),
            "status": status
        })
        
        # Save intermediate state
        pd.DataFrame(manifest).to_csv("D:/isro/omni_manifest.csv", index=False)
        time.sleep(1) # Be polite to NASA
        
    print("\nParallel OMNI Download Complete.")
    
    coverage = {
        "total_files": total_files,
        "failed_downloads": failed_downloads,
    }
    
    with open("D:/isro/omni_coverage_report.json", "w") as f:
        json.dump(coverage, f, indent=4)

if __name__ == "__main__":
    run_omni_downloader()
