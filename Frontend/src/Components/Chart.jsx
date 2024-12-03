import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import TimeRangeSelector from "./TimeRangeSelector";
import fetchStockData from "../Services/StockService";
import { FaChartLine } from "react-icons/fa";
import { LuCandlestickChart } from "react-icons/lu";
import { Button } from "./ui/button";
import { Box, Flex, Heading, HStack, VStack } from "@chakra-ui/react";
import DateRangeSelector from "./DateRangeSelector";

const Chart = ({ symbol }) => {
  const [stockData, setStockData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("1m");
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  // Fetch Data
  const fetchData = async () => {
    try {
      const data = await fetchStockData(
        symbol,
        timeRange,
        dateRange.startDate,
        dateRange.endDate
      );
      setStockData(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol, timeRange, dateRange]);

  // Format Data
  const formatData = (data) => {
    const dates = data.map((item) => item.Date);
    const close = data.map((item) => item.Close);
    const open = data.map((item) => item.Open);

    const formattedDates = dates.map((date) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    });

    return { formattedDates, close, open };
  };

  const { formattedDates, close } = formatData(stockData);

  // Calculate y-axis range dynamically
  const calculateYAxisRange = (data) => {
    if (data.length === 0) return { min: 0, max: 10, interval: 1 };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    const padding = range * 0.1; // Add 10% padding
    const adjustedMin = Math.floor(min - padding);
    const adjustedMax = Math.ceil(max + padding);

    const interval = range / 5; // Divide the range into 5 intervals
    return {
      min: adjustedMin,
      max: adjustedMax,
      interval: Math.ceil(interval),
    };
  };

  const yAxisRange = calculateYAxisRange(close);

  // Chart Options
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
    grid: {
      left: "10%",
      right: "10%",
      top: "10%",
      bottom: "15%",
    },
    series: [
      chartType === "line"
        ? {
            data: close,
            type: "line",
            smooth: false,
          }
        : {
            type: "candlestick",
            data: stockData.map((item) => [
              item.Open,
              item.Close,
              item.Low,
              item.High,
            ]),
          },
    ],
    backgroundColor: "#333",
    color: ["#00FF00", "#FF0000"],
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const date = params[0].name;
        if (chartType === "line") {
          const value = params[0].data;
          return `${date}<br/>Close: ${value}`;
        }
        const ohlc = params[0].data;
        return `${date}<br/>Open: ${ohlc[1]}<br/>Close: ${ohlc[2]}<br/>High: ${ohlc[3]}<br/>Low: ${ohlc[4]}`;
      },
    },
  };

  // TimeRange Change Handler
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    setDateRange({ startDate: null, endDate: null }); // Clear date range when switching time range
  };

  // Date Range Apply Handler
  const handleDateRangeApply = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    setTimeRange(null); // Clear time range when using date range
  };

  // Chart Type Toggle Handler
  const toggleChartType = () => {
    setChartType((prevType) =>
      prevType === "line" ? "candlestick" : "line"
    );
  };

  return (
    <VStack gap="6" w="100%" h="85vh" p="6" bg="transparent" color="white" borderRadius="md" >
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
