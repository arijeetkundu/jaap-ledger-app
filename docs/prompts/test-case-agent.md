# Test Case Agent — Reusable Prompt Template

**Purpose:** Convert approved test scenarios into detailed, step-by-step test cases.  
**When to use:** After the Test Scenario Agent has produced a scenario set and scenarios have been prioritised.  
**Input required:** Selected scenario entries from `docs/test-artifacts/scenarios/[FEATURE-NAME]-scenarios.md`  
**Output location:** `docs/test-artifacts/test-cases/[FEATURE-NAME]-test-cases.md`

---

## How to Use This Template

1. Open the scenarios file from `docs/test-artifacts/scenarios/`
2. Select the scenarios you want to convert (recommended: start with all P1s)
3. Copy each selected scenario's full entry (ID, title, type, priority, description, linked AC)
4. Copy the prompt block below into Claude Code
5. Replace every `[PLACEHOLDER]` with your actual content
6. Paste the selected scenarios into the `SCENARIOS TO CONVERT` section
7. Run it — review and save the output

---

## Prompt

```
Act as a Senior Test Case Writer for the [PROJECT NAME] application.

Convert the following test scenarios into detailed test cases.

For each test case provide:
- TEST CASE ID (same as the Scenario ID)
- TITLE (one line)
- MODULE (which part of the app is being tested)
- TYPE (Happy Path / BVA / Negative / State / UI / Integration)
- PRIORITY (P1-Critical / P2-High / P3-Medium / P4-Low)
- PRE-CONDITIONS (numbered list — what must be true before the test starts)
- TEST STEPS and EXPECTED RESULTS (use a table with columns: Step | Action | Expected Result)
- TEST DATA (exact values to use — not ranges, specific values)
- POST-CONDITIONS (numbered cleanup steps to restore the app to a known state)
- AUTOMATION FEASIBILITY: Yes / No / Partial — with a one-line reason

Guidelines for writing test steps:
- One action per step — never combine two actions in one step
- Expected results only where there is a visible outcome — not every step needs one
- Pre-conditions must be verifiable — each one must be checkable before the test runs
- Test data must be specific — use exact values, not "enter a valid number"
- Post-conditions must restore clean state — the next test must not be affected

Format each test case as a clearly separated section with a horizontal rule between them.
Use a table for Test Steps and Expected Results.

At the end, produce a SUMMARY TABLE:
TC ID | Title | Type | Priority | Automation Feasibility

Save the output to:
docs/test-artifacts/test-cases/[FEATURE-NAME]-test-cases.md

---
SCENARIOS TO CONVERT:

[PASTE EACH SELECTED SCENARIO HERE IN THIS FORMAT:]

[SCENARIO-ID] | [TYPE] | [PRIORITY]
[SCENARIO TITLE]
[SCENARIO DESCRIPTION — 2-3 sentences]
AC: [linked AC numbers]

[REPEAT FOR EACH SCENARIO]

```

---

## Placeholder Reference

| Placeholder | Replace With |
|-------------|-------------|
| `[PROJECT NAME]` | Your app name (e.g. Sumiran, Banking Portal) |
| `[FEATURE-NAME]` | Short feature name in kebab-case (e.g. daily-goal, fund-transfer) |
| `[SCENARIO-ID]` | The ID from your scenarios file (e.g. DG-001) |
| `[TYPE]` | Happy Path / BVA / Negative / State / UI / Integration |
| `[PRIORITY]` | P1-Critical / P2-High / P3-Medium / P4-Low |
| `[SCENARIO TITLE]` | One-line title from the scenarios file |
| `[SCENARIO DESCRIPTION]` | The brief description from the scenarios file |
| `[linked AC numbers]` | AC numbers from the scenarios file (e.g. AC: 1, 3) |

---

## How Many Scenarios to Convert at Once

| Situation | Recommendation |
|-----------|---------------|
| New feature, start of testing | Convert all P1s first — typically 6–10 cases |
| Sprint-based testing | Convert only the scenarios for that sprint's scope |
| Regression suite | Convert P1 + P2 scenarios across all features |
| Exploratory prep | Convert State-based and Integration scenarios |

Avoid converting more than 10 scenarios in a single run — quality drops and steps become generic.

---

## Test Data Principle

Always use **specific values**, never descriptions:

| Wrong | Right |
|-------|-------|
| "Enter a valid goal" | `108` |
| "Enter an invalid number" | `-1` |
| "Enter the maximum value" | `1000000` |
| "Enter a large count" | `200` |

Specific values make tests repeatable and automatable.

---

## Example (for reference)

- Project Name: `Sumiran`
- Feature Name: `daily-goal`
- Scenarios converted: DG-001, DG-011, DG-014, DG-037
- Output saved at: `docs/test-artifacts/test-cases/daily-goal-test-cases.md`
- All 4 test cases: Automation Feasibility = Yes
