import os
from pathlib import Path

# 1. Rename files if they exist
file_moves = {
    "models/pretrained/model_phase1_pretrained.json": "models/pretrained/model_phase1_pretrained.json",
    "models/adapted/model_phase2_adapted.json": "models/adapted/model_phase2_adapted.json",
    "submission/model_phase2_adapted.json": "submission/model_phase2_adapted.json",
    "model_phase2_adapted.json": "model_phase2_adapted.json"
}

for old_path, new_path in file_moves.items():
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"Renamed {old_path} -> {new_path}")

# 2. Replace text in files
replace_map = {
    "model_phase1_pretrained.json": "model_phase1_pretrained.json",
    "model_phase2_adapted.json": "model_phase2_adapted.json",
    "model_phase2_adapted.json": "model_phase2_adapted.json"
}

root_dir = Path(".")
extensions = {".py", ".md", ".mmd", ".gitignore", ".json", ".csv"}

for p in root_dir.rglob("*"):
    if p.is_file() and p.suffix in extensions and not "GEOShield_RealData_2010_2020" in str(p) and not ".git" in str(p):
        try:
            content = p.read_text(encoding="utf-8")
            new_content = content
            for old_text, new_text in replace_map.items():
                new_content = new_content.replace(old_text, new_text)
            if new_content != content:
                p.write_text(new_content, encoding="utf-8")
                print(f"Updated references in {p}")
        except Exception as e:
            print(f"Skipping {p} due to error: {e}")
