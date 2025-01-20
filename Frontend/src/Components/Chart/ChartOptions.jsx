  // Function to calculate Y-Axis range dynamically
import calculateMA from "../../Utils/movingAvgCalculator";

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

    const ma50Data = calculateMA(stockData, 50);
    const ma100Data = calculateMA(stockData, 100);
    const ma200Data = calculateMA(stockData, 200);
  
    // Adjust MA50, MA100, and MA200 data to handle missing values
    const ma50Adjusted = new Array(49).fill(null).concat(ma50Data.map(item => item.MA50));
    const ma100Adjusted = new Array(99).fill(null).concat(ma100Data.map(item => item.MA100));
    const ma200Adjusted = new Array(199).fill(null).concat(ma200Data.map(item => item.MA200));
  
    const yAxisRange = calculateYAxisRange(close);
  
    return {
      xAxis: {
        type: "category",
        data: formattedDates,
        axisLine: { show: true },
        axisTick: { show: true },
        axisLabel: { show: true },
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
          axisLabel: { show: false },
        },
      ],
      grid: { left: "10%", right: "10%", top: "10%", bottom: "15%" },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
      ],
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
        {
          name: 'MA50',
          type: 'line',
          data: ma50Adjusted,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
          color: '#FFA500',
        },
        {
          name: 'MA100',
          type: 'line',
          data: ma100Adjusted,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
          color: '#FF0000',
        },
        {
          name: 'MA200',
          type: 'line',
          data: ma200Adjusted,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
          color: '#00FFFF',
        },
      ],
      backgroundColor: "#333",
      color: ["#00FF00", "#FF0000"],
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const date = params[0].name;
          let tooltipContent = `${date}<br/>`;
  
          // For line chart, show Close price
          if (chartType === "line") {
            const closePrice = params[0].data.toFixed(2); // Format Close price
            tooltipContent += `Close: ${closePrice}`;
          }
  
          // For candlestick chart, show Open, Close, High, Low
          else {
            const [id, open, close, low, high] = params[0].data;
            tooltipContent += `Open: ${open.toFixed(2)}<br/>`;  // Format Open price
            tooltipContent += `Close: ${close.toFixed(2)}<br/>`;  // Format Close price
            tooltipContent += `High: ${high.toFixed(2)}<br/>`;  // Format High price
            tooltipContent += `Low: ${low.toFixed(2)}`;  // Format Low price
          }
  
          // Add MA50, MA100, MA200 values to the tooltip if available
          const ma50Value = ma50Adjusted[params[0].dataIndex];
          if (ma50Value !== null) {
            tooltipContent += `<br/>MA50: ${ma50Value.toFixed(2)}`;  // Format MA50 value
          }
  
          const ma100Value = ma100Adjusted[params[0].dataIndex];
          if (ma100Value !== null) {
            tooltipContent += `<br/>MA100: ${ma100Value.toFixed(2)}`;  // Format MA100 value
          }
  
          const ma200Value = ma200Adjusted[params[0].dataIndex];
          if (ma200Value !== null) {
            tooltipContent += `<br/>MA200: ${ma200Value.toFixed(2)}`;  // Format MA200 value
          }
  
          return tooltipContent;
        },
      },
      legend: {
        data: ['MA50', 'MA100', 'MA200'],
        show: true,
        textStyle: {
          color: '#fff',
        },
        top: '10%',
        right: '10%',
      },
    };
  };
  
  export default generateChartOptions;
  