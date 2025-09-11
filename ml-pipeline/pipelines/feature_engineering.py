"""
Feature engineering module using Polars for advanced feature creation
"""
import polars as pl
import numpy as np
from typing import List, Optional


def forward_fill_with_decay(df: pl.DataFrame, column: str, decay_factor: float = 0.99) -> pl.DataFrame:
    """
    Forward fill missing values with exponential decay
    
    Args:
        df: Input DataFrame
        column: Column to apply decay to
        decay_factor: Decay factor (0 < decay_factor < 1)
    
    Returns:
        DataFrame with decay-filled values
    """
    if not (0 < decay_factor < 1):
        raise ValueError("Decay factor must be between 0 and 1")
    
    # This is a simplified implementation
    # For a full decay implementation, we'd need custom logic
    return df.with_columns([
        pl.col(column).forward_fill().alias(f"{column}_decay_filled")
    ])


def apply_event_features(df: pl.DataFrame, events_df: pl.DataFrame, prefix: str, 
                        decay_factor: float = 0.99, use_decay: bool = True) -> pl.DataFrame:
    """
    Apply event features to the main dataframe with optional decay
    
    Args:
        df: Main stock data DataFrame
        events_df: Events DataFrame with columns [date, name, value, sentiment]
        prefix: Prefix for event column names
        decay_factor: Decay factor for event impact
        use_decay: Whether to apply decay to event features
    
    Returns:
        DataFrame with event features added
    """
    if events_df.is_empty():
        # Add empty event columns if no events
        return df.with_columns([
            pl.lit(None).cast(pl.Utf8).alias(f"{prefix}_event_name"),
            pl.lit(None).cast(pl.Float64).alias(f"{prefix}_event_value"),
            pl.lit(None).cast(pl.Int32).alias(f"{prefix}_event_sentiment"),
            pl.lit(0.0).alias(f"{prefix}_event_decay")
        ])
    
    # Ensure events_df has correct column names
    events_renamed = events_df.rename({
        "name": f"{prefix}_event_name",
        "value": f"{prefix}_event_value", 
        "sentiment": f"{prefix}_event_sentiment"
    })
    
    # Add decay marker for events
    events_renamed = events_renamed.with_columns([
        pl.lit(1.0).alias(f"{prefix}_event_decay")
    ])
    
    # Left join with main DataFrame
    result_df = df.join(events_renamed, on="date", how="left")
    
    # Forward fill event information
    result_df = result_df.with_columns([
        pl.col(f"{prefix}_event_name").forward_fill(),
        pl.col(f"{prefix}_event_value").forward_fill(),
        pl.col(f"{prefix}_event_sentiment").forward_fill()
    ])
    
    # Apply decay if requested
    if use_decay:
        # Simplified decay - in production this would be more sophisticated
        result_df = result_df.with_columns([
            pl.col(f"{prefix}_event_decay").fill_null(0.0)
        ])
    
    # Fill nulls with defaults
    result_df = result_df.with_columns([
        pl.col(f"{prefix}_event_name").fill_null("none"),
        pl.col(f"{prefix}_event_value").fill_null(0.0),
        pl.col(f"{prefix}_event_sentiment").fill_null(0),
        pl.col(f"{prefix}_event_decay").fill_null(0.0)
    ])
    
    return result_df


def create_crossing_events(df: pl.DataFrame, lower_col: str, upper_col: str, 
                          event_name: str, decay_factor: float = 0.98) -> pl.DataFrame:
    """
    Create events when one indicator crosses another
    
    Args:
        df: DataFrame with indicator columns
        lower_col: Column representing lower boundary
        upper_col: Column representing upper boundary  
        event_name: Name for the crossing event
        decay_factor: Decay factor for event impact
    
    Returns:
        DataFrame with crossing event features
    """
    # Detect crossings (simplified logic)
    df_with_crossing = df.with_columns([
        # Check if upper crosses above lower
        ((pl.col(upper_col) > pl.col(lower_col)) & 
         (pl.col(upper_col).shift(1) <= pl.col(lower_col).shift(1))).alias(f"{event_name}_crossing_up"),
        # Check if upper crosses below lower  
        ((pl.col(upper_col) < pl.col(lower_col)) & 
         (pl.col(upper_col).shift(1) >= pl.col(lower_col).shift(1))).alias(f"{event_name}_crossing_down")
    ])
    
    # Create event decay columns
    df_with_crossing = df_with_crossing.with_columns([
        pl.when(pl.col(f"{event_name}_crossing_up"))
        .then(1.0)
        .when(pl.col(f"{event_name}_crossing_down"))
        .then(-1.0)
        .otherwise(0.0)
        .alias(f"{event_name}_event_signal")
    ])
    
    # Apply forward fill with decay (simplified)
    df_with_crossing = df_with_crossing.with_columns([
        pl.col(f"{event_name}_event_signal").fill_null(0.0).alias(f"{event_name}_event_decay")
    ])
    
    return df_with_crossing.drop([f"{event_name}_crossing_up", f"{event_name}_crossing_down"])


