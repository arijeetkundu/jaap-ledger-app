# Test Data Agent — Reusable Prompt Template

**Purpose:** Generate a comprehensive test data set for a feature's input fields.  
**When to use:** After test cases are written — before automation or manual execution begins.  
**Input required:** Test cases from `docs/test-artifacts/test-cases/[FEATURE-NAME]-test-cases.md`  
**Output location:** `docs/test-artifacts/test-data/[FEATURE-NAME]-test-data.md`

---

## How to Use This Template

1. Open the test cases file from `docs/test-artifacts/test-cases/`
2. Identify all input fields in the feature (numeric, text, date, dropdown, etc.)
3. Copy the prompt block below into Claude Code
4. Replace every `[PLACEHOLDER]` with your actual field details
5. Run it — review Critical Risk items before execution begins

---

## Prompt

```
Act as a Senior Test Data Engineer for the [PROJECT NAME] application.

Generate a comprehensive test data set for the [FEATURE NAME] feature.

The feature has the following input fields:

FIELD 1: [FIELD NAME]
- Data type: [Integer / Text / Date / Dropdown / etc.]
- Valid range/values: [e.g. 1 to 1000 / free text up to 500 chars / YYYY-MM-DD]
- Purpose: [what this field does]

FIELD 2: [FIELD NAME]
- Data type: [Integer / Text / Date / Dropdown / etc.]
- Valid range/values: [describe valid values]
- Purpose: [what this field does]

[ADD MORE FIELDS AS NEEDED]

For EACH field, generate test data covering ALL of these classes:

1. VALID DATA — NORMAL USE
   Representative values a real user would enter

2. VALID DATA — BOUNDARY VALUES
   Minimum valid, minimum+1, maximum-1, maximum valid

3. INVALID DATA — BOUNDARY VALUES
   One below minimum, one above maximum

4. INVALID DATA — WRONG TYPE
   Text in a number field, numbers in a text field, decimals,
   special characters, mixed input

5. INVALID DATA — EDGE CASES
   Empty/blank, whitespace only, very long input (15+ chars/digits),
   leading zeros, copy-pasted text, scientific notation

6. SECURITY TEST DATA
   XSS attempt: <script>alert('xss')</script>
   SQL injection: '; DROP TABLE entries; --
   JS protocol: javascript:alert(1)
   HTML injection: <<value>>
   Flag ALL security items as CRITICAL risk

[IF THE FEATURE HAS COMBINATION LOGIC — e.g. Field A compared against Field B]
Additionally, generate COMBINATION test data:
- [State 1 name] (e.g. count < goal): 3 combinations
- [State 2 name] (e.g. count = goal): 3 combinations
- [State 3 name] (e.g. count > goal): 3 combinations
- Edge case combinations: [describe specific edges]

For each data item provide:
- DATA ID (format: TD-[PREFIX]-001, TD-[PREFIX]-002 etc.)
- FIELD (which field this data is for)
- VALUE (exact value — specific, never descriptive)
- DATA CLASS (Valid-Normal / Valid-Boundary / Invalid-Boundary /
              Invalid-Type / Invalid-Edge / Security / Combination)
- EXPECTED BEHAVIOUR (what should happen when this value is used)
- RISK LEVEL (Low / Medium / High / Critical)
- LINKED TEST CASE (TC ID that uses this data, or — if none yet)

At the end produce:
- DATA CLASS SUMMARY (count per class, total)
- CRITICAL RISK ITEMS table (ID, field, value, why critical)
- DATA GAPS — any combinations or edge cases not covered,
  and any items blocked pending a product decision

Save the output to:
docs/test-artifacts/test-data/[FEATURE-NAME]-test-data.md

```

---

## Placeholder Reference

| Placeholder | Replace With |
|-------------|-------------|
| `[PROJECT NAME]` | Your app name (e.g. Sumiran, Banking Portal) |
| `[FEATURE NAME]` | Full readable feature name (e.g. Daily Jaap Goal) |
| `[FEATURE-NAME]` | Kebab-case for filename (e.g. daily-goal) |
| `[PREFIX]` | 2–4 letter code for Data IDs (e.g. DG, FT, SA) |
| `[FIELD NAME]` | Name of each input field |
| `[Data type]` | Integer / Text / Date / Decimal / Dropdown / Toggle |
| `[Valid range/values]` | The exact valid range (e.g. 1 to 1,000,000) |

---

## Data Classes — Quick Reference

| Class | What to Generate |
|-------|----------------|
| Valid-Normal | 3–5 realistic user values |
| Valid-Boundary | Min, min+1, max-1, max |
| Invalid-Boundary | Min-1, max+1 |
| Invalid-Type | Wrong data type for the field |
| Invalid-Edge | Empty, whitespace, leading zeros, very long |
| Security | XSS, injection, protocol attacks — always Critical risk |
| Combination | Only when two fields interact in logic |

---

## The "Specific Values" Rule

Always use exact values. Never describe them.

| Wrong | Right |
|-------|-------|
| "Enter maximum value" | `1000000` |
| "Enter an invalid type" | `abc` |
| "Enter a very long string" | `123456789012345` |
| "Enter a special character" | `@#$%` |

Specific values make data reusable in automation without interpretation.

---

## Example (for reference)

- Project Name: `Sumiran`
- Feature Name: `Daily Jaap Goal`
- Fields: Goal Input (integer, 1–10,00,000) + Count Input (integer, 0+)
- Prefix: `DG`
- Total data items generated: 53
- Critical risk items: 5
- Output: `docs/test-artifacts/test-data/daily-goal-test-data.md`
