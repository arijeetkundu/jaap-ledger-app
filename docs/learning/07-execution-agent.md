# Module 07 — Test Execution Agent

## What This Agent Does

The Execution Agent:
1. Runs your test suite
2. Captures all output (pass/fail/error messages)
3. Analyzes failures and explains them in plain English
4. Identifies patterns (flaky tests, repeated failures in one area)

---

## Exercise 7A — Run Unit Tests

In the Claude Code chat, type:

```
Run the unit tests using: npm test

After they complete:
1. Show me a PASS/FAIL summary
2. For any failures, explain what broke in plain English (no code jargon)
3. List any test that took unusually long (>1 second)
```

Claude will actually execute `npm test` and analyze the results.

---

## Exercise 7B — Run E2E Tests

> **Pre-condition:** The app must be running. Open a terminal and run `npm run dev` first, then come back to Claude Code.

```
The app is running at http://localhost:5173

Run the E2E tests using: npm run test:e2e

After they complete:
1. Show a PASS/FAIL/SKIP summary table
2. For each FAILED test: explain what happened (what was expected vs what actually occurred)
3. Identify if any failures are related to test data from previous test runs
4. Suggest whether each failure is: Application Bug | Test Script Bug | Environment Issue | Test Data Issue
```

---

## Exercise 7C — Run Tests with Visual UI

For a more visual experience (you can watch the browser being controlled):

```
Run: npm run test:e2e:ui

This opens Playwright's visual interface. I will watch the tests run.
After I close it, help me understand what I observed.
```

---

## Understanding Test Results — Tester's Lens

When a test fails, classify it the same way you would in manual testing:

| Failure Type | Meaning | Action |
|-------------|---------|--------|
| **App Bug** | The application behaved incorrectly | Log a defect |
| **Test Script Bug** | The test code was wrong, not the app | Fix the test |
| **Environment Issue** | App wasn't running, wrong URL, etc. | Fix the environment |
| **Test Data Issue** | Previous test left bad data | Add cleanup/isolation |
| **Flaky Test** | Sometimes passes, sometimes fails | Investigate stability |

Ask Claude to classify failures:
```
This test failed: [paste failure message]
Is this an Application Bug, Test Script Bug, Environment Issue, or Test Data Issue?
Explain your reasoning.
```

---

## Exercise 7D — Test Isolation Analysis

A common QA problem: tests pass individually but fail when run together (test pollution).

```
Run the E2E tests in this specific order and tell me if the order matters:
1. First run test: 'should save a jaap count and show saved confirmation'
2. Then run test: 'should pre-populate Today Card with saved data on reload'

Are these tests dependent on each other? Should they be isolated?
How would you fix any dependency issues?
```

---

**Next:** [Module 08 — Defect Logging Agent](./08-defect-agent.md)
