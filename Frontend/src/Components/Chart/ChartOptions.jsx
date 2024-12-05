// utils/chartOptions.js

// Function to calculate Y-Axis range dynamically
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

// Chart options generator
export const generateChartOptions = (chartType, formattedDates, close, stockData) => {
  const yAxisRange = calculateYAxisRange(close);

  return {
    xAxis: {
      type: "category",
      data: formattedDates,
      axisLine: { show: true },
      axisTick: { show: true },
      axisLabel: { show: false },
    },
    yAxis: [
      {
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
      {
        type: "value",
        name: "Volume",
        position: "right",
        axisLine: { show: true },
        axisTick: { show: true },
        splitLine: { show: false },
        axisLabel: { show: false }, // Hide the volume axis labels if needed
      },
    ],

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
        const [id, open, close, low, high] = params[0].data;
        return `${date}<br/>Open: ${open}<br/>Close: ${close}<br/>High: ${high}<br/>Low: ${low}`;
      },
    },
  };
};

export default generateChartOptions;