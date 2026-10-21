// Keep in sync with DataFetcher/src/config.py
const symbols = [
  "ADANIGREEN.NS", "ADANIPORTS.NS", "ASIANPAINT.NS", "AXISBANK.NS",
  "BAJAJ-AUTO.NS", "BAJFINANCE.NS", "BHARTIARTL.NS", "BPCL.NS",
  "CIPLA.NS", "COALINDIA.NS", "DIVISLAB.NS", "DRREDDY.NS", "EICHERMOT.NS",
  "GAIL.NS", "GRASIM.NS", "HCLTECH.NS", "HDFCBANK.NS", "HDFCLIFE.NS",
  "HINDUNILVR.NS", "ICICIBANK.NS", "INDUSINDBK.NS", "INFY.NS", "IOC.NS",
  "ITC.NS", "JSWSTEEL.NS", "KOTAKBANK.NS", "LT.NS", "M&M.NS", "MARICO.NS",
  "MARUTI.NS", "NTPC.NS", "ONGC.NS", "PIDILITIND.NS", "POWERGRID.NS",
  "RECLTD.NS", "RELIANCE.NS", "SAIL.NS", "SBILIFE.NS", "SBIN.NS",
  "SHREECEM.NS", "SUNPHARMA.NS", "TATACONSUM.NS", "TATAPOWER.NS", "TCS.NS",
  "TECHM.NS", "TITAN.NS", "TMPV.NS", "ULTRACEMCO.NS", "UNITDSPR.NS",
  "UPL.NS", "WIPRO.NS",
  "^NSEI", "AAPL", "GOOG", "MSFT",
];

export const symbolLabel = (symbol) => (symbol === "^NSEI" ? "NIFTY 50" : symbol.replace(".NS", ""));

export const stockOptions = symbols.map((value) => ({ value, label: symbolLabel(value) }));

export default symbols;
