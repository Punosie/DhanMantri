import React, { useState, useEffect } from 'react';
import Chart from './Components/Chart/Chart';
import './App.css';
import { Spinner } from "@chakra-ui/react"


const App = () => {
  // List of stock symbols including NIFTY50 stocks
  const nifty50Symbols = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "HINDUNILVR.NS", 
    "ICICIBANK.NS", "KOTAKBANK.NS", "BAJFINANCE.NS", "ITC.NS", "LT.NS", 
    "HDFC.NS", "SBIN.NS", "ASIANPAINT.NS", "M&M.NS", "MARUTI.NS", 
    "TITAN.NS", "SUNPHARMA.NS", "NTPC.NS", "POWERGRID.NS", "WIPRO.NS", 
    "ULTRACEMCO.NS", "DIVISLAB.NS", "HCLTECH.NS", "ONGC.NS", "DRREDDY.NS", 
    "BAJAJ-AUTO.NS", "AXISBANK.NS", "HDFCLIFE.NS", "SBILIFE.NS", "ADANIGREEN.NS", 
    "ADANIPORTS.NS", "BHARTIARTL.NS", "GRASIM.NS", "TATAMOTORS.NS", "EICHERMOT.NS", 
    "TECHM.NS", "INDUSINDBK.NS", "UPL.NS", "SHREECEM.NS", "BPCL.NS", 
    "TATACONSUM.NS", "COALINDIA.NS", "MCDOWELL-N.NS", "JSWSTEEL.NS", 
    "TATAPOWER.NS", "SAIL.NS", "CIPLA.NS", "RECLTD.NS", "PIDILITIND.NS",  
    "MARICO.NS", "IOC.NS", "GAIL.NS"
  ];

  const stockSymbols = ["MSFT", "AAPL", "GOOG"];  // Add more stock symbols if needed

  // Combine both lists
  const symbols = stockSymbols.concat(nifty50Symbols);

  // State for selected symbol and loading state
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve saved symbol from localStorage on initial render
  useEffect(() => {
    const savedSymbol = localStorage.getItem('selectedSymbol');
    if (savedSymbol) {
      setSelectedSymbol(savedSymbol);
    } else {
      setSelectedSymbol(symbols[0]); // Default to first symbol if no saved value
    }
    setLoading(false); // Set loading to false once data is fetched
  }, []);

  // Handler for changing selected symbol
  const handleSymbolChange = (event) => {
    const newSymbol = event.target.value;
    setSelectedSymbol(newSymbol);
    localStorage.setItem('selectedSymbol', newSymbol); // Save the selected symbol to localStorage
  };

  if (loading) {
    return (
      <>
        <Spinner color="teal.500" size="lg" />
      </>
    ); // Show loading message while fetching saved symbol
  }

  return (
    <>
      <div className="main-container">
        <h1 className="dashboard-title">Stock Dashboard</h1>

        {/* Dropdown for selecting stock symbol */}
        <div className="ticker-selector-container">
          <label htmlFor="symbol-select" className="ticker-label">Select Ticker:</label>
          <select
            id="symbol-select"
            className="ticker-dropdown"
            value={selectedSymbol}
            onChange={handleSymbolChange}
          >
            {/* Map over the symbols and display each option */}
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {/* Remove the ".NS" part of the symbol when displaying */}
                {symbol.replace('.NS', '')}
              </option>
            ))}
          </select>
        </div>

        {/* Render Chart Component and pass the selectedSymbol */}
        <div className="chart-container">
          <Chart symbol={selectedSymbol} />
        </div>
      </div>
    </>
  );
};

export default App;
