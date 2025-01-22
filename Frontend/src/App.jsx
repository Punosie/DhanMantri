import { useState} from 'react';
import Chart from './Components/Chart/Chart';
import { Box } from "@chakra-ui/react"
import Navbar from './Components/Navbar/Navbar';
import Search from './Components/Search';
import symbols from './Utils/stocks';
import Footer from './Components/Footer';

const App = () => {
  // Retrieve selected stock symbol from localStorage
  if (!localStorage.getItem('selectedStock')) {
    localStorage.setItem('selectedStock', symbols[0]);
  }
  const savedStock = localStorage.getItem('selectedStock') || symbols[0]; // Default to first symbol if none is saved

  const [selectedSymbol, setSelectedSymbol] = useState(savedStock); // Initialize with saved symbol

  // Handler for changing selected symbol
  const handleSymbolChange = (newSymbol) => {
    setSelectedSymbol(newSymbol);
    localStorage.setItem('selectedStock', newSymbol); // Save the selected symbol to localStorage
  };

  return (
    <>
      <Navbar />
      <Box width={"1/6"} mx="auto" mt="10">
        {/* Use the Search component */}
        <Search selectedSymbol={selectedSymbol} onSymbolChange={handleSymbolChange} />
      </Box>  
      <Box >
        <Box >
          <Chart symbol={selectedSymbol} />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default App;
