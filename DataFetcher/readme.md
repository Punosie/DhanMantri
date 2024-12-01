# 📊 Stock Data Fetcher and Database Inserter 🚀

This project is designed to fetch historical stock data (OHLCV) for NIFTY50 and selected global stocks from Yahoo Finance and store it in a MongoDB database.

## Project Structure

- **config.py**: Contains configuration settings such as MongoDB connection details and NIFTY50 stock symbols.
- **db.py**: Contains functions for interacting with the MongoDB database (inserting and clearing data).
- **fetcher.py**: Contains functions for fetching stock data from Yahoo Finance using the `yfinance` library.
- **main.py**: Main script to fetch the stock data and insert it into the database.

## Prerequisites

1. Python 3.x
2. MongoDB instance (MongoDB Atlas recommended)
3. Dependencies (listed in `requirements.txt`)

## 🔧 Setup Instructions

### Step 1: Install Dependencies

Create a virtual environment and install the required dependencies.

```bash
# Create virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

# Install the required libraries
pip install -r requirements.txt
```

### Step 2: Set Up MongoDB 🗄️

- If you don’t already have a MongoDB account, sign up at MongoDB Atlas. 🌍
- Create a new cluster and get the connection string. 🔑
- Replace the MONGO_URL in the .env file with your MongoDB connection string (replace the username, password, and database name accordingly).
- Example .env file:

```env
MONGO_URL=mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Step 3: Run the Script ▶️

Once your environment is set up, you can run the main.py script to fetch stock data and insert it into your MongoDB database

```bash
python main.py
```

### Step 4: (Optional) Clear Database 🧹

If you want to clear all the data in the collection, you can call the clear_database() function in the db.py file. Uncomment the line in main.py to clear the database before inserting new records.

## NOTES

- Ensure that MongoDB Atlas (or your MongoDB server) is properly set up and accessible.
- The `yfinance` library fetches historical OHLCV data for the given stock symbols from Yahoo Finance.
- If any stock symbol fails to fetch data, it will print a warning message and move on to the next symbol.
