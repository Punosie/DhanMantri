const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./config');
const { logger, httpLogger, withRequestContext } = require('./logger');
const db = require('./db/db');
const stockRoute = require('./routes/stockRoute');

const app = express();

// Render terminates TLS in front of the app
app.set('trust proxy', 1);

const corsOrigin = config.CORS_ORIGINS.length || config.CORS_ORIGIN_REGEX
    ? (origin, callback) => callback(null, !origin
        || config.CORS_ORIGINS.includes(origin)
        || Boolean(config.CORS_ORIGIN_REGEX?.test(origin)))
    : true;

app.use(httpLogger);
app.use(withRequestContext);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cors({ origin: corsOrigin, methods: ['GET', 'HEAD', 'OPTIONS'], exposedHeaders: ['X-Request-Id'], maxAge: 86400 }));
app.use(express.json({ limit: '10kb' }));

// default route
app.get('/', (req, res) => {
    res.send('Welcome to the stock API');
});

app.get('/health', async (req, res) => {
    const dbUp = await db.ping();
    res.status(dbUp ? 200 : 503).json({ status: dbUp ? 'ok' : 'degraded', db: dbUp ? 'up' : 'down', uptime: Math.round(process.uptime()) });
});

app.use('/api/stocks', stockRoute);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Express 5 forwards rejected promises from async handlers here
app.use((err, req, res, next) => {
    req.log.error({ err }, 'Unhandled error');
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ message: err.expose ? err.message : 'Internal server error' });
});

// Server
const server = async () => {
    try {
        await db.connect();
    } catch (err) {
        logger.fatal({ err }, 'Database connection failed');
        process.exit(1);
    }

    const http = app.listen(config.PORT, () => {
        logger.info(`Server is running on port ${config.PORT}`);
    });

    const shutdown = (signal) => {
        logger.info(`${signal} received, shutting down`);
        http.close(async () => {
            await db.close();
            process.exit(0);
        });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
};

server();
