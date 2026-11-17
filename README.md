# Village Fresh – Farm Products Delivery Platform

A full-stack, multi-role platform for ordering farm products online. Customers shop and track orders, admins manage products, orders and delivery assignment, and delivery partners update order status. Built module-by-module across eight development modules.

**Live demo:** https://farm-products-delivery-platform.vercel.app

## Features

**Customer**
- Browse the product catalog and manage a cart
- Checkout with address management
- Multi-step order status tracking timeline

**Admin**
- Dashboard to manage products and orders
- Assign orders to delivery partners

**Delivery Partner**
- Dedicated portal to update delivery status
- Status changes sync back to the customer's order tracker

**Security**
- Three independent authentication systems (Customer, Admin, Delivery Partner)
- Separate JWT contexts and dedicated dashboards per role
- Role-based access control

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React JS (Vite), Tailwind CSS |
| Backend | Python, FastAPI, Pydantic v2 |
| Database | MySQL, SQLAlchemy 2.0 |
| Auth | JWT, role-based access control |
| Deployment | Vercel (frontend), Render (backend), Aiven (MySQL) |

## Project Structure

```
farm-product-frontend/        React (Vite) application
farm-product-backend/         FastAPI application
farm-product-database/        Database scripts
farm-product-documentation/   Project documentation
```

## Author

**Vinothini R** | Full Stack Developer
[LinkedIn](https://www.linkedin.com/in/vinothini-ramakrishnan-111b8b333/) | vinothiniramkrishnan638@gmail.com
