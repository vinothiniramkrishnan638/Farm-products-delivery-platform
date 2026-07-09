from typing import Optional
from pydantic import BaseModel, EmailStr

class CustomerRegister(BaseModel):
    full_name: str
    mobile_number: str
    email: EmailStr
    village: str
    password: str

class CustomerLogin(BaseModel):
    login_id: Optional[str] = None
    mobile_number: Optional[str] = None
    password: str

class ForgotPasswordRequest(BaseModel):
    login_id: str

class SendOtpRequest(BaseModel):
    mobile_number: str

class VerifyOtpRequest(BaseModel):
    mobile_number: str
    otp: str

class CustomerProfile(BaseModel):
    customer_id: str
    full_name: str
    mobile_number: str
    email: str
    village: str

    class Config:
        from_attributes = True