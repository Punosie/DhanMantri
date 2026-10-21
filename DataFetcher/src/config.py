import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB = os.getenv("MONGO_DB", "stockdata")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "STOCKS")

# Backfill start for symbols that have no data yet
FETCH_START = os.getenv("FETCH_START", "2015-01-01")

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

# NIFTY50 constituent stock symbols (keep in sync with Frontend/src/Utils/stocks.js)
nifty50_symbols = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "HINDUNILVR.NS",
    "ICICIBANK.NS", "KOTAKBANK.NS", "BAJFINANCE.NS", "ITC.NS", "LT.NS",
    "SBIN.NS", "ASIANPAINT.NS", "M&M.NS", "MARUTI.NS",
    "TITAN.NS", "SUNPHARMA.NS", "NTPC.NS", "POWERGRID.NS", "WIPRO.NS",
    "ULTRACEMCO.NS", "DIVISLAB.NS", "HCLTECH.NS", "ONGC.NS", "DRREDDY.NS",
    "BAJAJ-AUTO.NS", "AXISBANK.NS", "HDFCLIFE.NS", "SBILIFE.NS", "ADANIGREEN.NS",
    "ADANIPORTS.NS", "BHARTIARTL.NS", "GRASIM.NS", "TMPV.NS", "EICHERMOT.NS",
    "TECHM.NS", "INDUSINDBK.NS", "UPL.NS", "SHREECEM.NS", "BPCL.NS",
    "TATACONSUM.NS", "COALINDIA.NS", "UNITDSPR.NS", "JSWSTEEL.NS",
    "TATAPOWER.NS", "SAIL.NS", "CIPLA.NS", "RECLTD.NS", "PIDILITIND.NS",
    "MARICO.NS", "IOC.NS", "GAIL.NS"
]

# NIFTY50 index symbol
nifty50_index_symbol = "^NSEI"

# Combine NIFTY50 index symbol with company symbols
symbols = ["MSFT", "AAPL", "GOOG"] + nifty50_symbols + [nifty50_index_symbol]
