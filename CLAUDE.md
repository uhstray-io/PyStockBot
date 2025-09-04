# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PyStockBot is a machine learning-based stock prediction system with two main components:
- **Python ML Pipeline** (`stonks/` and `crypto/`): Data collection, feature engineering, and model training using Jupyter notebooks
- **Next.js UI** (`ui/`): React dashboard for visualizing ML predictions and market indicators

## Development Environment

### Python Environment
- Uses `uv` package manager (not pip/conda)
- Python 3.13+ required
- Dependencies defined in `pyproject.toml`

**Setup Commands:**
```bash
pip install -U uv
uv sync
```

**Running ML Pipeline:**
Execute notebooks in sequence:
1. `pull_data.ipynb` - Fetch market data using yfinance
2. `pull_events.ipynb` - Collect market events
3. `pull_dividends_splits.ipynb` - Get dividend/split data  
4. `prepare_dataset.ipynb` - Feature engineering with technical indicators
5. `train_model.ipynb` - Train ML models (XGBoost, etc.)
6. `analyze_model.ipynb` - Model evaluation and analysis

**Code Formatting:**
- Uses autopep8 with max line length 120 characters
- Run: `python -m autopep8 --in-place --max-line-length=120 <file>`

### UI Development
- Next.js 15 with React 19
- Uses pnpm package manager
- TypeScript with shadcn/ui components
- Tailwind CSS for styling

**Setup Commands:**
```bash
cd ui
pnpm install
pnpm dev     # Development server
pnpm build   # Production build
pnpm lint    # ESLint
```

## Architecture

### Data Flow
1. **Data Ingestion**: `pull_data.ipynb` fetches OHLCV data from Yahoo Finance
2. **Feature Engineering**: `prepare_dataset.ipynb` creates 200+ technical indicators:
   - Moving averages (SMA, EMA)
   - Bollinger Bands, RSI, MACD, ADX
   - Fibonacci retracements, Hurst exponent
   - Lag features, event integration
3. **Model Training**: XGBoost and other ML models predict price movements
4. **Visualization**: Next.js dashboard displays predictions and indicators

### Key Components

**Python ML Pipeline (`stonks/src/`):**
- Technical indicator functions in `prepare_dataset.ipynb`
- Event-based feature engineering with decay factors
- Multi-timeframe analysis (7, 14, 30 day windows)
- Classification and regression model training

**UI Dashboard (`ui/`):**
- Multiple dashboard views: Market Indicators, ML Predictions, Social Sentiment
- Real-time chart components using Recharts
- Responsive design with Radix UI components
- Custom design system with financial typography (Source Sans Pro, Playfair Display)
- Dark/light theme support with custom CSS variables

### Data Storage
- Raw data: `stonks/data/stock_data.parquet`
- Events: `stonks/data/events.parquet`
- Processed features: `stonks/data/dataset.parquet`

## Development Guidelines

### Jupyter Notebooks
- Keep cells organized and well-commented
- Use data validation between processing steps
- Save intermediate results to parquet files
- Clean notebook outputs using `cleannb.py` script

### UI Development
- Follow existing component patterns in `ui/components/dashboards/`
- Use TypeScript interfaces for data structures
- Implement responsive design with Tailwind classes
- Keep dashboard components modular and reusable
- Use CSS custom properties defined in `ui/app/globals.css` for theming
- Follow professional financial UI patterns with clean, data-focused layouts

### Data Processing
- Always validate data before processing
- Handle missing values appropriately
- Use proper data types (float64 for prices, int for categorical)
- Implement feature decay for time-sensitive events

## Styling System

The UI uses a sophisticated design system with:
- Custom CSS variables for light/dark themes
- Financial-focused color palette (primary: #0891b2, secondary: #f97316)
- Professional typography with serif headings and sans-serif body text
- Consistent chart colors and spacing
- Responsive dashboard layouts optimized for financial data visualization