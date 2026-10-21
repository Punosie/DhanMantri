import logging
import time
from datetime import timedelta

import yfinance as yf

logger = logging.getLogger("dhanmantri.fetcher")


def fetch_ohlcv(symbol, start):
    """Daily OHLCV candles for a symbol from `start` (inclusive) up to today."""
    started = time.perf_counter()
    try:
        # `end` is exclusive in yfinance, so omit it to include today's candle
        data = yf.Ticker(symbol).history(start=start, interval="1d")
    except Exception:
        logger.exception("Error fetching data for %s", symbol)
        return None
    elapsed = (time.perf_counter() - started) * 1000

    if data.empty:
        logger.info("No new data for %s since %s (%.0fms)", symbol, start, elapsed)
        return None

    logger.info("Fetched %d rows for %s (%.0fms)", len(data), symbol, elapsed)
    return data


def next_start(last_date, default):
    """Start date for an incremental fetch: the day after the newest stored candle."""
    if last_date is None:
        return default
    return (last_date + timedelta(days=1)).strftime("%Y-%m-%d")
