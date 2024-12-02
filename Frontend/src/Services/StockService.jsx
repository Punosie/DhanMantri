import axios from "axios";

const fetchStockData = async (symbol, timeRange, startDateInput, endDateInput) => {
  let startDate = startDateInput;
  let endDate = endDateInput || new Date().toISOString().split('T')[0]; // Default to current date if no endDateInput

  // If explicit dates are not provided, use timeRange to calculate dates
  if (!startDateInput) {
    switch (timeRange) {
      case '1m': // 1 month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        startDate = oneMonthAgo.toISOString().split('T')[0];
        break;
      case '3m': // 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        startDate = threeMonthsAgo.toISOString().split('T')[0];
        break;
      case '6m': // 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        startDate = sixMonthsAgo.toISOString().split('T')[0];
        break;
      case '1y': // 1 year
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        startDate = oneYearAgo.toISOString().split('T')[0];
        break;
      case '3yr': // 3 years
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
        startDate = threeYearsAgo.toISOString().split('T')[0];
        break;
      case '5yr': // 5 years
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        startDate = fiveYearsAgo.toISOString().split('T')[0];
        break;
      default: // All time
        startDate = '2000-01-01'; // Default to "all time" data
    }
  }

  try {
    const response = await axios.get(
      `http://localhost:5000/api/stocks/fetch?symbol=${symbol}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return 'Error fetching stock data';
  }
};

export default fetchStockData;
