from pymongo import MongoClient

def get_database():
    from config import MONGO_URL
    client = MongoClient(MONGO_URL)
    return client["stockdata"]

def clear_database():
    db = get_database()
    collection = db["STOCKS"]
    collection.delete_many({})
    print("All data deleted from the STOCKS collection.")

def insert_records(symbol, records):
    db = get_database()
    collection = db["STOCKS"]
    records["Symbol"] = symbol
    records_dict = records.reset_index().to_dict(orient="records")
    collection.insert_many(records_dict)
    print(f"Data for {symbol} inserted successfully.")
  
    
database = get_database()
print(database, type(database))
if database is not None:
    # clear_database()
    print("Database connection successful!")
else:
    print("Database connection failed.")