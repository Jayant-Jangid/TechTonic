# KisanSetu – Direct Agricultural Commerce & Logistics Platform

An integrated digital ecosystem empowering Indian farmers through transparent MSP-benchmarked crop pricing, intermediary-free commercial transactions, multilingual voice assistance, and end-to-end freight tracking.

---

## 1. Project Information

- **Project Title:** KisanSetu – National Agricultural Commerce & Logistics Platform
- **PS ID:** SIH2026-AGRI-001 *(Update with your team's assigned PS ID)*
- **PS Title:** Direct Farmer-to-Consumer Market Linkage and Rural Logistics System
- **Category:** Software
- **Theme:** Smart Agriculture / Rural Development

---

## 2. Problem Statement

Indian agricultural producers frequently face distress selling due to information asymmetry, multiple layers of intermediaries taking significant commission cuts, and delayed payments at local mandis. Small and marginal farmers lack visibility into actual wholesale market demand, Government Minimum Support Price (MSP) spreads, and reliable rural transport networks to deliver harvests directly to bulk buyers and institutional consumers.

---

## 3. Proposed Solution

**KisanSetu** bridges the gap between cultivators, buyers, and rural logistics transporters:
1. **Direct Marketplace:** Eliminates commission middlemen, allowing farmers to list produce directly with transparent weight-based pricing.
2. **MSP Benchmarking & Negotiation:** Compares farmer quotes with official CACP MSP rates and local mandi price averages, enabling interactive multi-round price bargaining.
3. **Voice-First Accessibility:** Provides speech recognition in vernacular Indian languages (Hindi, Punjabi, English) so non-tech-savvy farmers can list harvests effortlessly.
4. **End-to-End Logistics Dispatch:** Connects regional drivers and freight operators with farm pickups, tracking waypoint status from harvest to delivery.
5. **Market Intelligence:** Offers real-time analytics on price realization indices, harvest arrival glut cycles, and state-level e-NAM trade statistics.

---

## 4. Key Features

- **Farmer Portal:** Produce cataloging, quality grade classification, harvest availability scheduling, and real-time earnings ledger.
- **Multilingual Voice Assistant:** Hands-free voice interface for adding listings and navigating features.
- **Wholesale & Retail Marketplace:** Crop filtering by commodity, harvest date, location, and verified farmer badges.
- **Counter-Offer Engine:** Bilateral transparent price negotiations between buyers and farmers.
- **Driver & Freight Module:** Route navigation, load assignment, OTP-based pickup validation, and delivery fulfillment.
- **Agricultural Market Intelligence:** Real-time visual comparison of Mandi vs MSP variances, price deficit alarms, and seasonal supply cycles.
- **Relational Data Layer:** Dual-engine database abstraction supporting plug-and-play SQLite and production MySQL databases.

---

## 5. Technology Stack

- **Frontend:** HTML5, CSS3, Tailwind CSS, Lucide Icons, Chart.js
- **Voice Interface:** Web Speech Recognition & SpeechSynthesis APIs (Hindi / English / Vernacular)
- **Backend API:** Python 3.9+ HTTP Server & REST API Engine (`src/server.py`)
- **Database:** Relational Engine (Pre-seeded SQLite3 `src/kisansetu.db` with native MySQL `mysql_schema.sql` connector support)
- **Datasets:** Agmarknet, CACP MSP benchmarks, and e-NAM trade volumes (`data/`)

---

## 6. Architecture

See [docs/architecture.md](docs/architecture.md) for detailed technical specifications and data flow diagrams.

```text
Cultivators (Voice/Web)       Consumers / Buyers            Drivers / Logistics
         |                             |                             |
         +-----------------------------+-----------------------------+
                                       |
                                       v
                     Frontend Single-Page Application (src/)
                                       |
                                       v
                    REST API Controller (src/server.py :8080)
                                       |
                                       v
                    Relational Data Layer (src/db.py)
                           /                       \
                          v                         v
            SQLite Engine (kisansetu.db)     MySQL (Production Engine)
```

---

## 7. Repository Structure

This repository follows the official [NSUT-SIH-DEMO](https://github.com/NSUT-SIH-26/NSUT-SIH-DEMO) format:

```text
SIH2026/
├── README.md                          # Comprehensive project documentation
├── SUBMISSION_GUIDE.md                # SIH 2026 checklist and submission instructions
├── requirements.txt                   # Project dependencies
├── .gitignore                         # Git exclusion rules
├── LICENSE                            # MIT License
├── submission/                        # Presentation and demo links
│   ├── PRESENTATION.md                # Final PPT presentation instructions and link
│   └── DEMO.md                        # Prototype walkthrough video link
├── docs/                              # Technical architecture and design
│   └── architecture.md                # Component diagrams and API references
├── assets/                            # Media assets and screenshots
│   └── screenshots/
│       └── README.md                  # Screenshots guide and naming standards
├── data/                              # Agricultural market benchmark datasets
│   ├── msp_mandi_variation_2025_2026.csv
│   ├── seasonal_crop_arrivals_realization.csv
│   └── enam_mandis_trade_by_state.csv
└── src/                               # Application source code
    ├── main.py                        # Application entry point
    ├── server.py                      # HTTP REST API server
    ├── db.py                          # Relational database adapter
    ├── setup_mysql.py                 # Database health & verification utility
    ├── mysql_schema.sql               # Production MySQL relational schema
    ├── kisansetu.db                   # Pre-seeded SQLite database
    ├── index.html                     # Web application frontend
    ├── css/
    │   └── custom.css                 # Custom styling
    └── js/                            # Client logic and analytics
        ├── analytics-data.js          # Market intelligence datasets & charts
        ├── app.js                     # Core frontend router and state
        ├── consumer.js                # Consumer marketplace logic
        ├── data.js                    # Crop and commodity data models
        ├── driver.js                  # Driver transit & freight module
        ├── farmer.js                  # Farmer listings & order actions
        └── voice.js                   # Multilingual voice recognition
```

### What goes where?

| Item | Location |
|---|---|
| Source code & UI | `src/` |
| Architecture & technical docs | `docs/` |
| Benchmark market data | `data/` |
| Screenshots & prototype photos | `assets/screenshots/` |
| Final PPT / presentation | `submission/` |
| Demo video link | `submission/DEMO.md` |
| Project overview | `README.md` |

---

## 8. Final Presentation

Keep your final SIH presentation in the repository whenever practical.

See [submission/PRESENTATION.md](submission/PRESENTATION.md) for instructions and format.

---

## 9. Demo Video

Add the YouTube / Google Drive walkthrough link in [submission/DEMO.md](submission/DEMO.md).

---

## 10. Screenshots / Prototype Photos

Store screenshots of key workflows in:

`assets/screenshots/`

See [assets/screenshots/README.md](assets/screenshots/README.md) for suggested naming conventions.

---

## 11. Installation

### Prerequisites
- Python 3.9 or higher

### Steps

```bash
# 1. Clone repository
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>

# 2. Install optional requirements (if using MySQL)
pip install -r requirements.txt
```

---

## 12. Run

### Quick Start (Local SQLite)

Run the entry point script from the repository root:

```bash
python src/main.py
```

Or run the server script directly:

```bash
python src/server.py 8080
```

Open your browser at **`http://localhost:8080`**.

### Verify Database Integrity

To verify database tables, records, and relational schema health:

```bash
python src/setup_mysql.py
```

### Running with MySQL (Optional Production Mode)

Set environment variables before running:

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=kisansetu

python src/setup_mysql.py
python src/main.py
```

---

## 13. Team Members

*(Fill in your team details before final submission)*

- **Team Name:** [Your Team Name]
- **Team Leader:** [Name / Email / GitHub]
- **Member 2:** [Name / Email]
- **Member 3:** [Name / Email]
- **Member 4:** [Name / Email]
- **Member 5:** [Name / Email]
- **Member 6:** [Name / Email]

---

## 14. Future Scope

- **Smart Contract Escrow:** Integration with automated payment escrow released upon verified freight delivery.
- **AI Crop Quality Assessment:** Computer vision grading using camera photos to verify moisture content, discoloration, and grain size.
- **Cold Storage Aggregation:** Real-time booking of nearby solar cold-chain facilities to reduce post-harvest spoilage during arrival gluts.
- **WhatsApp & SMS Gateway:** SMS / IVR bidding alerts for farmers without constant internet connectivity.

---

## Important

Before submission, ensure the repository is public and accessible to reviewers. Do **not** upload passwords, API tokens, `.env` files containing production secrets, or confidential keys.
