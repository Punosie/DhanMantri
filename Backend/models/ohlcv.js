const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  Date: { type: Date, required: true },
  Open: { type: Number, required: true },
  High: { type: Number, required: true },
  Low: { type: Number, required: true },
  Close: { type: Number, required: true },
  Volume: { type: Number, required: true },
  Dividends: { type: Number, default: 0 },
  StockSplits: { type: Number, default: 0 },
  Symbol: { type: String, required: true },
});

// Create a model based on the schema
const Stock = mongoose.model('STOCK', stockSchema);

module.exports = Stock;
