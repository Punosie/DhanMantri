const { AsyncLocalStorage } = require('node:async_hooks');
const { randomUUID } = require('node:crypto');
const pino = require('pino');
const pinoHttp = require('pino-http');
const { LOG_LEVEL, LOG_PRETTY } = require('./config');

// Carries the current request id so outgoing DB calls can be tied to the request
const requestContext = new AsyncLocalStorage();

const logger = pino({
    level: LOG_LEVEL,
    base: { service: 'dhanmantri-api' },
    redact: ['req.headers.authorization', 'req.headers.cookie'],
    transport: LOG_PRETTY
        ? {
            target: 'pino-pretty',
            options: { translateTime: 'SYS:HH:MM:ss.l', ignore: 'pid,hostname,service', singleLine: true, colorize: Boolean(process.stdout.isTTY) },
        }
        : undefined,
});

// Logs every incoming request when its response finishes
const httpLogger = pinoHttp({
    logger,
    genReqId(req, res) {
        const id = req.headers['x-request-id'] || randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
    },
    customLogLevel(req, res, err) {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    customSuccessMessage: (req, res, ms) => `${req.method} ${req.originalUrl} ${res.statusCode} ${Math.round(ms)}ms`,
    customErrorMessage: (req, res, err) => `${req.method} ${req.originalUrl} ${res.statusCode} ${err.message}`,
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            origin: req.headers.origin,
            userAgent: req.headers['user-agent'],
            remoteAddress: req.remoteAddress,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
            contentLength: res.headers?.['content-length'],
            cache: res.headers?.['cache-control'],
        }),
    },
    // Render probes /health every few seconds; only log those at debug level
    autoLogging: { ignore: (req) => req.url === '/health' && LOG_LEVEL !== 'debug' },
});

const withRequestContext = (req, res, next) => requestContext.run({ id: req.id }, next);

module.exports = { logger, httpLogger, withRequestContext, requestContext };
