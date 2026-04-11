# Module 03 — Test Scenario Agent

## What is a Test Scenario vs a Test Case?

| | Test Scenario | Test Case |
|-|--------------|-----------|
| **Level** | High-level, "what to test" | Detailed, "exactly how to test" |
| **Example** | "Verify that Jaap count can be saved" | Step 1: Open app. Step 2: Enter 108 in count field. Step 3: Click Save. Expected: "✓ Saved!" appears |
| **Written by** | Test Lead / Scenario Analyst | Test Engineer |
| **Volume** | 5–10 per feature | 10–50 per scenario |

Test Scenarios come *before* Test Cases. They ensure you have *complete coverage* before diving into detail.

---

## Exercise 3 — Run the Test Scenario Agent

Copy and paste this prompt:

```
Act as a Test Scenario Analyst for the Sumiran (JAAP-LEDGER) app.

Based on the Today Card feature in src/components/TodayCard.jsx, generate a complete set of Test Scenarios.

For each scenario, provide:
- SCENARIO ID (e.g., TC-TODAY-001)
- SCENARIO TITLE (one line, what is being tested)
- SCENARIO TYPE (Functional / Negative / Boundary / UI / Performance)
- PRIORITY (P1-Critical / P2-High / P3-Medium / P4-Low)
- BRIEF DESCRIPTION (2-3 sentences)

Cover all of these scenario types:
1. Happy Path (normal, expected usage)
2. Negative Tests (what happens with wrong/missing input)
3. Boundary Value Analysis (minimum, maximum, edge values for Jaap count)
4. State-based scenarios (what happens after save, before save, on reload)
5. UI/UX scenarios (button states, disabled states, visual feedback)

Group scenarios by type. At the end, provide a COVERAGE MATRIX showing which app behaviors are covered.
```

---

## Understanding the Output — A QA Perspective

The agent will generate scenarios like:

**Happy Path:**
- TC-TODAY-001: Save valid Jaap count (e.g., 108) with notes
- TC-TODAY-002: Save valid Jaap count without notes

**Boundary Value Analysis:**
- TC-TODAY-010: Enter count = 0 (minimum)
- TC-TODAY-011: Enter count = 1 (just above minimum)
- TC-TODAY-012: Enter count = 100000 (large valid number)
- TC-TODAY-013: Enter count = -1 (negative — invalid)
- TC-TODAY-014: Enter count = 99999999 (very large — what happens?)

**Negative Tests:**
- TC-TODAY-020: Enter text in count field ("abc")
- TC-TODAY-021: Leave count empty and click Save
- TC-TODAY-022: Enter decimal number (10.5)

---

## Save Your Scenarios

Ask Claude to save the scenarios as a file:

```
Save these test scenarios as a file at:
docs/test-artifacts/scenarios/today-card-scenarios.md
```

This creates a living test artifact in your project — version-controlled alongside the code.

---

## Key Insight for QA Leads

Notice that Claude uses **Boundary Value Analysis** and **Negative Testing** automatically when instructed. This is the same technique you would apply manually — but Claude applies it to *every field and interaction* in seconds.

---

**Next:** [Module 04 — Test Case Agent](./04-test-case-agent.md)
