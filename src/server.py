#!/usr/bin/env python3
"""
Simple HTTP Server & Relational REST API for KisanSetu Agricultural Commerce Platform.
Supports MySQL Engine with persistent SQLite fallback for Users, OTP Verification,
Crops, Orders, Counter-Offer Negotiations, and Audited Pricing calculations.
"""
import http.server
import socketserver
import os
import sys
import json
import time
import uuid

# Ensure UTF-8 output on Windows consoles
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Ensure directory is in sys.path
SRC_DIR = os.path.dirname(os.path.abspath(__file__))
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

import db

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class KisanSetuHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_json(self, status_code, payload):
        response = json.dumps(payload).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response)))
        self.end_headers()
        self.wfile.write(response)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_GET(self):
        # REST API routing
        if self.path == '/api/health':
            engine = db.get_active_engine()
            self.send_json(200, {
                'status': 'healthy',
                'database': 'kisansetu',
                'engine': engine,
                'relational': True
            })
            return

        if self.path == '/api/crops':
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
            self.send_json(200, {'crops': crops})
            return

        if self.path == '/api/orders':
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
            self.send_json(200, {'orders': orders})
            return

        # Fallback to static file server (index.html, js, css)
        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        # API Auth: Send Live OTP for Mobile Registration
        if self.path == '/api/auth/send-otp':
            phone = str(data.get('phone', '')).strip()
            if not phone:
                self.send_json(400, {'success': False, 'error': '10-digit mobile number required.'})
                return
            res = db.create_otp(phone)
            self.send_json(200, res)
            return

        # API Auth: Verify Mobile OTP
        if self.path == '/api/auth/verify-otp':
            phone = str(data.get('phone', '')).strip()
            otp = str(data.get('otp', '')).strip()
            if not phone or not otp:
                self.send_json(400, {'success': False, 'error': 'Phone number and 6-digit OTP code required.'})
                return
            res = db.verify_otp(phone, otp)
            status = 200 if res['success'] else 400
            self.send_json(status, res)
            return

        # API: Audited Mathematical Pricing Calculation
        if self.path == '/api/pricing/calculate':
            subtotal = data.get('subtotal', 0)
            distance_km = data.get('distanceKm', 50)
            pricing = db.calculate_pricing(subtotal, distance_km)
            self.send_json(200, {'success': True, 'pricing': pricing})
            return

        # API: Multi-round Counter-Offer Submission
        if self.path == '/api/orders/counter':
            order_id = data.get('orderId')
            proposed_by_role = data.get('role', 'farmer')
            proposed_by_id = data.get('userId', 'farmer-1')
            proposed_by_name = data.get('userName', 'Farmer Ramesh Patel')
            proposed_price = data.get('proposedPrice')
            notes = data.get('notes', '')

            if not order_id or not proposed_price:
                self.send_json(400, {'success': False, 'error': 'orderId and proposedPrice required.'})
                return

            res = db.create_counter_offer(order_id, proposed_by_role, proposed_by_id, proposed_by_name, proposed_price, notes)
            status = 200 if res['success'] else 400
            self.send_json(status, res)
            return

        # API: Respond to Counter-Offer (Accept, Re-counter, Decline)
        if self.path == '/api/orders/counter/respond':
            order_id = data.get('orderId')
            action = data.get('action') # 'accept', 'counter', 'decline'
            user_id = data.get('userId')
            user_name = data.get('userName')
            new_price = data.get('newPrice')
            notes = data.get('notes')

            if not order_id or not action:
                self.send_json(400, {'success': False, 'error': 'orderId and action required.'})
                return

            res = db.respond_counter_offer(order_id, action, user_id, user_name, new_price, notes)
            status = 200 if res['success'] else 400
            self.send_json(status, res)
            return

        # API Auth: Register new account
        if self.path == '/api/auth/register':
            role = data.get('role', 'farmer')
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            phone = data.get('phone', '').strip()
            password = data.get('password', '').strip()
            extra_fields = data.get('extra_fields', {})

            if not name or not email or not phone or not password:
                self.send_json(400, {'success': False, 'error': 'All fields (name, email, phone, password) are required.'})
                return

            result = db.register_user(role, name, email, phone, password, extra_fields)
            status = 201 if result['success'] else 409
            self.send_json(status, result)
            return

        # API Auth: Login
        if self.path == '/api/auth/login':
            identifier = data.get('identifier', '').strip()
            password = data.get('password', '').strip()
            if not identifier or not password:
                self.send_json(400, {'success': False, 'error': 'Identifier (email/phone) and password required.'})
                return

            result = db.login_user(identifier, password)
            status = 200 if result['success'] else 401
            self.send_json(status, result)
            return

        # API Auth: Reset Password
        if self.path == '/api/auth/reset-password':
            identifier = data.get('identifier', '').strip()
            new_password = data.get('newPassword', '').strip()
            if not identifier or not new_password:
                self.send_json(400, {'success': False, 'error': 'Identifier and new password required.'})
                return

            result = db.reset_password(identifier, new_password)
            status = 200 if result['success'] else 404
            self.send_json(status, result)
            return

        # API: Add new crop listing
        if self.path == '/api/crops':
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
            self.send_json(201, {'success': True, 'cropId': crop_id, 'deduplicated': deleted})
            return

        # API: Add new Order with Audited Pricing Breakdown
        if self.path == '/api/orders':
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
            self.send_json(201, {'success': True, 'orderId': order_id, 'pricing': pricing})
            return

        # API: Update Order Status
        if self.path == '/api/orders/status':
            order_id = data.get('orderId') or data.get('id')
            status = data.get('status')
            notes = data.get('notes', '')
            if order_id and status:
                res = db.update_order_status(order_id, status, notes)
                self.send_json(200, res)
                return
            self.send_json(400, {'error': 'orderId and status required'})
            return

        # API: Order review
        if self.path == '/api/orders/review':
            order_id = data.get('orderId')
            rating = data.get('rating', 5.0)
            review_text = data.get('reviewText', '')
            tags = data.get('tags', [])
            res = db.add_order_review(order_id, rating, review_text, tags)
            self.send_json(200, res)
            return

        # API: Update operational profile
        if self.path == '/api/profile':
            user_id = data.get('userId')
            op_data = data.get('profile', {})
            if user_id:
                res = db.update_user_profile(user_id, op_data)
                self.send_json(200, res)
                return
            self.send_json(400, {'error': 'userId required'})
            return

        # API: Reset / Seed full demo data
        if self.path == '/api/demo/seed':
            res = db.reset_full_demo_data()
            self.send_json(200, res)
            return

        self.send_json(404, {'error': 'Endpoint not found'})

    def do_DELETE(self):
        if self.path.startswith('/api/crops'):
            crop_id = None
            if '?id=' in self.path:
                crop_id = self.path.split('?id=')[-1].split('&')[0]
            elif self.path.startswith('/api/crops/'):
                crop_id = self.path.split('/api/crops/')[-1]

            if crop_id:
                res = db.delete_crop(crop_id)
                self.send_json(200, res)
                return
            self.send_json(400, {'error': 'crop id required'})
            return

        self.send_json(404, {'error': 'Endpoint not found'})

    def do_PATCH(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        if self.path.startswith('/api/orders'):
            order_id = data.get('orderId')
            status = data.get('status')
            notes = data.get('notes')
            if order_id and status:
                res = db.update_order_status(order_id, status, notes)
                self.send_json(200, res)
                return
            self.send_json(400, {'error': 'orderId and status required'})
            return

        self.send_json(404, {'error': 'Endpoint not found'})

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

def run_server(port=PORT):
    db.init_db()
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), KisanSetuHandler) as httpd:
        print(f"🌾 KisanSetu HTTP Server & Relational REST API active at http://localhost:{port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer shutting down.")

if __name__ == '__main__':
    run_server(PORT)
