"""
Configuration settings for PyStockBot Polars pipeline
"""
from dataclasses import dataclass
from typing import List, Dict, Any
from pathlib import Path


@dataclass
class DataConfig:
    """Data-related configuration"""
    # Default stock symbol
    default_symbol: str = "AAPL"
    
    # Historical data range
    default_years_back: int = 5
    
    # Data directory
    data_dir: str = "../../data"
    
    # File names
    stock_data_file: str = "stock_data.parquet"
    events_data_file: str = "events.parquet"
    dividends_data_file: str = "dividends.parquet"
    splits_data_file: str = "splits.parquet"
    processed_data_file: str = "dataset.parquet"
    models_file: str = "trained_models.pkl"


@dataclass
class TechnicalIndicatorsConfig:
    """Technical indicators configuration"""
    # Target columns for indicators
    target_columns: List[str] = None
    
    # Window sizes for rolling calculations
    window_sizes: List[int] = None
    
    # RSI settings
    rsi_window: int = 14
    
    # MACD settings
    macd_fast: int = 12
    macd_slow: int = 26
    macd_signal: int = 9
    
    # Bollinger Bands settings
    bb_window: int = 20
    bb_std_dev: float = 2.0
    
    # ADX settings
    adx_window: int = 14
    
    # Stochastic settings
    stoch_window: int = 14
    
    def __post_init__(self):
        if self.target_columns is None:
            self.target_columns = ["close", "open", "high", "low", "volume"]
        if self.window_sizes is None:
            self.window_sizes = [7, 14, 30]


@dataclass
class FeatureEngineeringConfig:
    """Feature engineering configuration"""
    # Lag feature settings
    max_lag: int = 30
    price_change_lags: List[int] = None
    
    # Rolling statistics windows
    rolling_windows: List[int] = None
    
    # Percentage change periods
    pct_change_periods: List[int] = None
    
    # Event decay factors
    dividend_decay: float = 0.95
    split_decay: float = 0.95
    general_event_decay: float = 0.99
    
    def __post_init__(self):
        if self.price_change_lags is None:
            self.price_change_lags = [1, 2, 3, 5, 7, 10, 15, 20, 30]
        if self.rolling_windows is None:
            self.rolling_windows = [5, 10, 20, 50]
        if self.pct_change_periods is None:
            self.pct_change_periods = [1, 2, 3, 5, 10, 20]


@dataclass
class ModelConfig:
    """Model training configuration"""
    # Prediction horizons (days ahead)
    prediction_horizons: List[int] = None
    
    # Train/test split
    test_size: float = 0.2
    
    # Cross-validation folds
    cv_folds: int = 5
    
    # Random state for reproducibility
    random_state: int = 42
    
    # Model hyperparameters
    xgboost_params: Dict[str, Any] = None
    random_forest_params: Dict[str, Any] = None
    
    # Hyperparameter tuning
    perform_tuning: bool = False
    tuning_cv_folds: int = 3
    
    def __post_init__(self):
        if self.prediction_horizons is None:
            self.prediction_horizons = [1, 5, 10]
        
        if self.xgboost_params is None:
            self.xgboost_params = {
                'n_estimators': [50, 100, 200],
                'max_depth': [3, 5, 7],
                'learning_rate': [0.01, 0.1, 0.2],
                'subsample': [0.8, 0.9, 1.0]
            }
        
        if self.random_forest_params is None:
            self.random_forest_params = {
                'n_estimators': [50, 100, 200],
                'max_depth': [None, 5, 10, 20],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            }


