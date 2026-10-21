import logging
from functools import cache

from pymongo import ASCENDING, DESCENDING, MongoClient, UpdateOne, monitoring

from config import LOG_LEVEL, MONGO_COLLECTION, MONGO_DB, MONGO_URL

logger = logging.getLogger("dhanmantri.db")


class CommandLogger(monitoring.CommandListener):
    """Logs every outgoing MongoDB command with its latency."""

    def started(self, event):
        pass

    def succeeded(self, event):
        logger.debug("mongo %s ok %.1fms", event.command_name, event.duration_micros / 1000)

    def failed(self, event):
        logger.warning("mongo %s failed %.1fms: %s", event.command_name,
                       event.duration_micros / 1000, event.failure)


@cache
def get_collection():
    if not MONGO_URL:
        raise RuntimeError("MONGO_URL is not configured")
    listeners = [CommandLogger()] if LOG_LEVEL == "DEBUG" else []
    client = MongoClient(MONGO_URL, event_listeners=listeners, serverSelectionTimeoutMS=15000)
    collection = client[MONGO_DB][MONGO_COLLECTION]
    # Same spec the backend creates, so either side can build it first
    collection.create_index([("Symbol", ASCENDING), ("Date", ASCENDING)])
    logger.info("Connected to MongoDB %s.%s", MONGO_DB, MONGO_COLLECTION)
    return collection


def latest_date(symbol):
    """Date of the newest stored candle for a symbol, or None."""
    doc = get_collection().find_one({"Symbol": symbol}, {"Date": 1},
                                    sort=[("Date", DESCENDING)])
    return doc["Date"] if doc else None


def clear_database():
    get_collection().delete_many({})
    logger.info("All data deleted from the %s collection.", MONGO_COLLECTION)


def upsert_records(symbol, records):
    """Insert or update candles keyed on (Symbol, Date), so reruns never duplicate."""
    rows = records.reset_index().to_dict(orient="records")
    ops = [
        UpdateOne({"Symbol": symbol, "Date": row["Date"]},
                  {"$set": {**row, "Symbol": symbol}}, upsert=True)
        for row in rows
    ]
    if not ops:
        return 0
    result = get_collection().bulk_write(ops, ordered=False)
    return result.upserted_count + result.modified_count
