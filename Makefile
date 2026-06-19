.PHONY: reproduce data preprocess train evaluate

reproduce: data preprocess train evaluate

data:
	@echo "Downloading data..."
	python src/ingestion/download_goes_robust.py
	python src/ingestion/download_omni_robust.py

preprocess:
	@echo "Preprocessing data..."
	python src/preprocessing/parse_omni.py
	# Add any other preprocessing scripts needed

train:
	@echo "Training model..."
	python src/training/pretrain_xgboost.py
	python src/training/phase7_adapt_grasp.py

evaluate:
	@echo "Evaluating model..."
	python src/evaluation/baseline_persistence.py
	# Add any other evaluation scripts needed
