from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, text

from app.database import Base, engine, get_db
from app.models import Customer, Category, Product
from app.schemas import (
    CustomerRegister, CustomerLogin, SendOtpRequest, VerifyOtpRequest,
    CustomerProfile, ForgotPasswordRequest, CategoryResponse, ProductResponse,
    CategoryProductsResponse,
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

# Auto-migrate & Seed: Add is_popular column and seed categories/products if empty
import threading
def run_migration():
    try:
        import time
        time.sleep(2)
        with engine.begin() as conn:
            conn.execute(text("SET lock_wait_timeout = 2;"))
            try:
                conn.execute(text("ALTER TABLE products ADD COLUMN is_popular BOOLEAN NOT NULL DEFAULT FALSE;"))
            except Exception:
                pass
        
        # Seed categories & products
        from sqlalchemy.orm import sessionmaker
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        try:
            empty_images = db.query(Product).filter(Product.product_image == None).count()
            empty_images += db.query(Product).filter(Product.product_image == "").count()
            
            old_categories = db.query(Category).filter(
                or_(
                    Category.category_image.like("%1603048588665%"),
                    Category.category_image.like("%1516467508483%")
                )
            ).count()
            
            old_products = db.query(Product).filter(Product.product_image.like("%1527018601619%")).count()
            
            if db.query(Category).count() == 0 or empty_images > 0 or old_categories > 0 or old_products > 0:
                db.query(Product).delete()
                db.query(Category).delete()
                db.commit()

                categories = [
                    Category(id=1, category_name="Milk & Dairy", category_image="https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=300"),
                    Category(id=2, category_name="Goat Farm", category_image="https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80&w=300"),
                    Category(id=3, category_name="Chicken Farm", category_image="https://images.unsplash.com/photo-1548550022-c1cf126d4d3e?auto=format&fit=crop&q=80&w=300"),
                    Category(id=4, category_name="Eggs", category_image="https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=300"),
                    Category(id=5, category_name="Fresh Water Fish", category_image="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=300"),
                    Category(id=6, category_name="Sea Fish", category_image="https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=300"),
                    Category(id=7, category_name="Fresh Water Prawn", category_image="https://images.unsplash.com/photo-1559737753-5d9059e3542a?auto=format&fit=crop&q=80&w=300"),
                    Category(id=8, category_name="Sea Prawn", category_image="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=300"),
                    Category(id=9, category_name="Crab", category_image="https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=300"),
                    Category(id=10, category_name="Meat", category_image="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=300")
                ]
                db.bulk_save_objects(categories)
                db.commit()

                products = [
                    Product(category_id=1, product_name="Fresh Cow Milk", description="Pure organic fresh cow milk from local village cows", product_image="https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=300", price=45.00, stock=100, unit="Litre", is_featured=True, is_popular=True),
                    Product(category_id=1, product_name="Goat Milk", description="Fresh raw goat milk, easy to digest and highly nutritious", product_image="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=300", price=80.00, stock=50, unit="Litre", is_featured=True, is_popular=False),
                    Product(category_id=2, product_name="Goat Meat", description="Tender and fresh goat meat cut clean", product_image="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=300", price=750.00, stock=20, unit="Kg", is_featured=False, is_popular=True),
                    Product(category_id=3, product_name="Country Chicken", description="Free-range healthy country chicken", product_image="https://images.unsplash.com/photo-1587593817642-5999cd15279f?auto=format&fit=crop&q=80&w=300", price=350.00, stock=30, unit="Kg", is_featured=True, is_popular=True),
                    Product(category_id=4, product_name="Country Eggs", description="Nutritious brown eggs from free-range country chickens", product_image="https://images.unsplash.com/photo-1516448424440-9dbca97779c1?auto=format&fit=crop&q=80&w=300", price=8.00, stock=200, unit="Piece", is_featured=True, is_popular=False),
                    Product(category_id=5, product_name="Fresh Water Fish (Rohu)", description="Freshly caught river Rohu fish", product_image="https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=300", price=180.00, stock=15, unit="Kg", is_featured=False, is_popular=True),
                    Product(category_id=6, product_name="Sea Fish (Sardine)", description="Fresh sea sardine fish rich in Omega-3", product_image="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=300", price=120.00, stock=40, unit="Kg", is_featured=False, is_popular=False),
                    Product(category_id=7, product_name="Fresh Water Prawn", description="Jumbo prawns caught from local freshwater lakes", product_image="https://images.unsplash.com/photo-1559737753-5d9059e3542a?auto=format&fit=crop&q=80&w=300", price=450.00, stock=25, unit="Kg", is_featured=True, is_popular=True),
                    Product(category_id=8, product_name="Sea Prawn", description="Fresh tiger sea prawns clean and whole", product_image="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=300", price=550.00, stock=15, unit="Kg", is_featured=False, is_popular=False),
                    Product(category_id=9, product_name="Mud Crab", description="Large fresh mud crabs caught daily", product_image="https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=300", price=600.00, stock=10, unit="Piece", is_featured=False, is_popular=True)
                ]
                db.bulk_save_objects(products)
                db.commit()
        except Exception as ex:
            db.rollback()
            print(f"Seed error: {ex}")
        finally:
            db.close()
    except Exception as e:
        print(f"Migration note: {e}")

threading.Thread(target=run_migration, daemon=True).start()

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



@app.get("/api/categories", response_model=list[CategoryResponse])
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

@app.get("/api/products/featured", response_model=list[ProductResponse])
def get_featured_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.is_featured == True,
        Product.status == "active"
    ).all()
    return products

@app.get("/api/products/popular", response_model=list[ProductResponse])
def get_popular_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.is_popular == True,
        Product.status == "active"
    ).all()
    return products

@app.get("/api/products/search", response_model=list[ProductResponse])
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

@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.status == "active").first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product