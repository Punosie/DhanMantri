# Stock Data API 📈

Express 5 API that serves daily stock candles from the MongoDB `STOCKS` collection. The [DataFetcher](../DataFetcher) fills that collection.

## Project Structure 🗂️

- `index.js`: Express app (security headers, compression, CORS, logging, error handling) and server lifecycle
- `config.js`: environment configuration (reads `.env` locally)
- `logger.js`: pino logger, the incoming request logger and request-ID context
- `db/db.js`: MongoDB client, outgoing command logging and the `(Symbol, Date)` index
- `routes/stockRoute.js`, `controller/stockController.js`: the stock endpoint

## Endpoints 🖥️

### `GET /api/stocks/fetch`

Returns daily candles for a symbol, oldest first.

| Query | Required | Description |
| --- | --- | --- |
| `symbol` | yes | Yahoo Finance ticker, e.g. `TCS.NS`, `M&M.NS`, `^NSEI`, `AAPL` |
| `startDate` | no | `YYYY-MM-DD`, defaults to the earliest data |
| `endDate` | no | `YYYY-MM-DD` (inclusive), defaults to now |

```
GET http://localhost:5000/api/stocks/fetch?symbol=TCS.NS&startDate=2026-10-01&endDate=2026-10-21
```

```json
[
  { "Date": "2026-10-20T18:30:00.000Z", "Open": 2484, "High": 2533.3, "Low": 2476.5, "Close": 2529, "Volume": 5703350 }
]
```

- `200 OK`: the candles, or `[]` when the range has none. Responses carry `Cache-Control: public, max-age=300` and an ETag.
- `400 Bad Request`: missing or invalid `symbol`, a malformed date, or `startDate` after `endDate`.
- `500 Internal Server Error`: an unexpected error, which is logged with the request ID.

### `GET /health`

`200 {"status":"ok","db":"up"}`, or `503` when MongoDB is unreachable. Render uses this endpoint as its health check.

## Logging 🪵

- **Incoming:** every request is logged when its response finishes (method, URL, status, duration, origin, cache header). The `X-Request-Id` response header carries the request ID, and an incoming `X-Request-Id` is reused.
- **Outgoing:** every MongoDB command is logged with its duration and the `reqId` of the request that triggered it (`LOG_DB_COMMANDS=false` turns this off).
- Logs are pretty-printed in a terminal and written as JSON lines elsewhere, such as on Render. Health checks are logged only at `LOG_LEVEL=debug`.

## 🔧 Setup Instructions

```bash
npm install
cp .env.example .env   # set MONGO_URL; see the file for logging and CORS options
npm run dev            # node --watch, restarts on changes
# or
npm start              # production
```

The server runs on `http://localhost:5000`. It needs Node.js 22.12 or newer.
