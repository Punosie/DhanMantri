import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import TimeRangeSelector from "./TimeRangeSelector";
import fetchStockData from "../Services/StockService";
import { FaChartLine } from "react-icons/fa";
import { LuCandlestickChart } from "react-icons/lu";
import { Button } from "./ui/button";
import { Box, VStack, Heading, HStack } from "@chakra-ui/react";
import DateRangeSelector from "./DateRangeSelector";

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

  // Calculate Y-Axis range dynamically
  const calculateYAxisRange = (data) => {
    if (data.length === 0) return { min: 0, max: 10, interval: 1 };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const padding = range * 0.1;

    return {
      min: Math.floor(min - padding),
      max: Math.ceil(max + padding),
      interval: Math.ceil(range / 5),
    };
  };

  const yAxisRange = calculateYAxisRange(close);

  // Chart options configuration
  const chartOptions = {
    xAxis: {
      type: "category",
      data: formattedDates,
      axisLine: { show: true },
      axisTick: { show: true },
    },
    yAxis: {
      type: "value",
      name: "Price",
      position: "left",
      axisLine: { show: true },
      axisTick: { show: true },
      splitLine: { show: true },
      min: yAxisRange.min,
      max: yAxisRange.max,
      interval: yAxisRange.interval,
    },
    grid: { left: "10%", right: "10%", top: "10%", bottom: "15%" },
    series: [
      chartType === "line"
        ? {
            data: close,
            type: "line",
            smooth: false,
          }
        : {
            type: "candlestick",
            data: stockData.map(item => [item.Open, item.Close, item.Low, item.High]),
          },
    ],
    backgroundColor: "#333",
    color: ["#00FF00", "#FF0000"],
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const date = params[0].name;
        if (chartType === "line") {
          return `${date}<br/>Close: ${params[0].data}`;
        }
        const [open, close, low, high] = params[0].data;
        return `${date}<br/>Open: ${open}<br/>Close: ${close}<br/>High: ${high}<br/>Low: ${low}`;
      },
    },
  };

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
                {chartType === "line" ? <LuCandlestickChart /> : <FaChartLine />}
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
