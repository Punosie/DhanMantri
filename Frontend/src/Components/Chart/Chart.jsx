import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { LuChartCandlestick } from "react-icons/lu";
import { Box, Center, Stack, VStack, HStack } from "@chakra-ui/react";
import TimeRangeSelector from "../TimeRangeSelector";
import fetchStockData from "../../Services/StockService";
import { Button } from "../ui/button";
import DateRangeSelector from "../DateRangeSelector";
import { toaster } from "../ui/toaster";
import generateChartOptions from "./ChartOptions";
import Loading from "../Loading";
import News from "../News/News";
import { symbolLabel } from "../../Utils/stocks";

// ECharts is the heaviest dependency, so it loads in its own chunk. Start downloading it
// right away so it arrives in parallel with the first data request instead of after it.
const echartModule = import("./EChart");
const EChart = lazy(() => echartModule);

const CHART_HEIGHT = { base: "420px", md: "600px", xl: "720px" };

const readStored = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const Chart = ({ symbol }) => {
  // Local Storage - Load previous settings or defaults
  const [chartType, setChartType] = useState(() => readStored("chartType", "line"));
  const [timeRange, setTimeRange] = useState(() => readStored("timeRange", "1m"));
  const [dateRange, setDateRange] = useState(() => readStored("dateRange", { startDate: null, endDate: null }));
  const [result, setResult] = useState({ key: null, data: [] });

  const requestKey = [symbol, timeRange, dateRange.startDate, dateRange.endDate].join("|");
  const isLoading = result.key !== requestKey;
  const stockData = result.data;

  // Save settings to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem("chartType", JSON.stringify(chartType));
      localStorage.setItem("timeRange", JSON.stringify(timeRange));
      localStorage.setItem("dateRange", JSON.stringify(dateRange));
    } catch {
      // storage unavailable
    }
  }, [chartType, timeRange, dateRange]);

  // Fetch data when symbol, time range, or date range changes; abort stale requests
  useEffect(() => {
    const controller = new AbortController();
    fetchStockData(symbol, timeRange, dateRange.startDate, dateRange.endDate, controller.signal)
      .then((data) => {
        if (data.length === 0) {
          toaster.create({
            title: "No Data Found",
            description: `No data found for ${symbolLabel(symbol)} in this range`,
            type: "warning",
          });
        }
        setResult({ key: requestKey, data });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        toaster.create({
          title: "Could not load data",
          description: error.response?.data?.message || "The stock server is not responding. Please try again.",
          type: "error",
        });
        setResult({ key: requestKey, data: [] });
      });
    return () => controller.abort();
  }, [requestKey, symbol, timeRange, dateRange.startDate, dateRange.endDate]);

  // Generate chart options
  const chartOptions = useMemo(() => generateChartOptions(chartType, stockData), [chartType, stockData]);

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

  const spinner = (
    <Center h="100%">
      <Loading />
    </Center>
  );

  return (
    <VStack gap="6" w="100%" p="6" bg="transparent" color="white" borderRadius="md">
      <Stack direction={{ base: "column", xl: "row" }} justify="center" align={{ base: "center", xl: "start" }} w="100%" gap="6">
        <VStack gap="4" align="center" w={{ base: "100%", xl: "70vw" }}>
          <HStack gap="4" align="center" wrap="wrap" justify="center">
            <TimeRangeSelector active={timeRange} onTimeRangeChange={handleTimeRangeChange} />
            <Button
              onClick={toggleChartType}
              colorPalette="red"
              variant="outline"
              p="5"
              aria-label={chartType === "line" ? "Show candlestick chart" : "Show line chart"}
            >
              {chartType === "line" ? <LuChartCandlestick /> : <FaChartLine />}
            </Button>
          </HStack>
          <Box w="100%" h={CHART_HEIGHT} position="relative" data-testid="chart">
            {isLoading && stockData.length === 0 ? (
              spinner
            ) : (
              <Suspense fallback={spinner}>
                <Box h="100%" opacity={isLoading ? 0.5 : 1} transition="opacity 0.2s">
                  <EChart option={chartOptions} style={{ height: "100%", width: "100%" }} />
                </Box>
              </Suspense>
            )}
          </Box>
        </VStack>
        <VStack gap="4" align="start" mt={{ base: 0, xl: "16" }} bg="transparent">
          <DateRangeSelector onApply={handleDateRangeApply} />
          <News />
        </VStack>
      </Stack>
    </VStack>
  );
};

export default Chart;
