# Field Service FSM - Master Orchestrator & Alibaba Cloud Coding Invariants

## Core Invariant: All Coding Must Happen via GitHub Issues using Alibaba Cloud Keys
1. **Orchestrator Role Only:**
   - The primary agent acts as the Master Orchestrator.
   - **All coding is dispatched, executed, and tracked strictly through GitHub Issues on `kathirvelmurugan/field-service`.**
   - No direct unprompted code changes without a formal corresponding GitHub Issue.
2. **Issue Format & Specifications:**
   - Every GitHub issue must specify:
     - Clear Technical Objective & Context
     - Target Files & Directories
     - Data Contracts & TypeScript interfaces
     - Acceptance Criteria & Automated Unit Test Requirements
     - Model Target: `qwen3.8-max` (Alibaba Cloud DashScope API)
3. **Alibaba Cloud Key Concurrency & Rate Limit Management:**
   - Use a **single concurrent channel** for Alibaba Cloud API workers to avoid 429/TPM throttling.
   - Employ **adaptive delay polling** (15s–45s backoff) based on task complexity; avoid tight 2-second polling loops.
4. **Data Security & Name Scrubbing:**
   - Strictly prohibit the personal name "Kathirvel" anywhere in the application, data models, comments, or commit messages. Use authentic field names: `Adrian Lewis`, `Emmanuel Arcon Gonzalez`, `David Nunez`, `Marcus Vance`, `V. Prasanth`.
   - Neutralize all financial numbers and project quotes with ±5% variance. Zero confidential client data.
5. **Full-Stack Architecture Standard:**
   - The application is a production React 18 SPA (`client/`) powered by a Node.js + Express REST API (`server/`) with automated tests (`server/tests/`).
   - Monolithic plain HTML mockups are strictly prohibited.
