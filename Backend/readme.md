# Stock Data API 📈

This is a backend API for fetching stock data from a MongoDB database. It allows clients to request stock information for a specific stock symbol over a given date range. The data is queried from the `STOCKS` collection in MongoDB.

## Project Structure 🗂️

- `index.js`                – Main entry point that sets up the Express server and routes.
- `stockRoute.js`    – Defines routes for handling stock-related requests.
- `stockController.js` – Contains the business logic for fetching stock data.
- `db.js`                – MongoDB database connection setup file.
- `.env`                    – Environment file for sensitive variables like the database URI and port number.
- `package.json`            – Contains project dependencies and scripts.

## Endpoints 🖥️

### `GET /api/stocks/fetch`

This endpoint retrieves stock data based on the provided `symbol`, `startDate`, and `endDate`.

#### Query Parameters

- `symbol` (required): The stock symbol (e.g., "AAPL", "GOOG").
- `startDate` (optional): The start date of the range in `YYYY-MM-DD` format.
- `endDate` (optional): The end date of the range in `YYYY-MM-DD` format.

#### Example Request

``` example
GET http://localhost:5000/api/stocks/fetch?symbol=AAPL&startDate=2023-01-01&endDate=2023-12-31
```

#### Response

- `200 OK`: Returns the stock data in JSON format.
- `400 Bad Request`: If `symbol` is missing, or if `startDate` is after `endDate`.
- `404 Not Found`: If no stock data is found for the given symbol and date range.
- `500 Internal Server Error`: If an unexpected error occurs.

#### Example Response

```json
[
  {
    "Symbol": "AAPL",
    "Date": "2023-05-15T00:00:00.000Z",
    "Open": 170.50,
    "Close": 173.12,
    "High": 175.00,
    "Low": 169.75,
    "Volume": 125200000
  },
  {
    "Symbol": "AAPL",
    "Date": "2023-05-16T00:00:00.000Z",
    "Open": 172.00,
    "Close": 174.80,
    "High": 176.00,
    "Low": 171.50,
    "Volume": 118000000
  }
]

```

## 🔧 Setup Instructions

### STEP 1: Install Dependencies

Make sure you have Node.js installed. Then, run the following command to install all required dependencies:

```bash
npm install
```

### STEP 2: Set up environment variables

Create a `.env` file in the root directory and define the following variables:

```.env
PORT = 5000
MONGO_URI=<your-mongo-db-uri>
```

### STEP 4: Start the server

This project uses nodemon for running the server on the backend to help with refreshing while developement. Run the following command to start the Express server:

```bash
npm start
```

The server will now be running on `http://localhost:5000.`

## Contributing 🤝

If you'd like to contribute, feel free to fork the repository and submit a pull request with your changes. Ensure you follow good coding practices and write tests if applicable.
