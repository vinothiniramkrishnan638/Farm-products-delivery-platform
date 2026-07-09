from datetime import datetime, timedelta
from jose import jwt
import bcrypt
import random

SECRET_KEY = "your_secret_key_change_this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

otp_store = {}

def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def generate_otp(mobile_number: str) -> str:
    otp = str(random.randint(100000, 999999))
    otp_store[mobile_number] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5)
    }
    return otp

def verify_otp(mobile_number: str, otp: str) -> bool:
    record = otp_store.get(mobile_number)
    if not record:
        return False
    if datetime.utcnow() > record["expires_at"]:
        del otp_store[mobile_number]
        return False
    if record["otp"] != otp:
        return False
    del otp_store[mobile_number]
    return True