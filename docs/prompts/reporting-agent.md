# Reporting Agent — Reusable Prompt Template

**Purpose:** Generate a formal Test Summary Report for a feature — consolidating all STLC artifacts into a single sign-off document for stakeholders.  
**When to use:** After the execution log is complete and all defects are logged. This is the final agent in the STLC pipeline.  
**Input required:** All artifacts produced in the pipeline for this feature (listed below)  
**Output location:** `docs/test-artifacts/reports/[FEATURE-NAME]-test-summary-report.md`

---

## How to Use This Template

1. Confirm all upstream artifacts exist:
   - Requirements review: `docs/test-artifacts/requirements/[FEATURE-NAME]-requirement-review.md`
   - Scenarios: `docs/test-artifacts/scenarios/[FEATURE-NAME]-scenarios.md`
   - Test cases: `docs/test-artifacts/test-cases/[FEATURE-NAME]-test-cases.md`
   - Test data: `docs/test-artifacts/test-data/[FEATURE-NAME]-test-data.md`
   - Execution log(s): `docs/test-artifacts/execution/[FEATURE-NAME]-execution-[RUN-ID].md`
   - Defects (if any): `docs/test-artifacts/defects/[FEATURE-NAME]-defects.md`
2. Copy the prompt block below into Claude Code
3. Replace every `[PLACEHOLDER]` with your actual values
4. Run it — review and save

---

## Prompt

```
Act as a Senior QA Lead for the [PROJECT NAME] application.

Generate a formal Test Summary Report for the following feature.

FEATURE DETAILS:
- Feature Name: [FEATURE NAME]
- Feature Description: [one paragraph — what the feature does]
- Requirement document: docs/test-artifacts/requirements/[FEATURE-NAME]-requirement-review.md
- Total Acceptance Criteria: [number]
- Requirement verdict: [READY / NOT READY at the time of requirement review]

PIPELINE ARTIFACTS:
- Scenarios file: docs/test-artifacts/scenarios/[FEATURE-NAME]-scenarios.md
  - Total scenarios: [number] | Types: [list]
- Test cases file: docs/test-artifacts/test-cases/[FEATURE-NAME]-test-cases.md
  - Total test cases: [number] | P1: [number] | P2: [number]
- Test data file: docs/test-artifacts/test-data/[FEATURE-NAME]-test-data.md
  - Total data items: [number] | Critical Risk items: [number]
- Execution log(s): [list all Run IDs and their files]
  - [RUN-ID-1]: [Pass/Fail summary — e.g. 36 Pass, 0 Fail]
  - [RUN-ID-2 if re-run]: [Pass/Fail summary]
- Defects file: docs/test-artifacts/defects/[FEATURE-NAME]-defects.md
  - Total defects raised: [number]
  - Open: [number] | Fixed: [number] | Verified: [number]

FINAL RUN RESULTS (most recent execution):
- Run ID: [FINAL-RUN-ID]
- Total test cases: [number]
- Pass: [number] | Fail: [number] | Blocked: [number] | Skipped: [number]
- Pass rate: [X%]
- AC coverage: [X of Y ACs fully covered]

Generate a Test Summary Report with the following sections:

1. EXECUTIVE SUMMARY
   3–5 sentences. State: what was tested, the final verdict (pass/fail/conditional),
   pass rate, AC coverage, and open defects. Written for a non-technical stakeholder.

2. FEATURE OVERVIEW
   - Feature name and description
   - Requirement document reference
   - Total ACs defined | ACs covered | Coverage %

3. TESTING SCOPE
   Table: What was tested vs what was explicitly out of scope for this cycle.

4. PIPELINE SUMMARY
   Table showing each STLC stage, artifact produced, and status:
   Stage | Artifact | Items | Status

5. TEST RESULTS SUMMARY
   - Final run ID and date
   - Results table: Total | Pass | Fail | Blocked | Skipped | Pass Rate
   - Results by type: Type | Total | Pass | Fail | Pass Rate
   - Results by priority: Priority | Total | Pass | Fail | Pass Rate

6. AC COVERAGE SUMMARY
   Table: AC | Description | Linked TCs | Result
   Footer: X of Y ACs fully covered (X%)

7. DEFECT SUMMARY
   Table: DEF ID | Title | Severity | Priority | Detected In | Status
   - Total raised: [N]
   - Open: [N] — list them. If none: "No open defects."
   - Fixed and verified: [N]
   If no defects: "No defects raised in this test cycle."

8. RISKS AND OBSERVATIONS
   - Any data gaps from the test data file not yet resolved
   - Any test cases that were Partial automation or Skipped
   - Any flaky or slow tests identified during execution
   - Any ACs that have single-TC coverage (single point of failure)

9. TEST METRICS
   Table of key numbers for the record:
   Metric | Value
   - Total scenarios designed
   - Total test cases written
   - Total test data items
   - Critical risk data items
   - Total defects raised
   - Defects open at report date
   - Final pass rate
   - AC coverage %
   - Automation coverage % (automated TCs ÷ total TCs)

10. RECOMMENDATION
    One of:
    - APPROVED FOR RELEASE — all P1 tests pass, no open P1/P2 defects, AC coverage ≥ 95%
    - CONDITIONAL APPROVAL — pass rate ≥ 90%, open defects are P3/P4 only, risk accepted by PM
    - NOT APPROVED — one or more P1 tests failing, or open P1/P2 defects, or AC coverage < 90%

    State the recommendation clearly and give a one-sentence justification.

11. SIGN-OFF
    | Role | Name | Date | Signature |
    |------|------|------|-----------|
    | QA Lead | [NAME] | [DATE] | [Signed] |
    | Developer | — | — | Pending |
    | Product Owner | — | — | Pending |

Save the output to:
docs/test-artifacts/reports/[FEATURE-NAME]-test-summary-report.md

```

