import os
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_file_list(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'html.parser')
                files = [link.get('href') for link in soup.find_all('a') if link.get('href').endswith('.csv')]
                return files, "success"
            elif resp.status_code == 404:
                return [], "not_found"
        except requests.RequestException:
            continue
    return [], "failed"

def download_file(url, dest_path, max_retries=3):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        return True, "already_exists", dest_path
    
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, stream=True, timeout=15)
            if resp.status_code == 200:
                with open(dest_path, 'wb') as f:
                    for chunk in resp.iter_content(chunk_size=8192):
                        f.write(chunk)
                return True, "downloaded", dest_path
        except requests.RequestException:
            continue
    return False, "download_failed", dest_path

def run_downloader():
    base_url = "https://www.ncei.noaa.gov/data/goes-space-environment-monitor/access/avg/{year}/{month:02d}/goes13/csv/"
    base_dir = "D:/isro/data/goes"
    
    print("Starting HYPER-THREADED GOES-13 Downloader...")
    
    # Generate all URLs to download
    tasks = []
    for year in range(2017, 2021):
        for month in range(1, 13):
            url = base_url.format(year=year, month=month)
            month_dir = os.path.join(base_dir, str(year), f"{month:02d}")
            os.makedirs(month_dir, exist_ok=True)
            files, status = fetch_file_list(url)
            if files:
                for filename in files:
                    file_url = url + filename
                    dest_path = os.path.join(month_dir, filename)
                    tasks.append((file_url, dest_path))

    print(f"Found {len(tasks)} files to download for 2017-2020.")
    
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(download_file, t[0], t[1]): t for t in tasks}
        
        count = 0
        for future in as_completed(futures):
            count += 1
            success, status, dest_path = future.result()
            if count % 50 == 0:
                print(f"Downloaded {count}/{len(tasks)} files...")

    print("Turbo download complete! Watchdog is now digesting the batch.")

if __name__ == "__main__":
    run_downloader()
