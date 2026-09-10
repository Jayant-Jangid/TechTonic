# System Architecture – KisanSetu

KisanSetu is a direct agricultural commerce and supply-chain logistics platform engineered to eliminate intermediary exploitation, offer algorithmic price recommendations against official Minimum Support Prices (MSP), and streamline farm-to-door freight dispatch.

## 1. High-Level Flow

```text
  +-----------------------------------------------------------------------+
  |                             Client Tier                               |
  |                                                                       |
  |   +-------------------+  +---------------------+  +-----------------+ |
  |   |  Farmer Portal    |  | Consumer / Business |  | Driver Transit  | |
  |   |  • Voice Assist   |  | • Live Marketplace  |  | • Load Pickup   | |
  |   |  • MSP Benchmarks |  | • Price Negotiation |  | • Live Route    | |
  |   +---------+---------+  +----------+----------+  +--------+--------+ |
  +-------------|-----------------------|----------------------|----------+
                |                       |                      |
                |          HTTP / JSON  v                      |
  +-------------v----------------------------------------------v----------+
  |                             Backend Tier                              |
  |                                                                       |
  |   +---------------------------------------------------------------+   |
  |   |                  KisanSetu REST API Engine                    |   |
  |   |                   (src/server.py / port 8080)                 |   |
  |   |                                                               |   |
  |   |  • /api/health          • /api/crops       • /api/orders      |   |
  |   |  • /api/negotiations    • /api/auth/otp    • /api/drivers     |   |
  |   +-------------------------------+-------------------------------+   |
  +-----------------------------------|-----------------------------------+
                                      |
                                      v
  +-----------------------------------------------------------------------+
  |                            Database Tier                              |
  |                                                                       |
  |   +---------------------------------------------------------------+   |
  |   |            Relational Database Adapter (src/db.py)            |   |
  |   |                                                               |   |
  |   |  [Primary / Fallback]                 [Production Option]     |   |
  |   |   SQLite (kisansetu.db)   <-------->   MySQL Engine           |   |
  |   |   • Users                 • Crops      (mysql_schema.sql)     |   |
  |   |   • Orders                • Drivers                           |   |
  |   |   • OTP Verifications     • Counter-Offers                    |   |
  |   +---------------------------------------------------------------+   |
  +-----------------------------------------------------------------------+
```

## 2. Core Components

### 2.1. Frontend Single-Page Application (`src/index.html`)
- **Responsive UI**: Built with Tailwind CSS and responsive flex/grid layouts.
- **Role Portals**: Dedicated switchable experiences for **Farmers**, **Wholesale Consumers / Traders**, and **Logistics Drivers**.
- **Multilingual Voice Assistant (`src/js/voice.js`)**: Real-time voice recognition allowing vernacular voice commands in Hindi, English, and regional dialects for farmers.
- **Predictive Analytics & Visualization (`src/js/analytics-data.js`)**: Interactive Chart.js graphs mapping MSP vs Mandi price spreads, seasonal arrival indices, and state-wise e-NAM volume.

### 2.2. Backend REST API (`src/server.py`)
- Python-powered HTTP server exposing cross-origin REST endpoints.
- Validates user sessions, OTP authentication, order dispatch, status state transitions, and price negotiations.
- Zero external backend framework dependencies by default (utilizes Python standard library `http.server`, `socketserver`, and `json`).

### 2.3. Relational Data Layer (`src/db.py` & `src/mysql_schema.sql`)
- Provides an automated dual-engine abstraction:
  - **SQLite3 (`src/kisansetu.db`)**: Pre-seeded relational database for instant out-of-the-box local operation with zero server setup.
  - **MySQL Engine**: Production-ready connection support via `pymysql` or `mysql.connector`, controlled through environment variables (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`).
- Enforces relational referential integrity across users, crops, orders, counter-offers, and delivery tracking.

## 3. Key REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and active relational database engine |
| `GET` | `/api/crops` | Retrieve all active crop listings with pricing and farmer details |
| `POST` | `/api/crops/add` | Publish a new harvest batch with MSP benchmarks |
| `GET` | `/api/orders` | Retrieve current consumer and farmer orders |
| `POST` | `/api/orders/create` | Place a new purchase order with delivery address & payment mode |
| `POST` | `/api/orders` | Update order status (`confirmed`, `in_transit`, `delivered`) |
| `GET` | `/api/negotiations` | Fetch active counter-offer negotiations for a crop or order |
| `POST` | `/api/negotiations/submit` | Propose or accept a negotiated price per quintal |
| `POST` | `/api/auth/otp/send` | Issue one-time verification passcode for farmer/driver onboarding |
| `POST` | `/api/auth/otp/verify` | Validate OTP passcode and verify identity |

## 4. Market Intelligence Datasets (`data/`)

KisanSetu incorporates benchmark price and supply indicators extracted from CACP, Agmarknet, and e-NAM reports:
- `data/msp_mandi_variation_2025_2026.csv`: 2025–2026 MSP vs mandi spot price variance across Kharif and Rabi commodities.
- `data/seasonal_crop_arrivals_realization.csv`: Monthly harvest arrival indices and price realization cycles.
- `data/enam_mandis_trade_by_state.csv`: State-level distribution of integrated agricultural mandis, trade volume (MT), and trade turnover.
