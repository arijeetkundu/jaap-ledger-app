# Coverage Analysis Agent — Reusable Prompt Template

**Purpose:** Audit existing source code against existing test files to identify untested behaviours — ranked by risk. The output feeds directly into the Test Case Agent to close coverage gaps.  
**When to use:**
- Joining a project mid-way and assessing test health
- After a new feature ships — checking it was fully tested
- Periodic quality audit (monthly, pre-release)
- Before running the Test Case Agent on an unfamiliar area

**Input required:** Source files (components, logic, db) + existing test files (unit, E2E)  
**Output location:** `docs/test-artifacts/coverage/[SCOPE]-coverage-gap-report.md`

---

## How to Use This Template

1. Decide your scope — full codebase audit, a single feature, or a single layer (logic only, E2E only)
2. List the source files and test files relevant to that scope
3. Copy the prompt block below into Claude Code
4. Replace every `[PLACEHOLDER]` with your actual file lists
5. Run it — the output is a gap report + a ready-to-paste input for the Test Case Agent

---

## Prompt

```
Act as a Senior QA Analyst performing a test coverage audit for the [PROJECT NAME] application.

SCOPE: [Full codebase / Feature name / Layer name]

SOURCE FILES TO AUDIT:
[List each file on its own line, e.g.:]
- src/components/TodayCard.jsx
- src/logic/milestoneLogic.js
- src/db/db.js

EXISTING TEST FILES:
Unit tests:
[List each unit test file, e.g.:]
- src/tests/unit/milestoneLogic.test.js
- src/tests/unit/ledgerLogic.test.js

E2E tests:
[List each E2E test file, e.g.:]
- src/tests/e2e/app.spec.js
- src/tests/e2e/reflection-prediction.spec.js

API tests: [List files or write "None — no API layer"]

For each source file, read the code and extract every distinct testable behaviour.
A testable behaviour is any logic that:
- Produces a visible output (UI change, rendered value, format)
- Makes a decision (if/else, threshold, filter, calculation)
- Reads or writes data (IndexedDB get/put/delete)
- Has a boundary (minimum, maximum, threshold, edge case)
- Can fail or produce an error state

For each testable behaviour, determine:
1. BEHAVIOUR ID: BEH-[NNN] (sequential)
2. BEHAVIOUR: plain English description — what the code does
3. SOURCE: file path + function name + approximate line number
4. TEST TYPE: Unit / E2E / Both / API (which type of test best covers this)
5. RISK: 
   - High: data integrity, incorrect calculation, security, data loss
   - Medium: user flow broken, wrong display, missing feature
   - Low: cosmetic, label wording, minor layout
6. COVERAGE STATUS:
   - Fully Covered: at least one test explicitly asserts this exact behaviour
   - Partially Covered: a test touches this code path but does not assert the specific behaviour
   - Not Covered: no test exists for this behaviour
7. EVIDENCE: test file + test name that covers it (or "none")

Then produce four sections:

SECTION 1 — FULL COVERAGE TABLE
All behaviours in a table:
BEH ID | Behaviour | Source | Test Type | Risk | Status | Evidence

SECTION 2 — COVERAGE METRICS
- Total behaviours identified: X
- Fully Covered: X (X%)
- Partially Covered: X (X%)
- Not Covered: X (X%)
- High Risk gaps: X
- Medium Risk gaps: X
- Low Risk gaps: X

SECTION 3 — PRIORITY GAP LIST
Only the Not Covered and Partially Covered items, sorted:
1. High Risk first
2. Medium Risk second
3. Low Risk last

For each gap:
BEH ID | Behaviour | Source | Risk | Recommended Test Type | Why it matters

SECTION 4 — TEST CASE AGENT INPUT
Produce a ready-to-paste block for the Test Case Agent.
Format each gap as a scenario block:

[BEH-ID] | [Risk as Priority: High=P1, Medium=P2, Low=P3] | [Recommended Test Type]
[Behaviour as a scenario title]
[2-sentence description of what to test and why]
AC: [derived from the behaviour — write as a testability statement]

Save the output to:
docs/test-artifacts/coverage/[SCOPE]-coverage-gap-report.md

```

