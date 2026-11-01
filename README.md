# Windmill Blade Field Service & Twin-Stream ERP Platform

An enterprise-grade, **100% Offline-First Field Service & Asset Intelligence Platform** engineered specifically for Windmill Blade Manufacturing and In-Field Blade Maintenance (GE / OEM Wind Turbines).

---

## 🚀 Live Interactive Flow Simulator
You can view and test the complete end-to-end interactive workflow directly:
- **Local Preview:** Open `index.html` in any web browser.
- **Includes:**
  - 4-Role Profile Switcher (Technician, GE Site Lead, HR Payroll, Billing/Finance).
  - 6-Stage Lifecyle Stepper with Wind Turbine Domain Nuances.
  - "Select All / Assume Ready" accelerator button to test automated data handover.
  - Interactive 0m to 80m Blade Canvas with DNV Cat 1–5 defect pins.
  - Live Twin-Stream calculation engine (HR Payroll vs Client Invoicing).

---

## 📑 Repository Structure

```text
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── 01_feat_interactive_flow_page.md   # GitHub Issue Spec with YAML Frontmatter
├── docs/
│   └── Windmill_Blade_Field_Service_Detailed_Prompt_and_Domain_Spec.md  # Deep Domain Study & LLM System Prompt
├── index.html                                 # Standalone Interactive Flow Simulator
└── README.md                                  # Project Documentation
```

---

## 👥 4 Role Personas

1. **🧗 Blade Repair Technician (IRATA L3 / GWO):** Pre-departure tool/chemical verification, LOTO safety lock, interactive blade damage mapping, and composite curing logs.
2. **🏢 GE Client Site Lead / Asset Owner:** Reviewing BIRR technical report, verifying LOTO release, and providing legal digital authorization.
3. **👥 HR & Technician Payroll Administrator:** Stream A review - base travel pay, high-risk climbing hazard differential ($25/hr), weather standby, and per-diem.
4. **💰 Commercial Finance & Billing Specialist:** Stream B review - contractual MSA rate cards ($195/hr for L3), warranty vs client liability split, and materials markup (+18%).

---

## ⚡ The Twin-Stream Engine

A single field job completion with client e-signature instantaneously branches into two reconciled streams:

```
[ Field Job Completion: Time + Materials + LOTO + Geolocation + BIRR Signed ]
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
[ STREAM A: TECHNICIAN PAYROLL (HR) ]       [ STREAM B: GE CLIENT BILLING (FINANCE) ]
• Travel Hours @ Base Hourly Rate           • Contractual MSA Rate Cards per Labor Tier:
• Tower Climbing / Rope Rigging @ Hazard      - IRATA Level 3 Lead: $195/hr
  Differential (+$25/hr)                      - Composite Blade Specialist: $145/hr
• Weather Standby (Wind > 10m/s) @ 100%       - Ground / Safety Watch: $95/hr
  Guaranteed Base Rate                      • Weather Standby: Contractual Billable Rate ($90/hr)
• Per-Diem Meal & Lodging Allowance         • Consumables: Cost + 18% Markup
• Vehicle Mileage / Equipment Towing Rate   • Heavy Equipment Pass-through (Skylift/Crane) + 10% Fee
                                            • Warranty Routing (OEM Defect -> Warranty Reserve vs
                                              Asset Owner Invoicing)
```
