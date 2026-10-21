const { stocks } = require('../db/db');
const { CACHE_MAX_AGE } = require('../config');

// Yahoo Finance tickers such as AAPL, TCS.NS, M&M.NS, BAJAJ-AUTO.NS and ^NSEI
const SYMBOL_PATTERN = /^[\^A-Z0-9.&-]{1,20}$/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

// Only the fields the chart draws
const PROJECTION = { _id: 0, Date: 1, Open: 1, High: 1, Low: 1, Close: 1, Volume: 1 };

const parseDate = (value, fallback, endOfDay = false) => {
    if (value === undefined) return fallback;
    if (typeof value !== 'string') return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    // A bare YYYY-MM-DD end date includes candles stamped later that day (e.g. US market open in UTC)
    return endOfDay && DATE_ONLY.test(value) ? new Date(date.getTime() + DAY_MS - 1) : date;
};

exports.fetchStockData = async (req, res) => {
    const { symbol, startDate, endDate } = req.query;

    if (typeof symbol !== 'string' || !SYMBOL_PATTERN.test(symbol)) {
        return res.status(400).json({ message: 'A valid stock symbol is required' });
    }

    const start = parseDate(startDate, new Date(0));
    const end = parseDate(endDate, new Date(), true);
    if (!start || !end) {
        return res.status(400).json({ message: 'Dates must be in YYYY-MM-DD format' });
    }
    if (start > end) {
        return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    const data = await stocks()
        .find({ Symbol: symbol, Date: { $gte: start, $lte: end } }, { projection: PROJECTION })
        .sort({ Date: 1 })
        .toArray();

    res.set('Cache-Control', `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=86400`);
    res.json(data);
};
