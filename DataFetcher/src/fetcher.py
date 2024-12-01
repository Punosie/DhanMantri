import yfinance as yf

def fetch_ohlcv(symbol, period='max', interval='1d'):
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period=period, interval=interval)
        if data.empty:
            print(f"Warning: No data available for {symbol}. Skipping.")
            return None  # Return None if no data is available
        return data
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None  # Return None on error
