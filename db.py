#!/usr/bin/env python3
"""
KisanSetu Production Relational Database Layer
Supports MySQL Relational Engine (via pymysql / mysql.connector) with persistent SQLite fallback.
Handles Users, OTP Verifications, Crops, Orders, Multi-Round Counter-Offers, Driver Profiles, and Audited Pricing.
"""
import os
import sys
import json
import random
import hashlib
from datetime import datetime, timedelta

DB_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_PATH = os.environ.get('SQLITE_PATH', os.path.join(DB_DIR, 'kisansetu.db'))

# MySQL Config from Environment
MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'kisansetu')

ACTIVE_ENGINE = 'sqlite3'
_mysql_driver = None

# Attempt to discover MySQL driver
for mod_name in ['pymysql', 'mysql.connector', 'MySQLdb']:
    try:
        _mysql_driver = __import__(mod_name)
        break
    except ImportError:
        pass

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def get_active_engine():
    global ACTIVE_ENGINE
    return ACTIVE_ENGINE

class DictRow(dict):
    """Row adapter allowing both dict access and tuple index access."""
    def __init__(self, cursor, row):
        super().__init__()
        for idx, col in enumerate(cursor.description):
            self[col[0]] = row[idx]

def get_mysql_conn():
    if not _mysql_driver:
        return None
    try:
        if _mysql_driver.__name__ == 'pymysql':
            conn = _mysql_driver.connect(
                host=MYSQL_HOST,
                port=MYSQL_PORT,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD,
                charset='utf8mb4',
                cursorclass=_mysql_driver.cursors.DictCursor
            )
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DATABASE}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            cursor.execute(f"USE `{MYSQL_DATABASE}`")
            return conn
        elif _mysql_driver.__name__ == 'mysql.connector':
            conn = _mysql_driver.connect(
                host=MYSQL_HOST,
                port=MYSQL_PORT,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD
            )
            cursor = conn.cursor(dictionary=True)
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DATABASE}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            cursor.execute(f"USE `{MYSQL_DATABASE}`")
            return conn
    except Exception as e:
        return None
    return None

