# Village Fresh Farm Delivery Platform

A village-based e-commerce platform that connects local producers directly with local customers. The application supports roles for Customers, Administrators (owners), and last-mile Delivery Partners.

---

## Implemented Modules Summary Map

| Module                            | Key Features                                                         | Status        | Core Entry Points / File Paths                                                                                     |
| :-------------------------------- | :------------------------------------------------------------------- | :------------ | :----------------------------------------------------------------------------------------------------------------- |
| **Module 1: Authentication**       | Customer login/register, OTP verification, JWT auth                  | **Completed** | [main.py](../../farm-product-backend/app/main.py), [Login.jsx](../../farm-product-frontend/src/pages/Login.jsx)     |
| **Module 2: Product Catalog**      | Category listing, live search catalog, featured lists                | **Completed** | [CustomerDashboard.jsx](../../farm-product-frontend/src/pages/CustomerDashboard.jsx)                               |
| **Module 3: Shopping Cart**        | Stock checking, persistent quantity selector, price calculations     | **Completed** | [CartContext.jsx](../../farm-product-frontend/src/context/CartContext.jsx)                                         |
| **Module 4: Checkout & Orders**    | 8-field address validation, order code generation, stock deduction   | **Completed** | [Checkout.jsx](../../farm-product-frontend/src/pages/Checkout.jsx)                                                 |
| **Module 5: Customer Orders**      | 6-step progress timeline, cancellation, instant reordering           | **Completed** | [OrderDetailsPage.jsx](../../farm-product-frontend/src/pages/OrderDetailsPage.jsx)                                 |
| **Module 6: Admin Dashboard**      | Setup bootstrap locking, KPI stats counters, catalog controls        | **Completed** | [AdminDashboardHome.jsx](../../farm-product-frontend/src/pages/admin/AdminDashboardHome.jsx)                       |
| **Module 7: Delivery Management**  | Enable/disable partner status, modal assignment dropdown             | **Completed** | [AdminDeliveryManagement.jsx](../../farm-product-frontend/src/pages/admin/AdminDeliveryManagement.jsx)             |
| **Module 8: Order Fulfillment**    | Active assignments, "Picked Up" step sync, partner fallback details  | **Completed** | [main.py](../../farm-product-backend/app/main.py), [delivery/](../../farm-product-frontend/src/pages/delivery/)     |
| **Module 9: Reports & Analytics**  | Chart layout, sales metrics, Average delivery times                  | *Planned*     | [AdminReports.jsx](../../farm-product-frontend/src/pages/admin/AdminReports.jsx)                                   |
| **Module 10: In-App Alerts**       | Automated status update push alerts, message bells                   | *Planned*     | [NotificationContext.jsx](../../farm-product-frontend/src/context/NotificationContext.jsx)                         |

## Developer Prerequisites

| Dependency     | Required Version | Purpose / Stack Layer                                                |
| :------------- | :--------------- | :------------------------------------------------------------------- |
| **Python**     | 3.10+            | Backend server execution (FastAPI, SQLAlchemy, Uvicorn)              |
| **Node.js**    | 18.0+            | Frontend application compiler (Vite, React JS)                       |
| **npm**        | 9.0+             | Package manager handling React modules installations                 |
| **MySQL**      | 8.0+             | Schema database engine (Local database or Cloud Aiven cluster)       |

---

## Configuration (.env.example)

Create a `.env` file in the `farm-product-backend/` root directory to specify environment connections:

```env
DATABASE_URL=mysql+pymysql://root:password@127.0.0.1:3306/farm_delivery
SECRET_KEY=yoursecretjwtsecretkeyhere123!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

## Quick Start & How to Run

### Step 1: Clone or Open Project Folder
Make sure you are in the main project directory containing `farm-product-backend` and `farm-product-frontend` folders.

### Step 2: Set Up Database (MySQL)

Create a database named `farm_delivery` in your MySQL server:
```sql
CREATE DATABASE farm_delivery;
```

Import the schema and initial seed data from `farm-product-database/farm_delivery.sql` using either a GUI client (like MySQL Workbench, DBeaver) or directly from your terminal CLI:
```bash
mysql -u root -p farm_delivery < "farm-product-database/farm_delivery.sql"
```

#### Common Database Connection Troubleshooting
* **Error: `Access denied for user 'root'@'localhost'`**:
  * Check the password specified in your backend `.env` file matches your local MySQL root password.
* **Error: `Can't connect to MySQL server on '127.0.0.1'`**:
  * Verify the MySQL server service is active on your system. Run `services.msc` on Windows and start/restart the "MySQL" service.
  * Verify the server is running on the default port `3306`. If using a different port, update the `DATABASE_URL` in `.env` accordingly.

### Step 3: Set Up and Run Backend
```bash
cd farm-product-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Step 4: Set Up and Run Frontend
```bash
cd farm-product-frontend
npm install
npm run dev
```

---

## Test Credentials (Constant Roles)
* **System Admin**: Mobile `8888888888` / Password `adminpassword123`
* **Test Customer**: Mobile `9876543210` / Password `test1234`
* **Delivery Partner**: Mobile `7000000001` / Password `delivery123`

---

## Seed Data Import Verification

Run the following test queries in your MySQL console to verify that the schema seeds imported successfully:

```sql
-- 1. Check if product categories are populated
SELECT category_name, status FROM categories;

-- 2. Verify admin bootstrap credentials
SELECT full_name, mobile_number, email FROM admins WHERE mobile_number = '8888888888';

-- 3. Verify loaded test customer credentials
SELECT full_name, mobile_number, email FROM customers WHERE mobile_number = '9876543210';
```

---

## Documentation Contents

All project documents are located in this folder:
* [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md): Detailed 17-section explanation of modules, folder structures, and deployment.
* [API_DOCUMENTATION.md](API_DOCUMENTATION.md): Complete list of REST APIs.
* [er_diagram.png](er_diagram.png): Visual entity-relationship database diagram.
* [system_flow_diagram.png](system_flow_diagram.png): Visual workflow sequence diagram.
