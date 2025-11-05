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

**Legacy Jupyter Pipeline** (`stonks/src/`):
Execute notebooks in sequence:
1. `pull_data.ipynb` - Fetch market data using yfinance
2. `pull_events.ipynb` - Collect market events
3. `pull_dividends_splits.ipynb` - Get dividend/split data  
4. `prepare_dataset.ipynb` - Feature engineering with technical indicators
5. `train_model.ipynb` - Train ML models (XGBoost, etc.)
6. `analyze_model.ipynb` - Model evaluation and analysis

**New Polars Pipeline** (`stonks/src/polars/`) - **Recommended**:
```bash
cd stonks/src/polars
python main.py                    # Run full pipeline with defaults
python main.py --symbol TSLA      # Different stock symbol
python main.py --years 10 --tune  # 10 years data + hyperparameter tuning
python main.py --analyze-only     # Analyze existing results
```

**Code Formatting:**
- Uses autopep8 with max line length 120 characters
- Run: `python -m autopep8 --in-place --max-line-length=120 <file>`

### UI Development
- Next.js 15 with React 19
- Uses npm package manager (with --legacy-peer-deps for dependencies)
- TypeScript with shadcn/ui components
- Tailwind CSS for styling
- PostgreSQL database integration for user asset management

**Setup Commands:**
```bash
cd ui
npm install --legacy-peer-deps
npm run dev     # Development server
npm run build   # Production build
npm run lint    # ESLint
```

**Database Setup:**
```bash
# 1. Setup PostgreSQL database
createdb pystockbot

# 2. Configure environment variables
cp .env.example .env
# Edit DATABASE_URL in .env file

# 3. Run database migrations
npx tsx scripts/migrate.ts
```

## Architecture

### Data Flow

**Legacy Jupyter Pipeline:**
1. **Data Ingestion**: `pull_data.ipynb` fetches OHLCV data from Yahoo Finance
2. **Feature Engineering**: `prepare_dataset.ipynb` creates 200+ technical indicators:
   - Moving averages (SMA, EMA)
   - Bollinger Bands, RSI, MACD, ADX
   - Fibonacci retracements, Hurst exponent
   - Lag features, event integration
3. **Model Training**: XGBoost and other ML models predict price movements
4. **Visualization**: Next.js dashboard displays predictions and indicators

**New Polars Pipeline (Recommended):**
1. **Data Ingestion**: `data_ingestion.py` - High-performance data download and processing
2. **Technical Indicators**: `technical_indicators.py` - 20+ indicators with Polars optimization
3. **Feature Engineering**: `feature_engineering.py` - Advanced features with 10-100x speed improvement
4. **Model Training**: `model_training.py` - Automated model selection and hyperparameter tuning
5. **Pipeline Orchestration**: `main.py` - Complete automated workflow with logging and monitoring

### Key Components

**Legacy Python ML Pipeline (`stonks/src/`):**
- Technical indicator functions in `prepare_dataset.ipynb`
- Event-based feature engineering with decay factors
- Multi-timeframe analysis (7, 14, 30 day windows)
- Classification and regression model training

**New Polars Pipeline (`stonks/src/polars/`) - Production Ready:**
- Modular architecture with clean separation of concerns
- High-performance data processing with Polars (10-100x faster)
- Comprehensive technical indicator library
- Advanced feature engineering with lag features and interactions
- Automated model selection and hyperparameter tuning
- Production logging and monitoring
- Configuration management for different environments

**UI Dashboard (`ui/`):**
- Multiple dashboard views: Market Indicators, ML Predictions, Social Sentiment
- Real-time chart components using Recharts
- Responsive design with Radix UI components
- Custom design system with financial typography (Source Sans Pro, Playfair Display)
- Dark/light theme support with custom CSS variables

### Data Storage

**ML Pipeline Data:**
- Raw data: `stonks/data/stock_data.parquet`
- Events: `stonks/data/events.parquet`
- Processed features: `stonks/data/dataset.parquet`