---

## Placeholder Reference

| Placeholder | Replace With |
|-------------|-------------|
| `[PROJECT NAME]` | Your app name (e.g. Sumiran) |
| `[SCOPE]` | What you're auditing: `full-codebase`, `today-card`, `ledger`, `reflection-card`, etc. |
| Source files | All `.jsx`, `.js` files in `src/components/`, `src/logic/`, `src/db/` relevant to scope |
| Unit test files | All `.test.js` files in `src/tests/unit/` |
| E2E test files | All `.spec.js` files in `src/tests/e2e/` |

---

## Scope Options — When to Use Each

| Scope | Source Files | When |
|-------|-------------|------|
| **Full codebase** | All components + logic + db | Pre-release audit, onboarding to a new project |
| **Single feature** | Files for that feature only | After shipping a feature |
| **Logic layer only** | `src/logic/*.js` | When unit test coverage is suspected low |
| **E2E layer only** | `src/components/*.jsx` | When E2E coverage is suspected low |
| **Single file** | One file | Deep dive on a high-risk function |

---

## Risk Classification Guide

| Risk | Examples |
|------|---------|
| **High** | Milestone calculation wrong, YTD average incorrect, IndexedDB write fails, duplicate date handling, count = 0 exclusion logic, data export produces corrupt file |
| **Medium** | Edit lock not enforced, Poornima not detected, YTD line shows when threshold not met, date format wrong, Indian number format not applied |
| **Low** | Label wording, colour, spacing, tooltip text, placeholder text |

---

## Coverage Status — How to Determine It

| Status | Criteria |
|--------|---------|
| **Fully Covered** | A test explicitly asserts the exact value, exact condition, or exact behaviour. Example: `expect(result.averagePerDay).toBe(51200)` |
| **Partially Covered** | A test exercises the code path but asserts something else. Example: a test saves an entry (triggers IndexedDB write) but only checks the UI, not the stored value |
| **Not Covered** | No test file contains any assertion related to this behaviour |

When in doubt, mark as Partially Covered — it is better to flag something and find it's covered than to miss a real gap.

---

## How the Output Feeds the Pipeline

The Section 4 output (Test Case Agent Input) is designed to paste directly into the Test Case Agent prompt:

```
Coverage Analysis  →  Section 4 gap list
                            ↓
                    Test Case Agent  (paste Section 4 as "SCENARIOS TO CONVERT")
                            ↓
                    Test Cases  →  Test Data  →  Automation  →  Execution
```

This means a coverage gap found today becomes a passing automated test by end of the same cycle.

---

## Sumiran — Full File List for Reference

**Source files (all):**
```
src/components/TodayCard.jsx
src/components/Ledger.jsx
src/components/ReflectionCard.jsx
src/components/SettingsPanel.jsx
src/components/SankalpePage.jsx
src/components/AntaryatraPage.jsx
src/components/AntaryatraArchivePage.jsx
src/components/SplashScreen.jsx
src/logic/milestoneLogic.js
src/logic/ledgerLogic.js
src/logic/formatIndianNumber.js
src/logic/antaryatraLogic.js
src/logic/palette.js
src/db/db.js
```

**Test files (all):**
```
src/tests/unit/milestoneLogic.test.js
src/tests/unit/ledgerLogic.test.js
src/tests/unit/formatIndianNumber.test.js
src/tests/unit/antaryatraLogic.test.js
src/tests/e2e/app.spec.js
src/tests/e2e/reflection-prediction.spec.js
```

---

## Example (for reference)

- Project: `Sumiran`
- Scope: `full-codebase`
- Source files: 14 (all components + logic + db)
- Test files: 6 (4 unit + 2 E2E)
- Expected output: behaviours table + metrics + priority gap list + Test Case Agent input block
- Output file: `docs/test-artifacts/coverage/full-codebase-coverage-gap-report.md`
