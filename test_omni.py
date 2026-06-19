import pandas as pd
import numpy as np

with open('data/omni/omni_5min2010.asc', 'r') as f:
    lines = [f.readline().strip().split() for _ in range(5)]
    
for i, val in enumerate(lines[0]):
    print(f"Col {i}: {val}")
