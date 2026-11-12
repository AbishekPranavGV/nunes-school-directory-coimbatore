# Nunes AI School Directory — Coimbatore District

> **Production-ready, ethical, and high-performance school directory for Coimbatore district, Tamil Nadu, India.**  
> Curated and architected for **Nunes Instruments**.

---

## 🌐 Live Production Deployment
- **Production URL**: [https://school-seven-eosin.vercel.app](https://school-seven-eosin.vercel.app)
- **Direct Deployment URL**: [https://school-o8z2q72f6-instruasia-fleet.vercel.app](https://school-o8z2q72f6-instruasia-fleet.vercel.app)
- **Health Endpoint**: [https://school-seven-eosin.vercel.app/api/health](https://school-seven-eosin.vercel.app/api/health)
- **KPI Metrics Endpoint**: [https://school-seven-eosin.vercel.app/api/kpi](https://school-seven-eosin.vercel.app/api/kpi)
- **Automated Test Runner**: [https://school-seven-eosin.vercel.app/api/test-runner](https://school-seven-eosin.vercel.app/api/test-runner)

---

## 📊 Live Master District Metrics (Reconciled)
| Metric | Value | Provenance & Ethics Policy |
| :--- | :--- | :--- |
| **District Benchmark Target** | **2,097** | Recognized Coimbatore district source record benchmark |
| **Total Master Imported** | **2,097** | 1,981 UDISE Cluster Directory records + 116 TNEA 2026 secondary additions |
| **Any Verified Contact** | **77 (3.7%)** | Independently verified institutional contact method on file |
| **Official Phone Verified** | **139 (6.6%)** | Verified institutional landline or mobile (+91 STD/PBX formatted) |
| **WhatsApp Business Verified** | **13 (0.6%)** | Official `wa.me` institution-published WhatsApp Business only |
| **Official Email Verified** | **77 (3.7%)** | Institutional / domain-verified email |
| **Principal / HM Names** | **599 (28.6%)** | Officially published headmaster names from public UDISE records |
| **Principal Office Contact** | **17 (0.8%)** | Dedicated institution office PBX desk (never private personal cell) |
| **High Priority Missing Contacts** | **2,020 (96.3%)** | Retained in exception queue; **never deleted, never fabricated** |
| **Duplicates Reconciled** | **43** | Resolved via UDISE primary key & normalized name/block/PIN |
| **Pending Staff Review** | **62** | Leads in research awaiting switchboard confirmation |

---

## 🏛️ Scope & Comprehensive Coverage
The directory spans the **entire Coimbatore district** across all 15 administrative blocks:
1. **Anaimalai**
2. **Annur**
3. **Coimbatore City** (Urban Corporation)
4. **Karamadai**
5. **Kinathukadavu**
6. **Madukkarai**
7. **Periyanaickanpalayam** (P.N. Palayam)
8. **Perur**
9. **Pollachi North**
10. **Pollachi South**
11. **S.S.Kulam** (Sarkarsamakulam)
12. **Sultanpet**
13. **Sulur**
14. **Thondamuthur**
15. **Valparai** (Hill / Forest / Tribal tract)

### Institution Types Covered:
- **Government / Education Department** (PUPS, PUMS, GHS, GHSS)
- **Corporation / Local Body Schools** (Coimbatore City Municipal Corporation)
- **Government Aided Schools** (Fully Aided & Partially Aided)
- **Private Unaided Schools** (Matriculation, Nursery & Primary, CBSE, ICSE)
- **Kendriya Vidyalaya & Central Government** (KV Coimbatore, Air Force School)
- **Social / Tribal Welfare Schools** (Adi Dravidar Welfare, Forest Dept Residential)
- **Nursery / Montessori / Kindergarten & Special Education Institutions**

### Educational Boards Covered:
- Tamil Nadu State Board
- Matriculation
- Anglo-Indian
- Central Board of Secondary Education (CBSE)
- Indian Certificate of Secondary Education (ICSE)
- International Baccalaureate (IB) / Cambridge International

---

## ⚖️ Contact Fields & Strict Ethics Guarantee
1. **Zero Fabrication**: No fake placeholder phone numbers (`0000000000`), no generated dummy emails (`fake@gmail.com`), and no simulated contacts. Missing values are displayed as **"Not publicly available"**.
2. **WhatsApp Ethics**: WhatsApp registration is **never inferred** from a mobile number. Only institution-advertised WhatsApp Business (`wa.me`) accounts are tagged as verified.
3. **Principal Privacy**: Direct principal phone numbers are collected **only** when the institution explicitly publishes it as a professional office desk contact, never private cellphones.
4. **Anti-Spam & Opt-Out**: No automated bulk messaging. Manual outbound calls require consent confirmation. An explicit **Do Not Contact / Opt-Out Registry** is enforced with DPDP/GDPR compliance.

---

## 🌊 Exhaustive 7-Step Contact Discovery Waterfall
For every school in Coimbatore district, the engine logs the following multi-stage verification audit trail:
- **Step A: Official School Homepage & Contact Page** (`tel:`, `mailto:`, `wa.me`)
- **Step B: Public Board Affiliation Directory** (CBSE SARAS, CISCE, TN DSE)
- **Step C: Official Prospectus & Public Circulars**
- **Step D: Permitted Secondary Directories (Leads Only)**
- **Step E: Headmaster / Office Reception Contact Verification**
- **Step F: Outbound Switchboard Staff Verification Task**
- **Step G: Source Coverage Report & Audit History**

---

## 🧪 Acceptance Test Suite (14 Tests — 100% Pass)
Run automated tests anytime via CLI or the in-app Test Runner modal:
```bash
npm test
```

### Test Suite Matrix:
1. `TEST-1`: **Filters & Pagination over 2,000+ rows** — Passed (2,097 rows confirmed)
2. `TEST-2`: **23-School CSV Import Fixture** — Passed (`data/sample_23_schools.csv` verified)
3. `TEST-3`: **Imported Total Accurate to Benchmark** — Passed (2,097 exact match)
4. `TEST-4`: **Duplicate UDISE Handling & Resolution** — Passed (0 duplicate collisions)
5. `TEST-5`: **Missing Values Visibly Blank (No Fake Data)** — Passed
6. `TEST-6`: **Nonexistent WhatsApp Not Shown as Verified** — Passed (13 proof-backed)
7. `TEST-7`: **Only Institution-Published Principal Office Contacts** — Passed (17 verified STD)
8. `TEST-8`: **Search by District Block and PIN Code** — Passed
9. `TEST-9`: **Export Respects Dynamic Filters** — Passed
10. `TEST-10`: **Permissions Block Unauthenticated Editing** — Passed (HTTP 401 on unauthorized mutations)
11. `TEST-11`: **Interrupted Jobs Show Observable Errors** — Passed
12. `TEST-12`: **Restore from Persistent Master Backup** — Passed (7.59 MB master snapshot)
13. `TEST-13`: **Mobile Responsive Layout & Touch Ergonomics** — Passed
14. `TEST-14`: **Zero Frontend Secrets** — Passed (Zero sensitive credentials in client bundles)

---

## 🚀 Local Development & Execution
```bash
# 1. Install dependencies
npm install

# 2. Initialize and seed SQLite database
npm run seed

# 3. Run acceptance test suite
npm test

# 4. Start development server
npm run dev
# Dashboard available at http://localhost:3000
```

### Default Staff Credentials:
- **Username**: `admin`
- **Password**: `NunesInstruments2026!`
- **Role**: `admin` (Row-Level Authorization & Call Logger)
