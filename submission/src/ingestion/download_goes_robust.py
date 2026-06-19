import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import json

def fetch_file_list(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, timeout=15)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'html.parser')
                files = [link.get('href') for link in soup.find_all('a') if link.get('href').endswith('.csv')]
                return files, "success"
            elif resp.status_code == 404:
                return [], "not_found"
        except requests.RequestException:
            time.sleep(2)
            continue
    return [], "failed"

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

def validate_csv(filepath):
    try:
        if os.path.getsize(filepath) == 0:
            return False, 0, "empty_file"
        df = pd.read_csv(filepath, nrows=5)
        
        # Check if a timestamp-like column exists
        time_cols = [c for c in df.columns if 'time' in c.lower() or 'date' in c.lower()]
        if not time_cols:
            return False, 0, "no_timestamp_column"
            
        # Count actual rows
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            rows = sum(1 for line in f) - 1 # Subtract header
            
        return True, rows, "valid"
    except Exception as e:
        return False, 0, f"corrupted: {str(e)}"

def run_downloader():
    base_url = "https://www.ncei.noaa.gov/data/goes-space-environment-monitor/access/avg/{year}/{month:02d}/goes13/csv/"
    base_dir = "data/goes"
    
    manifest = []
    failed_downloads = 0
    missing_months = 0
    total_files = 0
    total_rows = 0
    years_completed = []
    
    print("Starting GOES-13 Historical Downloader (2010-2020)...")
    
    for year in range(2010, 2021):
        year_complete = True
        for month in range(1, 13):
            url = base_url.format(year=year, month=month)
            month_dir = os.path.join(base_dir, str(year), f"{month:02d}")
            os.makedirs(month_dir, exist_ok=True)
            
            print(f"Checking {year}-{month:02d}...")
            files, status = fetch_file_list(url)
            
            if status == "not_found" or not files:
                print(f"  -> No data found for {year}-{month:02d}")
                missing_months += 1
                year_complete = False
                continue
            elif status == "failed":
                print(f"  -> Failed to access directory {year}-{month:02d}")
                missing_months += 1
                year_complete = False
                continue
                
            for filename in files:
                file_url = url + filename
                dest_path = os.path.join(month_dir, filename)
                
                success, dl_status = download_file(file_url, dest_path)
                
                rows = 0
                size_mb = 0
                val_status = dl_status
                
                if success:
                    size_mb = os.path.getsize(dest_path) / (1024 * 1024)
                    is_valid, rows, v_msg = validate_csv(dest_path)
                    if not is_valid:
                        val_status = f"invalid: {v_msg}"
                        failed_downloads += 1
                    else:
                        val_status = "success"
                        total_files += 1
                        total_rows += rows
                else:
                    failed_downloads += 1
                    
                manifest.append({
                    "filename": filename,
                    "year": year,
                    "month": month,
                    "size_mb": round(size_mb, 2),
                    "rows": rows,
                    "download_status": val_status
                })
                
        if year_complete:
            years_completed.append(year)
            
        # Save intermediate manifest to allow safe interruption
        pd.DataFrame(manifest).to_csv("data/download_manifest.csv", index=False)
            
    print("\nDownload Loop Complete. Generating final reports...")
    
    # Final Manifest
    pd.DataFrame(manifest).to_csv("data/download_manifest.csv", index=False)
    
    # Coverage Report
    coverage = {
        "total_files": total_files,
        "total_rows": total_rows,
        "failed_downloads": failed_downloads,
        "missing_months": missing_months,
        "years_completed": years_completed
    }
    
    with open("outputs/reports/coverage_report.json", "w") as f:
        json.dump(coverage, f, indent=4)
        
    print(f"Completed! Downloaded {total_files} valid files. Data spans {total_rows} rows.")

if __name__ == "__main__":
    run_downloader()
