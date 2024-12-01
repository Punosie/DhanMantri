const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const stockRoute = require('./routes/stockRoute');  // Import stock route

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// default route
app.get('/', (req, res) => {
    res.send('Welcome to the stock API');
});

app.use('/api/stocks', stockRoute);

// Server
const server = async () => {
    try {
        await db();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
};

server();
