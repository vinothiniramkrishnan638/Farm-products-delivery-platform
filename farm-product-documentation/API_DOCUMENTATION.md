# Village Fresh Farm Delivery Platform - API Documentation

All routes use JWT-based token authentication scoping users by their roles: `Customer`, `Admin`, or `Delivery Partner`.

---

## 1. Customer APIs

### Authentication & Profile
* **`POST /api/customer/register`**
  * *Auth*: Public
  * *Description*: Registers a customer record. Auto-generates unique `CUS001` ID.
* **`POST /api/customer/login`**
  * *Auth*: Public
  * *Description*: Authenticates customer via Mobile + Password/OTP. Returns role-scoped JWT.
* **`POST /api/customer/send-otp`**
  * *Auth*: Public
  * *Description*: Generates a mockup OTP returned in the API response for testing.
* **`POST /api/customer/verify-otp`**
  * *Auth*: Public
  * *Description*: Confirms verification code and returns JWT on success.
* **`POST /api/customer/forgot-password`**
  * *Auth*: Public
  * *Description*: Sends inline mockup password reset code in the JSON payload.
* **`GET /api/customer/profile`**
  * *Auth*: Customer JWT
  * *Description*: Returns profile metadata for the authenticated customer account.

### Shop & Cart Catalog
* **`GET /api/categories`**
  * *Auth*: Customer JWT
  * *Description*: Returns categories list along with the counts of active products.
* **`GET /api/categories/{category_id}/products`**
  * *Auth*: Customer JWT
  * *Description*: Returns all active products under a specific category.
* **`GET /api/products/featured`**
  * *Auth*: Customer JWT
  * *Description*: Retrieves featured products.
* **`GET /api/products/popular`**
  * *Auth*: Customer JWT
  * *Description*: Retrieves popular products.
* **`GET /api/products/search?q=`**
  * *Auth*: Customer JWT
  * *Description*: Filters product names and categories by keyword query.
* **`GET /api/products/{product_id}`**
  * *Auth*: Customer JWT
  * *Description*: Returns details, category names, and images array for a single product.
* **`GET /api/cart`**
  * *Auth*: Customer JWT
  * *Description*: Retrieves list of items in the customer's shopping cart.
* **`POST /api/cart`**
  * *Auth*: Customer JWT
  * *Description*: Adds a product item or increments quantity inside the database cart.
* **`PUT /api/cart/{cart_id}`**
  * *Auth*: Customer JWT
  * *Description*: Updates item quantity in the cart.
* **`DELETE /api/cart/{cart_id}`**
  * *Auth*: Customer JWT
  * *Description*: Deletes item row from the database cart.

### Addresses & Checkout Orders
* **`GET /api/addresses`**
  * *Auth*: Customer JWT
  * *Description*: Retrieves list of shipping addresses saved for the customer.
* **`POST /api/addresses`**
  * *Auth*: Customer JWT
  * *Description*: Adds shipping address. Automatically defaults if it is the first address.
* **`PUT /api/addresses/{address_id}`**
  * *Auth*: Customer JWT
  * *Description*: Modifies address fields, enforcing a single default choice.
* **`DELETE /api/addresses/{address_id}`**
  * *Auth*: Customer JWT
  * *Description*: Deletes address card. Enforces defaults swap if necessary.
* **`POST /api/orders`**
  * *Auth*: Customer JWT
  * *Description*: Places order from cart list, validates stock limits, and empties cart.
* **`GET /api/orders/{order_id}`**
  * *Auth*: Customer JWT
  * *Description*: Returns full order details with product photos and shipping metrics.
* **`GET /api/my-orders`**
  * *Auth*: Customer JWT
  * *Description*: Returns active customer orders newest first.
* **`GET /api/order-history`**
  * *Auth*: Customer JWT
  * *Description*: Returns completed historical customer orders list (status `"Delivered"` or `"Cancelled"`).
* **`GET /api/orders/{order_id}/track`**
  * *Auth*: Customer JWT
  * *Description*: Returns timeline logs tracking order status.
* **`POST /api/orders/{order_id}/cancel`**
  * *Auth*: Customer JWT
  * *Description*: Cancels order inside the database if the status is still `"Pending"`.
* **`POST /api/orders/{order_id}/reorder`**
  * *Auth*: Customer JWT
  * *Description*: Adds all items from a completed history order back into the active cart.
* **`GET /api/notifications`**
  * *Auth*: Customer JWT
  * *Description*: Retrieves all planned in-app notifications for the customer.
* **`PUT /api/notifications/{notification_id}/read`**
  * *Auth*: Customer JWT
  * *Description*: Marks an active notification alert as read.

---

## 2. Admin APIs

* **`POST /api/admin/setup/create-first-admin`**
  * *Auth*: Secret Setup Key
  * *Description*: Bootstraps first system admin profile, self-locks on completion.
* **`POST /api/admin/login`**
  * *Auth*: Public
  * *Description*: Signs in admin and issues role-scoped JWT.
* **`GET /api/admin/profile`**
  * *Auth*: Admin JWT
  * *Description*: Fetches credentials metadata.
* **`GET /api/admin/dashboard-summary`**
  * *Auth*: Admin JWT
  * *Description*: Returns counters for orders, customers, delivery partners, and total earnings.
* **`GET /api/admin/orders`**
  * *Auth*: Admin JWT
  * *Description*: Returns all database orders for monitoring.
* **`GET /api/admin/orders/{order_id}`**
  * *Auth*: Admin JWT
  * *Description*: Full order details lookup.
* **`PUT /api/admin/orders/{order_id}/status`**
  * *Auth*: Admin JWT
  * *Description*: Transitions order status state.
