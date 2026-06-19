import pandas as pd
import requests
import os
import json
from datetime import datetime

def download_flare_cme_catalog():
    """
    Ingests the NOAA SWPC Solar Flare and CME catalog.
    This fulfills Phase V of the GEOShield Roadmap: Explicit Event Precursors.
    
    Data Source: https://services.swpc.noaa.gov/json/solar-flares
    Returns: A dataframe of flare events to be joined as binary 
             'flare_in_last_24h' and 'flare_intensity' features.
    """
    print("Initiating SWPC Solar Flare & CME Ingestion...")
    os.makedirs("data/events", exist_ok=True)
    
    url = "https://services.swpc.noaa.gov/json/solar-flares"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        flare_data = response.json()
        
        df = pd.DataFrame(flare_data)
        if df.empty:
            print("No flare data returned.")
            return
            
        # Parse critical timestamps
        df['time_tag'] = pd.to_datetime(df['time_tag'])
        df['begin_time'] = pd.to_datetime(df['begin_time'])
        df['max_time'] = pd.to_datetime(df['max_time'])
        df['end_time'] = pd.to_datetime(df['end_time'])
        
        # Sort chronologically
        df.sort_values("time_tag", inplace=True)
        
        # Save raw event table
        output_file = "data/events/swpc_flares_latest.csv"
        df.to_csv(output_file, index=False)
        print(f"Successfully downloaded {len(df)} flare records to {output_file}")
        
    except Exception as e:
        print(f"Error downloading SWPC feed: {e}")

if __name__ == "__main__":
    download_flare_cme_catalog()
