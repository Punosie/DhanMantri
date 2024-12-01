import time
from fetcher import fetch_ohlcv
from db import insert_records
from config import symbols

if __name__ == "__main__":
    for symbol in symbols:
        print(f"Fetching data for {symbol}")
        ohlcv_data = fetch_ohlcv(symbol)
        if ohlcv_data is not None:
            print(ohlcv_data)
            insert_records(symbol, ohlcv_data)
        time.sleep(1)
