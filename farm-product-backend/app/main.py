from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.database import Base, engine, get_db
from app.models import Customer
from app.schemas import CustomerRegister, CustomerLogin, SendOtpRequest, VerifyOtpRequest, CustomerProfile, ForgotPasswordRequest
from app.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    generate_otp,
    verify_otp,
)
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "running", "message": "Farm Products Delivery Platform Backend is online"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "your_secret_key_change_this"
ALGORITHM = "HS256"

def get_current_customer(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        customer_id = payload.get("customer_id")
        if customer_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if customer is None:
        raise credentials_exception
    return customer

def generate_customer_id(db: Session) -> str:
    last_customer = db.query(Customer).order_by(Customer.id.desc()).first()
    if not last_customer:
        return "CUS001"
    last_number = int(last_customer.customer_id.replace("CUS", ""))
    new_number = last_number + 1
    return f"CUS{new_number:03d}"

@app.post("/api/customer/register")
def register_customer(payload: CustomerRegister, db: Session = Depends(get_db)):
    existing = db.query(Customer).filter(Customer.mobile_number == payload.mobile_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Mobile number already registered")

    new_customer_id = generate_customer_id(db)
    hashed_pw = hash_password(payload.password)

    new_customer = Customer(
        customer_id=new_customer_id,
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        email=payload.email,
        village=payload.village,
        password=hashed_pw,
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return {"message": "Registration successful", "customer_id": new_customer.customer_id}

@app.post("/api/customer/login")
def login_customer(payload: CustomerLogin, db: Session = Depends(get_db)):
    identifier = payload.login_id or payload.mobile_number
    if not identifier:
        raise HTTPException(status_code=400, detail="Either login_id or mobile_number must be provided")

    customer = db.query(Customer).filter(
        or_(
            Customer.mobile_number == identifier,
            Customer.email == identifier
        )
    ).first()
    if not customer or not verify_password(payload.password, customer.password):
        raise HTTPException(status_code=401, detail="Invalid mobile number, email, or password")

    token = create_access_token({"customer_id": customer.customer_id})

    return {
        "token": token,
        "customer": {
            "customer_id": customer.customer_id,
            "full_name": customer.full_name,
            "mobile_number": customer.mobile_number,
            "email": customer.email,
            "village": customer.village,
        },
    }

@app.post("/api/customer/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(
        or_(
            Customer.mobile_number == payload.login_id,
            Customer.email == payload.login_id
        )
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Mobile number or email ID not registered")
    
    # Generate a mock reset code
    import random
    reset_code = str(random.randint(100000, 999999))
    print(f"Reset code for {payload.login_id}: {reset_code}")
    
    return {"message": "Reset code sent successfully. Check your terminal/device."}

@app.post("/api/customer/send-otp")
def send_otp(payload: SendOtpRequest, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.mobile_number == payload.mobile_number).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Mobile number not registered")

    otp = generate_otp(payload.mobile_number)
    print(f"OTP for {payload.mobile_number}: {otp}")

    return {"message": "OTP sent successfully"}

@app.post("/api/customer/verify-otp")
def verify_otp_login(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    is_valid = verify_otp(payload.mobile_number, payload.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    customer = db.query(Customer).filter(Customer.mobile_number == payload.mobile_number).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    token = create_access_token({"customer_id": customer.customer_id})

    return {
        "token": token,
        "customer": {
            "customer_id": customer.customer_id,
            "full_name": customer.full_name,
            "mobile_number": customer.mobile_number,
            "email": customer.email,
            "village": customer.village,
        },
    }

@app.get("/api/customer/profile", response_model=CustomerProfile)
def get_profile(current_customer: Customer = Depends(get_current_customer)):
    return current_customer