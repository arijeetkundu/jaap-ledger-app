# Module 05 — Test Data Agent

## Why Test Data Generation Matters

Bad test data = false confidence. Good test data finds real bugs.

The Test Data Agent applies standard QA techniques:
- **Equivalence Partitioning** — representative values from each class
- **Boundary Value Analysis** — values at the edges
- **Special Characters** — values that break UI or database
- **Real-world data** — data that mimics actual usage

---

## Exercise 5 — Run the Test Data Agent

Copy and paste this prompt:

```
Act as a Test Data Generator for the Sumiran (JAAP-LEDGER) app.

Read these files to understand the data model:
- src/db/db.js (how data is stored)
- src/logic/ledgerLogic.js (how dates and counts are processed)
- src/logic/milestoneLogic.js (milestone calculation rules)

Generate comprehensive test data for the following fields:

1. JAAP COUNT FIELD (numeric input)
   - Valid data (Equivalence Class: normal usage)
   - Boundary values (min, max, just-inside, just-outside)
   - Invalid data (wrong type, negative, special chars)

2. NOTES FIELD (text input)
   - Valid data (short, medium, long text)
   - Special characters (& < > " ' / \)
   - Multilingual (Hindi/Sanskrit text like "राम नाम")
   - Empty/whitespace-only

3. DATE ENTRIES (for ledger testing)
   - Normal weekday
   - Sunday (should appear in red)
   - Poornima/full moon date (should show 🌕)
   - First day of year
   - Last day of year
   - Leap year date (Feb 29)
   - Today's date
   - Future date (should not be allowed)

Format as a TEST DATA TABLE with columns:
Data ID | Field | Value | Data Class | Expected Behavior | Risk Notes
```

---

## What Good Test Data Output Looks Like

| Data ID | Field | Value | Class | Expected Behavior | Risk |
|---------|-------|-------|-------|------------------|------|
| TD-001 | count | 108 | Valid-Normal | Saves, shows in ledger | Low |
| TD-002 | count | 0 | Valid-Boundary-Min | Saves (0 is valid, means no jaap today) | Medium |
| TD-003 | count | 1 | Valid-Boundary-Min+1 | Saves normally | Low |
| TD-004 | count | 100000 | Valid-Large | Saves, displays in Indian number format | Medium |
| TD-005 | count | -1 | Invalid-Negative | Should be rejected | High |
| TD-006 | count | 1.5 | Invalid-Decimal | Should be rejected or rounded | High |
| TD-007 | count | "abc" | Invalid-Type | Should be rejected | High |
| TD-008 | notes | "राम नाम जपो" | Valid-Multilingual | Saves and displays correctly | Medium |
| TD-009 | notes | "<script>alert(1)</script>" | Security-XSS | Must be stored as text, NOT executed | CRITICAL |

---

## The Security Test Data Insight

Notice **TD-009** — this is an XSS (Cross-Site Scripting) injection attempt.

As a tester, you should always include security test data:
- `<script>alert('xss')</script>` in any text field
- `' OR 1=1 --` (SQL injection pattern)
- Very long strings (500+ characters)

Ask Claude:
```
Add security-focused test data to the test data set.
Include XSS attempts, injection patterns, and overflow strings.
Note which are HIGH RISK for this app specifically.
```

---

## Saving and Using Test Data

```
Save this test data to:
docs/test-artifacts/test-data/test-data-master.md

Also create a JSON version at:
docs/test-artifacts/test-data/test-data.json
(so it can be used in automated tests)
```

---

**Next:** [Module 06 — Automation Script Agent](./06-automation-agent.md)
