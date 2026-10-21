const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { fetchStockData } = require('../controller/stockController');
const { RATE_LIMIT_PER_MINUTE } = require('../config');
const router = express.Router();

// Per-IP limit so one client cannot exhaust the database
const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: RATE_LIMIT_PER_MINUTE,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many requests, please slow down' },
});

// Define the route for fetching stock data
router.get('/fetch', limiter, fetchStockData);

module.exports = router;