def is_not_null_features(df: pl.DataFrame, columns: List[str]) -> pl.DataFrame:
    """Create binary features indicating whether columns are not null"""
    return df.with_columns([
        pl.col(col).is_not_null().cast(pl.Int32).alias(f"is_not_null_{col}") 
        for col in columns
    ] + [
        pl.col(col).fill_null(0.0) 
        for col in columns
    ])


def greater_than_features(df: pl.DataFrame, column_pairs: List[tuple]) -> pl.DataFrame:
    """
    Create binary features for column comparisons
    
    Args:
        df: Input DataFrame
        column_pairs: List of (col1, col2) tuples to compare
    
    Returns:
        DataFrame with comparison features
    """
    return df.with_columns([
        (pl.col(col1) > pl.col(col2)).cast(pl.Int32).alias(f"{col1}_gt_{col2}")
        for col1, col2 in column_pairs
    ])


def drop_recent_rows(df: pl.DataFrame, n_rows: int) -> pl.DataFrame:
    """Drop the most recent n rows (used to remove NaN targets)"""
    return df.head(df.height - n_rows)


def comprehensive_lag_features(df: pl.DataFrame, base_columns: List[str], 
                             max_lag: int = 30, specific_lags: Optional[List[int]] = None) -> pl.DataFrame:
    """
    Create comprehensive lag features for multiple columns
    
    Args:
        df: Input DataFrame
        base_columns: List of columns to create lags for
        max_lag: Maximum lag to create (creates 1 to max_lag)
        specific_lags: Specific lag values to create (overrides max_lag)
    
    Returns:
        DataFrame with lag features
    """
    lags = list(range(1, max_lag + 1)) if specific_lags is None else specific_lags
    
    return df.with_columns([
        pl.col(column).shift(lag).alias(f"{column}_lag_{lag}")
        for column in base_columns
        for lag in lags
    ])


def rolling_statistics_features(df: pl.DataFrame, columns: List[str], 
                               windows: List[int] = [7, 14, 30]) -> pl.DataFrame:
    """
    Create rolling statistics features (mean, std, min, max, etc.)
    
    Args:
        df: Input DataFrame
        columns: Columns to calculate rolling statistics for
        windows: Window sizes for rolling calculations
    
    Returns:
        DataFrame with rolling statistics features
    """
    stats_funcs = [
        ('rolling_mean', lambda col, win: pl.col(col).rolling_mean(win)),
        ('rolling_std', lambda col, win: pl.col(col).rolling_std(win)),
        ('rolling_min', lambda col, win: pl.col(col).rolling_min(win)),
        ('rolling_max', lambda col, win: pl.col(col).rolling_max(win)),
        ('rolling_median', lambda col, win: pl.col(col).rolling_median(win)),
        ('rolling_q25', lambda col, win: pl.col(col).rolling_quantile(0.25, window_size=win)),
        ('rolling_q75', lambda col, win: pl.col(col).rolling_quantile(0.75, window_size=win))
    ]
    
    return df.with_columns([
        stat_func(column, window).alias(f"{column}_{stat_name}_{window}")
        for column in columns
        for window in windows
        for stat_name, stat_func in stats_funcs
    ])


def pct_change_features(df: pl.DataFrame, columns: List[str], 
                       periods: List[int] = [1, 5, 10, 20]) -> pl.DataFrame:
    """
    Create percentage change features for multiple periods
    
    Args:
        df: Input DataFrame  
        columns: Columns to calculate percentage changes for
        periods: Number of periods for percentage change calculation
    
    Returns:
        DataFrame with percentage change features
    """
    return df.with_columns([
        pl.col(column).pct_change(period).alias(f"{column}_pct_change_{period}")
        for column in columns
        for period in periods
    ])


def rank_features(df: pl.DataFrame, columns: List[str], 
                 windows: List[int] = [20, 50, 100]) -> pl.DataFrame:
    """
    Create rolling rank features (percentile rank within window)
    
    Args:
        df: Input DataFrame
        columns: Columns to calculate ranks for  
        windows: Window sizes for rank calculations
    
    Returns:
        DataFrame with rank features
    """
    return df.with_columns([
        pl.col(column).rolling_map(
            lambda s: pl.Series([(s.search_sorted(s[-1]) / len(s)) * 100]), 
            window_size=window
        ).alias(f"{column}_rank_pct_{window}")
        for column in columns
        for window in windows
    ])


def interaction_features(df: pl.DataFrame, column_pairs: List[tuple]) -> pl.DataFrame:
    """
    Create interaction features between column pairs
    
    Args:
        df: Input DataFrame
        column_pairs: List of (col1, col2) tuples for interactions
    
    Returns:  
        DataFrame with interaction features
    """
    interaction_types = [
        ('x', lambda c1, c2: pl.col(c1) * pl.col(c2)),
        ('div', lambda c1, c2: pl.col(c1) / pl.col(c2)),
        ('minus', lambda c1, c2: pl.col(c1) - pl.col(c2))
    ]
    
    return df.with_columns([
        func(col1, col2).alias(f"{col1}_{name}_{col2}")
        for col1, col2 in column_pairs
        for name, func in interaction_types
    ])


