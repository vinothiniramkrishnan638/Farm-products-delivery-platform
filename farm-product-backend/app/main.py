import json
import random
from typing import List
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import Base, engine, get_db
from app.models import Customer, Category, Product, Cart, CustomerAddress, Order, OrderItem, OrderStatusHistory
from app.schemas import (
    CustomerRegister, CustomerLogin, SendOtpRequest, VerifyOtpRequest,
    CustomerProfile, ForgotPasswordRequest, CategoryResponse, ProductResponse,
    CategoryProductsResponse, ProductDetailResponse, AddToCartRequest,
    UpdateCartRequest, CartItemResponse, AddressRequest, AddressResponse,
    PlaceOrderRequest, PlaceOrderResponse, OrderDetailResponse,
    OrderListResponse, TrackOrderResponse, SimpleMessageResponse,
)


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
    allow_origin_regex=r"https://farm-products-delivery-platform.*\.vercel\.app",
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

def generate_order_id(db: Session) -> str:
    last_order = db.query(Order).order_by(Order.id.desc()).first()
    if not last_order:
        return "ORD001"
    last_number = int(last_order.order_id.replace("ORD", ""))
    new_number = last_number + 1
    return f"ORD{new_number:03d}"



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

    reset_code = str(random.randint(100000, 999999))
    print(f"Reset code for {payload.login_id}: {reset_code}")

    return {
        "message": "Reset code sent successfully. Check your terminal/device.",
        "reset_code": reset_code
    }

@app.post("/api/customer/send-otp")
def send_otp(payload: SendOtpRequest, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.mobile_number == payload.mobile_number).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Mobile number not registered")

    otp = generate_otp(payload.mobile_number)
    print(f"OTP for {payload.mobile_number}: {otp}")

    return {
        "message": "OTP sent successfully",
        "otp": otp
    }

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



@app.get("/api/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.status == "active").all()

    result = []
    for cat in categories:
        product_count = db.query(Product).filter(
            Product.category_id == cat.id,
            Product.status == "active"
        ).count()
        result.append({
            "id": cat.id,
            "category_name": cat.category_name,
            "category_image": cat.category_image,
            "product_count": product_count,
        })

    return result

@app.get("/api/categories/{category_id}/products", response_model=CategoryProductsResponse)
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id, Category.status == "active").first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    products = db.query(Product).filter(
        Product.category_id == category_id,
        Product.status == "active"
    ).all()

    return {
        "category_name": category.category_name,
        "products": products,
    }

@app.get("/api/products/featured", response_model=List[ProductResponse])
def get_featured_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.is_featured,
        Product.status == "active"
    ).all()
    return products

@app.get("/api/products/popular", response_model=List[ProductResponse])
def get_popular_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.is_popular,
        Product.status == "active"
    ).all()
    return products

