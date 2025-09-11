"""
Technical indicators module using Polars for high-performance computation
"""
import polars as pl
import numpy as np
from typing import List, Union


def simple_moving_average(df: pl.DataFrame, column: str, window: int) -> pl.DataFrame:
    """Calculate Simple Moving Average using Polars rolling operations"""
    return df.with_columns(
        pl.col(column).rolling_mean(window).alias(f"{column}_sma_{window}")
    )


def exponential_moving_average(df: pl.DataFrame, column: str, window: int) -> pl.DataFrame:
    """Calculate Exponential Moving Average using Polars ewm operations"""
    return df.with_columns(
        pl.col(column).ewm_mean(span=window).alias(f"{column}_ema_{window}")
    )


def bollinger_bands(df: pl.DataFrame, column: str, window: int = 20, std_dev: float = 2.0) -> pl.DataFrame:
    """Calculate Bollinger Bands"""
    return df.with_columns([
        pl.col(column).rolling_mean(window).alias(f"{column}_bb_middle_{window}"),
        pl.col(column).rolling_std(window).alias(f"{column}_bb_std_{window}"),
    ]).with_columns([
        (pl.col(f"{column}_bb_middle_{window}") + std_dev * pl.col(f"{column}_bb_std_{window}")).alias(f"{column}_bb_upper_{window}"),
        (pl.col(f"{column}_bb_middle_{window}") - std_dev * pl.col(f"{column}_bb_std_{window}")).alias(f"{column}_bb_lower_{window}")
    ])


def relative_strength_index(df: pl.DataFrame, column: str = "close", window: int = 14) -> pl.DataFrame:
    """Calculate Relative Strength Index (RSI)"""
    return df.with_columns([
        # Calculate price changes
        (pl.col(column) - pl.col(column).shift(1)).alias("price_change")
    ]).with_columns([
        # Separate gains and losses
        pl.when(pl.col("price_change") > 0).then(pl.col("price_change")).otherwise(0).alias("gain"),
        pl.when(pl.col("price_change") < 0).then(-pl.col("price_change")).otherwise(0).alias("loss")
    ]).with_columns([
        # Calculate average gains and losses
        pl.col("gain").rolling_mean(window).alias("avg_gain"),
        pl.col("loss").rolling_mean(window).alias("avg_loss")
    ]).with_columns([
        # Calculate RSI
        (100 - (100 / (1 + pl.col("avg_gain") / pl.col("avg_loss")))).alias(f"rsi_{window}")
    ]).drop(["price_change", "gain", "loss", "avg_gain", "avg_loss"])


def macd(df: pl.DataFrame, column: str = "close", fast: int = 12, slow: int = 26, signal: int = 9) -> pl.DataFrame:
    """Calculate MACD (Moving Average Convergence Divergence)"""
    return df.with_columns([
        pl.col(column).ewm_mean(span=fast).alias(f"ema_{fast}"),
        pl.col(column).ewm_mean(span=slow).alias(f"ema_{slow}"),
    ]).with_columns([
        (pl.col(f"ema_{fast}") - pl.col(f"ema_{slow}")).alias(f"macd_{fast}_{slow}")
    ]).with_columns([
        pl.col(f"macd_{fast}_{slow}").ewm_mean(span=signal).alias(f"macd_signal_{signal}")
    ]).with_columns([
        (pl.col(f"macd_{fast}_{slow}") - pl.col(f"macd_signal_{signal}")).alias(f"macd_histogram_{fast}_{slow}_{signal}")
    ])


def average_true_range(df: pl.DataFrame, window: int = 14) -> pl.DataFrame:
    """Calculate Average True Range (ATR)"""
    return df.with_columns([
        # Calculate True Range components
        (pl.col("high") - pl.col("low")).alias("hl"),
        (pl.col("high") - pl.col("close").shift(1)).abs().alias("hc"),
        (pl.col("low") - pl.col("close").shift(1)).abs().alias("lc")
    ]).with_columns([
        # True Range is the maximum of the three components
        pl.max_horizontal(["hl", "hc", "lc"]).alias("true_range")
    ]).with_columns([
        # Average True Range
        pl.col("true_range").rolling_mean(window).alias(f"atr_{window}")
    ]).drop(["hl", "hc", "lc", "true_range"])


def stochastic_oscillator(df: pl.DataFrame, window: int = 14) -> pl.DataFrame:
    """Calculate Stochastic Oscillator"""
    return df.with_columns([
        pl.col("low").rolling_min(window).alias("lowest_low"),
        pl.col("high").rolling_max(window).alias("highest_high")
    ]).with_columns([
        ((pl.col("close") - pl.col("lowest_low")) / 
         (pl.col("highest_high") - pl.col("lowest_low")) * 100).alias(f"stoch_k_{window}")
    ]).drop(["lowest_low", "highest_high"])


