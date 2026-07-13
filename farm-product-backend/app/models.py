from sqlalchemy import Column, Integer, String, TIMESTAMP, DECIMAL, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
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


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(100), nullable=False)
    category_image = Column(String(255))
    status = Column(String(20), nullable=False, default="active")

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    product_name = Column(String(150), nullable=False)
    description = Column(String(255))
    product_image = Column(String(255))
    price = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    unit = Column(String(20), nullable=False)
    is_featured = Column(Boolean, nullable=False, default=False)
    is_popular = Column(Boolean, nullable=False, default=False)
    status = Column(String(20), nullable=False, default="active")

    category = relationship("Category", back_populates="products")