#!/usr/bin/env python3
"""
KisanSetu - National Agricultural Commerce & Logistics Platform
SIH 2026 Entry Point

Launches the KisanSetu Flask Web Application & Production REST API.
"""
import os
import sys

# Ensure UTF-8 output on Windows consoles
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get('PORT', 8080))
    print("🌾 ========================================================")
    print("🌾 KisanSetu - National Agricultural Commerce Platform")
    print(f"🌾 Starting Flask application on port {port}...")
    print("🌾 ========================================================")
    try:
        from app import app
        app.run(host='0.0.0.0', port=port, debug=False)
    except ImportError:
        SRC_DIR = os.path.dirname(os.path.abspath(__file__))
        if SRC_DIR not in sys.path:
            sys.path.insert(0, SRC_DIR)
        from server import run_server
        run_server(port)

if __name__ == '__main__':
    main()
