import { useEffect, useState } from 'react';
import Chart from './Components/Chart/Chart';
import { Box } from "@chakra-ui/react"
import Navbar from './Components/Navbar/Navbar';
import Search from './Components/Search';
import symbols, { symbolLabel } from './Utils/stocks';
import Footer from './Components/Footer';

// Retrieve selected stock symbol from localStorage, ignoring symbols no longer listed
const savedSymbol = () => {
  try {
    const saved = localStorage.getItem('selectedStock');
    return symbols.includes(saved) ? saved : symbols[0];
  } catch {
    return symbols[0];
  }
};

const App = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(savedSymbol);

  // Handler for changing selected symbol
  const handleSymbolChange = (newSymbol) => {
    setSelectedSymbol(newSymbol);
    try {
      localStorage.setItem('selectedStock', newSymbol);
    } catch {
      // storage unavailable
    }
  };

  // Per-stock title for browser tabs, history and shared links
  useEffect(() => {
    document.title = `${symbolLabel(selectedSymbol)} Stock Chart & Moving Averages | DhanMantri`;
  }, [selectedSymbol]);

  return (
    <>
      <Navbar />
      <Box as="main">
        <Box width={{ base: "90%", md: "320px" }} mx="auto" mt="10">
          <Search selectedSymbol={selectedSymbol} onSymbolChange={handleSymbolChange} />
        </Box>
        <Chart symbol={selectedSymbol} />
      </Box>
      <Footer />
    </>
  );
};

export default App;
