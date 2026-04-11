# Test Data Set — Daily Jaap Goal Feature

*Agent: Test Data Agent*
*Date: 10 April 2026*
*Input: docs/test-artifacts/test-cases/daily-goal-test-cases.md*
*Total Data Items: 54 | Critical Risk Items: 5 | Open Decisions: 2*

---

## Field 1: Daily Goal Input — Valid Data, Normal Use

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-001 | Goal Input | `108` | Valid-Normal | Accepted, saved, persists on reload | Low | DG-001 |
| TD-DG-002 | Goal Input | `1008` | Valid-Normal | Accepted and saved | Low | — |
| TD-DG-003 | Goal Input | `10000` | Valid-Normal | Accepted and saved | Low | — |
| TD-DG-004 | Goal Input | `50000` | Valid-Normal | Accepted and saved | Low | — |

---

## Field 1: Daily Goal Input — Valid Data, Boundary Values

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-005 | Goal Input | `1` | Valid-Boundary (min) | Accepted — lowest legal value | Medium | DG-007 |
| TD-DG-006 | Goal Input | `2` | Valid-Boundary (min+1) | Accepted — just inside lower boundary | Low | — |
| TD-DG-007 | Goal Input | `999999` | Valid-Boundary (max-1) | Accepted — just inside upper boundary | Low | — |
| TD-DG-008 | Goal Input | `1000000` | Valid-Boundary (max) | Accepted — highest legal value | Medium | DG-009 |

---

## Field 1: Daily Goal Input — Invalid Data, Boundary Values

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-009 | Goal Input | `0` | Invalid-Boundary (min-1) | Rejected — validation message shown, not saved | High | DG-008 |
| TD-DG-010 | Goal Input | `1000001` | Invalid-Boundary (max+1) | Rejected — validation message shown, not saved | High | DG-010 |
| TD-DG-011 | Goal Input | `-1` | Invalid-Boundary (negative) | Rejected — validation message shown | High | DG-014 |

---

## Field 1: Daily Goal Input — Invalid Data, Wrong Type

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-012 | Goal Input | `abc` | Invalid-Type (text) | Rejected — validation message | High | DG-016 |
| TD-DG-013 | Goal Input | `108.5` | Invalid-Type (decimal) | Rejected — whole numbers only | High | DG-015 |
| TD-DG-014 | Goal Input | `@#$%` | Invalid-Type (special chars) | Rejected — validation message | High | DG-017 |
| TD-DG-015 | Goal Input | `108abc` | Invalid-Type (mixed) | Rejected — not a pure integer | High | — |
| TD-DG-016 | Goal Input | `1,08,000` | Invalid-Type (Indian-formatted) | Rejected — commas not valid in input field | Medium | — |
| TD-DG-017 | Goal Input | `1e5` | Invalid-Type (scientific notation) | Rejected — must not be interpreted as 100000 | High | — |

---

## Field 1: Daily Goal Input — Invalid Data, Edge Cases

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-018 | Goal Input | *(empty)* | Invalid-Edge (blank) | Treated as "remove goal" OR shows validation — behaviour must be defined | High | DG-019 |
| TD-DG-019 | Goal Input | `   ` (spaces only) | Invalid-Edge (whitespace) | Rejected — not treated as a valid integer | High | DG-018 |
| TD-DG-020 | Goal Input | `123456789012345` | Invalid-Edge (15 digits) | Rejected — far exceeds maximum | Medium | DG-020 |
| TD-DG-021 | Goal Input | `0108` | Invalid-Edge (leading zero) | Rejected or stripped to `108` — behaviour must be consistent | Medium | DG-021 |
| TD-DG-022 | Goal Input | `-0` | Invalid-Edge (negative zero) | Rejected — must not be treated as valid zero or valid positive | Medium | — |
| TD-DG-023 | Goal Input | `1 0 8` | Invalid-Edge (spaces within number) | Rejected — not a valid integer | Medium | — |

---

## Field 1: Daily Goal Input — Security Test Data ⚠️

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-024 | Goal Input | `<script>alert('xss')</script>` | Security (XSS) | Must NOT execute as script. Best outcome: rejected by validation | **Critical** | — |
| TD-DG-025 | Goal Input | `'; DROP TABLE entries; --` | Security (SQL Injection) | Must NOT affect data. App uses IndexedDB but test confirms safe handling | **Critical** | — |
| TD-DG-026 | Goal Input | `javascript:alert(1)` | Security (JS Protocol) | Rejected or stored as inert text — must not execute | **Critical** | — |
| TD-DG-027 | Goal Input | `<<108>>` | Security (HTML Injection) | Stored as plain text — must not render as HTML tags | High | — |

---

## Field 2: Jaap Count Input — Valid Data, Normal Use

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-028 | Count Input | `108` | Valid-Normal | Saved, shown in Indian format in Ledger | Low | DG-002, DG-003 |
| TD-DG-029 | Count Input | `1008` | Valid-Normal | Saved normally | Low | — |
| TD-DG-030 | Count Input | `50000` | Valid-Normal | Saved, shown as "50,000" | Low | — |
| TD-DG-031 | Count Input | `100000` | Valid-Normal | Saved, shown as "1,00,000" | Low | — |

---

## Field 2: Jaap Count Input — Valid Data, Boundary Values

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-032 | Count Input | `0` | Valid-Boundary (min) | Saved as 0 — indicator behaviour with goal active TBD (see DG-028) | High | DG-028 |
| TD-DG-033 | Count Input | `1` | Valid-Boundary (min+1) | Saved — indicator compares against goal | Low | — |
| TD-DG-034 | Count Input | `10000000` | Valid-Boundary (1 crore) | Saved — milestone crossed, shown as "1,00,00,000" | Medium | — |

