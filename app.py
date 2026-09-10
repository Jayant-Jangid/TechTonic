#!/usr/bin/env python3
"""
KisanSetu - National Agricultural Commerce & Logistics Platform
Flask Full-Stack Web Application & Production REST API Engine

Entry file for local execution and production deployment on Render with Gunicorn.
Start command: gunicorn app:app
"""
import os
import sys
import time
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS

# Ensure UTF-8 output on Windows consoles
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Initialize database
import db
db.init_db()

# Create Flask application instance
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# Cache control for dynamic API responses
@app.after_request
def add_security_and_cache_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    if request.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

# -----------------------------------------------------------------------------
# Frontend Route
# -----------------------------------------------------------------------------
@app.route('/')
def index():
    """Renders the main single-page application."""
    return render_template('index.html')

# Static asset fallback routes for direct /css and /js requests
@app.route('/css/<path:filename>')
def serve_css_fallback(filename):
    return send_from_directory(os.path.join(app.static_folder, 'css'), filename)

@app.route('/js/<path:filename>')
def serve_js_fallback(filename):
    return send_from_directory(os.path.join(app.static_folder, 'js'), filename)

# -----------------------------------------------------------------------------
# Health & Status Endpoint
# -----------------------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health():
    """System health status and active relational database engine."""
    engine = db.get_active_engine()
    return jsonify({
        'status': 'healthy',
        'database': 'kisansetu',
        'engine': engine,
        'relational': True
    })

# -----------------------------------------------------------------------------
# Crop Listings Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/crops', methods=['GET'])
def get_crops():
    """Retrieve all available agricultural harvest lots."""
    conn = db.get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM crops ORDER BY created_at DESC')
    raw_crops = [dict(row) for row in cursor.fetchall()]
    conn.close()
    crops = []
    for c in raw_crops:
        item = dict(c)
        item['farmerId'] = str(c.get('farmer_id') or c.get('farmerId', 'farmer-1'))
        item['farmerName'] = c.get('farmer_name') or c.get('farmerName', 'Farmer')
        item['pricePerUnit'] = float(c.get('price_per_unit') or c.get('pricePerUnit', 0))
        item['mandiPrice'] = float(c.get('mandi_price') or c.get('mandiPrice', 0))
        item['mspPrice'] = float(c.get('msp_price') or c.get('mspPrice', 0))
        item['isOrganic'] = bool(c.get('is_organic', c.get('isOrganic', False)))
        item['harvestDaysAgo'] = int(c.get('harvest_days_ago', c.get('harvestDaysAgo', 0)))
        item['harvestDate'] = c.get('harvest_date') or c.get('harvestDate', '')
        item['freshnessIndex'] = float(c.get('freshness_index') or c.get('freshnessIndex', 95))
        item['farmLocation'] = c.get('farm_location') or c.get('farmLocation', 'Farm Gate Cluster, Maharashtra')
        item['deliveryRadiusKm'] = int(c.get('delivery_radius_km') or c.get('deliveryRadiusKm', 150))
        item['imageUrl'] = c.get('image_url') or c.get('imageUrl', '')
        item['createdAt'] = c.get('created_at') or c.get('createdAt', '')
        crops.append(item)
    return jsonify({'crops': crops})

@app.route('/api/crops', methods=['POST'])
def add_crop():
    """Publish a new crop listing."""
    data = request.get_json(silent=True) or {}
    conn = db.get_db()
    cursor = conn.cursor()
    crop_id = data.get('id') or f"crop-{int(time.time() * 1000)}"
    ph = '?' if db.get_active_engine() == 'sqlite3' else '%s'
    cmd = 'INSERT OR REPLACE INTO crops' if db.get_active_engine() == 'sqlite3' else 'REPLACE INTO crops'
    cursor.execute(f'''
    {cmd} (id, farmer_id, farmer_name, name, category, quantity, unit, price_per_unit, mandi_price, msp_price, is_organic, harvest_days_ago, harvest_date, freshness_index, grade, farm_location, delivery_radius_km, image_url, description)
    VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph})
    ''', (
        crop_id,
        str(data.get('farmerId') or data.get('farmer_id', 'farmer-1')),
        data.get('farmerName') or data.get('farmer_name', 'Ramesh Patel'),
        data.get('name', 'Harvest Crop'),
        data.get('category', 'Cereals'),
        float(data.get('quantity', 10)),
        data.get('unit', 'Quintal'),
        float(data.get('pricePerUnit') or data.get('price_per_unit', 2000)),
        float(data.get('mandiPrice') or data.get('mandi_price', 1800)),
        float(data.get('mspPrice') or data.get('msp_price', 1700)),
        1 if (data.get('isOrganic') or data.get('is_organic')) else 0,
        int(data.get('harvestDaysAgo') or data.get('harvest_days_ago', 1)),
        data.get('harvestDate') or data.get('harvest_date', '2026-09-09'),
        float(data.get('freshnessIndex') or data.get('freshness_index', 95)),
        data.get('grade', 'A'),
        data.get('farmLocation') or data.get('farm_location', 'Nashik Agro-Cluster, Maharashtra'),
        int(data.get('deliveryRadiusKm') or data.get('delivery_radius_km', 150)),
        data.get('imageUrl') or data.get('image_url', ''),
        data.get('description', '')
    ))
    conn.commit()
    conn.close()
    deleted = db.deduplicate_crops()
    return jsonify({'success': True, 'cropId': crop_id, 'deduplicated': deleted}), 201

