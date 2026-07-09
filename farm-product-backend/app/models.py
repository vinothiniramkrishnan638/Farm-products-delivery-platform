from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from app.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(String(10), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    mobile_number = Column(String(10), unique=True, nullable=False)
    email = Column(String(100), nullable=False)
    village = Column(String(100), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())