---

## Field 2: Jaap Count Input — Invalid Data

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-035 | Count Input | `-1` | Invalid-Boundary | Rejected or saved as 0 — existing field behaviour applies | High | — |
| TD-DG-036 | Count Input | `108.5` | Invalid-Type (decimal) | Rejected or floor-rounded — must not break indicator maths | High | — |
| TD-DG-037 | Count Input | `abc` | Invalid-Type (text) | Rejected — existing field validation applies | High | — |
| TD-DG-038 | Count Input | *(empty)* | Invalid-Edge (blank) | Saved as 0 — existing behaviour | Medium | — |
| TD-DG-039 | Count Input | `999999999999999` | Invalid-Edge (15 digits) | Rejected or capped — must not overflow indicator calculation | High | — |

---

## Field 2: Jaap Count Input — Security Test Data ⚠️

| Data ID | Field | Value | Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|-------|--------------------|------|-----------|
| TD-DG-040 | Count Input | `<script>alert('xss')</script>` | Security (XSS) | Must not execute — stored as plain text or rejected | **Critical** | — |
| TD-DG-041 | Count Input | `'; DELETE FROM entries; --` | Security (SQL Injection) | Must not affect IndexedDB data — more dangerous field | **Critical** | — |

---

## Combination Data — Indicator Logic

### Amber State (count < goal)

| Data ID | Goal | Count | Class | Expected Behaviour | Risk | Linked TC |
|---------|------|-------|-------|--------------------|------|-----------|
| TD-DG-042 | `108` | `50` | Combination-Amber | Amber: "58 remaining to reach your goal" | Medium | DG-002 |
| TD-DG-043 | `1000` | `999` | Combination-Amber | Amber: "1 remaining to reach your goal" (just below boundary) | High | DG-012 |
| TD-DG-044 | `10000` | `1` | Combination-Amber | Amber: "9999 remaining to reach your goal" (far below) | Low | — |

### Gold State (count = goal exactly)

| Data ID | Goal | Count | Class | Expected Behaviour | Risk | Linked TC |
|---------|------|-------|-------|--------------------|------|-----------|
| TD-DG-045 | `108` | `108` | Combination-Gold | Gold: "Goal met!" — NOT amber | High | DG-003 |
| TD-DG-046 | `500` | `500` | Combination-Gold | Gold: "Goal met!" — critical exact boundary | **High** | DG-011 |
| TD-DG-047 | `1` | `1` | Combination-Gold | Gold: "Goal met!" — minimum goal met exactly | High | — |

### Green State (count > goal)

| Data ID | Goal | Count | Class | Expected Behaviour | Risk | Linked TC |
|---------|------|-------|-------|--------------------|------|-----------|
| TD-DG-048 | `108` | `109` | Combination-Green | Green: "Goal exceeded by 1" (just above boundary) | High | DG-013 |
| TD-DG-049 | `108` | `200` | Combination-Green | Green: "Goal exceeded by 92" | Medium | DG-004 |
| TD-DG-050 | `100` | `1000000` | Combination-Green | Green: "Goal exceeded by 999900" (extreme overage) | Medium | — |

### Edge Case Combinations

| Data ID | Goal | Count | Class | Expected Behaviour | Risk | Linked TC |
|---------|------|-------|-------|--------------------|------|-----------|
| TD-DG-051 | `1` | `0` | Combination-Edge | Amber: "1 remaining" OR no indicator if count=0 = no entry. **Product decision required.** | **High** | DG-028, DG-056 |
| TD-DG-052 | `1000000` | `999999` | Combination-Edge | Amber: "1 remaining to reach your goal" | High | DG-012 |
| TD-DG-053 | `1000000` | `1000000` | Combination-Edge | Gold: "Goal met!" — max goal met exactly | High | — |
| TD-DG-054 | `1000000` | `1000001` | Combination-Edge | Green: "Goal exceeded by 1" — max goal just exceeded | Medium | — |

---

## Data Class Summary

| Class | Count |
|-------|-------|
| Valid-Normal | 8 |
| Valid-Boundary | 7 |
| Invalid-Boundary | 3 |
| Invalid-Type | 8 |
| Invalid-Edge | 8 |
| Security | 6 |
| Combination | 13 |
| **Total** | **53** |

---

## Critical Risk Items ⚠️

| Data ID | Field | Value | Why Critical |
|---------|-------|-------|-------------|
| TD-DG-024 | Goal Input | `<script>alert('xss')</script>` | XSS — executes in browser if rendered as HTML |
| TD-DG-025 | Goal Input | `'; DROP TABLE entries; --` | SQL injection pattern — must not corrupt IndexedDB |
| TD-DG-026 | Goal Input | `javascript:alert(1)` | JS protocol injection attempt |
| TD-DG-040 | Count Input | `<script>alert('xss')</script>` | XSS on the main data entry field |
| TD-DG-041 | Count Input | `'; DELETE FROM entries; --` | Most dangerous — count field writes to main data store |

---

## Data Gaps — Open Items

1. **TD-DG-018 and TD-DG-051 blocked** — both require a product owner decision before test execution. See open questions in `docs/test-artifacts/requirements/daily-goal-requirement-review.md`.

2. **Palette coverage gap** — indicator display (especially large numbers like TD-DG-050) not tested across Sacred Saffron and Forest Ashram themes.

3. **Concurrent tab behaviour** — behaviour when goal is changed in one browser tab while another tab is open is undefined. Flag for future sprint.
