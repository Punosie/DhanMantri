import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import TimeRangeSelector from "../TimeRangeSelector";
import fetchStockData from "../../Services/StockService";
import { FaChartLine } from "react-icons/fa";
import { LuChartCandlestick } from "react-icons/lu";
import { Button } from "../ui/button";
import { Box, VStack, Heading, HStack } from "@chakra-ui/react";
import DateRangeSelector from "../DateRangeSelector";
import { toaster } from "../ui/toaster";
import generateChartOptions from "./ChartOptions";

const Chart = ({ symbol }) => {
  // Local Storage - Load previous settings or defaults
  const storedChartType = JSON.parse(localStorage.getItem("chartType")) || "line";
  const storedTimeRange = JSON.parse(localStorage.getItem("timeRange")) || "1m";
  const storedDateRange = JSON.parse(localStorage.getItem("dateRange")) || { startDate: null, endDate: null };

  // State
  const [stockData, setStockData] = useState([]);
  const [chartType, setChartType] = useState(storedChartType);
  const [timeRange, setTimeRange] = useState(storedTimeRange);
  const [dateRange, setDateRange] = useState(storedDateRange);

  // Fetch Stock Data
  const fetchData = async () => {
    try {
      const data = await fetchStockData(symbol, timeRange, dateRange.startDate, dateRange.endDate);
      if (data.length === 0) {
        toaster.create({
          title: "No Data Found",
          description: `No data found for ${symbol.replace(".NS", "")}`,
          type: "error",
        });

        localStorage.clear();
        console.error("No data found for the selected symbol");
        return;
      }
      setStockData(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  // Save settings to Local Storage
  useEffect(() => {
    localStorage.setItem("chartType", JSON.stringify(chartType));
    localStorage.setItem("timeRange", JSON.stringify(timeRange));
    localStorage.setItem("dateRange", JSON.stringify(dateRange));
  }, [chartType, timeRange, dateRange]);

  // Fetch data when symbol, time range, or date range changes
  useEffect(() => {
    fetchData();
  }, [symbol, timeRange, dateRange]);

  // Format stock data for the chart
  const formatData = (data) => {
    const dates = data.map(item => new Date(item.Date).toLocaleDateString());
    const close = data.map(item => item.Close);
    const open = data.map(item => item.Open);
    return { formattedDates: dates, close, open };
  };

  const { formattedDates, close } = formatData(stockData);

  // Generate chart options
  const chartOptions = generateChartOptions(chartType, formattedDates, close, stockData);

  // Handlers
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    setDateRange({ startDate: null, endDate: null });
  };

  const handleDateRangeApply = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    setTimeRange(null); // Clear time range when date range is applied
  };

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === "line" ? "candlestick" : "line"));
  };

  return (
    <VStack gap="6" w="100%" h="85vh" p="6" bg="transparent" color="white" borderRadius="md">
      <Heading size="lg">{symbol.replace(".NS", "")}</Heading>
      <Box w="100%" h="80vh" align="center">
        <HStack justify="center" align="start" w="100%">
          <VStack gap="4" align="center" w="100%">
            <HStack gap="4" align="center">
              <TimeRangeSelector onTimeRangeChange={handleTimeRangeChange} />
              <Button onClick={toggleChartType} colorPalette="red" variant="outline" p="5">
                {chartType === "line" ? <LuChartCandlestick /> : <FaChartLine />}
              </Button>
            </HStack>
            <ReactECharts option={chartOptions} style={{ height: "70vh", width: "100%" }} />
          </VStack>
          <VStack gap="4" align="start" mt="16">
            <DateRangeSelector onApply={handleDateRangeApply} />
          </VStack>
        </HStack>
      </Box>
    </VStack>
  );
};

export default Chart;
