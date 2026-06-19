import os
import requests

def download_f107_sunspots():
    """
    Ingests F10.7 Solar Radio Flux and Sunspot numbers.
    This fulfills Phase V of the GEOShield Roadmap: Low-Frequency Proxies.
    
    Data Source: NOAA SWPC FTP / HTTP Indices
    Returns: Long-term baseline solar activity metrics.
    """
    print("Initiating NOAA SWPC F10.7 & Sunspot Ingestion...")
    out_dir = "data/indices"
    os.makedirs(out_dir, exist_ok=True)
    
    url = "https://services.swpc.noaa.gov/text/daily-geomagnetic-indices.txt"
    
    try:
        print(f"Fetching proxy data from {url}...")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Save raw text data
        out_file = os.path.join(out_dir, "daily_geomagnetic_indices.txt")
        with open(out_file, "w") as f:
            f.write(response.text)
            
        print(f"Successfully downloaded F10.7 & Geomagnetic Indices to {out_file}")
        print("Pipeline note: These daily values will be forward-filled to match the 5-min master_time.")
        
    except Exception as e:
        print(f"Error accessing SWPC proxy feed: {e}")

if __name__ == "__main__":
    download_f107_sunspots()
