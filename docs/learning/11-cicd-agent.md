# Module 11 — CI/CD Integration

## What is CI/CD? (Tester's Explanation)

**CI (Continuous Integration)** = Every time a developer pushes code, tests run automatically.  
**CD (Continuous Deployment)** = If tests pass, the app is automatically deployed.

Think of it as a **quality gate** — no code reaches users unless tests pass.

```
Developer pushes code
        ↓
CI Pipeline triggers automatically
        ↓
Unit tests run → E2E tests run
        ↓
Pass? → Deploy to staging/production
Fail? → Developer is notified, code is blocked
```

For JAAP-LEDGER, we'll use **GitHub Actions** — which is free and already available since your code is on GitHub.

---

## Exercise 11A — Create a Basic GitHub Actions Pipeline

```
Act as a CI/CD Setup Agent for the Sumiran (JAAP-LEDGER) app.

Create a GitHub Actions workflow file at: .github/workflows/test.yml

This pipeline should:
1. Trigger on every push to main branch AND every pull request
2. Set up Node.js environment
3. Install dependencies (npm install)
4. Run unit tests (npm test)
5. Start the dev server in background
6. Run E2E tests (npm run test:e2e)
7. Upload test results as artifacts (so I can download and view them)
8. Send a PASS or FAIL notification (show status in GitHub UI)

Include comments in the YAML file explaining what each section does — in plain English for a non-developer.
```

---

## Understanding the Pipeline Output

Once the workflow is active, every code push will show:
- A green checkmark ✅ (all tests passed)
- A red X ❌ (tests failed)
- Clickable logs showing exactly what failed

As QA Lead, you monitor this dashboard without needing to run tests manually.

---

## Exercise 11B — Add Quality Gates

A quality gate is a rule that blocks deployment if quality thresholds are not met.

```
Update the GitHub Actions workflow to add quality gates:

1. UNIT TEST GATE: Fail the pipeline if unit test pass rate < 100%
2. E2E TEST GATE: Fail the pipeline if any E2E test fails
3. COVERAGE GATE: (Optional) Fail if test coverage drops below 60%

Also add a step that:
- On failure: creates a summary comment showing which tests failed
- On success: shows a green summary with test counts

Explain each gate in the YAML comment so the team understands the rules.
```

---

## Exercise 11C — Test Report in CI

```
Update the pipeline to generate and publish a test report:

1. After tests run, generate an HTML test report
2. Upload it as a GitHub Actions artifact (downloadable for 30 days)
3. Add the test summary to the GitHub Pull Request comment

This means every Pull Request will automatically show:
- Tests Passed: X / Y
- Tests Failed: X (with names)
- Blocking: Yes/No
```

---

## The QA Lead's CI/CD Dashboard

Once set up, your CI/CD workflow means:
- You **don't run tests manually** — they run on every commit
- You **monitor the dashboard** — green = quality maintained, red = action needed
- You **review failures** — decide if it's a real bug or test issue
- You **approve releases** — only after CI shows green

This is the shift from "manual test executor" to "quality guardian" — where your 21 years of expertise guides *what* is tested and *what* the results mean, not the mechanics of running tests.

---

## Full Pipeline Summary

```yaml
# What your complete CI/CD pipeline does:

on: push / pull_request
  ↓
1. Checkout code
2. Install Node.js + dependencies
3. Run ESLint (code quality)
4. Run Unit Tests (Vitest)
5. Build the app (npm run build)
6. Start dev server
7. Run E2E Tests (Playwright)
8. Generate test report
9. Upload artifacts
10. Post summary to PR
11. Quality Gate: PASS or FAIL
```

---

## Congratulations — You Now Have the Full STLC Agent Stack

| Agent | Module | Status |
|-------|--------|--------|
| Requirements Analysis | 02 | Learned |
| Test Scenario | 03 | Learned |
| Test Case | 04 | Learned |
| Test Data | 05 | Learned |
| Automation Script | 06 | Learned |
| Test Execution | 07 | Learned |
| Defect Logging | 08 | Learned |
| Test Report | 09 | Learned |
| Self-Healing | 10 | Learned |
| CI/CD Integration | 11 | Learned |

**Return to:** [Learning Path Overview](./00-overview.md)
