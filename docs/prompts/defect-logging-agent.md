# Defect Logging Agent — Reusable Prompt Template

**Purpose:** Convert a failing test case from an execution log into a well-structured, actionable defect report.  
**When to use:** After the Test Execution Agent has produced a run log and one or more test cases have a result of `Fail`.  
**Input required:** The execution log file + the failing row(s) from it  
**Output location:** `docs/test-artifacts/defects/[FEATURE-NAME]-defects.md`

---

## How to Use This Template

1. Open the execution log: `docs/test-artifacts/execution/[FEATURE-NAME]-execution-[RUN-ID].md`
2. Find every row where Result = `Fail`
3. For each failing test case, copy its TC ID, title, type, priority, and actual result from the log
4. Copy the prompt block below into Claude Code
5. Fill in `[RUN-ID]` and the failing test case details — everything else (environment, tester, date, branch, commit) is already in the execution log; just reference it by Run ID
6. Run it — one defect report per failing test case
7. Update the Defect ID column in the execution log with the generated DEF-XX-NNN ID

---

## Prompt

```
Act as a Senior QA Engineer for the [PROJECT NAME] application.

A test case has failed. Write a formal defect report.

The failure was recorded in execution log:
- Run ID: [RUN-ID]
- Execution log: docs/test-artifacts/execution/[FEATURE-NAME]-execution-[RUN-ID].md
(All environment details — tester, date, browser, OS, branch, commit — are in the execution log above. Do not repeat them here; reference the Run ID instead.)

FAILING TEST CASE (from the execution log):
- Test Case ID: [TC-ID]
- Test Case Title: [TITLE]
- Test Type: [Happy Path / BVA / Negative / State / Regression / UI / Integration]
- Priority: [P1-Critical / P2-High / P3-Medium / P4-Low]
- Test Data Used: [exact values from the test case — copy from the Test Data section of the TC]

OBSERVATION:
- Steps executed: [paste the steps from the test case that were actually run]
- Expected result: [what the test case says should happen]
- Actual result: [what actually happened — be specific: exact text, exact values, screenshot ref]
- Reproducible: [Yes / No / Intermittent]

Write a defect report with the following sections:

1. DEFECT ID
   Format: DEF-[FEATURE-PREFIX]-[NNN] (e.g. DEF-RP-001)

2. TITLE
   One line — concise, factual. Format: [Component] — [what is wrong] — [impact]
   Example: "Reflection Card — YTD average displays in international format (100,000) instead of Indian format (1,00,000)"

3. SEVERITY
   - Critical: App crashes, data loss, security breach, core feature completely broken
   - High: Major feature broken, incorrect calculation, wrong data shown
   - Medium: UI/display issue, minor feature broken, workaround exists
   - Low: Cosmetic, typo, minor layout issue

4. PRIORITY
   - P1: Must fix before release
   - P2: Should fix in current sprint
   - P3: Fix in next sprint
   - P4: Fix when time permits

5. DETECTED IN
   - Run ID: [RUN-ID]
   - Execution log: docs/test-artifacts/execution/[FEATURE-NAME]-execution-[RUN-ID].md
   (This is the single pointer to all environment, tester, and build details.)

6. STEPS TO REPRODUCE
   Numbered steps — exact, reproducible, starting from app launch.
   Include exact test data values used.

7. EXPECTED RESULT
   What should happen — reference the requirement/AC if possible.

8. ACTUAL RESULT
   What actually happened — exact text, values, or behaviour observed.
   Reference screenshot file if attached.

9. ROOT CAUSE HYPOTHESIS
   Your best assessment of what is likely wrong in the code.
   Identify: which file, which function, which line (if known).
   Keep it brief — this is a hypothesis, not a guaranteed diagnosis.

10. LINKED ARTIFACTS
    - Execution Log: docs/test-artifacts/execution/[FEATURE-NAME]-execution-[RUN-ID].md
    - Test Case: docs/test-artifacts/test-cases/[FEATURE-NAME]-test-cases.md ([TC-ID])
    - Requirement AC: [AC number(s) violated]
    - Affected file(s): [file path if known]

11. SUGGESTED FIX
    One or two sentences describing the likely code change needed.
    If unknown, state: "Requires developer investigation."

12. STATUS TRACKING
    | Field | Value |
    |-------|-------|
    | Status | Open |
    | Detected in | [RUN-ID] |
    | Fixed in | — |
    | Verified in | — |
    (Fixed in and Verified in are filled when a re-run confirms the fix.)

13. ATTACHMENTS
    - Screenshot: [filename or "none"]
    - Console log: [paste relevant errors or "none"]
    - Video: [filename or "none"]

At the end, produce a one-line DEFECT SUMMARY suitable for a status report:
DEF-[ID] | [Title] | [Severity] | [Priority] | Detected: [RUN-ID] | Status: Open

Save the output to:
docs/test-artifacts/defects/[FEATURE-NAME]-defects.md

```

