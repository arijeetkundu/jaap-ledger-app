# Module 04 — Test Case Agent

## What This Agent Produces

Test Cases are the detailed, step-by-step execution instructions. Each test case from this agent will have:
- Pre-conditions (what must be true before starting)
- Steps (exactly what to do)
- Expected Result (what should happen)
- Post-conditions (cleanup steps)

---

## Exercise 4 — Run the Test Case Agent

Copy and paste this prompt:

```
Act as a Test Case Writer for the Sumiran (JAAP-LEDGER) app.

Convert this test scenario into a detailed test case:

SCENARIO: TC-TODAY-001 — Save valid Jaap count with notes

Read src/components/TodayCard.jsx to understand the UI elements.

Write the test case with:
- TEST CASE ID: TC-TODAY-001
- TEST CASE TITLE
- MODULE: Today Card
- PRIORITY: P1-Critical
- PRE-CONDITIONS (what must be true before the test)
- TEST STEPS (numbered, exact actions on the UI)
- EXPECTED RESULTS (for each step that has a visible outcome)
- POST-CONDITIONS (cleanup)
- TEST DATA (what values to use)
- AUTOMATION FEASIBILITY: Yes/No/Partial — with reason

Then write 3 more test cases for:
- TC-TODAY-013: Enter negative number in count field
- TC-TODAY-014: Verify count persists after page reload
- TC-TODAY-015: Verify Save button is enabled only when count > 0
```

---

## Understanding the Output

A well-formed test case looks like this:

```
TEST CASE ID: TC-TODAY-001
TITLE: Save valid Jaap count with notes — Happy Path
MODULE: Today Card
PRIORITY: P1-Critical

PRE-CONDITIONS:
1. App is running at http://localhost:5173
2. Today's date entry does not exist in database (fresh state)
3. Browser is Chrome, latest version

TEST STEPS & EXPECTED RESULTS:
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open app in browser | Splash screen appears, then Today Card is visible |
| 2 | Locate the Jaap count input field (#jaap-count) | Field is empty and enabled |
| 3 | Enter value: 108 | Field shows "108" |
| 4 | Locate notes field (#jaap-notes) | Field is empty |
| 5 | Enter text: "Morning session" | Field shows "Morning session" |
| 6 | Click Save button | Button text changes to "✓ Saved!" briefly |
| 7 | Reload the page | Page reloads and shows splash screen |
| 8 | Wait for app to load | Today Card is visible |
| 9 | Check count field value | Field shows "108" (persisted) |
| 10 | Check notes field value | Field shows "Morning session" (persisted) |

POST-CONDITIONS:
- Clear the entry to restore clean state for next test

TEST DATA: count=108, notes="Morning session"
AUTOMATION FEASIBILITY: Yes — Playwright can automate all steps
```

---

## Saving Test Cases as Artifacts

```
Save all 4 test cases to:
docs/test-artifacts/test-cases/today-card-test-cases.md
```

---

## Building a Test Case Repository

Over time, ask Claude to:

```
I have test cases for Today Card, Ledger, and Settings.
Create a master test case register at:
docs/test-artifacts/master-test-register.md

Include: TC ID, Title, Module, Priority, Status (Not Run / Pass / Fail), Last Run Date
```

This gives you a **living test register** — updated as you add cases and run tests.

---

**Next:** [Module 05 — Test Data Agent](./05-test-data-agent.md)