@app.route('/api/crops', methods=['DELETE'])
@app.route('/api/crops/<crop_id>', methods=['DELETE'])
def delete_crop_endpoint(crop_id=None):
    """Delete a crop listing by ID."""
    if not crop_id:
        crop_id = request.args.get('id')
    if crop_id:
        res = db.delete_crop(crop_id)
        return jsonify(res), 200
    return jsonify({'error': 'crop id required'}), 400

# -----------------------------------------------------------------------------
# Orders Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Retrieve all orders placed across cultivators and wholesale buyers."""
    conn = db.get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM orders ORDER BY created_at DESC')
    raw_orders = [dict(row) for row in cursor.fetchall()]
    conn.close()
    orders = []
    for o in raw_orders:
        item = dict(o)
        item['cropId'] = o.get('crop_id') or o.get('cropId') or ''
        item['cropName'] = o.get('crop_name') or o.get('cropName') or ''
        item['farmerId'] = str(o.get('farmer_id') or o.get('farmerId') or '')
        item['farmerName'] = o.get('farmer_name') or o.get('farmerName') or ''
        item['buyerId'] = str(o.get('buyer_id') or o.get('buyerId') or '')
        item['buyerName'] = o.get('buyer_name') or o.get('buyerName') or ''
        item['buyerPhone'] = o.get('buyer_phone') or o.get('buyerPhone') or ''
        item['buyerType'] = o.get('buyer_type') or o.get('buyerType') or ''
        item['deliveryAddress'] = o.get('delivery_address') or o.get('deliveryAddress') or ''
        item['distanceKm'] = float(o.get('distance_km') or o.get('distanceKm') or 50)
        item['quantity'] = float(o.get('quantity') or 1)
        item['listedPrice'] = float(o.get('listed_price') or o.get('listedPrice') or 0)
        item['offeredPrice'] = float(o.get('offered_price') or o.get('offeredPrice') or 0)
        item['counterPrice'] = float(o['counter_price']) if o.get('counter_price') is not None else (float(o['counterPrice']) if o.get('counterPrice') is not None else None)
        item['subtotal'] = float(o.get('subtotal') or 0)
        item['mandiCess'] = float(o.get('mandi_cess') or o.get('mandiCess') or 0)
        item['platformFee'] = float(o.get('platform_fee') or o.get('platformFee') or 0)
        item['freightCharge'] = float(o.get('freight_charge') or o.get('freightCharge') or 0)
        item['totalAmount'] = float(o.get('total_amount') or o.get('totalAmount') or 0)
        item['paymentMode'] = o.get('payment_mode') or o.get('paymentMode') or 'UPI / Mandi Escrow'
        item['assignedDriverId'] = o.get('assigned_driver_id') or o.get('assignedDriverId')
        item['createdAt'] = o.get('created_at') or o.get('createdAt') or ''
        orders.append(item)
    return jsonify({'orders': orders})

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new wholesale purchase order with audited fee calculations."""
    data = request.get_json(silent=True) or {}
    conn = db.get_db()
    cursor = conn.cursor()
    order_id = data.get('id') or f"ord-{int(time.time() * 1000)}"
    qty = float(data.get('quantity', 1))
    offered_price = float(data.get('offeredPrice', data.get('listedPrice', 0)))
    subtotal_raw = qty * offered_price
    pricing = db.calculate_pricing(subtotal_raw, data.get('distanceKm', 50))

    subtotal = float(data.get('subtotal') or pricing['subtotal'])
    mandi_cess = float(data.get('mandiCess') or pricing['mandiCess'])
    platform_fee = float(data.get('platformFee') or pricing['platformFee'])
    freight_charge = float(data.get('freightCharge') or pricing['freightCharge'])
    total_amount = float(data.get('totalAmount') or pricing['grandTotal'])
    counter_price = data.get('counterPrice')

    ph = '?' if db.get_active_engine() == 'sqlite3' else '%s'
    cmd = 'INSERT OR REPLACE INTO orders' if db.get_active_engine() == 'sqlite3' else 'REPLACE INTO orders'
    cursor.execute(f'''
    {cmd} (id, crop_id, crop_name, farmer_id, farmer_name, buyer_id, buyer_name, buyer_phone, buyer_type, delivery_address, distance_km, quantity, unit, listed_price, offered_price, counter_price, subtotal, mandi_cess, platform_fee, freight_charge, total_amount, payment_mode, status, notes)
    VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph}, {ph})
    ''', (
        order_id,
        data.get('cropId') or data.get('crop_id', ''),
        data.get('cropName') or data.get('crop_name', ''),
        str(data.get('farmerId') or data.get('farmer_id', 'farmer-1')),
        data.get('farmerName') or data.get('farmer_name', ''),
        str(data.get('buyerId') or data.get('buyer_id', '')),
        data.get('buyerName') or data.get('buyer_name', ''),
        data.get('buyerPhone') or data.get('buyer_phone', ''),
        data.get('buyerType') or data.get('buyer_type', ''),
        data.get('deliveryAddress') or data.get('delivery_address', ''),
        float(data.get('distanceKm') or data.get('distance_km', 50)),
        qty,
        data.get('unit', 'Quintal'),
        float(data.get('listedPrice') or data.get('listed_price', 0)),
        offered_price,
        counter_price,
        subtotal, mandi_cess, platform_fee, freight_charge, total_amount,
        data.get('paymentMode') or data.get('payment_mode', 'UPI / Mandi Escrow'),
        data.get('status', 'pending'),
        data.get('notes', '')
    ))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'orderId': order_id, 'pricing': pricing}), 201

@app.route('/api/orders', methods=['PATCH'])
def patch_order():
    """Update order delivery status or notes via PATCH."""
    data = request.get_json(silent=True) or {}
    order_id = data.get('orderId')
    status = data.get('status')
    notes = data.get('notes')
    if order_id and status:
        res = db.update_order_status(order_id, status, notes)
        return jsonify(res), 200
    return jsonify({'error': 'orderId and status required'}), 400

@app.route('/api/orders/status', methods=['POST'])
def update_order_status_endpoint():
    """Update order status via POST endpoint."""
    data = request.get_json(silent=True) or {}
    order_id = data.get('orderId') or data.get('id')
    status = data.get('status')
    notes = data.get('notes', '')
    if order_id and status:
        res = db.update_order_status(order_id, status, notes)
        return jsonify(res), 200
    return jsonify({'error': 'orderId and status required'}), 400

@app.route('/api/orders/review', methods=['POST'])
def add_order_review_endpoint():
    """Submit rating and feedback tags for an executed order."""
    data = request.get_json(silent=True) or {}
    order_id = data.get('orderId')
    rating = data.get('rating', 5.0)
    review_text = data.get('reviewText', '')
    tags = data.get('tags', [])
    res = db.add_order_review(order_id, rating, review_text, tags)
    return jsonify(res), 200

# -----------------------------------------------------------------------------
# Price Negotiation & Counter-Offer Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/orders/counter', methods=['POST'])
def create_counter_offer_endpoint():
    """Submit a counter-offer proposal for an order."""
    data = request.get_json(silent=True) or {}
    order_id = data.get('orderId')
    proposed_by_role = data.get('role', 'farmer')
    proposed_by_id = data.get('userId', 'farmer-1')
    proposed_by_name = data.get('userName', 'Farmer Ramesh Patel')
    proposed_price = data.get('proposedPrice')
    notes = data.get('notes', '')

    if not order_id or not proposed_price:
        return jsonify({'success': False, 'error': 'orderId and proposedPrice required.'}), 400

    res = db.create_counter_offer(order_id, proposed_by_role, proposed_by_id, proposed_by_name, proposed_price, notes)
    status_code = 200 if res.get('success') else 400
    return jsonify(res), status_code

@app.route('/api/orders/counter/respond', methods=['POST'])
def respond_counter_offer_endpoint():
    """Accept, counter, or decline an active counter-offer."""
    data = request.get_json(silent=True) or {}
    order_id = data.get('orderId')
    action = data.get('action')  # 'accept', 'counter', 'decline'
    user_id = data.get('userId')
    user_name = data.get('userName')
    new_price = data.get('newPrice')
    notes = data.get('notes')

    if not order_id or not action:
        return jsonify({'success': False, 'error': 'orderId and action required.'}), 400

    res = db.respond_counter_offer(order_id, action, user_id, user_name, new_price, notes)
    status_code = 200 if res.get('success') else 400
    return jsonify(res), status_code

# -----------------------------------------------------------------------------
# Pricing Calculation Engine
# -----------------------------------------------------------------------------
@app.route('/api/pricing/calculate', methods=['POST'])
def calculate_pricing_endpoint():
    """Compute mathematical mandi cess, platform fee, and freight charges."""
    data = request.get_json(silent=True) or {}
    subtotal = float(data.get('subtotal', 0))
    distance_km = float(data.get('distanceKm', 50))
    pricing = db.calculate_pricing(subtotal, distance_km)
    return jsonify({'success': True, 'pricing': pricing}), 200

# -----------------------------------------------------------------------------
# Authentication & User Management Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/auth/send-otp', methods=['POST'])
def send_otp():
    """Generate and dispatch one-time passcode for mobile authentication."""
    data = request.get_json(silent=True) or {}
    phone = str(data.get('phone', '')).strip()
    if not phone:
        return jsonify({'success': False, 'error': '10-digit mobile number required.'}), 400
    res = db.create_otp(phone)
    return jsonify(res), 200

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    """Verify submitted OTP code for phone number."""
    data = request.get_json(silent=True) or {}
    phone = str(data.get('phone', '')).strip()
    otp = str(data.get('otp', '')).strip()
    if not phone or not otp:
        return jsonify({'success': False, 'error': 'Phone number and 6-digit OTP code required.'}), 400
    res = db.verify_otp(phone, otp)
    status_code = 200 if res.get('success') else 400
    return jsonify(res), status_code

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new cultivator, buyer, or driver account."""
    data = request.get_json(silent=True) or {}
    role = data.get('role', 'farmer')
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    password = data.get('password', '').strip()
    extra_fields = data.get('extra_fields', {})

    if not name or not email or not phone or not password:
        return jsonify({'success': False, 'error': 'All fields (name, email, phone, password) are required.'}), 400

    result = db.register_user(role, name, email, phone, password, extra_fields)
    status_code = 201 if result.get('success') else 409
    return jsonify(result), status_code

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate existing user credentials."""
    data = request.get_json(silent=True) or {}
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '').strip()
    if not identifier or not password:
        return jsonify({'success': False, 'error': 'Identifier (email/phone) and password required.'}), 400

    result = db.login_user(identifier, password)
    status_code = 200 if result.get('success') else 401
    return jsonify(result), status_code

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Update password for verified phone or email."""
    data = request.get_json(silent=True) or {}
    identifier = data.get('identifier', '').strip()
    new_password = data.get('newPassword', '').strip()
    if not identifier or not new_password:
        return jsonify({'success': False, 'error': 'Identifier and new password required.'}), 400

    result = db.reset_password(identifier, new_password)
    status_code = 200 if result.get('success') else 404
    return jsonify(result), status_code

# -----------------------------------------------------------------------------
# Profile & Demo Administration Endpoints
# -----------------------------------------------------------------------------
@app.route('/api/profile', methods=['POST'])
def update_profile():
    """Update profile and operational metrics for an authenticated user."""
    data = request.get_json(silent=True) or {}
    user_id = data.get('userId')
    op_data = data.get('profile', {})
    if user_id:
        res = db.update_user_profile(user_id, op_data)
        return jsonify(res), 200
    return jsonify({'error': 'userId required'}), 400

@app.route('/api/demo/seed', methods=['POST'])
def demo_seed():
    """Reset and re-seed full demo catalogue and transaction records."""
    res = db.reset_full_demo_data()
    return jsonify(res), 200

# -----------------------------------------------------------------------------
# Local Development Execution
# -----------------------------------------------------------------------------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    print(f"🌾 KisanSetu Flask App running at http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
