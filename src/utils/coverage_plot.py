import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

def create_coverage_plot():
    print("Generating coverage plot...")
    df = pd.read_parquet("D:/isro/final_merged_data.parquet")
    
    plt.figure(figsize=(15, 4))
    
    # 1 for present, NaN for missing
    availability = df["Electron_Flux"].notna().astype(int)
    availability = availability.replace(0, float('nan'))
    
    plt.plot(df["timestamp"], availability, '|', color='blue', markersize=20)
    
    plt.title("GRASP Target Availability (2017-2018)")
    plt.xlabel("Date")
    plt.yticks([])  # Hide y-axis
    
    # Format x-axis
    ax = plt.gca()
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=2))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m"))
    plt.xticks(rotation=45)
    
    plt.tight_layout()
    plt.savefig("D:/isro/coverage_plot.png", dpi=300)
    print("Coverage plot saved to D:/isro/coverage_plot.png")

if __name__ == "__main__":
    create_coverage_plot()
