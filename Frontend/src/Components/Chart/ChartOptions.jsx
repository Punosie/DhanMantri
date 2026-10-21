import calculateMA from "../../Utils/movingAvgCalculator";

const MOVING_AVERAGES = [
  { period: 50, color: "#FFA500" },
  { period: 100, color: "#FF0000" },
  { period: 200, color: "#00FFFF" },
];

const fmt = (value) => (value == null ? "-" : value.toFixed(2));

// Chart options generator
export const generateChartOptions = (chartType, stockData) => {
  const dates = stockData.map((item) => new Date(item.Date).toLocaleDateString());
  const averages = MOVING_AVERAGES.map(({ period, color }) => ({
    name: `MA${period}`,
    color,
    values: calculateMA(stockData, period),
  }));

  return {
    animationDuration: 300,
    xAxis: {
      type: "category",
      data: dates,
      axisLine: { show: true },
      axisTick: { show: true },
      axisLabel: { show: true },
    },
    yAxis: {
      type: "value",
      name: "Price",
      position: "left",
      // Fit the axis to the visible prices with rounded bounds instead of starting at 0
      scale: true,
      splitLine: { show: true },
    },
    grid: { left: "10%", right: "10%", top: "10%", bottom: "15%" },
    dataZoom: [{ type: "inside", xAxisIndex: 0, start: 0, end: 100 }],
    series: [
      chartType === "line"
        ? {
            name: "Close",
            data: stockData.map((item) => item.Close),
            type: "line",
            showSymbol: false,
            sampling: "lttb",
          }
        : {
            name: "OHLC",
            type: "candlestick",
            large: true,
            data: stockData.map((item) => [item.Open, item.Close, item.Low, item.High]),
          },
      ...averages.map(({ name, color, values }) => ({
        name,
        type: "line",
        data: values,
        smooth: true,
        showSymbol: false,
        lineStyle: { opacity: 0.5 },
        color,
      })),
    ],
    backgroundColor: "#333",
    color: ["#00FF00", "#FF0000"],
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const index = params[0].dataIndex;
        const candle = stockData[index];
        let tooltipContent = `${dates[index]}<br/>`;

        if (chartType === "line") {
          tooltipContent += `Close: ${fmt(candle.Close)}`;
        } else {
          tooltipContent += `Open: ${fmt(candle.Open)}<br/>Close: ${fmt(candle.Close)}<br/>`;
          tooltipContent += `High: ${fmt(candle.High)}<br/>Low: ${fmt(candle.Low)}`;
        }

        for (const { name, values } of averages) {
          if (values[index] !== null) tooltipContent += `<br/>${name}: ${fmt(values[index])}`;
        }
        return tooltipContent;
      },
    },
    legend: {
      data: averages.map(({ name }) => name),
      show: true,
      textStyle: { color: "#fff" },
      top: "10%",
      right: "10%",
    },
  };
};

export default generateChartOptions;
