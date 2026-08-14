CREATE DATABASE IF NOT EXISTS farm_delivery;
USE farm_delivery;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_image VARCHAR(255),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    product_image VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    unit ENUM('Kg', 'Litre', 'Piece') NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (category_id) REFERENCES categories(id)
);


INSERT INTO categories (id, category_name, category_image, status) VALUES
(1, 'Milk & Dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300', 'active'),
(2, 'Goat Farm', 'https://images.unsplash.com/photo-1524024412-3e1209782377?auto=format&fit=crop&q=80&w=300', 'active'),
(3, 'Chicken Farm', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=300', 'active'),
(4, 'Eggs', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=300', 'active'),
(5, 'Fresh Water Fish', 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=300', 'active'),
(6, 'Sea Fish', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=300', 'active'),
(7, 'Fresh Water Prawn', 'https://images.unsplash.com/photo-1559737753-5d9059e3542a?auto=format&fit=crop&q=80&w=300', 'active'),
(8, 'Sea Prawn', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=300', 'active'),
(9, 'Crab', 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=300', 'active'),
(10, 'Meat', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=300', 'active')
ON DUPLICATE KEY UPDATE category_name=VALUES(category_name), category_image=VALUES(category_image);


INSERT INTO products (category_id, product_name, description, product_image, price, stock, unit, is_featured, is_popular, status) VALUES
(1, 'Fresh Cow Milk', 'Pure organic fresh cow milk from local village cows', '', 45.00, 100, 'Litre', TRUE, TRUE, 'active'),
(1, 'Goat Milk', 'Fresh raw goat milk, easy to digest and highly nutritious', '', 80.00, 50, 'Litre', TRUE, FALSE, 'active'),
(2, 'Goat Meat', 'Tender and fresh goat meat cut clean', '', 750.00, 20, 'Kg', FALSE, TRUE, 'active'),
(3, 'Country Chicken', 'Free-range healthy country chicken', '', 350.00, 30, 'Kg', TRUE, TRUE, 'active'),
(4, 'Country Eggs', 'Nutritious brown eggs from free-range country chickens', '', 8.00, 200, 'Piece', TRUE, FALSE, 'active'),
(5, 'Fresh Water Fish (Rohu)', 'Freshly caught river Rohu fish', '', 180.00, 15, 'Kg', FALSE, TRUE, 'active'),
(6, 'Sea Fish (Sardine)', 'Fresh sea sardine fish rich in Omega-3', '', 120.00, 40, 'Kg', FALSE, FALSE, 'active'),
(7, 'Fresh Water Prawn', 'Jumbo prawns caught from local freshwater lakes', '', 450.00, 25, 'Kg', TRUE, TRUE, 'active'),
(8, 'Sea Prawn', 'Fresh tiger sea prawns clean and whole', '', 550.00, 15, 'Kg', FALSE, FALSE, 'active'),
(9, 'Mud Crab', 'Large fresh mud crabs caught daily', '', 600.00, 10, 'Piece', FALSE, TRUE, 'active');


ALTER TABLE products ADD COLUMN images TEXT;

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_customer_product (customer_id, product_id)
);

CREATE TABLE IF NOT EXISTS customer_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL,
    address VARCHAR(255) NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    landmark VARCHAR(150),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    address_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('COD', 'ONLINE') NOT NULL,
    order_status ENUM('Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (address_id) REFERENCES customer_addresses(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE IF NOT EXISTS order_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(10) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ADD COLUMN delivery_partner_name VARCHAR(100) NULL;

ALTER TABLE customers ADD COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
CREATE TABLE IF NOT EXISTS delivery_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    delivery_partner_id INT NOT NULL,
    delivery_status ENUM('Assigned', 'Accepted', 'Picked Up', 'Out for Delivery', 'Delivered') NOT NULL DEFAULT 'Assigned',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (delivery_partner_id) REFERENCES delivery_partners(id)
);
ALTER TABLE orders ADD COLUMN estimated_delivery_time VARCHAR(100) NULL;

ALTER TABLE orders MODIFY COLUMN order_status
    ENUM('Pending','Confirmed','Preparing','Picked Up','Out for Delivery','Delivered','Cancelled')
    NOT NULL DEFAULT 'Pending';

ALTER TABLE order_status_history MODIFY COLUMN status
    ENUM('Pending','Confirmed','Preparing','Picked Up','Out for Delivery','Delivered','Cancelled')
    NOT NULL;
