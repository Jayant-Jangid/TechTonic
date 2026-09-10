-- ==========================================================
-- KisanSetu Production Relational MySQL Database Schema
-- Version: 2.0 (Relational Architecture with Foreign Keys)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS kisansetu
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kisansetu;

-- 1. Users Table (Farmers, Wholesale Consumers, Logistics Drivers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    role ENUM('farmer', 'consumer', 'driver') NOT NULL,
    name VARCHAR(128) NOT NULL,
    hindi_name VARCHAR(128),
    email VARCHAR(191) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    govt_id VARCHAR(64),
    enam_id VARCHAR(64),
    location VARCHAR(255),
    coordinates VARCHAR(64),
    land_holding VARCHAR(128),
    buyer_type VARCHAR(128),
    vehicle_type VARCHAR(128),
    vehicle_no VARCHAR(64),
    upi_id VARCHAR(128),
    operational_status VARCHAR(32) DEFAULT 'active',
    operational_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_phone (phone),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. OTP Verifications Table (Live Mobile Registration Verification)
CREATE TABLE IF NOT EXISTS otp_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_phone (phone),
    INDEX idx_otp_code (otp_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Crops Listing Table (Relational link to Farmer)
CREATE TABLE IF NOT EXISTS crops (
    id VARCHAR(64) PRIMARY KEY,
    farmer_id VARCHAR(64) NOT NULL,
    farmer_name VARCHAR(128) NOT NULL,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(32) NOT NULL DEFAULT 'Quintal',
    price_per_unit DECIMAL(12, 2) NOT NULL,
    mandi_price DECIMAL(12, 2) NOT NULL,
    msp_price DECIMAL(12, 2) NOT NULL,
    is_organic BOOLEAN DEFAULT FALSE,
    organic_cert_no VARCHAR(64),
    harvest_days_ago INT DEFAULT 0,
    harvest_date DATE,
    freshness_index DECIMAL(5, 2) DEFAULT 95.0,
    grade VARCHAR(16) DEFAULT 'A',
    grade_label VARCHAR(64),
    quality_specs JSON,
    farm_location VARCHAR(255),
    delivery_radius_km INT DEFAULT 150,
    image_url TEXT,
    description TEXT,
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_crop_category (category),
    INDEX idx_crop_farmer (farmer_id),
    INDEX idx_crop_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Orders & Contracts Table (Relational link to Crops, Buyer, Farmer, Driver)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    crop_id VARCHAR(64) NOT NULL,
    crop_name VARCHAR(128) NOT NULL,
    farmer_id VARCHAR(64) NOT NULL,
    farmer_name VARCHAR(128) NOT NULL,
    buyer_id VARCHAR(64) NOT NULL,
    buyer_name VARCHAR(128) NOT NULL,
    buyer_phone VARCHAR(20),
    buyer_type VARCHAR(128),
    delivery_address TEXT,
    distance_km DECIMAL(8, 2) DEFAULT 50.0,
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(32) NOT NULL DEFAULT 'Quintal',
    listed_price DECIMAL(12, 2) NOT NULL,
    offered_price DECIMAL(12, 2) NOT NULL,
    counter_price DECIMAL(12, 2),
    subtotal DECIMAL(12, 2) NOT NULL,
    mandi_cess DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    platform_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    freight_charge DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_mode VARCHAR(64) DEFAULT 'UPI / Mandi Escrow',
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    assigned_driver_id VARCHAR(64),
    notes TEXT,
    review_rating DECIMAL(3, 1),
    review_text TEXT,
    review_tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE RESTRICT,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_order_buyer (buyer_id),
    INDEX idx_order_farmer (farmer_id),
    INDEX idx_order_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Multi-Round Counter-Offer Negotiations Table
CREATE TABLE IF NOT EXISTS negotiations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    proposed_by_role ENUM('farmer', 'consumer') NOT NULL,
    proposed_by_id VARCHAR(64) NOT NULL,
    proposed_by_name VARCHAR(128),
    proposed_price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    action ENUM('counter', 'accept', 'decline') DEFAULT 'counter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (proposed_by_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_negotiation_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Driver Logistics & Fleet Table
CREATE TABLE IF NOT EXISTS driver_profiles (
    driver_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(20),
    license_no VARCHAR(64),
    vehicle_no VARCHAR(64),
    vehicle_type VARCHAR(128),
    max_capacity_tons DECIMAL(6, 2) DEFAULT 10.0,
    booked_capacity_tons DECIMAL(6, 2) DEFAULT 0.0,
    base_per_km DECIMAL(6, 2) DEFAULT 28.0,
    per_quintal DECIMAL(6, 2) DEFAULT 16.0,
    assigned_route JSON,
    available_loads JSON,
    stats JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Notifications & Alerts Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    role VARCHAR(32) NOT NULL,
    user_id VARCHAR(64),
    type VARCHAR(32) NOT NULL,
    title VARCHAR(191) NOT NULL,
    message TEXT NOT NULL,
    metadata JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_role (role),
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Escrow Ledger Transactions Table
CREATE TABLE IF NOT EXISTS escrow_transactions (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    payer_id VARCHAR(64) NOT NULL,
    payee_id VARCHAR(64) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    mandi_cess DECIMAL(12, 2) NOT NULL,
    platform_fee DECIMAL(12, 2) NOT NULL,
    freight_charge DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('locked_in_escrow', 'released_to_farmer', 'refunded_to_buyer') DEFAULT 'locked_in_escrow',
    upi_ref VARCHAR(128),
    released_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (payee_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