def create_comprehensive_features(df: pl.DataFrame, 
                                events_df: pl.DataFrame = None,
                                dividends_df: pl.DataFrame = None,
                                splits_df: pl.DataFrame = None) -> pl.DataFrame:
    """
    Create comprehensive feature set from base stock data
    
    Args:
        df: Base stock DataFrame with OHLCV data
        events_df: Optional events DataFrame
        dividends_df: Optional dividends DataFrame  
        splits_df: Optional splits DataFrame
    
Returns:
        DataFrame with comprehensive feature set
    """
    print("Creating comprehensive features...")
    
    # Base price columns
    price_cols = ["open", "close", "high", "low"]
    all_cols = price_cols + ["volume"]
    
    # 1. Date features
    print("  Adding date features...")
    df = df.with_columns([
        pl.col("date").dt.weekday().alias("day_of_week"),
        pl.col("date").dt.day().alias("day_of_month"), 
        pl.col("date").dt.month().alias("month"),
        pl.col("date").dt.year().alias("year"),
        pl.col("date").dt.week().alias("week_of_year")
    ])
    
    # 2. Basic percentage changes
    print("  Adding percentage change features...")
    df = pct_change_features(df, price_cols, [1, 2, 3, 5, 10, 20])
    
    # 3. Rolling statistics
    print("  Adding rolling statistics...")
    df = rolling_statistics_features(df, all_cols, [5, 10, 20, 50])
    
    # 4. Lag features (extensive)
    print("  Adding lag features...")
    df = comprehensive_lag_features(df, all_cols, max_lag=10)
    df = comprehensive_lag_features(df, ["close_pct_change_1"], specific_lags=[1, 2, 3, 5, 7, 10, 15, 20, 30])
    
    # 5. Apply events using functional approach
    event_configs = [
        (events_df, "general_events", 0.99, "general event features"),
        (dividends_df, "dividends", 0.95, "dividend features", ["dividends_event_value", "dividends_event_sentiment"]),
        (splits_df, "splits", 0.95, "split features", ["splits_event_value", "splits_event_sentiment"])
    ]
    
    from functools import reduce
    
    def apply_event_config(df, config):
        event_df, prefix, decay, desc = config[:4]
        null_check_cols = config[4] if len(config) > 4 else None
        
        if event_df is not None and not event_df.is_empty():
            print(f"  Adding {desc}...")
            df = apply_event_features(df, event_df, prefix, decay_factor=decay)
            if null_check_cols:
                df = is_not_null_features(df, null_check_cols)
        return df
    
    df = reduce(apply_event_config, event_configs, df)
    
    # 6. Interaction features for important pairs
    print("  Adding interaction features...")
    # Only use pairs where both columns exist
    potential_pairs = [
        ("open", "close"),
        ("high", "low"),
        ("close", "volume"),
        ("close_pct_change_1", "volume_pct_change_1")
    ]
    important_pairs = [
        (col1, col2) for col1, col2 in potential_pairs 
        if col1 in df.columns and col2 in df.columns
    ]
    if important_pairs:
        df = interaction_features(df, important_pairs)
    
    # 7. Comparison features
    print("  Adding comparison features...")
    potential_comparison_pairs = [
        ("close", "open"),
        ("close", "close_rolling_mean_20"),
        ("volume", "volume_rolling_mean_20")
    ]
    comparison_pairs = [
        (col1, col2) for col1, col2 in potential_comparison_pairs 
        if col1 in df.columns and col2 in df.columns
    ]
    if comparison_pairs:
        df = greater_than_features(df, comparison_pairs)
    
    print(f"Feature engineering complete. Total columns: {len(df.columns)}")
    return df


if __name__ == "__main__":
    # Test feature engineering
    dates = pl.date_range(pl.date(2020, 1, 1), pl.date(2023, 12, 31), "1d", eager=True)
    np.random.seed(42)
    prices = np.cumsum(np.random.randn(len(dates)) * 0.01) + 100
    
    df = pl.DataFrame({
        'date': dates,
        'close': prices,
        'open': prices + np.random.randn(len(dates)) * 0.5,
        'high': prices + np.abs(np.random.randn(len(dates)) * 1.0),
        'low': prices - np.abs(np.random.randn(len(dates)) * 1.0),
        'volume': np.random.randint(1000000, 10000000, len(dates))
    })
    
    # Test comprehensive feature creation
    df_features = create_comprehensive_features(df)
    print(f"Original columns: {len(df.columns)}")
    print(f"With features: {len(df_features.columns)}")
    print("New features sample:", [col for col in df_features.columns if col not in df.columns][:10])