* **`PUT /api/admin/orders/{order_id}/assign-delivery`**
  * *Auth*: Admin JWT
  * *Description*: Assigns a delivery partner.
* **`PUT /api/admin/orders/{order_id}/estimated-delivery`**
  * *Auth*: Admin JWT
  * *Description*: Sets and saves the free-text Estimated Delivery Time (ETA).
* **`POST /api/admin/orders/{order_id}/cancel`**
  * *Auth*: Admin JWT
  * *Description*: Cancels order and deletes delivery assignments.
* **`GET /api/admin/customers`**
  * *Auth*: Admin JWT
  * *Description*: Returns customers list with live order count stats.
* **`PUT /api/admin/customers/{customer_id}/toggle-status`**
  * *Auth*: Admin JWT
  * *Description*: Enforces account suspension (Enable/Disable).
* **`GET /api/admin/delivery-partners`**
  * *Auth*: Admin JWT
  * *Description*: Lists registered partners.
* **`POST /api/admin/delivery-partners`**
  * *Auth*: Admin JWT
  * *Description*: Registers new partner account.
* **`PUT /api/admin/delivery-partners/{partner_id}`**
  * *Auth*: Admin JWT
  * *Description*: Updates details for a partner.
* **`PUT /api/admin/delivery-partners/{partner_id}/toggle-status`**
  * *Auth*: Admin JWT
  * *Description*: Enforces partner account suspension (Enable/Disable).
* **`GET /api/admin/reports/sales`**
  * *Auth*: Admin JWT
  * *Description*: Fetches planned sales and earnings reports for dashboard charting.
* **`GET /api/admin/reports/delivery-performance`**
  * *Auth*: Admin JWT
  * *Description*: Fetches planned average fulfillment time analytics per delivery partner.

---

## 3. Delivery Partner APIs

* **`POST /api/delivery/login`**
  * *Auth*: Public
  * *Description*: Signs in delivery partner and issues role-scoped JWT.
* **`GET /api/delivery/profile`**
  * *Auth*: Partner JWT
  * *Description*: Fetches partner account metadata.
* **`GET /api/delivery/dashboard-summary`**
  * *Auth*: Partner JWT
  * *Description*: Returns metrics of assignments.
* **`GET /api/delivery/assigned-orders`**
  * *Auth*: Partner JWT
  * *Description*: Lists current active orders assigned to the partner.
* **`PUT /api/delivery/assignments/{assignment_id}/status`**
  * *Auth*: Partner JWT
  * *Description*: Transitions delivery status (Accepted, Picked Up, Out for Delivery, Delivered).
* **`GET /api/delivery/orders/{order_id}`**
  * *Auth*: Partner JWT
  * *Description*: Returns order details for an active assignment.
* **`GET /api/delivery/history`**
  * *Auth*: Partner JWT
  * *Description*: Returns completed historical deliveries list.

---

## 4. Roadmap API Request/Response Schemas (Pydantic Models)

To support the implementation of Module 9 (Reports) and Module 10 (Alerts), the API will utilize the following structured JSON schemas:

### Module 9 - Reports & Analytics
* **`SalesSummaryResponse`**
  ```json
  {
    "start_date": "2026-08-01",
    "end_date": "2026-08-18",
    "total_revenue": 12450.50,
    "completed_orders_count": 87,
    "average_order_value": 143.10
  }
  ```
* **`DeliveryPerformanceResponse`**
  ```json
  {
    "partner_id": 1,
    "partner_name": "Vinoth Delivery",
    "total_deliveries": 32,
    "average_delivery_time_minutes": 45.5
  }
  ```

### Module 10 - Order Notifications
* **`NotificationCreateRequest`**
  ```json
  {
    "customer_id": 5,
    "order_id": 12,
    "title": "Order Picked Up",
    "message": "Your fresh products have been picked up from the Farm Shop by our delivery partner."
  }
  ```
* **`NotificationResponse`**
  ```json
  {
    "notification_id": 101,
    "customer_id": 5,
    "order_id": 12,
    "title": "Order Picked Up",
    "message": "Your fresh products have been picked up from the Farm Shop by our delivery partner.",
    "status": "unread",
    "sent_at": "2026-08-18T10:14:00Z"
  }
  ```

---

## 5. Standard API Error Codes Catalog

All APIs return a structured JSON response on failure to assist client-side rendering. Below is the list of standard error codes:

| HTTP Status | Error Type / Detail Code | Description / Trigger Rules                                                                     |
| :---------- | :----------------------- | :---------------------------------------------------------------------------------------------- |
| **`400`**   | `BAD_REQUEST`            | Request body validation failed, missing addresses, or empty checkout carts.                      |
| **`400`**   | `INSUFFICIENT_STOCK`     | Triggered during checkout if product quantity exceeds available `stock_quantity` limits.        |
| **`401`**   | `UNAUTHORIZED`           | Missing token, invalid signature, or expired JWT authorization token.                           |
| **`403`**   | `FORBIDDEN`              | Secondary Admin bootstrap attempt, account suspended, or user role mismatch.                    |
| **`404`**   | `NOT_FOUND`              | Requested order, product, category, customer address, or notification record does not exist.    |
| **`500`**   | `INTERNAL_SERVER_ERROR`  | Database connection failure or unhandled exception during backend routing execution.            |

---

## 6. CORS Middleware Configuration

To allow secure cross-origin resource sharing between the backend API service (listening on `127.0.0.1:8000`) and the React web application running in client browsers (listening on `127.0.0.1:5173` or `localhost:5173`), the FastAPI backend has configured CORS middleware.

* **Allowed Origins**: `http://localhost:5173`, `http://127.0.0.1:8000`
* **Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` headers.
* **Allowed Headers**: All standard headers, including `Content-Type`, `Authorization`, and `Access-Control-Allow-Credentials`.
