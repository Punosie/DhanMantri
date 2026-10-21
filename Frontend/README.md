# DhanMantri Frontend

React 19 + Vite 8 single-page app for [DhanMantri](https://dhanmantri-shubhabha.vercel.app/). Pick a NIFTY 50 stock to see a line or candlestick chart with 50/100/200-day moving averages, a time or custom date range, and market news.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173 (API defaults to http://localhost:5000) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright end-to-end tests (`e2e/`), which build the app and start the API |

## Configuration

Copy `.env.example` to `.env`. Every variable is optional:

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend base URL |
| `VITE_LOG_REQUESTS` | `false` disables request/response logging in the console |
| `VITE_FINNHUB_API_KEY` | Finnhub key for the news panel (hidden when empty) |
| `VITE_FIREBASE_*`, `VITE_AUTH_DOMAIN`, `VITE_PROJECT_ID`, … | Firebase web config for Google sign-in (disabled when empty) |

## Structure

- `src/lib/http.js`: axios clients that log every outgoing request and its response, with latency and the backend request ID
- `src/Services/StockService.jsx`: stock data API
- `src/Components/Chart/`: chart, option builder and the lazily loaded, tree-shaken ECharts wrapper
- `src/theme.js`: Chakra system with only the component recipes in use
- `public/`: favicons, manifest, `robots.txt`, `sitemap.xml`, OG image
- `vercel.json`: SPA rewrites, immutable asset caching and security headers
