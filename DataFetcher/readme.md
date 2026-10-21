# 📊 Stock Data Fetcher and Database Inserter 🚀

Fetches daily OHLCV candles for NIFTY 50 constituents, the NIFTY 50 index (`^NSEI`) and a few US stocks from Yahoo Finance, and upserts them into MongoDB for the [backend](../Backend).

## Project Structure

- **config.py**: settings from `.env` and the list of symbols (keep it in sync with `Frontend/src/Utils/stocks.js`)
- **db.py**: MongoDB access: latest stored date per symbol, idempotent bulk upserts on `(Symbol, Date)`, and command logging
- **fetcher.py**: Yahoo Finance download with timing logs
- **main.py**: the incremental fetch loop

## Prerequisites

1. Python 3.14
2. A MongoDB instance (MongoDB Atlas, or local `docker run -d -p 27017:27017 mongo:8`)

## 🔧 Setup Instructions

```bash
# Create a Python 3.14 virtual environment and install dependencies
uv venv --python 3.14
uv pip install -r requirements.txt
# or: py -3.14 -m venv .venv && .venv\Scripts\pip install -r requirements.txt

cp .env.example .env   # set MONGO_URL

cd src
../.venv/Scripts/python main.py     # macOS/Linux: ../.venv/bin/python main.py
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `MONGO_URL` | required | MongoDB connection string |
| `MONGO_DB` / `MONGO_COLLECTION` | `stockdata` / `STOCKS` | Where candles are stored |
| `FETCH_START` | `2015-01-01` | Backfill start for symbols with no data yet |
| `LOG_LEVEL` | `INFO` | `DEBUG` also logs every Yahoo Finance HTTP request and MongoDB command |

## How it works

- For each symbol it looks up the newest stored candle and fetches only from the following day, so the first run backfills and later runs are incremental.
- Rows are upserted on `(Symbol, Date)`, so running it twice never creates duplicates.
- Symbols with no new data (weekends, holidays, delisted tickers) are logged and skipped.
- The `Fetch stock data` GitHub Action runs it on weekdays after market close. It needs the `MONGO_URL` repository secret.

To wipe the collection, call `clear_database()` from `db.py`.
