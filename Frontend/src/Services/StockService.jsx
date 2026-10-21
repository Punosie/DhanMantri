import { createHttpClient } from "../lib/http";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "https://dhanmantri-backend.onrender.com");

const api = createHttpClient("api", { baseURL: API_URL });

// How far back each time range button reaches
const RANGES = {
  "1m": { months: 1 },
  "3m": { months: 3 },
  "6m": { months: 6 },
  "1y": { years: 1 },
  "3yr": { years: 3 },
  "5yr": { years: 5 },
};

const toISODate = (date) => date.toISOString().split("T")[0];

export const rangeStart = (timeRange) => {
  const range = RANGES[timeRange];
  if (!range) return "2000-01-01"; // All time
  const date = new Date();
  if (range.months) date.setMonth(date.getMonth() - range.months);
  if (range.years) date.setFullYear(date.getFullYear() - range.years);
  return toISODate(date);
};

/** Daily candles for a symbol; explicit dates take precedence over the time range. */
const fetchStockData = async (symbol, timeRange, startDateInput, endDateInput, signal) => {
  const { data } = await api.get("/api/stocks/fetch", {
    params: {
      symbol,
      startDate: startDateInput || rangeStart(timeRange),
      endDate: endDateInput || toISODate(new Date()),
    },
    signal,
  });
  return data;
};

export default fetchStockData;
