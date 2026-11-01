---
name: "Feature: Interactive Windmill Blade Field Service Flow Page"
about: "Build the master overview flow page with role switcher, step-by-step nuances, and automated simulation triggers."
title: "[FEAT] Interactive Windmill Field Service Flow & Role Switcher Page"
labels: ["enhancement", "frontend", "architecture", "windmill-fsm", "qwen-ready"]
assignees: []
target_model: "qwen3.8-max"
epic: "Windmill Blade Field Operations & Twin-Stream Engine"
priority: "P0 - Blocker"
---

## 📌 Context & Objective
We are building the entry-point **Flow Overview Page** for the Windmill Blade Field Service & Twin-Stream ERP platform.
The objective of this page is to provide clients (e.g., GE Wind, Wind Farm Operators) and internal engineering teams with crystal-clear visibility into the complete operational lifecycle. 

This page serves as an **interactive simulator & architectural roadmap** where stakeholders can switch roles, inspect domain-specific field nuances at each stage, and use an **"Assume Data Ready / Select All"** mechanism to step through the entire sequence from Pre-Departure to Twin-Stream Payroll/Billing reconciliation.

---

## 👥 Personas & Role Switcher Requirements
The top header must include a 4-way **Role Switcher** that dynamically updates the perspective, focus notes, and active stage highlights:

1. **🧗 Blade Repair Technician (IRATA L3 / GWO):**
   - *Focus:* Offline execution, tool & resin QR scans, LOTO physical verification, blade damage mapping, and thermal curing logs.
2. **🏢 GE Client Site Lead / Asset Owner:**
   - *Focus:* Approving BIRR (Blade Inspection & Repair Report), LOTO safety release, reviewing Cat 1-5 structural assessments, and providing legal e-signatures.
3. **👥 HR & Payroll Operations:**
   - *Focus:* **Stream A** financial breakdown: Base travel pay, 100m high-altitude climbing hazard differential, guaranteed weather standby, and per-diem.
4. **💰 Commercial Finance & Billing:**
   - *Focus:* **Stream B** financial breakdown: MSA rate cards ($195/hr for L3), warranty reserve vs asset owner billing split, consumables markup (+18%), and heavy equipment pass-through.

---

## 🛠️ Stage-by-Stage Domain Nuances & Interactive Checklists

### Stage 1: Pre-Departure Verification & Tool Crib Scanner
* **Field Nuance:** Wind farms are located 2–4 hours from base depots. Discovering expired resin or missing heat blankets on-site results in huge mobilization losses ($5,000+ per idle day).
* **Interactive Requirements:**
  - [ ] **GWO & IRATA Validation:** Auto-verifies technician WINDA ID (BST, ART, Blade Repair) and IRATA rope access level.
  - [ ] **Chemical Shelf-Life QR Check:** Scans 2-part epoxy resin batch and hardener. Rejects expired batches or mismatched mix ratios.
  - [ ] **Hardware Calibration:** Verifies calibration dates for silicone heat blankets, vacuum gauges, and micro-ohmmeters.
  - [ ] **Action:** "Select All / Assume Ready" unlocks departure.

### Stage 2: On-Site Arrival, Weather Telemetry & LOTO Guard
* **Field Nuance:** Working at 100m height without cell reception. Rotor rotation during rope access is fatal. High winds (>10 m/s) prevent rope descent; rain stops composite curing.
* **Interactive Requirements:**
  - [ ] **Geofence Check-in:** Matches GPS coordinates to target turbine serial number.
  - [ ] **Live Anemometer & Weather Envelope:** Checks wind (< 10 m/s), RH (< 70%), and substrate temp (> Dew Point + 3°C). Provides "Weather Standby" state if limits are breached.
  - [ ] **Mandatory LOTO Photo:** Requires photo proof of mechanical rotor lock pin engaged and electrical pitch/yaw locks tagged.
  - [ ] **Action:** "Select All / Assume Ready" unlocks tower ascent.

### Stage 3: Interactive Blade Canvas (0m to 80m+)
* **Field Nuance:** Blades have 4 distinct aerodynamic quadrants (Leading Edge, Trailing Edge, Pressure Side, Suction Side) and span lengths up to 80m+.
* **Interactive Requirements:**
  - [ ] **2D Coordinate Mapper:** Selectable span zone (0–10m Root, 10–25m Max Chord, 25–55m Mid-Span, 55–80m Tip).
  - [ ] **Aero Face Toggle:** Switch between LE (erosion prone), TE (bond split prone), PS (windward), and SS (leeward delamination).
  - [ ] **DNV / IEC Severity Categorization:** Cat 1 (Cosmetic), Cat 2 (Surface erosion), Cat 3 (Laminate crack), Cat 4 (Structural shear), Cat 5 (Catastrophic/Fracture).
  - [ ] **Action:** "Select All / Assume Ready" logs defect coordinates (e.g., 68.0m Suction Side Cat 3 delamination).

