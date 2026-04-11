# Module 02b — Test Coverage Analysis Agent

## What This Agent Does

This agent is an **audit tool** — it runs on an existing codebase and existing test suite to answer one question:

> "What behaviour exists in this application that has no test coverage?"

It is NOT a requirements analysis agent. It does not review incoming requirements. It reverse-engineers testable behaviours from written code and compares them against existing tests.

**Use this agent when:**
- You join a project mid-way and need to assess test coverage quickly
- After a new feature is released, to check if it was tested
- As a periodic quality audit (e.g., monthly)
- Before a major release, to find uncovered high-risk areas

---

## Where It Sits in the STLC

```
  Existing Codebase  +  Existing Test Suite
          │
          ▼
  [TEST COVERAGE ANALYSIS AGENT]   ← This module
  Reads: source code files + test files
  Produces: coverage gap report + risk-ranked list
          │
          ▼
  Gap list feeds into → Test Scenario Agent (Module 03)
  for prioritised test creation
```

---

## The Agent Prompt

Copy everything inside the box and paste it into Claude Code:

```
Act as a Senior QA Analyst performing a test coverage audit.

Read the following SOURCE files to identify all testable behaviours:
- src/components/TodayCard.jsx
- src/components/Ledger.jsx
- src/components/ReflectionCard.jsx
- src/components/SettingsPanel.jsx
- src/logic/ledgerLogic.js
- src/logic/milestoneLogic.js
- src/logic/formatIndianNumber.js
- src/logic/antaryatraLogic.js
- src/db/db.js

Read the following TEST files to identify what is already covered:
- src/tests/e2e/app.spec.js
- src/tests/unit/ledgerLogic.test.js
- src/tests/unit/milestoneLogic.test.js
- src/tests/unit/formatIndianNumber.test.js
- src/tests/unit/antaryatraLogic.test.js

For each testable behaviour found in the source files:
1. BEHAVIOUR: describe it in plain English
2. SOURCE: which file and function it comes from
3. RISK: High / Medium / Low (based on: data integrity > user flow > visual)
4. COVERAGE STATUS: Fully Covered / Partially Covered / Not Covered
5. EVIDENCE: which specific test covers it (or "none")

Then produce:
- A COVERAGE SUMMARY TABLE (all behaviours)
- A PRIORITY GAP LIST (Not Covered items, ranked by Risk: High first)
- COVERAGE METRICS:
    Total behaviours identified: X
    Fully covered: X (X%)
    Partially covered: X (X%)
    Not covered: X (X%)

Save the output to:
docs/test-artifacts/scenarios/coverage-analysis.md
```

---

## Why Logic and DB Files Matter

Notice this prompt reads **more files** than the original Module 02 prompt did. Here is why each category is important:

| File Type | What It Reveals |
|-----------|----------------|
| `src/components/*.jsx` | User-facing features — what the user sees and interacts with |
| `src/logic/*.js` | Business rules — date calculations, milestone logic, Poornima detection, locking rules |
| `src/db/db.js` | Data model — what is stored, how it is retrieved, what happens if storage fails |

If you skip the logic files, you miss requirements like:
- The 7-day edit lock (`isWithinSevenDays`)
- Poornima keyword detection (`isPoornima`)
- Indian number formatting rules

If you skip the db file, you miss:
- What fields are required vs optional
- What happens when IndexedDB fails
- Whether duplicate dates are allowed or overwritten

---

## Exercise — Run the Coverage Analysis on Sumiran

Paste the agent prompt above into Claude Code and run it now against the Sumiran project.

Compare the output with the `requirements-analysis.md` file you created earlier. They should largely agree on the gaps — but the coverage analysis will be more precise because it reads the logic and db files too.

---

## How the Two Module 02 Agents Work Together

| | Requirements Analysis (02) | Coverage Analysis (02b) |
|-|---------------------------|------------------------|
| **Runs when** | A new requirement arrives | An audit is needed |
| **Input** | A written requirement document | Existing source code + test files |
| **Output** | Improved requirement ready for testing | List of untested behaviours |
| **Feeds into** | Test Scenario Agent (for the new feature) | Test Scenario Agent (for gap coverage) |

---

**Next:** [Module 03 — Test Scenario Agent](./03-test-scenario-agent.md)
