from sqlalchemy import Column, Integer, String, TIMESTAMP, DECIMAL, Boolean, Text, ForeignKey, func, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped
from typing import List
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

    products: Mapped[List["Product"]] = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    product_name = Column(String(150), nullable=False)
    description = Column(String(255))
    product_image = Column(String(255))
    images = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    unit = Column(String(20), nullable=False)
    is_featured = Column(Boolean, nullable=False, default=False)
    is_popular = Column(Boolean, nullable=False, default=False)
    status = Column(String(20), nullable=False, default="active")

    category: Mapped["Category"] = relationship("Category", back_populates="products")
    cart_items: Mapped[List["Cart"]] = relationship("Cart", back_populates="product")


class Cart(Base):
    __tablename__ = "cart"
    __table_args__ = (UniqueConstraint("customer_id", "product_id", name="unique_customer_product"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(String(10), ForeignKey("customers.customer_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    created_at = Column(TIMESTAMP, server_default=func.now())

    product: Mapped["Product"] = relationship("Product", back_populates="cart_items")
    
class CustomerAddress(Base):
    __tablename__ = "customer_addresses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(String(10), ForeignKey("customers.customer_id"), nullable=False)
    full_name = Column(String(100), nullable=False)
    mobile_number = Column(String(10), nullable=False)
    address = Column(String(255), nullable=False)
    village = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(6), nullable=False)
    landmark = Column(String(150))
    is_default = Column(Boolean, nullable=False, default=False)


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(String(20), primary_key=True)
    customer_id = Column(String(10), ForeignKey("customers.customer_id"), nullable=False)
    address_id = Column(Integer, ForeignKey("customer_addresses.id"), nullable=False)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(String(20), nullable=False)
    order_status = Column(String(30), nullable=False, default="Pending")
    created_at = Column(TIMESTAMP, server_default=func.now())

    address: Mapped["CustomerAddress"] = relationship("CustomerAddress")
    items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="order")
    status_history: Mapped[List["OrderStatusHistory"]] = relationship("OrderStatusHistory", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(20), ForeignKey("orders.order_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)

    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product")    
    
class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(20), ForeignKey("orders.order_id"), nullable=False)
    status = Column(String(30), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now())

    order: Mapped["Order"] = relationship("Order", back_populates="status_history")