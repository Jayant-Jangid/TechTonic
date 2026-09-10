#!/usr/bin/env python3
"""
KisanSetu - National Agricultural Commerce & Logistics Platform
SIH 2026 Entry Point

Launches the KisanSetu HTTP Server, Relational REST API, and static asset pipeline.
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

# Ensure src directory is in Python module search path
SRC_DIR = os.path.dirname(os.path.abspath(__file__))
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from server import run_server, PORT

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    print("🌾 ========================================================")
    print("🌾 KisanSetu - National Agricultural Commerce Platform")
    print(f"🌾 Starting application on port {port}...")
    print("🌾 ========================================================")
    run_server(port)

if __name__ == '__main__':
    main()
