# Module 08 — Defect Logging Agent

## What This Agent Does

When a test fails, the Defect Logging Agent:
1. Reads the failure output
2. Writes a structured defect report in your standard format
3. Saves it to your defect repository
4. Assigns severity and priority
5. Writes clear, reproducible steps to reproduce

---

## Your Defect Template

We will create a standard defect format. This is the same information you would enter in Jira, ALM, or any defect management tool.

---

## Exercise 8A — Create the Defect Template

```
Create a standard defect report template for the Sumiran app.
Save it at: docs/test-artifacts/defects/DEFECT-TEMPLATE.md

Include these fields:
- DEFECT ID (format: DEF-SUMIRAN-001)
- DEFECT TITLE (one line summary)
- MODULE (which part of the app)
- SEVERITY (S1-Critical / S2-Major / S3-Minor / S4-Trivial)
- PRIORITY (P1-Immediate / P2-High / P3-Medium / P4-Low)
- STATUS (New / Open / In Progress / Fixed / Closed / Reopen)
- REPORTED BY
- REPORTED DATE
- BUILD/VERSION
- ENVIRONMENT (Browser, OS)
- PRECONDITIONS
- STEPS TO REPRODUCE (numbered)
- ACTUAL RESULT
- EXPECTED RESULT
- ROOT CAUSE ANALYSIS (to be filled by developer)
- SCREENSHOTS/EVIDENCE
- LINKED TEST CASE IDs
- RESOLUTION NOTES
```

---

## Exercise 8B — Auto-Generate a Defect from Test Failure

Take any real or simulated test failure and run this:

```
A test failure occurred. Here is the test output:

[Paste any error output from a failed test here — or use this example:]
---
FAIL: 'should show Sunday dates in red'
Error: Expected element 'text=22 Feb 2026' to have color rgb(192, 57, 43)
Received: element not found in page
---

Act as a Defect Logger. Using the template at docs/test-artifacts/defects/DEFECT-TEMPLATE.md:
1. Create a complete defect report for this failure
2. Determine if this is a real app bug or a test script issue (the date is in the past)
3. Assign appropriate Severity and Priority
4. Write clear Steps to Reproduce
5. Save the defect as: docs/test-artifacts/defects/DEF-SUMIRAN-001.md
```

---

## Exercise 8C — Defect Analysis and Trends

After logging a few defects:

```
Read all defect files in docs/test-artifacts/defects/

Provide a DEFECT SUMMARY:
1. Total defects by Severity
2. Total defects by Module
3. Which module has the highest defect density?
4. Are there any patterns (same root cause appearing multiple times)?
5. List all Open/New defects (not yet Fixed)

Format as a Defect Summary Report.
```

---

## Defect Severity Guide for Sumiran

| Severity | Condition | Example |
|----------|-----------|---------|
| **S1-Critical** | Data loss, app crash, security | Count is not saved to database |
| **S2-Major** | Feature completely broken | Ledger does not load |
| **S3-Minor** | Feature partially broken | Wrong color on Sunday dates |
| **S4-Trivial** | Cosmetic, no functional impact | Spacing issue in Settings panel |

---

## Integration with GitHub Issues

Once you're comfortable, you can ask Claude to:

```
Convert this defect report into a GitHub Issue format.
Include: title, labels (bug, severity-major, module-ledger), body with steps to reproduce.
```

This bridges your test artifacts with developer workflow.

---

**Next:** [Module 09 — Test Report Agent](./09-report-agent.md)
