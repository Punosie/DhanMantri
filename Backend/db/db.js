const { MongoClient } = require('mongodb');
const { MONGO_URL, MONGO_DB, MONGO_COLLECTION, LOG_DB_COMMANDS } = require('../config');
const { logger, requestContext } = require('../logger');

let client;

// Logs every outgoing MongoDB command with its latency and the request that caused it
const logCommands = (mongo) => {
    const log = logger.child({ component: 'mongodb' });
    const reqId = () => requestContext.getStore()?.id;
    mongo.on('commandSucceeded', (e) => {
        const level = e.commandName === 'ping' ? 'debug' : 'info';
        log[level]({ reqId: reqId(), command: e.commandName, ms: e.duration }, `mongo ${e.commandName} ok ${Math.round(e.duration)}ms`);
    });
    mongo.on('commandFailed', (e) => {
        log.error({ reqId: reqId(), command: e.commandName, ms: e.duration, err: e.failure }, `mongo ${e.commandName} failed`);
    });
};

let ready = false;

const connect = async () => {
    if (!MONGO_URL) throw new Error('MONGO_URL is not configured');
    const mongo = new MongoClient(MONGO_URL, {
        monitorCommands: LOG_DB_COMMANDS,
        serverSelectionTimeoutMS: 15000,
        maxPoolSize: 10,
        // Keep warm connections so bursts of requests skip the TCP/TLS handshake
        minPoolSize: 3,
    });
    if (LOG_DB_COMMANDS) logCommands(mongo);
    try {
        await mongo.connect();
        await mongo.db(MONGO_DB).command({ ping: 1 });
    } catch (err) {
        await mongo.close().catch(() => {});
        throw err;
    }
    client = mongo;
    ready = true;
    logger.info({ db: MONGO_DB }, 'Connected to the database');

    // Every query filters on Symbol and a Date range; same spec the DataFetcher creates
    try {
        await stocks().createIndex({ Symbol: 1, Date: 1 });
    } catch (err) {
        logger.warn({ err }, 'Could not ensure the Symbol/Date index');
    }
};

// Keeps retrying with backoff so the API comes up (and reports 503) while MongoDB is unreachable
const connectWithRetry = async (attempt = 1) => {
    try {
        await connect();
    } catch (err) {
        const delay = Math.min(60, 5 * attempt);
        logger.error({ err, attempt }, `Database connection failed, retrying in ${delay}s`);
        setTimeout(() => connectWithRetry(attempt + 1), delay * 1000).unref();
    }
};

const stocks = () => {
    if (!ready) {
        const err = new Error('Database unavailable, please try again shortly');
        err.status = 503;
        err.expose = true;
        throw err;
    }
    return client.db(MONGO_DB).collection(MONGO_COLLECTION);
};

const ping = async () => {
    if (!ready) return false;
    try {
        await client.db(MONGO_DB).command({ ping: 1 }, { timeoutMS: 2000 });
        return true;
    } catch {
        return false;
    }
};

const close = () => client?.close();

module.exports = { connect, connectWithRetry, stocks, ping, close };