def williams_r(df: pl.DataFrame, window: int = 14) -> pl.DataFrame:
    """Calculate Williams %R"""
    return df.with_columns([
        pl.col("high").rolling_max(window).alias("highest_high"),
        pl.col("low").rolling_min(window).alias("lowest_low")
    ]).with_columns([
        (((pl.col("highest_high") - pl.col("close")) / 
          (pl.col("highest_high") - pl.col("lowest_low"))) * -100).alias(f"williams_r_{window}")
    ]).drop(["highest_high", "lowest_low"])


def on_balance_volume(df: pl.DataFrame) -> pl.DataFrame:
    """Calculate On-Balance Volume (OBV)"""
    return df.with_columns([
        pl.when(pl.col("close") > pl.col("close").shift(1))
        .then(pl.col("volume"))
        .when(pl.col("close") < pl.col("close").shift(1))
        .then(-pl.col("volume"))
        .otherwise(0)
        .alias("obv_change")
    ]).with_columns([
        pl.col("obv_change").cum_sum().alias("obv")
    ]).drop("obv_change")


def volume_weighted_average_price(df: pl.DataFrame, window: int = 14) -> pl.DataFrame:
    """Calculate Volume Weighted Average Price (VWAP)"""
    return df.with_columns([
        ((pl.col("high") + pl.col("low") + pl.col("close")) / 3).alias("typical_price")
    ]).with_columns([
        (pl.col("typical_price") * pl.col("volume")).alias("pv")
    ]).with_columns([
        (pl.col("pv").rolling_sum(window) / pl.col("volume").rolling_sum(window)).alias(f"vwap_{window}")
    ]).drop(["typical_price", "pv"])


def money_flow_index(df: pl.DataFrame, window: int = 14) -> pl.DataFrame:
    """Calculate Money Flow Index (MFI)"""
    return df.with_columns([
        ((pl.col("high") + pl.col("low") + pl.col("close")) / 3).alias("typical_price")
    ]).with_columns([
        (pl.col("typical_price") * pl.col("volume")).alias("raw_money_flow"),
        (pl.col("typical_price") > pl.col("typical_price").shift(1)).alias("price_up")
    ]).with_columns([
        pl.when(pl.col("price_up"))
        .then(pl.col("raw_money_flow"))
        .otherwise(0)
        .rolling_sum(window)
        .alias("positive_money_flow"),
        pl.when(~pl.col("price_up"))
        .then(pl.col("raw_money_flow"))
        .otherwise(0)
        .rolling_sum(window)
        .alias("negative_money_flow")
    ]).with_columns([
        (100 - (100 / (1 + pl.col("positive_money_flow") / pl.col("negative_money_flow")))).alias(f"mfi_{window}")
    ]).drop(["typical_price", "raw_money_flow", "price_up", "positive_money_flow", "negative_money_flow"])


def adx(df: pl.DataFrame, window: int = 14) -> pl.DataFrame:
    """Calculate Average Directional Index (ADX)"""
    return df.with_columns([
        # Calculate True Range components
        (pl.col("high") - pl.col("low")).alias("hl"),
        (pl.col("high") - pl.col("close").shift(1)).abs().alias("hc"),
        (pl.col("low") - pl.col("close").shift(1)).abs().alias("lc"),
        # Calculate directional movement
        (pl.col("high") - pl.col("high").shift(1)).alias("up_move"),
        (pl.col("low").shift(1) - pl.col("low")).alias("down_move")
    ]).with_columns([
        pl.max_horizontal(["hl", "hc", "lc"]).alias("tr"),
        pl.when((pl.col("up_move") > pl.col("down_move")) & (pl.col("up_move") > 0))
        .then(pl.col("up_move"))
        .otherwise(0)
        .alias("plus_dm"),
        pl.when((pl.col("down_move") > pl.col("up_move")) & (pl.col("down_move") > 0))
        .then(pl.col("down_move"))
        .otherwise(0)
        .alias("minus_dm")
    ]).with_columns([
        (100 * pl.col("plus_dm").ewm_mean(span=window) / pl.col("tr").ewm_mean(span=window)).alias("plus_di"),
        (100 * pl.col("minus_dm").ewm_mean(span=window) / pl.col("tr").ewm_mean(span=window)).alias("minus_di")
    ]).with_columns([
        (100 * (pl.col("plus_di") - pl.col("minus_di")).abs() / (pl.col("plus_di") + pl.col("minus_di"))).alias("dx")
    ]).with_columns([
        pl.col("dx").ewm_mean(span=window).alias(f"adx_{window}")
    ]).drop(["hl", "hc", "lc", "up_move", "down_move", "tr", "plus_dm", "minus_dm", "plus_di", "minus_di", "dx"])


def fibonacci_retracement(df: pl.DataFrame, high_col: str = "high", low_col: str = "low", 
                         levels: List[float] = [0.236, 0.382, 0.618, 1.0]) -> pl.DataFrame:
    """Calculate Fibonacci retracement levels"""
    return df.with_columns([
        (pl.col(high_col) - (pl.col(high_col) - pl.col(low_col)) * level).alias(f"fib_{level}")
        for level in levels
    ])


