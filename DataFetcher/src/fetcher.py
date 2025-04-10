from datetime import datetime
import yfinance as yf

def fetch_ohlcv(symbol):
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        ticker = yf.Ticker(symbol)
        data = ticker.history(start=today, end=today, interval="1d")

        if data.empty:
            print(f"Warning: No data available for {symbol} today. Skipping.")
            return None

        return data
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None