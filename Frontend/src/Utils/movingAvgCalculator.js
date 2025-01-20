const calculateMA = (data, period) => {
    const movingAvg = [];
    
    // Start from the 50th data point (index 49)
    for (let i = period-1; i < data.length; i++) {
      const sliceData = data.slice(i - (period-1), i + 1);
      // Calculate the sum of the Close prices for the last 50 data points
      const sum = sliceData.reduce((acc, item) => acc + item.Close, 0);
      const avg = sum / period;
      // Push the Date and MA50 value into the result array
      movingAvg.push({ Date: data[i].Date, [`MA${period}`]: avg });
    }
  
    return movingAvg;
  };


export default calculateMA;