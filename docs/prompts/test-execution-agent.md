# Test Execution Agent — Reusable Prompt Template

**Purpose:** Record the formal execution results of a test run — pass/fail per test case, environment, tester, date, and a run-level summary.  
**When to use:** After running test cases (manual or automated) — before defect logging or reporting.  
**Input required:** Test cases from `docs/test-artifacts/test-cases/[FEATURE-NAME]-test-cases.md` + actual execution results  
**Output location:** `docs/test-artifacts/execution/[FEATURE-NAME]-execution-[RUN-ID].md`

---

## How to Use This Template

1. Run your test cases — manually or via automation (`npm test`, `npm run test:e2e`)
2. Note the result for each test case: Pass / Fail / Blocked / Skipped
3. For each failure, note the actual result observed
4. Copy the prompt block below into Claude Code
5. Replace every `[PLACEHOLDER]` with your actual run details
6. Paste each test case result into the EXECUTION RESULTS section
7. Run it — review the output before saving

---

## Prompt

```
Act as a Senior QA Engineer for the [PROJECT NAME] application.

Record a formal test execution log for the following test run.

RUN DETAILS:
- Run ID: [RUN-ID] (format: RUN-[FEATURE-PREFIX]-[NNN], e.g. RUN-RP-001)
- Feature: [FEATURE NAME]
- Tester: [NAME]
- Execution Date: [DATE]
- Environment: [Browser + version, OS, app URL]
- Branch: [git branch name]
- Commit: [git commit hash — short form, 7 chars]
- Test Types Executed: [e.g. Happy Path, BVA, Negative, State, Regression, UI, Integration]
- Execution Mode: [Manual / Automated (Vitest) / Automated (Playwright) / Both]
- Total Test Cases in Suite: [number]

EXECUTION RESULTS:
[For each test case provide the following. Copy this block once per test case.]

TC ID: [ID]
Title: [one-line title]
Type: [Happy Path / BVA / Negative / State / Regression / UI / Integration]
Priority: [P1 / P2]
Result: [Pass / Fail / Blocked / Skipped]
Actual Result: [For Pass: "As expected." For Fail: describe exactly what went wrong. For Blocked: state the blocker. For Skipped: state the reason.]
Defect ID: [DEF-XX-NNN if a defect was raised, else —]

[REPEAT FOR EACH TEST CASE]

Produce a formal test execution log with the following sections:

1. RUN SUMMARY
   - Run ID, Feature, Tester, Date, Environment, Branch, Commit
   - Execution mode
   - Total: Pass | Fail | Blocked | Skipped
   - Pass rate: X%

2. EXECUTION RESULTS TABLE
   Columns: TC ID | Title | Type | Priority | Result | Defect ID
   Sort by: Type, then Priority within each type

3. PASS/FAIL BY TYPE
   Table: Type | Total | Pass | Fail | Blocked | Skipped | Pass Rate

4. PRIORITY BREAKDOWN
   Table: Priority | Total | Pass | Fail | Pass Rate

5. FAILED TEST CASES — DETAIL
   For each failed test case:
   - TC ID and title
   - Steps executed
   - Expected result
   - Actual result
   - Defect ID raised
   (If no failures: state "No failures — all test cases passed.")

6. BLOCKED / SKIPPED TEST CASES
   List any blocked or skipped cases with reason.
   (If none: state "None.")

7. COVERAGE SUMMARY
   Reference the AC coverage matrix from the scenarios file.
   State: how many ACs are fully covered (all linked TCs pass), partially covered (some pass), or at risk (linked TC failed).

8. OBSERVATIONS
   2–5 bullet points — anything notable from this run:
   - Unexpected behaviour that was not a clear failure
   - Flaky tests (intermittent results)
   - Performance observations
   - Gaps in coverage noticed during execution

9. SIGN-OFF
   - Tester sign-off: [NAME] — [DATE]
   - Recommended next action: [Ready for release / Defects must be fixed / Re-test required]

Save the output to:
docs/test-artifacts/execution/[FEATURE-NAME]-execution-[RUN-ID].md

```

---

## Placeholder Reference

| Placeholder | Replace With |
|-------------|-------------|
| `[PROJECT NAME]` | Your app name (e.g. Sumiran) |
| `[RUN-ID]` | Run identifier (e.g. RUN-RP-001) |
| `[FEATURE-PREFIX]` | Short prefix matching test case IDs (e.g. RP, DG) |
| `[FEATURE NAME]` | Full readable feature name |
| `[FEATURE-NAME]` | Kebab-case for filename (e.g. reflection-prediction) |
| `[NAME]` | Tester's name |
| `[DATE]` | Execution date (DD MMM YYYY) |
| `[Environment]` | Browser, OS, URL |
| `[Branch]` | Git branch name |
| `[Commit]` | Short git commit hash (7 chars) |

---

## Result Definitions

| Result | When to use |
|--------|------------|
| **Pass** | Actual result matches expected result exactly |
| **Fail** | Actual result does not match expected result — a defect must be raised |
| **Blocked** | Test could not be executed due to an external dependency (environment down, prerequisite not met, another defect blocking this test) |
| **Skipped** | Test was intentionally not run this cycle (out of scope, deferred, not applicable to this build) |

---

## Run ID Convention

| Format | Example | When |
|--------|---------|------|
| `RUN-[PREFIX]-001` | `RUN-RP-001` | First execution of this feature's test suite |
| `RUN-[PREFIX]-002` | `RUN-RP-002` | Re-execution after defect fixes |
| `RUN-[PREFIX]-001-REG` | `RUN-RP-001-REG` | Regression-only run |

Keep a separate execution file per run. Do not overwrite previous runs — the history is the audit trail.

---

## Automated Test Results — How to Capture

For Vitest (unit tests):
- Run: `npm test`
- Copy the summary line: `X passed | Y failed` and the per-test output

For Playwright (E2E tests):
- Run: `npm run test:e2e`
- Copy the summary: `X passed (Xs)` and any failure output
- Individual test names map directly to TC IDs (use the test title prefix: `RP-001 |`, `RP-002 |`, etc.)

---

## Example (for reference)

- Project: `Sumiran`
- Feature: `Reflection Card YTD Milestone Prediction`
- Run ID: `RUN-RP-001`
- Execution mode: Both (Vitest unit + Playwright E2E)
- Total test cases: 41 (6 unit + 35 E2E)
- Result: 41 Pass | 0 Fail | 0 Blocked | 0 Skipped
- Pass rate: 100%
- Output: `docs/test-artifacts/execution/reflection-prediction-execution-RUN-RP-001.md`
