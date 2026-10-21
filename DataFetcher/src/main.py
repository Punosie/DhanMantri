import logging
import time

import yfinance as yf

from config import FETCH_START, LOG_LEVEL, symbols

logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
# db.CommandLogger already logs each command concisely
logging.getLogger("pymongo").setLevel(logging.WARNING)
yf.config.network.retries = 2
if LOG_LEVEL == "DEBUG":
    # Logs every outgoing Yahoo Finance HTTP request and response
    yf.config.debug.logging = True

from db import latest_date, upsert_records  # noqa: E402
from fetcher import fetch_ohlcv, next_start  # noqa: E402

logger = logging.getLogger("dhanmantri")


def run():
    started = time.perf_counter()
    total, failed = 0, []
    for symbol in symbols:
        start = next_start(latest_date(symbol), FETCH_START)
        ohlcv_data = fetch_ohlcv(symbol, start)
        if ohlcv_data is None:
            failed.append(symbol)
        else:
            written = upsert_records(symbol, ohlcv_data)
            total += written
            logger.info("Stored %d rows for %s", written, symbol)
        time.sleep(0.5)  # be polite to Yahoo Finance

    logger.info("Done: %d rows written for %d symbols in %.1fs",
                total, len(symbols), time.perf_counter() - started)
    if failed:
        logger.info("No new data for: %s", ", ".join(failed))


if __name__ == "__main__":
    run()
