
#!/usr/bin/env python3
"""
Main pipeline orchestrator for PyStockBot using Polars
This script runs the complete ML pipeline from data ingestion to model training
"""

# Standard library imports
import argparse
import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Any

# Third-party imports
import polars as pl

# Local application imports
from data_ingestion import (
    download_stock_data,
    download_dividends_and_splits,
    create_events_dataframe,
    save_stock_data,
    load_stock_data,
)
from technical_indicators import apply_all_technical_indicators
from feature_engineering import create_comprehensive_features
from model_training import ModelTrainer

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('pipeline.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class PyStockBotPipeline:
    """Main pipeline orchestrator for PyStockBot"""

    data_dir: Path
    symbol: str
    stock_data_path: Path
    events_data_path: Path
    dividends_data_path: Path
    splits_data_path: Path
    processed_data_path: Path
    models_path: Path
    stock_data: Optional[pl.DataFrame]
    processed_data: Optional[pl.DataFrame]
    trainer: Optional[ModelTrainer]
    dividends_data: Optional[pl.DataFrame]
    splits_data: Optional[pl.DataFrame]
    events_data: Optional[pl.DataFrame]

    def __init__(self, data_dir: str = "../../data", symbol: str = "AAPL") -> None:
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        self.symbol = symbol

        # File paths
        self.stock_data_path = self.data_dir / "stock_data.parquet"
        self.events_data_path = self.data_dir / "events.parquet"
        self.dividends_data_path = self.data_dir / "dividends.parquet"
        self.splits_data_path = self.data_dir / "splits.parquet"
        self.processed_data_path = self.data_dir / "dataset.parquet"
        self.models_path = self.data_dir / "trained_models.pkl"

        # Data containers
        self.stock_data = None
        self.processed_data = None
        self.trainer = None
        self.dividends_data = None
        self.splits_data = None
        self.events_data = None

    def run_data_ingestion(self, years_back: int = 5, force_refresh: bool = False) -> None:
        """
        Step 1: Download and save stock data

        Args:
            years_back: Number of years of historical data to download
            force_refresh: Force re-download even if data exists
        """
        logger.info("=" * 60)
        logger.info("STEP 1: DATA INGESTION")
        logger.info("=" * 60)

        if not force_refresh and self.stock_data_path.exists():
            logger.info(f"Loading existing stock data from {self.stock_data_path}")
            self.stock_data = load_stock_data(str(self.stock_data_path))
            logger.info(f"Loaded {self.stock_data.height} rows of stock data")
        else:
            # Calculate date range
            end_date = datetime.now()
            start_date = datetime(end_date.year - years_back, end_date.month, end_date.day)

            logger.info(f"Downloading stock data for {self.symbol}")
            logger.info(f"Date range: {start_date.date()} to {end_date.date()}")

            # Download stock data
            self.stock_data = download_stock_data(self.symbol, start_date, end_date)

            # Save to parquet
            save_stock_data(self.stock_data, str(self.stock_data_path))

        # Download dividends and splits
        if not force_refresh and self.dividends_data_path.exists() and self.splits_data_path.exists():
            logger.info("Loading existing dividends and splits data")
            dividends_data = load_stock_data(str(self.dividends_data_path))
            splits_data = load_stock_data(str(self.splits_data_path))
        else:
            logger.info(f"Downloading dividends and splits for {self.symbol}")
            dividends_data, splits_data = download_dividends_and_splits(self.symbol)

            save_stock_data(dividends_data, str(self.dividends_data_path))
            save_stock_data(splits_data, str(self.splits_data_path))

        # Create or load events data
        if not self.events_data_path.exists():
            logger.info("Creating empty events dataset")
            events_data = create_events_dataframe()
            save_stock_data(events_data, str(self.events_data_path))
        else:
            events_data = load_stock_data(str(self.events_data_path))

        # Store for later use
        self.dividends_data = dividends_data
        self.splits_data = splits_data
        self.events_data = events_data

        logger.info("✓ Data ingestion completed successfully")

    def run_technical_indicators(self) -> None:
        """
        Step 2: Apply technical indicators
        """
        logger.info("=" * 60)
        logger.info("STEP 2: TECHNICAL INDICATORS")
        logger.info("=" * 60)

        if self.stock_data is None:
            raise ValueError("Stock data not loaded. Run data_ingestion first.")

        logger.info(f"Applying technical indicators to {self.stock_data.height} rows")
        logger.info(f"Starting columns: {len(self.stock_data.columns)}")

        # Apply all technical indicators
        self.stock_data = apply_all_technical_indicators(
            self.stock_data,
            target_columns=["close", "open", "high", "low", "volume"],
            windows=[7, 14, 30]
        )

        logger.info(f"After indicators: {len(self.stock_data.columns)} columns")
        logger.info("✓ Technical indicators completed successfully")

    def run_feature_engineering(self) -> None:
        """
        Step 3: Advanced feature engineering
        """
        logger.info("=" * 60)
        logger.info("STEP 3: FEATURE ENGINEERING")
        logger.info("=" * 60)

        if self.stock_data is None:
            raise ValueError("Stock data not loaded. Run previous steps first.")

        logger.info(f"Creating comprehensive features for {self.stock_data.height} rows")
        logger.info(f"Starting columns: {len(self.stock_data.columns)}")

        # Apply comprehensive feature engineering
        self.processed_data = create_comprehensive_features(
            self.stock_data,
            events_df=self.events_data,
            dividends_df=self.dividends_data,
            splits_df=self.splits_data
        )

        logger.info(f"After feature engineering: {len(self.processed_data.columns)} columns")
        logger.info("✓ Feature engineering completed successfully")

    def run_target_creation(self, prediction_horizons: Optional[List[int]] = None) -> List[str]:
        """
        Step 4: Create prediction targets

        Args:
            prediction_horizons: List of days ahead to predict (default: [1, 5, 10])
        """
        logger.info("=" * 60)
        logger.info("STEP 4: TARGET CREATION")
        logger.info("=" * 60)

        if self.processed_data is None:
            raise ValueError("Processed data not available. Run previous steps first.")

        if prediction_horizons is None:
            prediction_horizons = [1, 5, 10]

        logger.info(f"Creating targets for prediction horizons: {prediction_horizons}")

        # Create all targets in a single operation
        target_expressions: List[Any] = []
        target_columns: List[str] = []

        for horizon in prediction_horizons:
            # Regression target (percentage returns)
            return_target = f"target_return_{horizon}d"
            target_columns.append(return_target)
            target_expressions.append(
                ((pl.col("close").shift(-horizon) - pl.col("close")) / pl.col("close") * 100)
                .alias(return_target)
            )

            # Classification target (up/down movement)
            direction_target = f"target_direction_{horizon}d"
            target_columns.append(direction_target)
            target_expressions.append(
                (pl.col("close").shift(-horizon) > pl.col("close"))
                .cast(pl.Int32)
                .alias(direction_target)
            )

        # Add all targets in one operation
        self.processed_data = self.processed_data.with_columns(target_expressions)

        # Remove rows without future data (last N rows where N is max horizon)
        max_horizon = max(prediction_horizons)
        self.processed_data = self.processed_data.head(self.processed_data.height - max_horizon)

        logger.info(f"Created {len(target_columns)} target columns")
        logger.info(f"Final dataset shape: {self.processed_data.shape}")
        logger.info("✓ Target creation completed successfully")

        return target_columns

    def run_model_training(self, target_columns: List[str], perform_tuning: bool = False) -> Any:
        """
        Step 5: Train machine learning models

        Args:
            target_columns: List of target column names
            perform_tuning: Whether to perform hyperparameter tuning
        """
        logger.info("=" * 60)
        logger.info("STEP 5: MODEL TRAINING")
        logger.info("=" * 60)

        if self.processed_data is None:
            raise ValueError("Processed data not available. Run previous steps first.")

        # Separate regression and classification targets
        regression_targets = [col for col in target_columns if 'return' in col]
        classification_targets = [col for col in target_columns if 'direction' in col]

        logger.info(f"Regression targets: {regression_targets}")
        logger.info(f"Classification targets: {classification_targets}")

        # Initialize trainer
        self.trainer = ModelTrainer()

        # Train all models
        results = self.trainer.train_all_models(
            self.processed_data,
            regression_targets=regression_targets,
            classification_targets=classification_targets,
            perform_tuning=perform_tuning
        )

        # Print summary
        self.trainer.print_model_summary()

        logger.info("✓ Model training completed successfully")
        return results

    def save_results(self) -> None:
        """
        Step 6: Save processed data and trained models
        """
        logger.info("=" * 60)
        logger.info("STEP 6: SAVING RESULTS")
        logger.info("=" * 60)

        # Save processed dataset
        if self.processed_data is not None:
            logger.info(f"Saving processed dataset to {self.processed_data_path}")
            self.processed_data.write_parquet(str(self.processed_data_path))

        # Save trained models
        if self.trainer is not None:
            logger.info(f"Saving trained models to {self.models_path}")
            self.trainer.save_models(str(self.models_path))

        logger.info("✓ Results saved successfully")

    def _load_existing_results(self) -> bool:
        """Load existing models and processed data for analysis"""
        if not self.models_path.exists():
            logger.error("No existing models found. Run the full pipeline first.")
            return False

        self.trainer = ModelTrainer()
        self.trainer.load_models(str(self.models_path))

        if self.processed_data_path.exists():
            self.processed_data = load_stock_data(str(self.processed_data_path))

        return True

    def run_full_pipeline(
        self,
        years_back: int = 5,
        prediction_horizons: Optional[List[int]] = None,
        perform_tuning: bool = False,
        force_refresh: bool = False,
    ) -> bool:
        """
        Run the complete ML pipeline

        Args:
            years_back: Years of historical data to use
            prediction_horizons: Days ahead to predict
            perform_tuning: Whether to perform hyperparameter tuning
            force_refresh: Force refresh of all data
        """
        start_time = datetime.now()
        logger.info("🚀 Starting PyStockBot ML Pipeline")
        logger.info(f"Symbol: {self.symbol}")
        logger.info(f"Data directory: {self.data_dir}")
        logger.info(f"Start time: {start_time}")
        logger.info("=" * 80)

        try:
            # Step 1: Data Ingestion
            self.run_data_ingestion(years_back, force_refresh)

            # Step 2: Technical Indicators
            self.run_technical_indicators()

            # Step 3: Feature Engineering
            self.run_feature_engineering()

            # Step 4: Target Creation
            target_columns = self.run_target_creation(prediction_horizons)

            # Step 5: Model Training
            self.run_model_training(target_columns, perform_tuning)

            # Step 6: Save Results
            self.save_results()

            # Pipeline completed
            end_time = datetime.now()
            duration = end_time - start_time

            logger.info("=" * 80)
            logger.info("🎉 PIPELINE COMPLETED SUCCESSFULLY!")
            logger.info(f"Total duration: {duration}")
            logger.info(f"End time: {end_time}")
            logger.info("=" * 80)

            return True

        except Exception as e:
            logger.error(f"❌ Pipeline failed with error: {str(e)}")
            logger.error("Check the logs for detailed error information")
            return False

    def analyze_results(self) -> None:
        """Analyze and display pipeline results"""
        if self.trainer is None:
            logger.warning("No trained models available for analysis")
            return

        logger.info("=" * 60)
        logger.info("PIPELINE RESULTS ANALYSIS")
        logger.info("=" * 60)

        # Model performance summary
        self.trainer.print_model_summary()

        # Feature importance analysis
        logger.info("\nTOP FEATURES BY MODEL:")
        for target in self.trainer.models.keys():
            importance = self.trainer.get_feature_importance(target, 10)
            if importance:
                logger.info(f"\n{target}:")
                for i, (feature, score) in enumerate(importance, 1):
                    logger.info(f"  {i:2d}. {feature:<40} {score:.4f}")

        # Dataset statistics
        if self.processed_data is not None:
            logger.info(f"\nDATASET STATISTICS:")
            logger.info(f"Total rows: {self.processed_data.height:,}")
            logger.info(f"Total features: {len(self.processed_data.columns):,}")
            logger.info(f"Date range: {self.processed_data['date'].min()} to {self.processed_data['date'].max()}")


def run_pipeline_mode(pipeline: PyStockBotPipeline, args: argparse.Namespace) -> bool:
    if args.analyze_only:
        success = pipeline._load_existing_results() and pipeline.analyze_results() is None
    else:
        success = pipeline.run_full_pipeline(
            years_back=args.years,
            prediction_horizons=args.horizons,
            perform_tuning=args.tune,
            force_refresh=args.force_refresh
        ) and pipeline.analyze_results() is None
    return success


def main() -> int:
    """Main entry point with command line arguments"""
    parser = argparse.ArgumentParser(description="PyStockBot ML Pipeline")
    parser.add_argument("--symbol", default="AAPL", help="Stock symbol to analyze")
    parser.add_argument("--data-dir", default="../../data", help="Data directory path")
    parser.add_argument("--years", type=int, default=5, help="Years of historical data")
    parser.add_argument("--horizons", nargs="+", type=int, default=[1, 5, 10],help="Prediction horizons in days")
    parser.add_argument("--tune", action="store_true", help="Perform hyperparameter tuning")
    parser.add_argument("--force-refresh", action="store_true", help="Force refresh all data")
    parser.add_argument("--analyze-only", action="store_true", help="Only run analysis on existing results")
    args = parser.parse_args()

    pipeline = PyStockBotPipeline(data_dir=args.data_dir, symbol=args.symbol)

    try:
        success = run_pipeline_mode(pipeline, args)
        return 0 if success else 1
    except Exception as e:
        logger.error(f"Operation failed: {e}")
        return 1


if __name__ == "__main__":
    exit(main())
