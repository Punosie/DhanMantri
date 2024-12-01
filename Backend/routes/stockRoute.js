const express = require('express');
const { fetchStockData } = require('../controller/stockController');
const router = express.Router();

// Define the route for fetching stock data
router.get('/fetch', fetchStockData);

module.exports = router;
