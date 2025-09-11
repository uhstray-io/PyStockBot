"""
Data ingestion module for downloading stock data using yfinance and converting to Polars DataFrame
"""
from datetime import datetime
from pathlib import Path
import yfinance as yf
import polars as pl
import pandas as pd


def download_stock_data(symbol: str, start_date: datetime = None, end_date: datetime = None) -> pl.DataFrame:
    """
    Download stock data using yfinance and return as Polars DataFrame
    
    Args:
        symbol: Stock symbol (e.g., 'AAPL')
        start_date: Start date for data download
        end_date: End date for data download
    
    Returns:
        Polars DataFrame with stock data
    """
    if end_date is None:
        end_date = datetime.now()
    if start_date is None:
        start_date = datetime(end_date.year - 20, end_date.month, end_date.day)
    
    print(f"Downloading data for {symbol} from {start_date.date()} to {end_date.date()}")
    
    # Download using yfinance (returns pandas DataFrame)
    df_pandas = yf.download(symbol, start_date, end_date)
    
    # Reset index to make date a column
    df_pandas = df_pandas.reset_index()
    
    # Clean column names - remove multi-level index and convert to lowercase
    if isinstance(df_pandas.columns, pd.MultiIndex):
        df_pandas.columns = [x.lower() for x in df_pandas.columns.droplevel(1)]
    else:
        df_pandas.columns = [x.lower() for x in df_pandas.columns]
    
    # Convert to Polars DataFrame
    df = pl.from_pandas(df_pandas)
    
    # Ensure proper data types
    df = df.with_columns([
        pl.col("date").cast(pl.Date),
        pl.col("open").cast(pl.Float64),
        pl.col("high").cast(pl.Float64),
        pl.col("low").cast(pl.Float64),
        pl.col("close").cast(pl.Float64),
        pl.col("volume").cast(pl.Int64),
    ])
    
    print(f"Downloaded {df.height} rows of data")
    return df


def save_stock_data(df: pl.DataFrame, filepath: str):
    """Save Polars DataFrame to parquet file"""
    df.write_parquet(filepath)
    print(f"Saved data to {filepath}")


def load_stock_data(filepath: str) -> pl.DataFrame:
    """Load stock data from parquet file"""
    return pl.read_parquet(filepath)


def download_dividends_and_splits(symbol: str) -> tuple[pl.DataFrame, pl.DataFrame]:
    """
    Download dividend and stock split data
    
    Returns:
        Tuple of (dividends_df, splits_df) as Polars DataFrames
    """
    ticker = yf.Ticker(symbol)
    
    # Get dividends
    dividends_pandas = ticker.dividends.reset_index()
    if not dividends_pandas.empty:
        dividends_pandas.columns = ['date', 'value']
        dividends_pandas['name'] = 'dividend'
        dividends_pandas['sentiment'] = 1  # Positive sentiment for dividends
        dividends_df = pl.from_pandas(dividends_pandas)
        dividends_df = dividends_df.with_columns([
            pl.col("date").cast(pl.Date),
            pl.col("value").cast(pl.Float64),
        ])
    else:
        # Create empty DataFrame with correct schema
        dividends_df = pl.DataFrame({
            'date': [],
            'name': [],
            'value': [],
            'sentiment': []
        }, schema={
            'date': pl.Date,
            'name': pl.Utf8,
            'value': pl.Float64,
            'sentiment': pl.Int32
        })
    
    # Get stock splits
    splits_pandas = ticker.splits.reset_index()
    if not splits_pandas.empty:
        splits_pandas.columns = ['date', 'value']
        splits_pandas['name'] = 'split'
        splits_pandas['sentiment'] = 0  # Neutral sentiment for splits
        splits_df = pl.from_pandas(splits_pandas)
        splits_df = splits_df.with_columns([
            pl.col("date").cast(pl.Date),
            pl.col("value").cast(pl.Float64),
        ])
    else:
        # Create empty DataFrame with correct schema
        splits_df = pl.DataFrame({
            'date': [],
            'name': [],
            'value': [],
            'sentiment': []
        }, schema={
            'date': pl.Date,
            'name': pl.Utf8,
            'value': pl.Float64,
            'sentiment': pl.Int32
        })
    
    print(f"Downloaded {dividends_df.height} dividend events and {splits_df.height} split events")
    return dividends_df, splits_df


def create_events_dataframe() -> pl.DataFrame:
    """
    Create an empty events DataFrame with the correct schema
    This is a placeholder for market events data
    """
    return pl.DataFrame({
        'date': [],
        'name': [],
        'value': [],
        'sentiment': []
    }, schema={
        'date': pl.Date,
        'name': pl.Utf8,
        'value': pl.Float64,
        'sentiment': pl.Int32
    })


if __name__ == "__main__":
    # Example usage
    data_dir = Path("../../data")
    data_dir.mkdir(exist_ok=True)
    
    # Download AAPL data
    stock_data = download_stock_data("AAPL")
    save_stock_data(stock_data, str(data_dir / "stock_data.parquet"))
    
    # Download dividends and splits
    dividends, splits = download_dividends_and_splits("AAPL")
    save_stock_data(dividends, str(data_dir / "dividends.parquet"))
    save_stock_data(splits, str(data_dir / "splits.parquet"))
    
    # Create empty events file
    events = create_events_dataframe()
    save_stock_data(events, str(data_dir / "events.parquet"))