**User Data (PostgreSQL):**
- `user_assets` - Individual user's tracked stocks/crypto
- `watchlists` - User-created asset collections
- `watchlist_assets` - Assets within specific watchlists

## Development Guidelines

### Code Optimization Principles
**CRITICAL**: Always prioritize code optimization and efficiency when writing or modifying code:

**Line Minimization:**
- Use list comprehensions instead of explicit for loops: `[f(x) for x in items]`
- Leverage dictionary comprehensions: `{k: v for k, v in items}`
- Combine operations using method chaining when possible
- Use functional programming patterns with `map`, `filter`, `reduce`
- Prefer vectorized operations over iterative approaches

**Conditional Minimization:**
- Replace if/else chains with dictionary-driven lookups: `actions[key]()`
- Use ternary operators for simple conditions: `value if condition else default`
- Leverage boolean algebra to eliminate nested conditionals
- Use `all()` and `any()` for multiple condition checks
- Replace switch-like patterns with configuration dictionaries

**Exception Handling Optimization:**
- Use EAFP (Easier to Ask for Forgiveness than Permission) pattern
- Combine multiple exception types: `except (ValueError, TypeError) as e:`
- Use context managers (`with` statements) for resource management
- Prefer early returns to reduce nesting depth
- Use exception chaining with `raise ... from e` for debugging
- Implement centralized error handling where possible

**Examples:**
```python
# BAD - Explicit loops and conditionals
results = []
for item in data:
    if item.status == 'active':
        if item.value > threshold:
            results.append(process_item(item))

# GOOD - Optimized functional approach  
results = [process_item(item) for item in data 
          if item.status == 'active' and item.value > threshold]

# BAD - Multiple if/else statements
if action == 'buy':
    execute_buy()
elif action == 'sell':
    execute_sell()
elif action == 'hold':
    execute_hold()

# GOOD - Dictionary-driven approach
actions = {'buy': execute_buy, 'sell': execute_sell, 'hold': execute_hold}
actions.get(action, lambda: None)()
```

### Jupyter Notebooks
- Keep cells organized and well-commented
- Use data validation between processing steps
- Save intermediate results to parquet files
- Clean notebook outputs using `cleannb.py` script
- Apply optimization principles to all notebook code

### UI Development
- Follow existing component patterns in `ui/components/dashboards/`
- Use TypeScript interfaces for data structures
- Implement responsive design with Tailwind classes
- Keep dashboard components modular and reusable
- Use CSS custom properties defined in `ui/app/globals.css` for theming
- Follow professional financial UI patterns with clean, data-focused layouts
- Apply functional programming patterns to React components

### Database Development
- Use native PostgreSQL queries (not an ORM)
- Database functions are in `ui/lib/db.ts`
- API endpoints follow REST conventions in `ui/app/api/`
- Use React hooks (`use-user-assets.ts`, `use-watchlists.ts`) for data management
- Implement efficient error handling with proper exception chaining
- Always validate user input and sanitize database queries
- Use connection pooling and optimized query patterns

### Data Processing
- Always validate data before processing using functional approaches
- Handle missing values with vectorized operations
- Use proper data types (float64 for prices, int for categorical)
- Implement feature decay using mathematical expressions, not loops
- Leverage Polars/pandas vectorized operations for maximum performance
- Replace explicit loops with built-in aggregation functions

### Git Commit Guidelines
- **NEVER** reference Claude, Anthropic, or AI assistance in commit messages
- Write commit messages as if authored by the developer
- Use standard conventional commit format: `type(scope): description`
- Focus on the technical changes and their purpose
- Examples:
  - `feat: optimize polars pipeline with vectorized operations`
  - `fix: resolve XGBoost dependency issues with OpenMP`
  - `refactor: replace loops with functional programming patterns`
  - `test: add comprehensive pipeline validation suite`

## Styling System

The UI uses a sophisticated design system with:
- Custom CSS variables for light/dark themes
- Financial-focused color palette (primary: #0891b2, secondary: #f97316)
- Professional typography with serif headings and sans-serif body text
- Consistent chart colors and spacing
- Responsive dashboard layouts optimized for financial data visualization