def volatility(df: pl.DataFrame, column: str, window: int = 14) -> pl.DataFrame:
    """Calculate price volatility"""
    return df.with_columns([
        pl.col(column).rolling_std(window).alias(f"volatility_{column}_{window}"),
        pl.col(column).pct_change().rolling_std(window).alias(f"volatility_pct_{column}_{window}")
    ])


def create_lag_features(df: pl.DataFrame, column: str, lags: List[int]) -> pl.DataFrame:
    """Create lag features for a given column"""
    return df.with_columns([
        pl.col(column).shift(lag).alias(f"{column}_lag_{lag}")
        for lag in lags
    ])


def percent_change_future(df: pl.DataFrame, column: str, periods: List[int]) -> pl.DataFrame:
    """Calculate future percent changes (for targets)"""
    return df.with_columns([
        ((pl.col(column).shift(-period) - pl.col(column)) / pl.col(column) * 100)
        .alias(f"{column}_pct_change_future_{period}")
        for period in periods
    ])


def up_down_future(df: pl.DataFrame, column: str, periods: List[int]) -> pl.DataFrame:
    """Calculate future up/down movement (binary classification target)"""
    return df.with_columns([
        pl.when(pl.col(column).shift(-period) > pl.col(column))
        .then(1)
        .otherwise(0)
        .alias(f"up_down_{column}_{period}")
        for period in periods
    ])


def date_features(df: pl.DataFrame) -> pl.DataFrame:
    """Extract date-based features"""
    return df.with_columns([
        pl.col("date").dt.weekday().alias("day_of_week"),
        pl.col("date").dt.day().alias("day_of_month"),
        pl.col("date").dt.month().alias("month"),
        pl.col("date").dt.year().alias("year"),
        pl.col("date").dt.week().alias("week_of_year")
    ])


def apply_all_technical_indicators(df: pl.DataFrame, 
                                 target_columns: List[str] = ["close", "open", "high", "low", "volume"],
                                 windows: List[int] = [7, 14, 30]) -> pl.DataFrame:
    """
    Apply all technical indicators with multiple windows and columns
    Optimized for Polars performance with vectorized operations
    """
    print("Applying technical indicators...")
    
    # Apply basic indicators using reduce pattern to eliminate nested loops
    from functools import reduce
    
    basic_indicators = [(simple_moving_average, target_columns), (exponential_moving_average, target_columns), (volatility, target_columns)]
    df = reduce(lambda d, args: reduce(lambda dd, c: reduce(lambda ddd, w: args[0](ddd, c, w), windows, dd), args[1], d), basic_indicators, df)
    
    # Apply close-specific indicators
    close_indicators = [(relative_strength_index, "close"), (bollinger_bands, "close")]
    df = reduce(lambda d, args: reduce(lambda dd, w: args[0](dd, args[1], w), windows, d), close_indicators, df)
    
    # Apply window-only indicators
    window_indicators = [stochastic_oscillator, williams_r, money_flow_index, volume_weighted_average_price]
    df = reduce(lambda d, func: reduce(lambda dd, w: func(dd, w), windows, d), window_indicators, df)
    
    # Apply single-instance indicators
    single_indicators = [macd, average_true_range, adx, on_balance_volume, fibonacci_retracement]
    df = reduce(lambda d, func: func(d), single_indicators, df)
    
    print("Technical indicators applied successfully")
    return df


def hurst_exponent_rolling(df: pl.DataFrame, column: str, max_lag: int = 20, window: int = 100) -> pl.DataFrame:
    """
    Calculate simplified Hurst exponent approximation using rolling variance ratios
    Optimized for Polars with minimal loops and conditionals
    """
    return df.with_columns([
        # Simplified Hurst approximation using variance ratios
        (pl.col(column).log().diff().rolling_var(window * 2) / 
         pl.col(column).log().diff().rolling_var(window)).log().alias(f"hurst_approx_{column}_{window}")
    ])


if __name__ == "__main__":
    # Example usage and testing
    import polars as pl
    
    # Create sample data
    dates = pl.date_range(pl.date(2020, 1, 1), pl.date(2023, 12, 31), "1d", eager=True)
    np.random.seed(42)
    prices = np.cumsum(np.random.randn(len(dates)) * 0.01) + 100
    volume = np.random.randint(1000000, 10000000, len(dates))
    
    df = pl.DataFrame({
        'date': dates,
        'close': prices,
        'open': prices + np.random.randn(len(dates)) * 0.5,
        'high': prices + np.abs(np.random.randn(len(dates)) * 1.0),
        'low': prices - np.abs(np.random.randn(len(dates)) * 1.0),
        'volume': volume
    })
    
    # Test technical indicators
    df_with_indicators = apply_all_technical_indicators(df)
    print(f"Original columns: {len(df.columns)}")
    print(f"With indicators: {len(df_with_indicators.columns)}")
    print("Sample indicators created:", [col for col in df_with_indicators.columns if col not in df.columns][:10])