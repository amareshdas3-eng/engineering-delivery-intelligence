# Engineering Delivery Intelligence (EDI) ⚡
> **"From Project Data to Evidence-Based Engineering Decisions."**  
> AI-assisted project assurance platform for electrical EPC, industrial infrastructure, project controls, and commissioning teams.

Built by a Senior Electrical Engineering & Industrial Project Management Professional with **23+ years of industrial delivery experience**.

- **Live Published Application:** [https://amareshdas3-eng.github.io/engineering-delivery-intelligence/](https://amareshdas3-eng.github.io/engineering-delivery-intelligence/)
- **GitHub Repository:** [https://github.com/amareshdas3-eng/engineering-delivery-intelligence](https://github.com/amareshdas3-eng/engineering-delivery-intelligence)

---

## 🌟 Overview & Key Capabilities

Most project controls dashboards display progress percentages (e.g., "85% complete") while unapproved vendor drawings, unresolved cross-party interface details, and unverified punch list items quietly create commissioning bottlenecks.

**Engineering Delivery Intelligence (EDI)** combines deep industrial engineering governance with deterministic rule engines and an adversarial 6-agent assurance swarm to surface genuine delivery risks before energization.

### Core Features
1. **Executive Control Tower:** Deterministic Project Health Score (0–100) derived from documented penalty models across Schedule, MDR, Interfaces, and Punch lists.
2. **Deterministic-First Assurance Engine:** Evaluates baseline vs. forecast slips, primary-key collisions, overdue vendor submissions, and closed punch items lacking closure protocols.
3. **6-Agent Epistemic Swarm:**
   - `AGT-01`: Data Integrity & Schema Agent (computes SHA-256 dataset digest)
   - `AGT-02`: Schedule & Critical-Chain Agent (slip & float erosion analysis)
   - `AGT-03`: MDR & Interface Cross-Examination Agent (vendor document gaps)
   - `AGT-04`: Commissioning Readiness & Punch Agent (Category A energization blockers)
   - `AGT-05`: Adversarial Epistemic Auditor (Zero-Trust gate: blocks hallucinated citations)
   - `AGT-06`: Executive Brief Synthesizer (decision brief generation)
4. **Evidence-Driven Risk Register:** Side-by-side inspector showing machine-observed facts, evidence available, and missing evidence.
5. **Human-in-the-Loop Validation:** Qualified engineers record review decisions (`ACCEPTED`, `REJECTED`, `MORE_EVIDENCE_REQUIRED`) with immutable timestamps and comments.
6. **Spreadsheet Security (CWE-1236):** Automatic formula injection sanitization on CSV export.
7. **Print-Ready Executive Brief:** One-page clean decision brief for project directors.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js:** v18+ (tested on Node v24.19.0)
- **npm:** v9+

### 2. Installation
```bash
# Clone and enter workspace
cd "d:\Electrical\Digital\Engineering Delivery Intelligence (EDI)"

# Install dependencies
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Automated Test Suite
```bash
npm test
```
Executes Vitest suite verifying the 10-anomaly Test Oracle, deterministic engine, and CWE-1236 formula sanitization.

### 5. Build Production Bundle
```bash
npm run build
```

---

## 📁 Repository Structure

```text
├── src/
│   ├── types/
│   │   └── edi.ts                      # Core TypeScript data contracts & epistemic types
│   ├── data/
│   │   └── syntheticProjectData.ts     # Project EDI-001 (65 records) & Test Oracle
│   ├── engine/
│   │   ├── assuranceEngine.ts          # Deterministic rule engine & SHA-256 digest
│   │   ├── agentOrchestrator.ts        # 6-Agent Swarm with Zero-Trust Epistemic Gate
│   │   └── __tests__/
│   │       └── assuranceEngine.test.ts # Vitest suite (100% pass on 10 anomalies)
│   ├── utils/
│   │   └── csvSecurity.ts              # CWE-1236 formula injection guard & CSV parsers
│   ├── App.tsx                         # Enterprise React application
│   ├── index.css                       # Industrial design system (Navy & Electric Blue)
│   └── main.tsx                        # React application entrypoint
├── docs/
│   ├── GOOGLE_SITES_PORTFOLIO.md       # Complete ready-to-paste Google Sites portfolio copy
│   ├── TWO_MINUTE_VIDEO_STORYBOARD.md  # 120-second screen recording script & timecodes
│   ├── ENGINEERING_CASE_STUDY.md       # Technical case study whitepaper
│   └── RELEASE_CHECKLIST.md            # 15-point governance & security gate report
├── package.json
└── vite.config.ts
```

---

## 🛡️ Engineering Governance Mandate
> **Notice:** AI-assisted project assurance. Findings require verification by an appropriately qualified engineer or authorised project professional. This application does not approve energization, certify safety, authorise commissioning, or replace approved project procedures.
