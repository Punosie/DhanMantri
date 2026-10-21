// Simple moving average of Close prices, aligned with `data` (null until `period` points exist).
// Uses a running sum, so it is O(n) instead of re-summing every window.
const calculateMA = (data, period) => {
  const movingAvg = new Array(data.length).fill(null);
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i].Close;
    if (i >= period) sum -= data[i - period].Close;
    if (i >= period - 1) movingAvg[i] = sum / period;
  }

  return movingAvg;
};

export default calculateMA;
