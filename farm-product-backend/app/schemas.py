from typing import Optional, List
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


class CategoryResponse(BaseModel):
    id: int
    category_name: str
    category_image: Optional[str] = None
    product_count: int

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: int
    category_id: int
    product_name: str
    description: Optional[str] = None
    product_image: Optional[str] = None
    price: float
    stock: int
    unit: str
    is_featured: bool
    is_popular: bool

    class Config:
        from_attributes = True


class CategoryProductsResponse(BaseModel):
    category_name: str
    products: List[ProductResponse]