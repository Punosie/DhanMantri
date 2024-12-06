const calculateMovingAverage = (data, period, type, parameter) => {
  const smaData = [];

  // Loop through the data to calculate the moving average
  for (let i = period - 1; i < data.length; i++) {
    // Slice the data array to get the previous 'period' elements
    const sliceData = data.slice(i + 1 - period, i + 1);

    // Calculate the sum of the 'parameter' values dynamically
    const sum = sliceData.reduce((acc, item) => {
      console.log("parameter", parameter); // Logs the parameter (e.g., "Close")
      console.log("item", item); // Logs the current item (data object)
      return acc + item[parameter]; // Dynamically use 'parameter' as the key
    }, 0);

    // Calculate the average
    const avg = sum / period;

    smaData.push({
      Date: data[i].Date, // Keep the date for the moving average
      sma: avg, // Store the moving average value
    });
  }

  return smaData;
};

export default calculateMovingAverage;
