import os
import glob

replacements = [
    ('"D:/isro/final_merged_data.parquet"', '"data/final_merged_data.parquet"'),
    ('"D:/isro/engineered_features.parquet"', '"data/engineered_features.parquet"'),
    ('"D:/isro/goes_historical_features.parquet"', '"data/goes_historical_features.parquet"'),
    ('"D:/isro/grasp_parsed.parquet"', '"data/grasp_parsed.parquet"'),
    ('"D:/isro/omni_parsed.parquet"', '"data/omni_parsed.parquet"'),
    ('"D:/isro/master_time.parquet"', '"data/master_time.parquet"'),
    ('"D:/isro/xgb_goes_physics.json"', '"models/pretrained/xgb_goes_physics.json"'),
    ('"D:/isro/baseline_metrics.json"', '"outputs/metrics/baseline_metrics.json"'),
    ('"D:/isro/metrics.json"', '"outputs/metrics/metrics.json"'),
    ('"D:/isro/metrics_finetuned.json"', '"outputs/metrics/metrics_finetuned.json"'),
    ('"D:/isro/baseline_results.csv"', '"outputs/predictions/baseline_results.csv"'),
    ('"D:/isro/predictions_45.csv"', '"outputs/predictions/predictions_45.csv"'),
    ('"D:/isro/predictions_6.csv"', '"outputs/predictions/predictions_6.csv"'),
    ('"D:/isro/predictions_12.csv"', '"outputs/predictions/predictions_12.csv"'),
    ('"D:/isro/predictions_{h_name.replace(''m'','''').replace(''h'','''')}.csv"', 'f"outputs/predictions/predictions_{h_name.replace(''m'','''').replace(''h'','''')}.csv"'),
    ('"D:/isro/feature_importance.csv"', '"outputs/metrics/feature_importance.csv"'),
    ('"D:/isro/trained_files.txt"', '"outputs/reports/trained_files.txt"'),
    ('"D:/isro/coverage_report.json"', '"outputs/reports/coverage_report.json"'),
    ('"D:/isro/omni_coverage_report.json"', '"outputs/reports/omni_coverage_report.json"'),
    ('"D:/isro/download_manifest.csv"', '"data/download_manifest.csv"'),
    ('"D:/isro/omni_manifest.csv"', '"data/omni_manifest.csv"'),
    ('"D:/isro/plots/residual_audit.png"', '"outputs/plots/residual_audit.png"'),
    ('"D:/isro/plots/actual_vs_predicted.png"', '"outputs/plots/actual_vs_predicted.png"'),
    ('"D:/isro/plots/residuals.png"', '"outputs/plots/residuals.png"'),
    ('"D:/isro/plots/peak_capture.png"', '"outputs/plots/peak_capture.png"'),
    ('"D:/isro/plots/feature_importance.png"', '"outputs/plots/feature_importance.png"'),
    ('"D:/isro/storm_gallery/storm_{i+1}.png"', 'f"outputs/storm_gallery/storm_{i+1}.png"'),
    ('"D:/isro/storm_gallery"', '"outputs/storm_gallery"'),
    ('"D:/isro/datasets/*.zip"', '"data/datasets/*.zip"'),
    ('"D:/isro/data/goes"', '"data/goes"'),
    ('"D:/isro/data/omni"', '"data/omni"'),
    ('"D:/isro/GOES-13andGOES-14"', '"data/GOES-13andGOES-14"'),
    ('"D:/isro/omni/omni_5min_def_dneZ2NWQwI.lst"', '"data/omni/omni_5min_def_dneZ2NWQwI.lst"'),
    ('"D:/isro/forensic_audit"', '"outputs/reports/forensic_audit"'),
]

files = glob.glob('src/**/*.py', recursive=True) + glob.glob('submission/**/*.py', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
        # Also handle potential f-strings that were replaced poorly
        
    # Catch any remaining D:/isro paths
    import re
    content = re.sub(r'"D:/isro/([^"\']+)"', r'"\1"', content)
    content = re.sub(r'\'D:/isro/([^"\']+)\'', r'\'\1\'', content)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed paths in {file}')

print('Done')
