# Module 06 — Automation Script Agent

## What This Agent Does

The Automation Script Agent takes your manual test cases and converts them into **Playwright** automation scripts — the same test tool already set up in your project.

You don't need to know how to code. You describe the test, Claude writes the script.

---

## How Playwright Works (Tester's Explanation)

Playwright is a **robot that operates a real browser** — just like a human tester would:
- It opens Chrome/Firefox
- Navigates to the app URL
- Fills in fields
- Clicks buttons
- Checks that expected results are visible
- Reports Pass/Fail

Your existing E2E tests at [src/tests/e2e/app.spec.js](../../src/tests/e2e/app.spec.js) are already written in Playwright.

---

## Exercise 6A — Understand Existing Automation

First, look at an existing test to understand the pattern. Read the test file and ask:

```
Read src/tests/e2e/app.spec.js

Explain each test in plain English for a non-developer:
- What is being tested?
- What actions does it take?
- What does it verify?
- Is there anything NOT tested that should be?

Format as a table: Test Name | What It Does | Gap (if any)
```

---

## Exercise 6B — Generate New Automation Scripts

Now ask Claude to write NEW automation tests based on your manual test cases:

```
Act as an Automation Engineer for the Sumiran (JAAP-LEDGER) app.

Read src/tests/e2e/app.spec.js to understand the existing test style and patterns.

Write new Playwright test cases for these scenarios that are NOT currently covered:

1. TC-LEDGER-001: Verify that entries with count > 0 show the count number in the ledger row
2. TC-LEDGER-002: Verify that entries with count = 0 show a dash or empty state in the ledger row
3. TC-REFLECT-001: Verify that the Lifetime Jaap count in Reflection Card increases after saving a new count
4. TC-EXPORT-001: Verify that clicking "Export as CSV" triggers a file download
5. TC-BOUNDARY-001: Verify behavior when entering 0 in the count field and saving

Follow the EXACT same code style as the existing tests.
Add all 5 tests to: src/tests/e2e/app.spec.js
Group them under a new describe block: 'Extended Coverage Tests'
```

---

## Exercise 6C — Generate Unit Tests for Logic

Your logic files have unit tests. Ask Claude to find gaps:

```
Read src/logic/ledgerLogic.js and src/tests/unit/ledgerLogic.test.js

Identify which functions in ledgerLogic.js do NOT have test coverage.
Write Vitest unit tests for each uncovered function.

Use the same style as the existing tests in ledgerLogic.test.js.
Add them to the existing test file (do not create a new file).
```

---

## The Feedback Loop

Automation → Run → Fail → Fix → Re-run → Pass

Ask Claude after running tests:
```
I ran npm test and got this output: [paste the output]
Explain what failed and why, in plain English.
```

---

## Key Principle

> **You define WHAT to test. Claude writes HOW to automate it.**

As a 21-year QA veteran, your domain knowledge of *what matters* is far more valuable than writing code. Claude handles the syntax.

---

**Next:** [Module 07 — Test Execution Agent](./07-execution-agent.md)