---

## Placeholder Reference

| Placeholder | Replace With |
|-------------|-------------|
| `[PROJECT NAME]` | Your app name (e.g. Sumiran) |
| `[FEATURE NAME]` | Full readable feature name |
| `[FEATURE-NAME]` | Kebab-case for filenames (e.g. reflection-prediction) |
| `[FINAL-RUN-ID]` | The most recent execution log Run ID (e.g. RUN-RP-002) |
| `[NAME]` | QA Lead name |
| `[DATE]` | Report date (DD MMM YYYY) |

---

## Recommendation Criteria

| Recommendation | Conditions |
|----------------|-----------|
| **APPROVED FOR RELEASE** | All P1 TCs pass · No open P1/P2 defects · AC coverage = 100% |
| **CONDITIONAL APPROVAL** | Pass rate ≥ 90% · Open defects are P3/P4 only · PM accepts risk in writing |
| **NOT APPROVED** | Any P1 TC failing · Any open P1/P2 defect · AC coverage < 90% |

When in doubt, escalate to NOT APPROVED — it is always safer to raise a flag than to approve silently.

---

## Pipeline Position

The Report is the final artifact. It consumes every upstream artifact and produces a single stakeholder-facing document:

```
Requirements  →  Scenarios  →  Test Cases  →  Test Data
                                                   ↓
                              Defects  ←  Execution Log
                                 ↓
                            TEST SUMMARY REPORT  ← you are here
```

---

## Example (for reference)

- Project: `Sumiran`
- Feature: `Reflection Card YTD Milestone Prediction`
- Final run: `RUN-RP-002` — 36 Pass, 0 Fail, 100% pass rate
- Defects: 1 raised (DEF-RP-001, hypothetical, Open)
- AC coverage: 20/20 (100%)
- Recommendation: APPROVED FOR RELEASE
- Output: `docs/test-artifacts/reports/reflection-prediction-test-summary-report.md`
