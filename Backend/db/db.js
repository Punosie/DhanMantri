// db.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);   

const db = async () => {
    try { 
        mongoose.set('strictQuery', false);
        // Replace your connection string with process.env.MONGO_URL for better practice
        await mongoose.connect(MONGO_URL, { dbName: 'stockdata' });
        console.log('Connected to the database');
    } catch (error) {
        console.log('Error connecting to the database', error);
    }
};

module.exports = db;
