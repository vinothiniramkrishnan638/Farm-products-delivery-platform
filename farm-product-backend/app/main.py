import json
import random
from typing import List
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_,func as sql_func

from app.database import Base, engine, get_db
from app.models import Customer, Category, Product, Cart, CustomerAddress, Order, OrderItem, OrderStatusHistory,Admin
from app.schemas import (
    CustomerRegister, CustomerLogin, SendOtpRequest, VerifyOtpRequest,
    CustomerProfile, ForgotPasswordRequest, CategoryResponse, ProductResponse,
    CategoryProductsResponse, ProductDetailResponse, AddToCartRequest,
    UpdateCartRequest, CartItemResponse, AddressRequest, AddressResponse,
    PlaceOrderRequest, PlaceOrderResponse, OrderDetailResponse,
    OrderListResponse, TrackOrderResponse, SimpleMessageResponse,
    AdminLoginRequest, AdminBootstrapRequest, AdminProfileResponse,
    DashboardSummaryResponse, AdminCategoryRequest, AdminCategoryResponse,
    AdminProductRequest, UpdateStockRequest, AdminProductResponse,
    AdminOrderListResponse, AdminOrderDetailResponse, UpdateOrderStatusRequest,
    AssignDeliveryRequest, AdminCustomerResponse
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

def run_db_migration():
    from sqlalchemy import text
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # Add email column to admins
            try:
                conn.execute(text("ALTER TABLE admins ADD COLUMN email VARCHAR(100) NULL UNIQUE;"))
            except Exception as ex:
                if "Duplicate column name" not in str(ex):
                    raise ex

            # Add delivery_partner_name column to orders
            try:
                conn.execute(text("ALTER TABLE orders ADD COLUMN delivery_partner_name VARCHAR(100) NULL;"))
            except Exception as ex:
                if "Duplicate column name" not in str(ex):
                    raise ex

            res = conn.execute(text("SELECT id FROM admins WHERE mobile_number = '8888888888' OR email = 'admin@farm.com'")).fetchone()
            hashed_pw = hash_password("adminpassword123")
            if res:
                conn.execute(
                    text("UPDATE admins SET email = 'admin@farm.com', password = :password, full_name = 'System Admin' WHERE id = :id"),
                    {"password": hashed_pw, "id": res[0]}
                )
            else:
                conn.execute(
                    text("INSERT INTO admins (admin_id, full_name, mobile_number, email, password) VALUES ('ADM001', 'System Admin', '8888888888', 'admin@farm.com', :password)"),
                    {"password": hashed_pw}
                )
            trans.commit()
            print("DB migration completed successfully inside Uvicorn reload loop.")
        except Exception as e:
            trans.rollback()
            print("DB migration failed inside Uvicorn reload loop:", e)

run_db_migration()

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
def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate admin credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = payload.get("admin_id")
        role = payload.get("role")
        if admin_id is None or role != "admin":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    admin = db.query(Admin).filter(Admin.admin_id == admin_id).first()
    if admin is None:
        raise credentials_exception
    return admin

def generate_customer_id(db: Session) -> str:
    last_customer = db.query(Customer).order_by(Customer.id.desc()).first()
    if not last_customer:
        return "CUS001"
    last_number = int(last_customer.customer_id.replace("CUS", ""))
    new_number = last_number + 1
    return f"CUS{new_number:03d}"

def generate_order_id(db: Session) -> str:
    last_order = db.query(Order).order_by(Order.order_id.desc()).first()
    if not last_order:
        return "ORD001"
    last_number = int(last_order.order_id.replace("ORD", ""))
    new_number = last_number + 1
    return f"ORD{new_number:03d}"
def generate_admin_id(db: Session) -> str:
    last_admin = db.query(Admin).order_by(Admin.id.desc()).first()
    if not last_admin:
        return "ADM001"
    last_number = int(last_admin.admin_id.replace("ADM", ""))
    new_number = last_number + 1
    return f"ADM{new_number:03d}"



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

@app.post("/api/admin/bootstrap")
def bootstrap_admin(payload: AdminBootstrapRequest, db: Session = Depends(get_db)):
    existing_admin_count = db.query(Admin).count()
    if existing_admin_count > 0:
        raise HTTPException(status_code=403, detail="An admin account already exists. Bootstrap is disabled.")

    existing_mobile = db.query(Admin).filter(Admin.mobile_number == payload.mobile_number).first()
    if existing_mobile:
        raise HTTPException(status_code=400, detail="Mobile number already in use")

    new_admin_id = generate_admin_id(db)
    hashed_pw = hash_password(payload.password)

    new_admin = Admin(
        admin_id=new_admin_id,
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        password=hashed_pw,
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {"message": "Admin account created successfully", "admin_id": new_admin.admin_id}

@app.post("/api/admin/login")
def login_admin(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    login_id = payload.login_id
    if "@" in login_id:
        admin = db.query(Admin).filter(Admin.email == login_id).first()
    else:
        admin = db.query(Admin).filter(Admin.mobile_number == login_id).first()

    if not admin or not verify_password(payload.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid mobile number, email, or password")

    token = create_access_token({"admin_id": admin.admin_id, "role": "admin"})

    return {
        "token": token,
        "admin": {
            "admin_id": admin.admin_id,
            "full_name": admin.full_name,
            "mobile_number": admin.mobile_number,
            "email": admin.email,
        },
    }

@app.get("/api/admin/profile", response_model=AdminProfileResponse)
def get_admin_profile(current_admin: Admin = Depends(get_current_admin)):
    return current_admin


# ---------------- MODULE 6: DASHBOARD SUMMARY ----------------

@app.get("/api/admin/dashboard-summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_customers = db.query(Customer).count()
    total_categories = db.query(Category).count()
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.order_status == "Pending").count()
    delivered_orders = db.query(Order).filter(Order.order_status == "Delivered").count()

    total_revenue = db.query(sql_func.sum(Order.total_amount)).filter(
        Order.order_status != "Cancelled"
    ).scalar() or 0

    return {
        "total_customers": total_customers,
        "total_categories": total_categories,
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "total_revenue": round(float(total_revenue), 2),
    }


# ---------------- MODULE 6: CATEGORY MANAGEMENT ----------------

@app.get("/api/admin/categories", response_model=List[AdminCategoryResponse])
def admin_get_categories(current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    categories = db.query(Category).all()

    result = []
    for cat in categories:
        product_count = db.query(Product).filter(Product.category_id == cat.id).count()
        result.append({
            "id": cat.id,
            "category_name": cat.category_name,
            "category_image": cat.category_image,
            "status": cat.status,
            "product_count": product_count,
        })

    return result

@app.post("/api/admin/categories")
def admin_add_category(payload: AdminCategoryRequest, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    new_category = Category(
        category_name=payload.category_name,
        category_image=payload.category_image,
        status="active",
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return {"message": "Category added successfully", "id": new_category.id}

@app.put("/api/admin/categories/{category_id}")
def admin_update_category(category_id: int, payload: AdminCategoryRequest, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.category_name = payload.category_name
    category.category_image = payload.category_image
    db.commit()

    return {"message": "Category updated successfully"}

@app.delete("/api/admin/categories/{category_id}")
def admin_delete_category(category_id: int, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    product_count = db.query(Product).filter(Product.category_id == category_id).count()
    if product_count > 0:
        raise HTTPException(status_code=400, detail="Cannot delete category with existing products. Disable it instead.")

    db.delete(category)
    db.commit()

    return {"message": "Category deleted successfully"}

@app.put("/api/admin/categories/{category_id}/toggle-status")
def admin_toggle_category_status(category_id: int, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.status = "inactive" if category.status == "active" else "active"
    db.commit()

    return {"message": "Category status updated successfully", "status": category.status}


# ---------------- MODULE 6: PRODUCT MANAGEMENT ----------------

@app.get("/api/admin/products", response_model=List[AdminProductResponse])
def admin_get_products(current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    products = db.query(Product).all()

    result = []
    for product in products:
        image_list = []
        if product.images:
            try:
                image_list = json.loads(product.images)
            except (json.JSONDecodeError, TypeError):
                image_list = []
        result.append({
            "id": product.id,
            "category_id": product.category_id,
            "product_name": product.product_name,
            "description": product.description,
            "product_image": product.product_image,
            "images": image_list,
            "price": product.price,
            "stock": product.stock,
            "unit": product.unit,
            "status": product.status,
        })

    return result

@app.post("/api/admin/products")
def admin_add_product(payload: AdminProductRequest, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    new_product = Product(
        category_id=payload.category_id,
        product_name=payload.product_name,
        description=payload.description,
        product_image=payload.product_image,
        images=json.dumps(payload.images) if payload.images else None,
        price=payload.price,
        stock=payload.stock,
        unit=payload.unit,
        status="active",
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {"message": "Product added successfully", "id": new_product.id}

@app.put("/api/admin/products/{product_id}")
def admin_update_product(product_id: int, payload: AdminProductRequest, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    product.category_id = payload.category_id
    product.product_name = payload.product_name
    product.description = payload.description
    product.product_image = payload.product_image
    product.images = json.dumps(payload.images) if payload.images else None
    product.price = payload.price
    product.stock = payload.stock
    product.unit = payload.unit
    db.commit()

    return {"message": "Product updated successfully"}

@app.delete("/api/admin/products/{product_id}")
def admin_delete_product(product_id: int, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    order_item_count = db.query(OrderItem).filter(OrderItem.product_id == product_id).count()
    if order_item_count > 0:
        raise HTTPException(status_code=400, detail="Cannot delete a product that has existing orders. Disable it instead.")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}

@app.put("/api/admin/products/{product_id}/stock")
def admin_update_stock(product_id: int, payload: UpdateStockRequest, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if payload.stock < 0:
        raise HTTPException(status_code=400, detail="Stock cannot be negative")

    product.stock = payload.stock
    db.commit()

    return {"message": "Stock updated successfully", "stock": product.stock}

@app.put("/api/admin/products/{product_id}/toggle-status")
def admin_toggle_product_status(product_id: int, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.status = "inactive" if product.status == "active" else "active"
    db.commit()

    return {"message": "Product status updated successfully", "status": product.status}


# ---------------- MODULE 6: ORDER MANAGEMENT ----------------

@app.get("/api/admin/orders", response_model=List[AdminOrderListResponse])
def admin_get_orders(current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()

    result = []
    for order in orders:
        items = [
            {"product_name": item.product.product_name, "quantity": item.quantity, "price": item.price}
            for item in order.items
        ]
        result.append({
            "order_id": order.order_id,
            "customer_name": order.customer.full_name,
            "total_amount": order.total_amount,
            "payment_method": order.payment_method,
            "order_status": order.order_status,
            "created_at": order.created_at.strftime("%d %b %Y, %I:%M %p"),
            "items": items,
        })

    return result

@app.get("/api/admin/orders/{order_id}", response_model=AdminOrderDetailResponse)
def admin_get_order_details(order_id: str, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = [
        {"product_name": item.product.product_name, "quantity": item.quantity, "price": item.price}
        for item in order.items
    ]

    return {
        "order_id": order.order_id,
        "customer_name": order.customer.full_name,
        "customer_mobile": order.customer.mobile_number,
        "total_amount": order.total_amount,
        "payment_method": order.payment_method,
        "order_status": order.order_status,
        "created_at": order.created_at.strftime("%d %b %Y, %I:%M %p"),
        "delivery_partner_name": order.delivery_partner_name,
        "delivery_address": {
            "address": order.address.address,
            "village": order.address.village,
            "district": order.address.district,
            "state": order.address.state,
            "pincode": order.address.pincode,
        },
        "items": items,
    }

@app.put("/api/admin/orders/{order_id}/status")
def admin_update_order_status(order_id: str, payload: UpdateOrderStatusRequest, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    valid_statuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid order status")

    order.order_status = payload.status

    status_entry = OrderStatusHistory(order_id=order_id, status=payload.status)
    db.add(status_entry)

    db.commit()

    return {"message": "Order status updated successfully"}

@app.put("/api/admin/orders/{order_id}/assign-delivery")
def admin_assign_delivery(order_id: str, payload: AssignDeliveryRequest, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.delivery_partner_name = payload.delivery_partner_name
    db.commit()

    return {"message": "Delivery partner assigned successfully"}




@app.get("/api/admin/customers", response_model=List[AdminCustomerResponse])
def admin_get_customers(current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    customers = db.query(Customer).all()

    result = []
    for customer in customers:
        total_orders = db.query(Order).filter(Order.customer_id == customer.customer_id).count()
        result.append({
            "customer_id": customer.customer_id,
            "full_name": customer.full_name,
            "mobile_number": customer.mobile_number,
            "email": customer.email,
            "village": customer.village,
            "status": customer.status,
            "total_orders": total_orders,
        })

    return result

@app.put("/api/admin/customers/{customer_id}/toggle-status")
def admin_toggle_customer_status(customer_id: str, current_admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    customer.status = "inactive" if customer.status == "active" else "active"
    db.commit()

    return {"message": "Customer status updated successfully", "status":customer.status}
