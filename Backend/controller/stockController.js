const mongoose = require('mongoose');

exports.fetchStockData = async (req, res) => {
    try {
        // Extract parameters from the request
        const { symbol, startDate, endDate } = req.query;

        // Validate the input
        if (!symbol) {
            return res.status(400).json({ message: 'Stock symbol is required' });
        }

        // Convert the startDate and endDate to JavaScript Date objects
        const start = startDate ? new Date(startDate) : new Date('1970-01-01'); // default to the earliest possible date
        const end = endDate ? new Date(endDate) : new Date(); // default to the current date

        // Ensure that the start date is not after the end date
        if (start > end) {
            return res.status(400).json({ message: 'Start date cannot be after end date' });
        }

        // Access the raw MongoDB collection from the Mongoose connection
        const db = mongoose.connection.db;
        const collection = db.collection('STOCKS');

        // Query the database to get the stock data for the given symbol and date range
        const data = await collection.find({
            Symbol: symbol,            // Filter by stock symbol
            Date: {                    // Filter by date range
                $gte: start,           // Greater than or equal to start date
                $lte: end              // Less than or equal to end date
            }
        }).toArray();

        // Check if data exists
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No data found for the provided symbol and date range' });
        }

        // Return the stock data
        res.json(data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