### Stage 4: Composite Scarf, Vacuum Bagging & Thermal Curing Log
* **Field Nuance:** Composite repair must meet aerospace structural standards. Laminate bevels require a 50:1 taper ratio to distribute shear forces. Epoxy requires an exotherm-controlled ramp/soak/cure thermal curve.
* **Interactive Requirements:**
  - [ ] **Scarf Calculator:** Enter defect depth (e.g., 2.4mm) -> Auto-computes 50:1 bevel scarf radius (120mm).
  - [ ] **Ply Schedule Log:** Tracks replacement fabric schedule (Triaxial 800g/m² + Biaxial 600g/m²).
  - [ ] **Vacuum Bagging Monitor:** Confirms vacuum draw maintained at minimum -0.85 bar.
  - [ ] **Thermal Datalogger:** Closed-loop chart showing 1°C/min ramp -> 70°C dwell for 4 hours -> controlled cool-down.
  - [ ] **LPS Micro-Ohmmeter:** Verifies lightning conductor continuity (< 0.5 Ω).
  - [ ] **Action:** "Select All / Assume Ready" marks composite repair structurally compliant.

### Stage 5: GE Site Representative E-Signature & BIRR Compilation
* **Field Nuance:** Official Blade Inspection & Repair Report (BIRR) is a legally binding handover document required by insurers and OEMs before de-tagging LOTO.
* **Interactive Requirements:**
  - [ ] **BIRR PDF Preview:** Aggregates before/after photos, lot numbers, thermal logs, and coordinates.
  - [ ] **Cryptographic E-Signature Pad:** Captures GE Site Representative digital signature and PIN.
  - [ ] **LOTO Release Authorization:** Digital clearance confirming rotor lock pin can be safely disengaged.
  - [ ] **Action:** "Select All / Assume Ready" triggers the Twin-Stream engine.

### Stage 6: Automated Twin-Stream Engine (Payroll vs Billing)
* **Field Nuance:** Discrepancies between field hours logged and client billing cause millions in dispute delays. A single field sign-off must instantaneously fork into internal payroll and external client billing.
* **Interactive Requirements:**
  - [ ] **Stream A (Internal HR / Technician Payroll):**
    - Base Travel: 2.5 hrs @ $45.00/hr = $112.50
    - Tower Climbing Hazard Pay: 6.5 hrs @ $70.00/hr ($45 base + $25 hazard differential) = $455.00
    - Guaranteed Weather Standby: 1.5 hrs @ $45.00/hr = $67.50
    - Daily Per-Diem (Lodging & Meals): $120.00
    - **Total Pay: $755.00** (Export format: Workday / ADP)
  - [ ] **Stream B (External GE Client Invoicing):**
    - IRATA L3 Rate Card: 6.5 hrs @ $195.00/hr = $1,267.50
    - Billable Weather Standby: 1.5 hrs @ $90.00/hr = $135.00
    - Consumables: Resin & Fabrics ($240.00 + 18% contractual markup) = $283.20
    - Equipment Pass-Through: Skylift ($450.00 + 10% handling fee) = $495.00
    - Warranty Routing: Tagged as non-warranty (Asset Owner direct invoice)
    - **Total Invoice: $2,180.70** (Export format: SAP S/4HANA)
  - [ ] **Reconciliation Strip:** Reconciles Gross Margin ($1,425.70 / 65.4%) in real time.

---

## 💻 Technical Implementation Requirements
1. **Framework:** React / Next.js or Single-Page TypeScript with Tailwind CSS.
2. **State Management:**
   - Active role state (`technician` | `client_lead` | `hr_payroll` | `billing_ops`).
   - Active stage index (`1` through `6`).
   - Checkbox checklist state mapping with `selectAll(stageId)` helper.
3. **Offline Indicator:** Prominent visual badge indicating "100% Offline-First Enabled (SQLite Local Cache)".
4. **Fast-Track Client Accelerator:** Global button: *"⚡ Select All / Assume Ready"* on every stage that automatically checks all requirements and enables the *"Next Step"* transition.

---

## 🎯 Acceptance Criteria
- [ ] Role switcher correctly toggles view context and highlights relevant stage.
- [ ] Each stage displays its specific wind turbine domain nuances.
- [ ] Clicking "Select All / Assume Ready" auto-checks all boxes in the active stage and enables progression.
- [ ] Stage 3 displays an interactive 0m–80m blade canvas with defect pins.
- [ ] Stage 4 displays the scarf calculation and thermal cure profile.
- [ ] Stage 6 displays the side-by-side Twin-Stream financial breakdown with live reconciliation.
