// Local development reads .env; on Render the variables are injected directly
try {
    process.loadEnvFile();
} catch {
    // no .env file
}

const DEFAULT_ORIGINS = [
    'https://dhanmantri-app.vercel.app',
    'https://dhanmantri-eight.vercel.app',
    'https://dhanmantri.onrender.com',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:4317',
].join(',');

const list = (value) => (value || '').split(',').map((s) => s.trim()).filter(Boolean);

module.exports = {
    PORT: Number(process.env.PORT) || 5000,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_DB: process.env.MONGO_DB || 'stockdata',
    MONGO_COLLECTION: process.env.MONGO_COLLECTION || 'STOCKS',

    // Defaults cover the deployed frontends and local dev; override per environment
    CORS_ORIGINS: list(process.env.CORS_ORIGINS || DEFAULT_ORIGINS),
    // Vercel preview deployments of the dhanmantri project
    CORS_ORIGIN_REGEX: new RegExp(process.env.CORS_ORIGIN_REGEX || '^https://dhanmantri-[a-z0-9-]*shubhabha\\.vercel\\.app$'),

    // Requests per minute per client IP on the stock API
    RATE_LIMIT_PER_MINUTE: Number(process.env.RATE_LIMIT_PER_MINUTE) || 300,

    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    // Human-readable logs in a terminal, JSON lines everywhere else
    LOG_PRETTY: process.env.LOG_PRETTY ? process.env.LOG_PRETTY === 'true' : Boolean(process.stdout.isTTY),
    // Log every outgoing MongoDB command with its latency
    LOG_DB_COMMANDS: process.env.LOG_DB_COMMANDS !== 'false',

    // Daily candles change at most once a day, so let browsers and CDNs reuse them
    CACHE_MAX_AGE: Number(process.env.CACHE_MAX_AGE) || 300,
};
