import pandas as pd

def build_master_time():
    print("Building master UTC timeline...")
    # Jan 1 2017 to Dec 31 2018 23:55:00
    timeline = pd.date_range(start="2017-01-01 00:00:00", end="2018-12-31 23:55:00", freq="5min")
    df = pd.DataFrame({"timestamp": timeline})
    
    output_file = "D:/isro/master_time.parquet"
    df.to_parquet(output_file, index=False)
    print(f"Master time generated and saved to {output_file}. Shape: {df.shape}")

if __name__ == "__main__":
    build_master_time()