---

## Placeholder Reference

| Placeholder | Replace With |
|-------------|-------------|
| `[PROJECT NAME]` | Your app name (e.g. Sumiran) |
| `[RUN-ID]` | The Run ID from the execution log where this failure was found (e.g. RUN-RP-002) |
| `[TC-ID]` | The test case ID that failed (e.g. RP-026) |
| `[TITLE]` | The test case title |
| `[FEATURE-NAME]` | Kebab-case feature name for filenames (e.g. reflection-prediction) |
| `[FEATURE-PREFIX]` | Short prefix for the defect ID (e.g. RP, DG) |
| `[NNN]` | Three-digit sequence number (001, 002, etc.) |

> **Note:** Tester name, date, browser, OS, branch, and commit are NOT repeated here — they are already recorded in the execution log. Reference the Run ID only.

---

## The Traceability Chain

Every artifact in the pipeline links to the next. A defect report sits between the execution log and the re-run:

```
Requirement AC  →  Test Case (TC-ID)  →  Execution Log (RUN-ID)  →  Defect (DEF-ID)
                                                ↑                          ↓
                                     Defect ID column in             Re-run log
                                     execution log updated           (RUN-ID-002)
                                     with DEF-ID                     Verified in field updated
```

When you raise a defect:
1. Add the DEF-ID to the Defect ID column in the execution log
2. When fixed, run the test again — create a new execution log (RUN-RP-003)
3. Update the defect's `Fixed in` and `Verified in` fields with the new Run ID

---

## Severity vs Priority — Quick Reference

| | Severity | Priority |
|-|---------|----------|
| **Meaning** | How badly the defect breaks the software | How urgently it needs to be fixed |
| **Set by** | QA (based on impact) | PM/Lead (based on business need) |

A cosmetic defect on the home screen = Low severity but potentially High priority (every user sees it).  
A data corruption bug in a rarely-used admin tool = Critical severity but possibly P3 priority.

---

## Root Cause Hypothesis — How to Write It

| Situation | What to write |
|-----------|--------------|
| You can see the issue in the code | "In `src/components/ReflectionCard.jsx`, the raw `averagePerDay` value is rendered without calling `formatIndianNumber()`." |
| You suspect a function | "The `predictNextMilestoneYTD` function in `milestoneLogic.js` may not be filtering prior-year entries correctly — the YTD average appears blended." |
| You have no idea | "Requires developer investigation — no visible code path identified from the UI." |

---

## Multiple Defects from One Run

Run the agent once per failing test case — do not batch multiple failures into one report. Each defect must be independently reproducible and independently fixable.

Append each new defect as a new section in `docs/test-artifacts/defects/[FEATURE-NAME]-defects.md`.
After raising all defects, update the Defect ID column in the execution log for each failing row.

---

## Example (for reference)

- Project: `Sumiran`
- Run ID: `RUN-RP-002`
- Failing test: `RP-026 — Daily average uses Indian number format in primary line`
- Observed: Primary line shows `100,000/day` instead of `1,00,000/day`
- Defect ID: `DEF-RP-001`
- Severity: Medium (display only — data is correct, formatting is wrong)
- Priority: P2 (visible to all users but no data corruption)
- Detected in: `RUN-RP-002`
- Root cause: `formatIndianNumber()` not called on `averagePerDay` in `ReflectionCard.jsx`
- After fix: re-run creates `RUN-RP-003` → update `Verified in: RUN-RP-003` in the defect report