@dataclass
class PipelineConfig:
    """Overall pipeline configuration"""
    # Sub-configurations
    data: DataConfig = None
    technical_indicators: TechnicalIndicatorsConfig = None
    feature_engineering: FeatureEngineeringConfig = None
    model: ModelConfig = None
    
    # Pipeline settings
    force_refresh: bool = False
    save_intermediate: bool = True
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "pipeline.log"
    
    def __post_init__(self):
        if self.data is None:
            self.data = DataConfig()
        if self.technical_indicators is None:
            self.technical_indicators = TechnicalIndicatorsConfig()
        if self.feature_engineering is None:
            self.feature_engineering = FeatureEngineeringConfig()
        if self.model is None:
            self.model = ModelConfig()
    
    def get_data_paths(self):
        """Get all data file paths"""
        data_dir = Path(self.data.data_dir)
        return {
            'stock_data': data_dir / self.data.stock_data_file,
            'events_data': data_dir / self.data.events_data_file,
            'dividends_data': data_dir / self.data.dividends_data_file,
            'splits_data': data_dir / self.data.splits_data_file,
            'processed_data': data_dir / self.data.processed_data_file,
            'models': data_dir / self.data.models_file
        }


# Default configuration instance
DEFAULT_CONFIG = PipelineConfig()


def load_config_from_file(config_path: str) -> PipelineConfig:
    """Load configuration from YAML or JSON file (placeholder for future implementation)"""
    # This would load from a file in a real implementation
    # For now, return default config
    return DEFAULT_CONFIG


def save_config_to_file(config: PipelineConfig, config_path: str):
    """Save configuration to file (placeholder for future implementation)"""
    # This would save to a file in a real implementation
    pass


# Configuration presets for different use cases
class ConfigPresets:
    """Predefined configuration presets"""
    
    @staticmethod
    def quick_test() -> PipelineConfig:
        """Configuration for quick testing with minimal data"""
        config = PipelineConfig()
        config.data.default_years_back = 1
        config.technical_indicators.window_sizes = [7, 14]
        config.feature_engineering.max_lag = 10
        config.model.prediction_horizons = [1, 5]
        config.model.perform_tuning = False
        return config
    
    @staticmethod
    def production() -> PipelineConfig:
        """Configuration for production use with comprehensive features"""
        config = PipelineConfig()
        config.data.default_years_back = 10
        config.technical_indicators.window_sizes = [5, 10, 14, 20, 30, 50]
        config.feature_engineering.max_lag = 60
        config.feature_engineering.rolling_windows = [5, 10, 20, 50, 100]
        config.model.prediction_horizons = [1, 3, 5, 10, 20]
        config.model.perform_tuning = True
        return config
    
    @staticmethod
    def development() -> PipelineConfig:
        """Configuration for development and experimentation"""
        config = PipelineConfig()
        config.data.default_years_back = 3
        config.technical_indicators.window_sizes = [7, 14, 30]
        config.feature_engineering.max_lag = 20
        config.model.prediction_horizons = [1, 5, 10]
        config.model.perform_tuning = False
        config.save_intermediate = True
        return config


if __name__ == "__main__":
    # Example usage
    print("Default Configuration:")
    print(f"  Symbol: {DEFAULT_CONFIG.data.default_symbol}")
    print(f"  Years back: {DEFAULT_CONFIG.data.default_years_back}")
    print(f"  Technical indicator windows: {DEFAULT_CONFIG.technical_indicators.window_sizes}")
    print(f"  Prediction horizons: {DEFAULT_CONFIG.model.prediction_horizons}")
    
    print("\nQuick Test Configuration:")
    quick_config = ConfigPresets.quick_test()
    print(f"  Years back: {quick_config.data.default_years_back}")
    print(f"  Technical indicator windows: {quick_config.technical_indicators.window_sizes}")
    print(f"  Max lag: {quick_config.feature_engineering.max_lag}")
    
    print("\nProduction Configuration:")
    prod_config = ConfigPresets.production()
    print(f"  Years back: {prod_config.data.default_years_back}")
    print(f"  Technical indicator windows: {prod_config.technical_indicators.window_sizes}")
    print(f"  Perform tuning: {prod_config.model.perform_tuning}")
    
    # Show data paths
    print("\nData Paths:")
    paths = DEFAULT_CONFIG.get_data_paths()
    for name, path in paths.items():
        print(f"  {name}: {path}")