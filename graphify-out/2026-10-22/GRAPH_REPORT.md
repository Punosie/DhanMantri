# Graph Report - DhanMantri  (2026-10-22)

## Corpus Check
- 54 files · ~21,144 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 296 nodes · 384 edges · 27 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `56805289`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.js
- dependencies
- Chart.jsx
- index.jsx
- StockService.jsx
- CommandLogger
- devDependencies
- Backend/package.json
- README.md
- dependencies
- Frontend/package.json
- App.jsx
- main.jsx
- Stock Data API 📈
- vercel.json
- 📊 Stock Data Fetcher and Database Inserter 🚀
- DhanMantri Frontend

## God Nodes (most connected - your core abstractions)
1. `scripts` - 7 edges
2. `symbolLabel()` - 7 edges
3. `CommandLogger` - 6 edges
4. `Chart()` - 6 edges
5. `toaster` - 6 edges
6. `loadAuth()` - 6 edges
7. `get_collection()` - 5 edges
8. `run()` - 5 edges
9. `AuthButton()` - 5 edges
10. `generateChartOptions()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `latest_date()`  [INFERRED]
  DataFetcher/src/main.py → DataFetcher/src/db.py
- `run()` --calls--> `upsert_records()`  [INFERRED]
  DataFetcher/src/main.py → DataFetcher/src/db.py
- `run()` --calls--> `fetch_ohlcv()`  [INFERRED]
  DataFetcher/src/main.py → DataFetcher/src/fetcher.py
- `run()` --calls--> `next_start()`  [INFERRED]
  DataFetcher/src/main.py → DataFetcher/src/fetcher.py
- `Chart()` --calls--> `generateChartOptions()`  [EXTRACTED]
  Frontend/src/Components/Chart/Chart.jsx → Frontend/src/Components/Chart/ChartOptions.jsx

## Import Cycles
- None detected.

## Communities (27 total, 0 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.07
Nodes (34): { CACHE_MAX_AGE }, fetchStockData(), parseDate(), PROJECTION, { stocks }, close(), connect(), logCommands() (+26 more)

### Community 1 - "dependencies"
Cohesion: 0.08
Nodes (25): axios, @chakra-ui/react, echarts, echarts-for-react, @emotion/react, firebase, dependencies, axios (+17 more)

### Community 2 - "Chart.jsx"
Cohesion: 0.14
Nodes (16): CHART_HEIGHT, EChart, echartModule, fmt(), generateChartOptions(), MOVING_AVERAGES, DateRangeSelector(), today() (+8 more)

### Community 3 - "index.jsx"
Cohesion: 0.19
Nodes (14): AuthButton(), Navbar(), Avatar, AvatarFallback, AvatarGroup, AuthContext, AuthProvider(), useAuth() (+6 more)

### Community 4 - "StockService.jsx"
Cohesion: 0.16
Nodes (15): News(), createHttpClient(), describe(), elapsed(), redact(), STATUS_STYLE, api, fetchStockData() (+7 more)

### Community 5 - "CommandLogger"
Cohesion: 0.15
Nodes (13): clear_database(), CommandLogger, get_collection(), latest_date(), Logs every outgoing MongoDB command with its latency., Date of the newest stored candle for a symbol, or None., Insert or update candles keyed on (Symbol, Date), so reruns never duplicate., upsert_records() (+5 more)

### Community 6 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks (+9 more)

### Community 7 - "Backend/package.json"
Cohesion: 0.12
Nodes (15): author, description, devDependencies, pino-pretty, engines, node, license, main (+7 more)

### Community 8 - "README.md"
Cohesion: 0.12
Nodes (14): DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 🖤, DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 😎, Analytics, Deployment, Developer tooling, Environment variables, License, Lighthouse Performance Report (+6 more)

### Community 9 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, compression, cors, express, helmet, mongodb, pino, pino-http (+7 more)

### Community 10 - "Frontend/package.json"
Cohesion: 0.14
Nodes (13): engines, node, name, private, scripts, build, dev, lint (+5 more)

### Community 11 - "App.jsx"
Cohesion: 0.26
Nodes (10): App(), savedSymbol(), Chart(), readStored(), Footer(), LINKS, StockSelector(), stockOptions (+2 more)

### Community 12 - "main.jsx"
Cohesion: 0.24
Nodes (8): ColorModeButton, ColorModeIcon(), ColorModeProvider(), useColorMode(), useColorModeValue(), Provider(), config, system

### Community 13 - "Stock Data API 📈"
Cohesion: 0.25
Nodes (7): Endpoints 🖥️, `GET /api/stocks/fetch`, `GET /health`, Logging 🪵, Project Structure 🗂️, 🔧 Setup Instructions, Stock Data API 📈

### Community 14 - "vercel.json"
Cohesion: 0.29
Nodes (6): buildCommand, framework, headers, outputDirectory, rewrites, $schema

### Community 15 - "📊 Stock Data Fetcher and Database Inserter 🚀"
Cohesion: 0.33
Nodes (5): How it works, Prerequisites, Project Structure, 🔧 Setup Instructions, 📊 Stock Data Fetcher and Database Inserter 🚀

### Community 16 - "DhanMantri Frontend"
Cohesion: 0.40
Nodes (4): Configuration, DhanMantri Frontend, Scripts, Structure

## Knowledge Gaps
- **117 isolated node(s):** `{ stocks }`, `{ CACHE_MAX_AGE }`, `PROJECTION`, `{ MongoClient }`, `{ MONGO_URL, MONGO_DB, MONGO_COLLECTION, LOG_DB_COMMANDS }` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `Frontend/package.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `Frontend/package.json`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `toaster` connect `Chart.jsx` to `index.jsx`, `main.jsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `{ stocks }`, `{ CACHE_MAX_AGE }`, `PROJECTION` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06968641114982578 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Chart.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._