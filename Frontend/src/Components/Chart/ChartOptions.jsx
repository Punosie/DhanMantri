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

  export const calculateMA50 = (data) => {
    const ma50 = [];
    
    // Start from the 50th data point (index 49)
    for (let i = 49; i < data.length; i++) {
      const sliceData = data.slice(i - 49, i + 1);
      // Calculate the sum of the Close prices for the last 50 data points
      const sum = sliceData.reduce((acc, item) => acc + item.Close, 0);
      const avg = sum / 50;
      // Push the Date and MA50 value into the result array
      ma50.push({ Date: data[i].Date, MA50: avg });
    }
  
    return ma50;
  };
  


  // Chart options generator
  export const generateChartOptions = (chartType, formattedDates, close, stockData) => {

    const ma50Data = calculateMA50(stockData);

    const ma50Adjusted = new Array(49).fill(null).concat(ma50Data.map(item => item.MA50));

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
        
          // Add MA50 value to the tooltip if available
          const ma50Value = ma50Adjusted[params[0].dataIndex];
          if (ma50Value !== null) {
            tooltipContent += `<br/>MA50: ${ma50Value.toFixed(2)}`;  // Format MA50 value
          }
        
          return tooltipContent;
        },
        
      },
      legend: {
      data: ['MA50'],
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