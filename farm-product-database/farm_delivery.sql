CREATE DATABASE farm_delivery;
USE farm_delivery;
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);