@app.get("/api/products/search", response_model=List[ProductResponse])
def search_products(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    search_term = f"%{q}%"

    products = db.query(Product).join(Category).filter(
        Product.status == "active",
        or_(
            Product.product_name.ilike(search_term),
            Category.category_name.ilike(search_term)
        )
    ).all()

    return products



@app.get("/api/products/{product_id}", response_model=ProductDetailResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.status == "active"
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    image_list = []
    if product.images:
        try:
            image_list = json.loads(product.images)
        except (json.JSONDecodeError, TypeError):
            image_list = []

    return {
        "id": product.id,
        "category_id": product.category_id,
        "category_name": product.category.category_name,
        "product_name": product.product_name,
        "description": product.description,
        "product_image": product.product_image,
        "images": image_list,
        "price": product.price,
        "stock": product.stock,
        "unit": product.unit,
        "is_featured": product.is_featured,
        "is_popular": product.is_popular,
    }

@app.get("/api/products/{product_id}/related", response_model=List[ProductResponse])
def get_related_products(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    related = db.query(Product).filter(
        Product.category_id == product.category_id,
        Product.id != product_id,
        Product.status == "active"
    ).limit(8).all()

    return related

@app.get("/api/cart", response_model=List[CartItemResponse])
def get_cart_items(current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    cart_items = db.query(Cart).filter(Cart.customer_id == current_customer.customer_id).all()

    result = []
    for item in cart_items:
        result.append({
            "cart_id": item.id,
            "product_id": item.product.id,
            "product_name": item.product.product_name,
            "product_image": item.product.product_image,
            "price": item.product.price,
            "unit": item.product.unit,
            "stock": item.product.stock,
            "quantity": item.quantity,
        })

    return result

@app.post("/api/cart")
def add_to_cart(payload: AddToCartRequest, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.status == "active").first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if payload.quantity > product.stock:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")

    existing_item = db.query(Cart).filter(
        Cart.customer_id == current_customer.customer_id,
        Cart.product_id == payload.product_id
    ).first()

    if existing_item:
        new_quantity = existing_item.quantity + payload.quantity
        if new_quantity > product.stock:
            raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")
        existing_item.quantity = new_quantity
        db.commit()
        db.refresh(existing_item)
        return {"message": "Cart updated successfully", "cart_id": existing_item.id, "quantity": existing_item.quantity}

    new_item = Cart(
        customer_id=current_customer.customer_id,
        product_id=payload.product_id,
        quantity=payload.quantity,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {"message": "Added to cart successfully", "cart_id": new_item.id, "quantity": new_item.quantity}

@app.put("/api/cart/{cart_id}")
def update_cart_item(cart_id: int, payload: UpdateCartRequest, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    cart_item = db.query(Cart).filter(
        Cart.id == cart_id,
        Cart.customer_id == current_customer.customer_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    if payload.quantity > cart_item.product.stock:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")

    cart_item.quantity = payload.quantity
    db.commit()
    db.refresh(cart_item)

    return {"message": "Cart item updated successfully", "cart_id": cart_item.id, "quantity": cart_item.quantity}

@app.delete("/api/cart/{cart_id}")
def remove_cart_item(cart_id: int, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    cart_item = db.query(Cart).filter(
        Cart.id == cart_id,
        Cart.customer_id == current_customer.customer_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()

    return {"message": "Item removed from cart successfully"}

@app.get("/api/addresses", response_model=List[AddressResponse])
def get_addresses(current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    addresses = db.query(CustomerAddress).filter(
        CustomerAddress.customer_id == current_customer.customer_id
    ).all()
    return addresses

@app.post("/api/addresses", response_model=AddressResponse)
def add_address(payload: AddressRequest, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    if payload.is_default:
        db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == current_customer.customer_id
        ).update({"is_default": False})

    existing_count = db.query(CustomerAddress).filter(
        CustomerAddress.customer_id == current_customer.customer_id
    ).count()

    new_address = CustomerAddress(
        customer_id=current_customer.customer_id,
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        address=payload.address,
        village=payload.village,
        district=payload.district,
        state=payload.state,
        pincode=payload.pincode,
        landmark=payload.landmark,
        is_default=payload.is_default or existing_count == 0,
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)

    return new_address

@app.put("/api/addresses/{address_id}", response_model=AddressResponse)
def update_address(address_id: int, payload: AddressRequest, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    address = db.query(CustomerAddress).filter(
        CustomerAddress.id == address_id,
        CustomerAddress.customer_id == current_customer.customer_id
    ).first()

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    if payload.is_default:
        db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == current_customer.customer_id,
            CustomerAddress.id != address_id
        ).update({"is_default": False})

    address.full_name = payload.full_name
    address.mobile_number = payload.mobile_number
    address.address = payload.address
    address.village = payload.village
    address.district = payload.district
    address.state = payload.state
    address.pincode = payload.pincode
    address.landmark = payload.landmark
    address.is_default = payload.is_default

    db.commit()
    db.refresh(address)

    return address

@app.delete("/api/addresses/{address_id}")
def delete_address(address_id: int, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    address = db.query(CustomerAddress).filter(
        CustomerAddress.id == address_id,
        CustomerAddress.customer_id == current_customer.customer_id
    ).first()

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    was_default = address.is_default

    db.delete(address)
    db.commit()

    if was_default:
        next_address = db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == current_customer.customer_id
        ).first()
        if next_address:
            next_address.is_default = True
            db.commit()

    return {"message": "Address deleted successfully"}

@app.post("/api/orders", response_model=PlaceOrderResponse)
def place_order(payload: PlaceOrderRequest, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    address = db.query(CustomerAddress).filter(
        CustomerAddress.id == payload.address_id,
        CustomerAddress.customer_id == current_customer.customer_id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    if payload.payment_method not in ["COD", "ONLINE"]:
        raise HTTPException(status_code=400, detail="Invalid payment method")

    cart_items = db.query(Cart).filter(Cart.customer_id == current_customer.customer_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    total_amount = 0
    for item in cart_items:
        if item.quantity > item.product.stock:
            raise HTTPException(status_code=400, detail=f"{item.product.product_name} has insufficient stock")
        total_amount += float(item.product.price) * item.quantity

    delivery_charge = 0 if total_amount >= 500 or total_amount == 0 else 40
    grand_total = total_amount + delivery_charge

    new_order_id = generate_order_id(db)

    new_order = Order(
        order_id=new_order_id,
        customer_id=current_customer.customer_id,
        address_id=payload.address_id,
        total_amount=grand_total,
        payment_method=payload.payment_method,
        order_status="Pending",
    )
    db.add(new_order)

    for item in cart_items:
        order_item = OrderItem(
            order_id=new_order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price,
        )
        db.add(order_item)
        prod = db.query(Product).filter(Product.id == item.product_id).first()
        if prod:
            prod.stock = max(0, prod.stock - item.quantity)

    for item in cart_items:
        db.delete(item)

    db.commit()

    return {"message": "Order placed successfully", "order_id": new_order_id}

@app.get("/api/orders/{order_id}", response_model=OrderDetailResponse)
def get_order_details(order_id: str, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    order = db.query(Order).filter(
        Order.order_id == order_id,
        Order.customer_id == current_customer.customer_id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = [
        {
            "product_name": item.product.product_name,
            "product_image": item.product.product_image,
            "quantity": item.quantity,
            "price": item.price,
        }
        for item in order.items
    ]

    # Calculate subtotal to determine delivery charge
    subtotal = sum(float(item.price) * item.quantity for item in order.items)
    delivery_charge = 0 if subtotal >= 500 or subtotal == 0 else 40

    return {
        "order_id": order.order_id,
        "total_amount": order.total_amount,
        "delivery_charge": delivery_charge,
        "payment_method": order.payment_method,
        "order_status": order.order_status,
        "created_at": order.created_at.strftime("%d %b %Y, %I:%M %p"),
        "delivery_address": {
            "full_name": order.address.full_name,
            "mobile_number": order.address.mobile_number,
            "address": order.address.address,
            "village": order.address.village,
            "district": order.address.district,
            "state": order.address.state,
            "pincode": order.address.pincode,
        },
        "items": items,
    }

@app.get("/api/my-orders", response_model=List[OrderListResponse])
def get_customer_orders(current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(
        Order.customer_id == current_customer.customer_id
    ).order_by(Order.created_at.desc(), Order.order_id.desc()).all()

    result = []
    for order in orders:
        items = [
            {
                "product_name": item.product.product_name,
                "product_image": item.product.product_image,
                "quantity": item.quantity,
                "price": item.price,
            }
            for item in order.items
        ]
        result.append({
            "order_id": order.order_id,
            "total_amount": order.total_amount,
            "payment_method": order.payment_method,
            "order_status": order.order_status,
            "created_at": order.created_at.strftime("%d %b %Y, %I:%M %p"),
            "items": items,
        })

    return result

@app.get("/api/orders/{order_id}/track", response_model=TrackOrderResponse)
def track_order_status(order_id: str, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    order = db.query(Order).filter(
        Order.order_id == order_id,
        Order.customer_id == current_customer.customer_id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    history_entries = db.query(OrderStatusHistory).filter(
        OrderStatusHistory.order_id == order_id
    ).order_by(OrderStatusHistory.updated_at.asc()).all()

    history = [
        {
            "status": entry.status,
            "updated_at": entry.updated_at.strftime("%d %b %Y, %I:%M %p"),
        }
        for entry in history_entries
    ]

    return {
        "order_id": order.order_id,
        "current_status": order.order_status,
        "history": history,
    }

@app.post("/api/orders/{order_id}/cancel", response_model=SimpleMessageResponse)
def cancel_order(order_id: str, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    order = db.query(Order).filter(
        Order.order_id == order_id,
        Order.customer_id == current_customer.customer_id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.order_status != "Pending":
        raise HTTPException(status_code=400, detail="Order can only be cancelled before confirmation")

    order.order_status = "Cancelled"

    status_entry = OrderStatusHistory(
        order_id=order_id,
        status="Cancelled",
    )
    db.add(status_entry)

    db.commit()

    return {"message": "Order cancelled successfully"}

@app.post("/api/orders/{order_id}/reorder", response_model=SimpleMessageResponse)
def reorder_previous_order(order_id: str, current_customer: Customer = Depends(get_current_customer), db: Session = Depends(get_db)):
    order = db.query(Order).filter(
        Order.order_id == order_id,
        Order.customer_id == current_customer.customer_id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.order_status != "Delivered":
        raise HTTPException(status_code=400, detail="Only delivered orders can be reordered")

    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id, Product.status == "active").first()
        if not product or product.stock <= 0:
            continue

        quantity_to_add = min(item.quantity, product.stock)

        existing_cart_item = db.query(Cart).filter(
            Cart.customer_id == current_customer.customer_id,
            Cart.product_id == item.product_id
        ).first()

        if existing_cart_item:
            new_quantity = existing_cart_item.quantity + quantity_to_add
            existing_cart_item.quantity = min(new_quantity, product.stock)
        else:
            new_cart_item = Cart(
                customer_id=current_customer.customer_id,
                product_id=item.product_id,
                quantity=quantity_to_add,
            )
            db.add(new_cart_item)

    db.commit()

    return {"message": "Items added to cart successfully"}