def get_db():
    global ACTIVE_ENGINE
    # First test if MySQL is available and working
    if _mysql_driver:
        mysql_conn = get_mysql_conn()
        if mysql_conn:
            ACTIVE_ENGINE = 'mysql'
            return mysql_conn

    # Fallback to persistent SQLite
    ACTIVE_ENGINE = 'sqlite3'
    import sqlite3
    conn = sqlite3.connect(SQLITE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def calculate_pricing(subtotal: float, distance_km: float = 50.0):
    """
    Standardized, audited mathematical pricing calculation for KisanSetu:
    - subtotal = quantity * unit_price
    - mandi_cess = 1.5% statutory APMC market fee
    - platform_fee = 1.0% escrow & tech protection fee (min Rs 20)
    - freight_charge = Rs 450 flat local agro-corridor logistics tariff (Rs 0 if cart empty)
    - grand_total = subtotal + mandi_cess + platform_fee + freight_charge
    - savings = 15.0% estimated saving over traditional 3-tier APMC middleman brokerage
    """
    try:
        subtotal = round(float(subtotal), 2)
    except (ValueError, TypeError):
        subtotal = 0.0

    if subtotal <= 0:
        return {
            'subtotal': 0.0,
            'mandiCess': 0.0,
            'mandi_cess': 0.0,
            'platformFee': 0.0,
            'platform_fee': 0.0,
            'freightCharge': 0.0,
            'freight_charge': 0.0,
            'grandTotal': 0.0,
            'grand_total': 0.0,
            'savings': 0.0,
            'retail_savings': 0.0,
            'retailSavings': 0.0
        }

    mandi_cess = round(subtotal * 0.015, 2)
    platform_fee = max(20.0, round(subtotal * 0.010, 2))
    freight_charge = 450.0
    grand_total = round(subtotal + mandi_cess + platform_fee + freight_charge, 2)
    savings = round(subtotal * 0.15, 2)

    return {
        'subtotal': subtotal,
        'mandiCess': mandi_cess,
        'mandi_cess': mandi_cess,
        'platformFee': platform_fee,
        'platform_fee': platform_fee,
        'freightCharge': freight_charge,
        'freight_charge': freight_charge,
        'grandTotal': grand_total,
        'grand_total': grand_total,
        'savings': savings,
        'retail_savings': savings,
        'retailSavings': savings
    }

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    if ACTIVE_ENGINE == 'mysql':
        # Execute mysql_schema.sql
        schema_path = os.path.join(DB_DIR, 'mysql_schema.sql')
        if os.path.exists(schema_path):
            with open(schema_path, 'r', encoding='utf-8') as f:
                schema_sql = f.read()
            for statement in schema_sql.split(';'):
                stmt = statement.strip()
                if stmt and not stmt.startswith('--'):
                    try:
                        cursor.execute(stmt)
                    except Exception:
                        pass
        conn.commit()
    else:
        # SQLite relational setup
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            role TEXT NOT NULL, -- 'farmer', 'consumer', 'driver'
            name TEXT NOT NULL,
            hindi_name TEXT,
            email TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            govt_id TEXT,
            enam_id TEXT,
            location TEXT,
            coordinates TEXT,
            land_holding TEXT,
            buyer_type TEXT,
            vehicle_type TEXT,
            vehicle_no TEXT,
            upi_id TEXT,
            operational_status TEXT DEFAULT 'active',
            operational_data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS otp_verifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT NOT NULL,
            otp_code TEXT NOT NULL,
            verified INTEGER DEFAULT 0,
            attempts INTEGER DEFAULT 0,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS crops (
            id TEXT PRIMARY KEY,
            farmer_id TEXT NOT NULL,
            farmer_name TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            quantity REAL NOT NULL,
            unit TEXT NOT NULL DEFAULT 'Quintal',
            price_per_unit REAL NOT NULL,
            mandi_price REAL NOT NULL,
            msp_price REAL NOT NULL,
            is_organic INTEGER DEFAULT 0,
            organic_cert_no TEXT,
            harvest_days_ago INTEGER DEFAULT 0,
            harvest_date TEXT,
            freshness_index REAL DEFAULT 95.0,
            grade TEXT DEFAULT 'A',
            grade_label TEXT,
            quality_specs TEXT,
            farm_location TEXT,
            delivery_radius_km INTEGER DEFAULT 150,
            image_url TEXT,
            description TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            crop_id TEXT NOT NULL,
            crop_name TEXT NOT NULL,
            farmer_id TEXT NOT NULL,
            farmer_name TEXT NOT NULL,
            buyer_id TEXT NOT NULL,
            buyer_name TEXT NOT NULL,
            buyer_phone TEXT,
            buyer_type TEXT,
            delivery_address TEXT,
            distance_km REAL DEFAULT 50.0,
            quantity REAL NOT NULL,
            unit TEXT NOT NULL DEFAULT 'Quintal',
            listed_price REAL NOT NULL,
            offered_price REAL NOT NULL,
            counter_price REAL,
            subtotal REAL NOT NULL,
            mandi_cess REAL DEFAULT 0.0,
            platform_fee REAL DEFAULT 0.0,
            freight_charge REAL DEFAULT 0.0,
            total_amount REAL NOT NULL,
            payment_mode TEXT DEFAULT 'UPI / Mandi Escrow',
            status TEXT DEFAULT 'pending',
            assigned_driver_id TEXT,
            notes TEXT,
            review_rating REAL,
            review_text TEXT,
            review_tags TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE RESTRICT,
            FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE RESTRICT,
            FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS negotiations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            proposed_by_role TEXT NOT NULL,
            proposed_by_id TEXT NOT NULL,
            proposed_by_name TEXT,
            proposed_price REAL NOT NULL,
            original_price REAL NOT NULL,
            quantity REAL NOT NULL,
            notes TEXT,
            action TEXT DEFAULT 'counter',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS driver_profiles (
            driver_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT,
            license_no TEXT,
            vehicle_no TEXT,
            vehicle_type TEXT,
            max_capacity_tons REAL DEFAULT 10.0,
            booked_capacity_tons REAL DEFAULT 0.0,
            base_per_km REAL DEFAULT 28.0,
            per_quintal REAL DEFAULT 16.0,
            assigned_route TEXT,
            available_loads TEXT,
            stats TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
        )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            user_id TEXT,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            metadata TEXT,
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Migrations for existing SQLite database
        for col, col_type in [
            ('counter_price', 'REAL'),
            ('subtotal', 'REAL'),
            ('mandi_cess', 'REAL DEFAULT 0.0'),
            ('platform_fee', 'REAL DEFAULT 0.0'),
            ('freight_charge', 'REAL DEFAULT 0.0'),
            ('review_rating', 'REAL'),
            ('review_text', 'TEXT'),
            ('review_tags', 'TEXT')
        ]:
            try:
                cursor.execute(f'ALTER TABLE orders ADD COLUMN {col} {col_type}')
            except Exception:
                pass

        try:
            cursor.execute('ALTER TABLE users ADD COLUMN upi_id TEXT')
        except Exception:
            pass

        conn.commit()

    seed_default_data(conn)
    conn.close()
    print(f"🌾 KisanSetu Relational Database Engine active: [{ACTIVE_ENGINE.upper()}]")

def seed_default_data(conn):
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) as count FROM users')
    row = cursor.fetchone()
    count = row['count'] if isinstance(row, dict) or hasattr(row, '__getitem__') else row[0]
    if count > 0:
        return

    default_pwd = hash_password('password123')

    # Seed Default Farmer: Ramesh Patel
    farmer_data = {
        'certifications': [
            {'name': 'NPOP Organic India', 'certNo': 'NPOP/NAB/0019/MH', 'status': 'Valid till Nov 2027'},
            {'name': 'Soil Health Card', 'certNo': 'SHC-MH-2025-8812', 'status': 'Cleared & Optimal'}
        ],
        'financials': {
            'bank': 'State Bank of India (Dindori Branch)',
            'accountNo': '•••• •••• •••• 9812',
            'ifsc': 'SBIN0004128',
            'kccLimit': '₹4,50,000 (Available: ₹3,30,000)',
            'mandiEscrowUpi': 'ramesh.patel@oksbi'
        },
        'storageCapacity': '200 Quintals Silo • 400 Crates Cold Storage'
    }

    cursor.execute('''
    INSERT INTO users (id, role, name, hindi_name, email, phone, password_hash, govt_id, enam_id, location, coordinates, land_holding, upi_id, operational_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''' if ACTIVE_ENGINE == 'sqlite3' else '''
    INSERT INTO users (id, role, name, hindi_name, email, phone, password_hash, govt_id, enam_id, location, coordinates, land_holding, upi_id, operational_data)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
        'farmer-1', 'farmer', 'Ramesh Patel', 'रमेश पटेल', 'farmer@kisansetu.in', '9423188901',
        default_pwd, 'Kisan Passbook #MH-NSK-4402', 'MH/APMC/NSK/2021-9941',
        'Plot 44, Dindori Agro-Zone, Nashik, Maharashtra', '19.9975° N, 73.7898° E',
        '12.5 Acres (9.0A Drip Irrigated • 3.5A Polyhouse)', 'ramesh.patel@oksbi', json.dumps(farmer_data)
    ))

    # Seed Default Consumer: Priya Sharma
    consumer_data = {
        'certifications': [
            {'name': 'FSSAI Central Food License', 'certNo': 'FSSAI-11522038000491', 'status': 'Active'},
            {'name': 'Fair-Price MSP Compliance', 'certNo': 'MSP-PLEDGE-98', 'status': 'A+ Verified'}
        ],
        'financials': {
            'bank': 'HDFC Corporate Banking (Pune Main)',
            'accountNo': '•••• •••• •••• 4421',
            'ifsc': 'HDFC0000039',
            'kccLimit': 'Mandi Escrow Wallet: ₹2,50,000',
            'mandiEscrowUpi': 'priya.greenbites@hdfcbank'
        },
        'storageCapacity': 'Walk-in Cold Storage Room (15 Tons)'
    }

    cursor.execute('''
    INSERT INTO users (id, role, name, hindi_name, email, phone, password_hash, govt_id, enam_id, location, coordinates, buyer_type, upi_id, operational_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''' if ACTIVE_ENGINE == 'sqlite3' else '''
    INSERT INTO users (id, role, name, hindi_name, email, phone, password_hash, govt_id, enam_id, location, coordinates, buyer_type, upi_id, operational_data)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
        'buyer-201', 'consumer', 'Priya Sharma', 'प्रिया शर्मा', 'consumer@kisansetu.in', '9820144552',
        default_pwd, 'FSSAI License #11522038000491', 'GSTIN: 27AABCG9821C1Z4',
        'Flat 402, Sunshine Heights, Kalyani Nagar, Pune, MH', '18.5480° N, 73.9038° E',
        'Consumer Collective Co-op', 'priya.greenbites@hdfcbank', json.dumps(consumer_data)
    ))

    # Seed Default Driver: Gurpreet Singh
    driver_data = {
        'certifications': [
            {'name': 'National Goods Permit (All-India)', 'certNo': 'NP-5521-MAH', 'status': 'Valid till 2028'},
            {'name': 'Vehicle Fitness & Green PUC', 'certNo': 'FC-MH15-2024', 'status': 'Cleared'}
        ],
        'financials': {
            'bank': 'Punjab National Bank (Transport Nagar)',
            'accountNo': '•••• •••• •••• 7741',
            'ifsc': 'PUNB0182400',
            'kccLimit': 'FASTag Wallet Balance: ₹3,840',
            'mandiEscrowUpi': 'gurpreet.vahan@icici'
        },
        'storageCapacity': '10.0 Tons Net Payload'
    }

    cursor.execute('''
    INSERT INTO users (id, role, name, hindi_name, email, phone, password_hash, govt_id, enam_id, location, coordinates, vehicle_type, vehicle_no, upi_id, operational_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''' if ACTIVE_ENGINE == 'sqlite3' else '''
    INSERT INTO users (id, role, name, hindi_name, email, phone, password_hash, govt_id, enam_id, location, coordinates, vehicle_type, vehicle_no, upi_id, operational_data)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
        'driver-301', 'driver', 'Gurpreet Singh', 'गुरप्रीत सिंह', 'driver@kisansetu.in', '9876543210',
        default_pwd, 'Commercial DL #MH-15-2018009214', 'Vahan RC: MH-15-EG-4482',
        'Sinnar Transport Nagar, Nashik, Maharashtra', '19.8450° N, 73.9850° E',
        '10-Wheeler Multi-Axle Truck', 'MH-15-EG-4482', 'gurpreet.vahan@icici', json.dumps(driver_data)
    ))

    # Seed 12 Core Verified Crops
    crops = [
        ('crop-101', 'farmer-1', 'Ramesh Patel', 'Sharbati Golden Wheat', 'Cereals', 45, 'Quintal', 2650, 2420, 2275, 1, 'NPOP/NAB/0019/MH', 2, '2026-09-08', 96, 'A+', 'Export Grade A+', json.dumps({'moisture': 10.2, 'foreignMatter': 0.3}), 'Nashik Agro-Cluster, Maharashtra', 85, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', 'Direct harvest from pesticide-free black soil. High protein luster grains, sun-dried naturally.'),
        ('crop-102', 'farmer-1', 'Ramesh Patel', 'Alphonso Ratnagiri Mangoes', 'Fruits', 120, 'Crates', 1850, 1720, 1600, 1, 'JAIVIK-MH-8821', 1, '2026-09-09', 99, 'A+', 'Geographical Indication (GI) Export', json.dumps({'moisture': 14.0, 'foreignMatter': 0.0}), 'Ratnagiri Coastal Orchards, Maharashtra', 150, 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80', 'Tree-ripened authentic Ratnagiri Alphonso. Naturally aromatic with no carbide artificial ripening.'),
        ('crop-103', 'farmer-1', 'Ramesh Patel', 'Red Hybrid Vine Tomatoes', 'Vegetables', 350, 'Crates', 480, 420, 380, 1, 'IND-ORG-4421', 1, '2026-09-09', 98, 'A', 'Super Fresh Grade A', json.dumps({'moisture': 18.0, 'foreignMatter': 0.1}), 'Dindori Greenhouse, Nashik', 60, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'Firm, glossy greenhouse tomatoes. High lycopene, zero transit bruising with specialized crating.'),
        ('crop-104', 'farmer-1', 'Ramesh Patel', 'Nashik Red Onion (Garwa Grade)', 'Vegetables', 400, 'Quintal', 2150, 1980, 1800, 0, '', 2, '2026-09-08', 96, 'A', 'Mandi Benchmark Grade A', json.dumps({'moisture': 12.0, 'foreignMatter': 0.4}), 'Lasalgaon Mandi Belt, Nashik', 90, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', 'Thick-layered pungent red onions with great storage life. Cured naturally in farm ventilated sheds.'),
        ('crop-105', 'farmer-1', 'Ramesh Patel', 'Yellow Feed Maize (Maka)', 'Cereals', 200, 'Quintal', 2180, 1869, 2400, 0, '', 1, '2026-09-09', 94, 'A', 'Feed Industry Prime', json.dumps({'moisture': 12.2, 'foreignMatter': 0.5}), 'Dindori Cluster, Nashik', 100, 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', 'Bright yellow grain with high starch. Direct supply contracts available.')
    ]
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'
    cursor.executemany(f'''
    INSERT INTO crops (id, farmer_id, farmer_name, name, category, quantity, unit, price_per_unit, mandi_price, msp_price, is_organic, organic_cert_no, harvest_days_ago, harvest_date, freshness_index, grade, grade_label, quality_specs, farm_location, delivery_radius_km, image_url, description)
    VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph})
    ''', crops)

    # Seed Initial Orders with Audited Pricing Breakdown
    p1 = calculate_pricing(15 * 2650)
    p2 = calculate_pricing(20 * 2600)
    p3 = calculate_pricing(80 * 460)

    orders = [
        ('ord-900', 'crop-101', 'Sharbati Golden Wheat', 'farmer-1', 'Ramesh Patel', 'buyer-201', 'Priya Sharma (GreenBites Co-op)', '+91 98201 44552', 'Consumer Collective', 'Flat 402, Sunshine Heights, Kalyani Nagar, Pune, MH 411006', 48, 15, 'Quintal', 2650, 2650, None, p1['subtotal'], p1['mandiCess'], p1['platformFee'], p1['freightCharge'], p1['grandTotal'], 'UPI / Mandi Escrow', 'delivered', 'driver-301', 'Successfully delivered to buyer warehouse. Quality verified.', 5.0, 'Outstanding harvest freshness and crisp quality! Direct mandi dispatch arrived right on schedule.', json.dumps(['Farm Fresh Quality', 'Punctual Delivery', 'Pristine Packaging'])),
        ('ord-901', 'crop-101', 'Sharbati Golden Wheat', 'farmer-1', 'Ramesh Patel', 'buyer-201', 'Priya Sharma (GreenBites Co-op)', '+91 98201 44552', 'Consumer Collective', 'Flat 402, Sunshine Heights, Kalyani Nagar, Pune, MH 411006', 48, 20, 'Quintal', 2650, 2600, 2625, p2['subtotal'], p2['mandiCess'], p2['platformFee'], p2['freightCharge'], p2['grandTotal'], 'UPI / Mandi Escrow', 'countered', None, 'Farmer countered at Rs 2,625/Quintal for moisture-sealed gunny bags packaging.', None, None, None),
        ('ord-902', 'crop-103', 'Red Hybrid Vine Tomatoes', 'farmer-1', 'Ramesh Patel', 'buyer-201', 'Priya Sharma (GreenBites Co-op)', '+91 98201 44552', 'Consumer Collective', 'Central Commissary, MIDC Bhosari, Pune', 54, 80, 'Crates', 480, 460, None, p3['subtotal'], p3['mandiCess'], p3['platformFee'], p3['freightCharge'], p3['grandTotal'], 'UPI / Mandi Escrow', 'pending', None, 'Early morning dock delivery requested before 7:00 AM.', None, None, None)
    ]
    cursor.executemany(f'''
    INSERT INTO orders (id, crop_id, crop_name, farmer_id, farmer_name, buyer_id, buyer_name, buyer_phone, buyer_type, delivery_address, distance_km, quantity, unit, listed_price, offered_price, counter_price, subtotal, mandi_cess, platform_fee, freight_charge, total_amount, payment_mode, status, assigned_driver_id, notes, review_rating, review_text, review_tags)
    VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph})
    ''', orders)

    # Seed Initial Driver Profile
    driver_route = {
        'routeId': 'route-nsk-pun-44',
        'origin': 'Plot 44, Dindori Agro-Zone, Nashik, Maharashtra - 422004',
        'originShort': 'Nashik APMC Cluster',
        'destination': 'Receiving Dock B, Sahyadri Food Park, Chakan, Pune, Maharashtra - 411028',
        'destinationShort': 'Pune Hadapsar Wholesale Hub',
        'totalDistanceKm': 164,
        'remainingDistanceKm': 66,
        'currentSpeedKmh': 54,
        'estimatedTimeRemaining': '1h 45m',
        'freightFee': 5450,
        'status': 'en_route',
        'cargoSeal': 'SEAL-MH-884192-K',
        'tempC': 4.2,
        'humidity': 85,
        'fastagStatus': 'Active (Tolls Cleared)',
        'ewayBill': 'EWB-2026-99214482-A',
        'estFuel': '38.5 L (₹3,620)',
        'haulDetails': '50 Quintals Grade A+ Sharbati Wheat'
    }
    cursor.execute(f'''
    INSERT INTO driver_profiles (driver_id, name, phone, license_no, vehicle_no, vehicle_type, max_capacity_tons, booked_capacity_tons, base_per_km, per_quintal, assigned_route, available_loads, stats)
    VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph})
    ''', (
        'driver-301', 'Gurpreet Singh', '+91 98765 43210', 'Commercial DL #MH-15-2018009214', 'MH-15-EG-4482', '10-Wheeler Multi-Axle Truck', 10.0, 6.5, 28.0, 16.0, json.dumps(driver_route), json.dumps([]), json.dumps({'trips': 14, 'earnings': 78450})
    ))

    conn.commit()

# ==================== LIVE OTP VERIFICATION API ====================

def create_otp(phone: str) -> dict:
    """Generate and store a 6-digit live OTP with 5-minute validity."""
    clean_phone = ''.join(filter(str.isdigit, phone))
    if len(clean_phone) > 10:
        clean_phone = clean_phone[-10:]

    otp_code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now() + timedelta(minutes=5)

    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'
    expires_str = expires_at.strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute(f'''
    INSERT INTO otp_verifications (phone, otp_code, verified, attempts, expires_at)
    VALUES ({ph}, {ph}, 0, 0, {ph})
    ''', (clean_phone, otp_code, expires_str))

    conn.commit()
    conn.close()

    print(f"📲 [SMS Gateway to +91 {clean_phone}]: Your KisanSetu verification OTP is {otp_code}. Valid for 5 minutes.")
    return {
        'success': True,
        'phone': clean_phone,
        'otp': otp_code,
        'expiresInSeconds': 300,
        'message': f'Verification OTP successfully dispatched to +91 {clean_phone}.'
    }

def verify_otp(phone: str, otp_code: str) -> dict:
    """Verify live mobile OTP."""
    clean_phone = ''.join(filter(str.isdigit, phone))
    if len(clean_phone) > 10:
        clean_phone = clean_phone[-10:]
    clean_otp = str(otp_code).strip()

    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'

    cursor.execute(f'''
    SELECT * FROM otp_verifications 
    WHERE phone = {ph} AND verified = 0 
    ORDER BY created_at DESC LIMIT 1
    ''', (clean_phone,))

    row = cursor.fetchone()
    if not row:
        conn.close()
        return {'success': False, 'error': 'No pending OTP verification found for this phone number.'}

    # Extract fields
    stored_otp = row['otp_code'] if isinstance(row, dict) or hasattr(row, '__getitem__') else row[2]
    expires_at_raw = row['expires_at'] if isinstance(row, dict) or hasattr(row, '__getitem__') else row[5]
    row_id = row['id'] if isinstance(row, dict) or hasattr(row, '__getitem__') else row[0]

    # Check expiry
    try:
        if isinstance(expires_at_raw, str):
            exp_time = datetime.strptime(expires_at_raw.split('.')[0], '%Y-%m-%d %H:%M:%S')
        else:
            exp_time = expires_at_raw
        if datetime.now() > exp_time:
            conn.close()
            return {'success': False, 'error': 'OTP has expired. Please request a fresh verification code.'}
    except Exception:
        pass

    if stored_otp != clean_otp:
        cursor.execute(f"UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = {ph}", (row_id,))
        conn.commit()
        conn.close()
        return {'success': False, 'error': 'Invalid OTP code. Please enter the correct 6-digit code.'}

    # Mark verified
    cursor.execute(f"UPDATE otp_verifications SET verified = 1 WHERE id = {ph}", (row_id,))
    conn.commit()
    conn.close()

    return {'success': True, 'phone': clean_phone, 'message': 'Mobile number successfully verified!'}

# ==================== COUNTER-OFFER & NEGOTIATION API ====================

def create_counter_offer(order_id: str, proposed_by_role: str, proposed_by_id: str, proposed_by_name: str, proposed_price: float, notes: str = None) -> dict:
    """Farmer or Consumer submits a revised counter-offer."""
    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'

    cursor.execute(f"SELECT * FROM orders WHERE LOWER(id) = LOWER({ph})", (order_id,))
    order = cursor.fetchone()
    if not order:
        conn.close()
        return {'success': False, 'error': f'Order #{order_id} not found.'}

    actual_order_id = order['id'] if isinstance(order, dict) or hasattr(order, '__getitem__') else order[0]
    orig_price = order['offered_price'] if isinstance(order, dict) or hasattr(order, '__getitem__') else order[14]
    qty = order['quantity'] if isinstance(order, dict) or hasattr(order, '__getitem__') else order[11]

    # Calculate audited pricing for counter-offer
    pricing = calculate_pricing(qty * float(proposed_price))

    # Insert into negotiations log
    cursor.execute(f'''
    INSERT INTO negotiations (order_id, proposed_by_role, proposed_by_id, proposed_by_name, proposed_price, original_price, quantity, notes, action)
    VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, 'counter')
    ''', (actual_order_id, proposed_by_role, proposed_by_id, proposed_by_name, proposed_price, orig_price, qty, notes or ''))

    # Update order with counter_price and new totals
    updated_notes = notes or f"Counter-offer of ₹{proposed_price} submitted by {proposed_by_name}."
    cursor.execute(f'''
    UPDATE orders 
    SET status = 'countered', counter_price = {ph}, subtotal = {ph}, mandi_cess = {ph}, platform_fee = {ph}, freight_charge = {ph}, total_amount = {ph}, notes = {ph}
    WHERE LOWER(id) = LOWER({ph})
    ''', (proposed_price, pricing['subtotal'], pricing['mandiCess'], pricing['platformFee'], pricing['freightCharge'], pricing['grandTotal'], updated_notes, actual_order_id))

    conn.commit()
    conn.close()

    return {
        'success': True,
        'orderId': actual_order_id,
        'counterPrice': proposed_price,
        'subtotal': pricing['subtotal'],
        'grandTotal': pricing['grandTotal'],
        'status': 'countered',
        'message': f"Counter-offer of ₹{proposed_price} successfully registered."
    }

def respond_counter_offer(order_id: str, action: str, respondent_id: str = None, respondent_name: str = None, new_price: float = None, notes: str = None) -> dict:
    """
    Consumer or Farmer handles incoming counter-offer:
    - action == 'accept': Accepts the counter-offer, sets offered_price = counter_price, status = 'accepted'
    - action == 'counter': Submits a revised counter proposal
    - action == 'decline': Declines the order negotiation, sets status = 'declined'
    """
    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'

    cursor.execute(f"SELECT * FROM orders WHERE LOWER(id) = LOWER({ph})", (order_id,))
    order = cursor.fetchone()
    if not order:
        conn.close()
        return {'success': False, 'error': f'Order #{order_id} not found.'}

    actual_order_id = order['id'] if isinstance(order, dict) or hasattr(order, '__getitem__') else order[0]
    counter_price = order['counter_price'] if isinstance(order, dict) or hasattr(order, '__getitem__') else order[15]
    qty = order['quantity'] if isinstance(order, dict) or hasattr(order, '__getitem__') else order[11]

    if action == 'accept':
        accepted_price = counter_price if counter_price else (order['offered_price'] if isinstance(order, dict) or hasattr(order, '__getitem__') else order[14])
        pricing = calculate_pricing(qty * float(accepted_price))

        cursor.execute(f'''
        INSERT INTO negotiations (order_id, proposed_by_role, proposed_by_id, proposed_by_name, proposed_price, original_price, quantity, notes, action)
        VALUES ({ph}, 'consumer', {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, 'accept')
        ''', (actual_order_id, respondent_id or 'buyer-current', respondent_name or 'Wholesale Buyer', accepted_price, accepted_price, qty, notes or 'Counter-offer accepted by buyer.'))

        cursor.execute(f'''
        UPDATE orders 
        SET status = 'accepted', offered_price = {ph}, subtotal = {ph}, mandi_cess = {ph}, platform_fee = {ph}, freight_charge = {ph}, total_amount = {ph}, notes = {ph}
        WHERE LOWER(id) = LOWER({ph})
        ''', (accepted_price, pricing['subtotal'], pricing['mandiCess'], pricing['platformFee'], pricing['freightCharge'], pricing['grandTotal'], notes or 'Order accepted with agreed counter price.', actual_order_id))

        conn.commit()
        conn.close()
        return {
            'success': True,
            'orderId': actual_order_id,
            'status': 'accepted',
            'agreedPrice': accepted_price,
            'grandTotal': pricing['grandTotal'],
            'message': f"Order #{actual_order_id} accepted at agreed price of ₹{accepted_price}."
        }

    elif action == 'decline':
        cursor.execute(f'''
        INSERT INTO negotiations (order_id, proposed_by_role, proposed_by_id, proposed_by_name, proposed_price, original_price, quantity, notes, action)
        VALUES ({ph}, 'consumer', {ph}, {ph}, 0, 0, {ph}, {ph}, 'decline')
        ''', (actual_order_id, respondent_id or 'buyer-current', respondent_name or 'Wholesale Buyer', qty, notes or 'Counter-offer declined.'))

        cursor.execute(f'''
        UPDATE orders SET status = 'declined', notes = {ph} WHERE LOWER(id) = LOWER({ph})
        ''', (notes or 'Counter-offer declined by buyer.', actual_order_id))

        conn.commit()
        conn.close()
        return {
            'success': True,
            'orderId': actual_order_id,
            'status': 'declined',
            'message': f"Order #{actual_order_id} negotiation declined."
        }

    elif action == 'counter':
        if not new_price or new_price <= 0:
            conn.close()
            return {'success': False, 'error': 'Valid counter price required.'}
        conn.close()
        return create_counter_offer(actual_order_id, 'consumer', respondent_id or 'buyer-current', respondent_name or 'Buyer', new_price, notes)

    conn.close()
    return {'success': False, 'error': f'Unsupported negotiation action: {action}'}

# ==================== AUTHENTICATION & CORE SERVICES ====================

def register_user(role, name, email, phone, password, extra_fields=None):
    clean_phone = ''.join(filter(str.isdigit, phone))
    if len(clean_phone) > 10:
        clean_phone = clean_phone[-10:]

    conn = get_db()
    cursor = conn.cursor()
    extra_fields = extra_fields or {}
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'

    # Check duplicate
    cursor.execute(f"SELECT id FROM users WHERE email = {ph} OR phone = {ph}", (email.strip(), clean_phone))
    if cursor.fetchone():
        conn.close()
        return {'success': False, 'error': 'Account with this email or mobile number already exists.'}

    user_id = f"{role}-{int(datetime.now().timestamp())}"
    pwd_hash = hash_password(password)

    upi_id = extra_fields.get('upi_id') or extra_fields.get('upiId') or ''
    govt_id = extra_fields.get('govt_id') or extra_fields.get('govtId') or f"ID-{role.upper()}-{int(datetime.now().timestamp()) % 10000}"
    location = extra_fields.get('location') or 'Registered Rural Hub'
    coordinates = extra_fields.get('coordinates') or '19.9975° N, 73.7898° E'
    land_holding = extra_fields.get('land_holding') or extra_fields.get('landHolding') or ''
    buyer_type = extra_fields.get('buyer_type') or extra_fields.get('buyerType') or ''
    vehicle_type = extra_fields.get('vehicle_type') or extra_fields.get('vehicleType') or ''
    vehicle_no = extra_fields.get('vehicle_no') or extra_fields.get('vehicleNo') or ''

    cursor.execute(f'''
    INSERT INTO users (id, role, name, email, phone, password_hash, govt_id, location, coordinates, land_holding, buyer_type, vehicle_type, vehicle_no, upi_id, operational_data)
    VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph})
    ''', (
        user_id, role, name, email.strip(), clean_phone, pwd_hash,
        govt_id, location, coordinates, land_holding, buyer_type, vehicle_type, vehicle_no, upi_id,
        json.dumps(extra_fields)
    ))

    conn.commit()
    conn.close()
    return {
        'success': True,
        'user': {
            'id': user_id,
            'role': role,
            'name': name,
            'email': email.strip(),
            'phone': clean_phone,
            'govt_id': govt_id,
            'govtId': govt_id,
            'location': location,
            'coordinates': coordinates,
            'land_holding': land_holding,
            'landHolding': land_holding,
            'buyer_type': buyer_type,
            'buyerType': buyer_type,
            'vehicle_type': vehicle_type,
            'vehicleType': vehicle_type,
            'vehicle_no': vehicle_no,
            'vehicleNo': vehicle_no,
            'upi_id': upi_id,
            'upiId': upi_id,
            'operational_data': extra_fields
        }
    }

def login_user(identifier, password):
    clean_id = identifier.strip()
    digits_only = ''.join(filter(str.isdigit, clean_id))
    pwd_hash = hash_password(password)

    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'

    cursor.execute(f'''
    SELECT * FROM users WHERE (email = {ph} OR phone = {ph} OR phone = {ph}) AND password_hash = {ph}
    ''', (clean_id, clean_id, digits_only if len(digits_only) == 10 else clean_id, pwd_hash))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return {'success': False, 'error': 'Invalid credentials. Please verify your mobile/email and password.'}

    op_data = {}
    raw_op = user['operational_data'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[17]
    if raw_op:
        try:
            op_data = json.loads(raw_op)
        except Exception:
            pass

    return {
        'success': True,
        'user': {
            'id': user['id'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[0],
            'role': user['role'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[1],
            'name': user['name'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[2],
            'email': user['email'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[4],
            'phone': user['phone'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[5],
            'govt_id': user['govt_id'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[7],
            'enam_id': user['enam_id'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[8],
            'location': user['location'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[9],
            'coordinates': user['coordinates'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[10],
            'land_holding': user['land_holding'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[11],
            'buyer_type': user['buyer_type'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[12],
            'vehicle_type': user['vehicle_type'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[13],
            'vehicle_no': user['vehicle_no'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[14],
            'upi_id': user['upi_id'] if (isinstance(user, dict) and 'upi_id' in user) or (hasattr(user, 'keys') and 'upi_id' in user.keys()) else '',
            'operational_data': op_data
        }
    }

def delete_crop(crop_id):
    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'
    cursor.execute(f"DELETE FROM crops WHERE id = {ph}", (crop_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return {'success': affected > 0, 'deleted_id': crop_id}

def update_order_status(order_id, status, notes=None):
    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'
    if notes:
        cursor.execute(f"UPDATE orders SET status = {ph}, notes = {ph} WHERE id = {ph}", (status, notes, order_id))
    else:
        cursor.execute(f"UPDATE orders SET status = {ph} WHERE id = {ph}", (status, order_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return {'success': affected > 0}

def add_order_review(order_id, rating, review_text, tags=None):
    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'
    tags_str = json.dumps(tags) if isinstance(tags, list) else (tags or '[]')
    cursor.execute(f'''
    UPDATE orders 
    SET review_rating = {ph}, review_text = {ph}, review_tags = {ph}
    WHERE id = {ph}
    ''', (rating, review_text, tags_str, order_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return {'success': affected > 0}

def update_user_profile(user_id, op_data):
    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'
    cursor.execute(f"UPDATE users SET operational_data = {ph} WHERE id = {ph}", (json.dumps(op_data), user_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return {'success': affected > 0}

def reset_password(identifier, new_password):
    conn = get_db()
    cursor = conn.cursor()
    ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'
    clean_id = identifier.strip()
    digits = ''.join(filter(str.isdigit, clean_id))

    cursor.execute(f'''
    SELECT * FROM users WHERE LOWER(email) = LOWER({ph}) OR phone = {ph} OR phone = {ph}
    ''', (clean_id, clean_id, digits if len(digits) == 10 else clean_id))
    user = cursor.fetchone()
    if not user:
        conn.close()
        return {'success': False, 'error': 'No account found matching this email or phone number.'}

    user_id = user['id'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[0]
    user_name = user['name'] if isinstance(user, dict) or hasattr(user, '__getitem__') else user[2]

    new_hash = hash_password(new_password)
    cursor.execute(f"UPDATE users SET password_hash = {ph} WHERE id = {ph}", (new_hash, user_id))
    conn.commit()
    conn.close()
    return {'success': True, 'message': f"Password reset successfully for {user_name}."}

def reset_full_demo_data():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM negotiations')
    cursor.execute('DELETE FROM crops')
    cursor.execute('DELETE FROM orders')
    cursor.execute('DELETE FROM driver_profiles')
    conn.commit()
    seed_default_data(conn)
    conn.close()
    return {'success': True, 'message': 'Demo database restored to pristine relational state.'}

def deduplicate_crops() -> list:
    """
    Remove duplicate crop listings from the database, strictly preserving any listings
    by Suresh Adhikari (and preferring Suresh Adhikari when a duplicate commodity is found).
    Returns list of deleted crop IDs.
    """
    import re
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM crops ORDER BY created_at ASC")
    raw_crops = [dict(row) for row in cursor.fetchall()]

    def get_commodity_key(name: str) -> str:
        s = (name or '').lower().strip()
        for keyword in ['wheat', 'rice', 'basmati', 'tomato', 'potato', 'onion', 'cotton', 'soybean', 'mustard', 'maize', 'mango', 'grapes', 'sugarcane', 'garlic', 'ginger']:
            if keyword in s:
                return keyword
        return re.sub(r'[^a-z0-9]', '', s)

    def is_suresh(c) -> bool:
        fname = (c.get('farmer_name') or '').lower()
        fid = (c.get('farmer_id') or '').lower()
        return 'suresh' in fname or 'suresh' in fid

    groups = {}
    for c in raw_crops:
        key = get_commodity_key(c.get('name', ''))
        if key not in groups:
            groups[key] = []
        groups[key].append(c)

    deleted_ids = []
    for key, crop_list in groups.items():
        if len(crop_list) <= 1:
            continue
        suresh_crop = next((c for c in crop_list if is_suresh(c)), None)
        if suresh_crop:
            keeper = suresh_crop
        else:
            keeper = crop_list[0]

        for c in crop_list:
            if c['id'] != keeper['id']:
                deleted_ids.append(c['id'])

    if deleted_ids:
        ph = '?' if ACTIVE_ENGINE == 'sqlite3' else '%s'
        placeholders = ', '.join([ph] * len(deleted_ids))
        cursor.execute(f"DELETE FROM crops WHERE id IN ({placeholders})", tuple(deleted_ids))
        conn.commit()

    conn.close()
    return deleted_ids

if __name__ == '__main__':
    init_db()
