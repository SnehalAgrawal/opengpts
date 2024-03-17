import datetime
import os

import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

TOKEN_SECRET_KEY = os.environ.get("TOKEN_SECRET_KEY")
if not TOKEN_SECRET_KEY:
    raise ValueError("TOKEN_SECRET_KEY not set")

security = HTTPBearer()


def create_token(username):
    return jwt.encode({
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, TOKEN_SECRET_KEY, algorithm="HS256")


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, TOKEN_SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=403, detail="Could not validate credentials")
