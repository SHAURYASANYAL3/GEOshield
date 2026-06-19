import requests
import pandas as pd
import numpy as np
import time
from datetime import datetime, timedelta

def fetch_live_telemetry():
    """
    Connects to NOAA SWPC live telemetry endpoints.
    Moves GEOShield from static CSV evaluations to operational real-time monitoring.
    """
    url = "https://services.swpc.noaa.gov/json/goes/primary/integral-electrons-3-day.json"
    
    try:
        print(f"[{datetime.utcnow().isoformat()}Z] Polling live GOES telemetry...")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Parse live JSON stream
        df = pd.DataFrame(data)
        if df.empty:
            print("No telemetry data returned.")
            return None
            
        df['time_tag'] = pd.to_datetime(df['time_tag'])
        df['flux'] = pd.to_numeric(df['flux'])
        
        # Filter to >2 MeV electrons (the standard space weather operational threshold)
        df_2mev = df[df['energy'] == '>=2 MeV'].copy()
        df_2mev.sort_values('time_tag', inplace=True)
        
        latest_record = df_2mev.iloc[-1]
        print(f"LIVE TELEMETRY ACQUIRED:")
        print(f"Timestamp: {latest_record['time_tag']}")
        print(f"Energy: {latest_record['energy']}")
        print(f"Flux: {latest_record['flux']:.2f} pfu")
        
        # In a full deployment, this feeds directly into model.predict()
        # using the trailing 24 hours of data to generate lagged features.
        return df_2mev
        
    except Exception as e:
        print(f"Telemetry Error: {e}")
        return None

if __name__ == "__main__":
    fetch_live_telemetry()
