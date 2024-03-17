import os
from typing import Any, Mapping

from pymongo import MongoClient
from pymongo.database import Database

MONGO_DB_CLIENT = None


def get_mongo_client() -> Database[Mapping[str, Any] | Any]:
    """Get a Redis client."""
    global MONGO_DB_CLIENT

    if MONGO_DB_CLIENT is not None:
        return MONGO_DB_CLIENT

    url = os.environ.get("MONGO_CONNECTION_URL")

    if not url:
        raise ValueError("MONGO_CONNECTION_URL not set")

    client = MongoClient(url)
    MONGO_DB_CLIENT = client['prudb']

    return MONGO_DB_CLIENT
