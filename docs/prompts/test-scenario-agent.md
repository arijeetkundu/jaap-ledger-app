# Test Scenario Agent — Reusable Prompt Template

**Purpose:** Generate a complete set of test scenarios from a reviewed and approved requirement.  
**When to use:** After the Requirements Analysis Agent has approved the requirement (Verdict: YES or CONDITIONAL with confirmations received).  
**Input required:** Improved requirement + accepted ACs from the requirement review file.  
**Output location:** `docs/test-artifacts/scenarios/[FEATURE-NAME]-scenarios.md`

---

## How to Use This Template

1. Open the requirement review file from `docs/test-artifacts/requirements/`
2. Copy the "Improved Requirement" and "Suggested Acceptance Criteria" sections
3. Copy everything inside the prompt block below
4. Paste into Claude Code
5. Replace every `[PLACEHOLDER]` with your actual content
6. Run it — save the output before passing to the Test Case Agent

---

## Prompt

```
Act as a Senior Test Scenario Analyst for the [PROJECT NAME] application.

The following requirement has been reviewed and approved for test scenario generation.

---
FEATURE: [FEATURE NAME]

REQUIREMENT:
[PASTE THE IMPROVED REQUIREMENT TEXT HERE]

ACCEPTANCE CRITERIA:
[PASTE THE NUMBERED LIST OF ACCEPTANCE CRITERIA HERE]
---

Generate a COMPLETE set of test scenarios covering ALL of the following types:

1. HAPPY PATH — normal, expected usage flows
2. BOUNDARY VALUE ANALYSIS — values at the edges of the valid range
3. NEGATIVE TESTING — invalid inputs and rejected actions
4. STATE-BASED — what happens when the app is in different states
   (feature enabled vs disabled, before action vs after action, on reload)
5. UI/UX — visual states, colours, layout, messages
6. INTEGRATION — how this feature interacts with existing features

For each scenario provide:
- SCENARIO ID (format: [PREFIX]-001, [PREFIX]-002 etc.)
- SCENARIO TITLE (one line — what is being tested)
- TYPE (Happy Path / BVA / Negative / State / UI / Integration)
- PRIORITY (P1-Critical / P2-High / P3-Medium / P4-Low)
- BRIEF DESCRIPTION (2-3 sentences — what is being tested and why it matters)
- LINKED AC (which acceptance criterion number this scenario covers)

After all scenarios, produce:

## Coverage Matrix
Table: AC Number | AC Description (short) | Scenario IDs that cover it

## Count by Type
Table: Type | Count | Total

## Gap Check
List any AC numbers that have NO scenario coverage.

Save the output to:
docs/test-artifacts/scenarios/[FEATURE-NAME]-scenarios.md

```

---

## Placeholder Reference

| Placeholder | Replace With |
|-------------|-------------|
| `[PROJECT NAME]` | Your app name (e.g. Sumiran, Banking Portal) |
| `[FEATURE NAME]` | Full readable feature name (e.g. Daily Jaap Goal, Fund Transfer) |
| `[PREFIX]` | 2–3 letter code for this feature (e.g. DG for Daily Goal, FT for Fund Transfer) |
| `[FEATURE-NAME]` | Short name in kebab-case for the filename (e.g. daily-goal, fund-transfer) |
| `[PASTE THE IMPROVED REQUIREMENT TEXT HERE]` | From the requirement review file — "Improved Requirement" section |
| `[PASTE THE NUMBERED LIST OF ACCEPTANCE CRITERIA HERE]` | From the requirement review file — "Suggested Acceptance Criteria" section |

---

## Priority Guide

| Priority | Assign When |
|----------|------------|
| P1-Critical | Core feature functionality — if this fails, the feature is broken |
| P2-High | Important behaviour — users will notice if wrong |
| P3-Medium | Edge case or secondary behaviour |
| P4-Low | Cosmetic, rare scenario, or nice-to-have coverage |

---

## Example (for reference)

- Project Name: `Sumiran`
- Feature Name: `Daily Jaap Goal`
- Prefix: `DG`
- Output saved at: `docs/test-artifacts/scenarios/daily-goal-scenarios.md`
- Total scenarios generated: 41 (covering 11 ACs, zero gaps)
