# KisanSetu – Direct Agricultural Commerce & Logistics Platform

An integrated digital ecosystem empowering Indian farmers through transparent MSP-benchmarked crop pricing, intermediary-free commercial transactions, multilingual voice assistance, and end-to-end freight tracking.

---

## 1. Project Information

- **Project Title:** KisanSetu – National Agricultural Commerce & Logistics Platform
- **PS ID:** 26033
- **PS Title:** Multiple intermediaries reduce farmers earnings and increase consumer prices
- **Category:** Software
- **Theme:** Agriculture, FoodTech & Rural Development
- **Deployed Website:** [KisanSetu - National Agricultural Commerce and Logistics Portal](https://techtonic-tt2k.onrender.com)

---

## 2. Problem Statement

Expected Solution: Create a digital marketplace that:

• Connects farmers/FPOs directly with consumers and bulk buyers.
• Provides logistics support.
• Uses AI for demand forecasting and route optimization.

Benefits:

• Better prices for farmers.
• Lower prices for consumers.
• Reduced supply chain inefficiencies.

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

## 8. Demo Video

Add the YouTube / Google Drive walkthrough link in [submission/DEMO.md](submission/DEMO.md).

---

## 9. Screenshots / Prototype Photos

Store screenshots of key workflows in:

`assets/screenshots/`

See [assets/screenshots/README.md](assets/screenshots/README.md) for suggested naming conventions.

---

## 10. Installation

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

## 11. Team Members

- **Team Name:** TechTonic
- **Member 1:** Vaishnavi Jha
- **Member 2:** Dhruv Khanna
- **Member 3:** Divyanshu Sharma
- **Member 4:** Arnav Gupta
- **Member 5:** MD Ubesh
- **Member 6:** Jayant Jangid

---

## 12. Future Scope

- **Smart Contract Escrow:** Integration with automated payment escrow released upon verified freight delivery.
- **AI Crop Quality Assessment:** Computer vision grading using camera photos to verify moisture content, discoloration, and grain size.
- **Cold Storage Aggregation:** Real-time booking of nearby solar cold-chain facilities to reduce post-harvest spoilage during arrival gluts.
- **WhatsApp & SMS Gateway:** SMS / IVR bidding alerts for farmers without constant internet connectivity.

---