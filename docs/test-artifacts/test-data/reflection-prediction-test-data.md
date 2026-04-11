# Test Data — Reflection Card YTD Milestone Prediction

*Agent: Test Data Agent*
*Date: 11 April 2026*
*Input: docs/test-artifacts/test-cases/reflection-prediction-test-cases.md*
*Total Data Items: 62 | Fields: 5 + Combination | Critical Risk Items: 6*

---

## Field Definitions

| Field | Type | Valid Range | Purpose |
|-------|------|-------------|---------|
| `count` | Integer | 0 to ~10,00,00,000 | Jaap count per entry — 0 is valid but excluded from YTD avg/threshold |
| `ytd_entry_count` | Derived Integer | 0 to 366 | Count of current-year entries with count > 0 — threshold for showing YTD line |
| `total_lifetime_count` | Derived Integer | 0+ | Sum of all entries — determines remaining to next 1-Crore milestone |
| `entry_date` | String YYYY-MM-DD | Any valid date | Determines if entry is current-year (YTD) or prior-year |
| `system_date` | String YYYY-MM-DD | Any valid date | Today's date — sets current year, base for predicted date arithmetic |

---

## Field 1: count (Jaap Count per Entry)

| Data ID | Field | Value | Data Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|------------|-------------------|------|-----------|
| TD-RP-001 | count | `10000` | Valid-Normal | Avg = 10,000/day; used in regression baseline test; displays as `10,000/day` in Indian format | Low | RP-020 |
| TD-RP-002 | count | `50000` | Valid-Normal | Most common test value; avg = 50,000/day; displays as `50,000/day` | Low | RP-001 to RP-009, RP-013 to RP-017, RP-021, RP-022, RP-028 to RP-031 |
| TD-RP-003 | count | `51200` | Valid-Normal | YTD total = 30 × 51,200 = 15,36,000; avg = 51,200/day; displays as `51,200/day` | Low | RP-003, RP-004, RP-005 |
| TD-RP-004 | count | `60000` | Valid-Normal | Used to create diverged primary avg (≠ YTD avg); displays as `60,000/day` | Low | RP-016, RP-024, RP-025 |
| TD-RP-005 | count | `100000` | Valid-Normal | YTD avg = 1,00,000/day; must display as `1,00,000/day` (Indian format), NOT `100,000/day` | Low | RP-026, RP-027 |
| TD-RP-006 | count | `1` | Valid-Boundary (min non-zero) | Included in threshold count and YTD average; avg = 1/day | Low | — |
| TD-RP-007 | count | `2` | Valid-Boundary (min+1) | Included in threshold count and YTD average; avg = 2/day | Low | — |
| TD-RP-008 | count | `0` | Valid-Boundary (zero) | Entry is valid and saved; excluded from YTD threshold count and excluded from avg numerator/denominator | High | RP-011, RP-012 |
| TD-RP-009 | count | `-1` | Invalid-Boundary (below min) | App should reject negative input — field should show error or not accept the value | High | — |
| TD-RP-010 | count | `100000000` | Invalid-Boundary (practical max exceeded) | 10 Crore in a single day — app should handle gracefully without crash or overflow | Medium | — |
| TD-RP-011 | count | `abc` | Invalid-Type (text) | App should reject non-numeric input — Save button should not activate or should show error | High | — |
| TD-RP-012 | count | `50000.5` | Invalid-Type (decimal) | App should reject decimal input — Jaap count must be a whole number | Medium | — |
| TD-RP-013 | count | `@#$%` | Invalid-Type (special chars) | App should reject — should not save or corrupt IndexedDB entry | High | — |
| TD-RP-014 | count | `1e5` | Invalid-Type (scientific notation) | App should reject or parse as 100000 — behaviour should be defined | Medium | — |
| TD-RP-015 | count | `` (empty string) | Invalid-Edge (empty) | App should not save — or should treat as 0 (today not counted) | Medium | — |
| TD-RP-016 | count | `   ` (whitespace only) | Invalid-Edge (whitespace) | App should reject — whitespace should not be parsed as 0 silently | Medium | — |
| TD-RP-017 | count | `000050000` | Invalid-Edge (leading zeros) | App should parse as 50,000 or reject — leading zeros must not corrupt the stored value | Medium | — |
| TD-RP-018 | count | `50,000` (comma in input) | Invalid-Edge (formatted input) | App should reject — comma-formatted input should not be accepted in a number field | Medium | — |
| TD-RP-019 | count | `<script>alert('xss')</script>` | Security | Should be stored as literal text — must NEVER execute as code; no alert popup | **Critical** | — |
| TD-RP-020 | count | `'; DROP TABLE entries; --` | Security | IndexedDB does not use SQL — but input must be sanitised; stored as literal string | **Critical** | — |
| TD-RP-021 | count | `javascript:alert(1)` | Security | Must not execute — stored as string, not evaluated | **Critical** | — |
| TD-RP-022 | count | `<<50000>>` | Security | HTML injection attempt — must display as literal characters, not interpreted as HTML tags | **Critical** | — |

---

## Field 2: ytd_entry_count (YTD Non-Zero Entry Count)

| Data ID | Field | Value | Data Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|------------|-------------------|------|-----------|
| TD-RP-023 | ytd_entry_count | `35` | Valid-Normal | Above threshold — YTD prediction shows | Low | RP-001 |
| TD-RP-024 | ytd_entry_count | `60` | Valid-Normal | Well above threshold — YTD shows; two different averages produce different predicted dates | Low | RP-016 |
| TD-RP-025 | ytd_entry_count | `200` | Valid-Normal | Full-year scenario — YTD shows; large denominator produces stable average | Low | — |
| TD-RP-026 | ytd_entry_count | `30` | Valid-Boundary (exact threshold) | YTD prediction appears for the first time — threshold exactly met | **High** | RP-007, RP-018 |
| TD-RP-027 | ytd_entry_count | `31` | Valid-Boundary (threshold+1) | YTD prediction continues to show — threshold is a floor, not exact | **High** | RP-008 |
| TD-RP-028 | ytd_entry_count | `29` | Invalid-Boundary (threshold-1) | YTD prediction is absent — one entry below the minimum | **High** | RP-006, RP-013 |
| TD-RP-029 | ytd_entry_count | `0` | Invalid-Boundary (none) | YTD prediction absent — no current-year non-zero entries exist | **High** | RP-010, RP-011 |
| TD-RP-030 | ytd_entry_count | `0 non-zero (35 entries all count=0)` | Invalid-Edge (zero-count entries ignored) | 35 YTD entries exist but all have count = 0 — effective non-zero count = 0, threshold not met, YTD absent | **High** | RP-011 |
| TD-RP-031 | ytd_entry_count | `20 non-zero + 30 zero = 50 total` | Invalid-Edge (mixed) | Only 20 count toward threshold — total entry count of 50 does NOT trigger YTD; threshold count = 20, YTD absent | **High** | RP-012 |
| TD-RP-032 | ytd_entry_count | `200 prior-year non-zero + 5 current-year non-zero` | Invalid-Edge (year isolation) | Prior-year entries must not count toward YTD threshold — only 5 current-year entries counted; YTD absent | **High** | RP-014 |

---

## Field 3: total_lifetime_count (Total Lifetime Jaap Count)

| Data ID | Field | Value | Data Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|------------|-------------------|------|-----------|
| TD-RP-033 | total_lifetime_count | `9000000` | Valid-Normal | Remaining to 1 Crore = 10,00,000; predicted date ≈ 20 days out at 50,000/day | Low | RP-001, RP-006 to RP-009, RP-011 to RP-016 |
| TD-RP-034 | total_lifetime_count | `9950000` | Valid-Normal | Remaining = 50,000; predicted date = 1 day out at 50,000/day = 12 Apr 2026 | Low | RP-002, RP-031 |
| TD-RP-035 | total_lifetime_count | `9488000` | Valid-Normal | Remaining = 5,12,000; at 51,200/day: ceil(512,000 ÷ 51,200) = 10 → predicted = 21 Apr 2026 | Low | RP-005 |
| TD-RP-036 | total_lifetime_count | `9974800` | Valid-Normal | Remaining = 25,200; at 51,200/day: ceil(25,200 ÷ 51,200) = 1 → predicted = 12 Apr 2026 | Low | RP-003 |
| TD-RP-037 | total_lifetime_count | `9900000` | Valid-Normal | Remaining = 1,00,000; at 50,000/day: ceil(100,000 ÷ 50,000) = 2 → predicted = 13 Apr 2026 | Low | RP-028, RP-029 |
| TD-RP-038 | total_lifetime_count | `9999999` | Valid-Boundary (1 below 1 Crore) | Remaining = 1; at any positive avg: ceil(1 ÷ avg) = 1 → predicted = tomorrow | **High** | — |
| TD-RP-039 | total_lifetime_count | `10000000` | Valid-Boundary (exactly 1 Crore) | Milestone just reached; next milestone = 2 Crore; remaining = 1,00,00,000 | **High** | — |
| TD-RP-040 | total_lifetime_count | `10000001` | Valid-Boundary (1 above 1 Crore) | Just crossed 1 Crore; next milestone = 2 Crore; remaining = 9,999,999 | **High** | — |
| TD-RP-041 | total_lifetime_count | `300000` | Invalid-Edge (very low — new user) | Remaining to 1 Crore = 97,00,000; far future predicted date; must not crash | Low | RP-020 |
| TD-RP-042 | total_lifetime_count | `0` | Invalid-Edge (no entries ever) | No entries exist — no prediction possible; prediction block absent or shows nothing | Medium | — |
| TD-RP-043 | total_lifetime_count | `11000000` | Valid-Normal (past 1 Crore) | Progress toward 2 Crore = 10.0%; milestone history shows 1 Crore crossed | Low | RP-036 |
| TD-RP-044 | total_lifetime_count | `11500000` | Valid-Normal (multi-year veteran) | Used to verify prior-year YTD isolation: 100 × 1,00,000 + 30 × 50,000 = 1,15,00,000 | Low | RP-034 |

---

## Field 4: entry_date (Date of a Jaap Entry, YYYY-MM-DD)

| Data ID | Field | Value | Data Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|------------|-------------------|------|-----------|
| TD-RP-045 | entry_date | `2026-01-01` | Valid-Normal | First day of year — counted as 2026 YTD entry | Low | RP-003 to RP-008, RP-016, RP-018 |
| TD-RP-046 | entry_date | `2026-04-11` | Valid-Normal | Today (current test date) — counted as 2026 YTD entry | Low | RP-009, RP-019, RP-033 |
| TD-RP-047 | entry_date | `2025-12-31` | Valid-Normal | Last day of 2025 — prior-year entry, NOT counted in 2026 YTD | Low | RP-006 |
| TD-RP-048 | entry_date | `2026-12-31` | Valid-Boundary (last day of current year) | Counted as 2026 YTD entry — last day of year must be included | **High** | — |
| TD-RP-049 | entry_date | `2027-01-01` | Valid-Boundary (first day of next year) | Counted as 2027 YTD entry — NOT counted in 2026 YTD; year boundary respected | **High** | RP-010 |
| TD-RP-050 | entry_date | `2026-02-28` | Valid-Normal | Last valid day of February 2026 (not a leap year) — valid entry | Low | — |
| TD-RP-051 | entry_date | `2026-02-29` | Invalid-Edge (Feb 29 in non-leap year) | 2026 is NOT a leap year — this date does not exist; app must not crash or create corrupt entry | **High** | — |
| TD-RP-052 | entry_date | `2026-13-01` | Invalid-Edge (invalid month) | Month 13 does not exist — app should reject or not create this entry | Medium | — |
| TD-RP-053 | entry_date | `<script>alert(1)</script>` | Security | Must be stored as literal string — never executed; YTD calculation must not include it | **Critical** | — |
| TD-RP-054 | entry_date | `'; DROP TABLE; --` | Security | IndexedDB is not SQL-based — must store safely as string without side effects | **Critical** | — |

---

## Field 5: system_date (Today's Date / Mocked Clock Date)

| Data ID | Field | Value | Data Class | Expected Behaviour | Risk | Linked TC |
|---------|-------|-------|------------|-------------------|------|-----------|
| TD-RP-055 | system_date | `2026-04-11` | Valid-Normal | Standard test date; current year = 2026; YTD label shows "At your 2026 pace" | Low | RP-001 to RP-031, RP-033 to RP-036 |
| TD-RP-056 | system_date | `2027-01-01` | Valid-Normal | New Year's Day 2027; current year = 2027; zero 2027 entries → YTD absent; 2026 entries used for primary only | **High** | RP-010 |
| TD-RP-057 | system_date | `2027-02-01` | Valid-Normal | Early February 2027; current year = 2027; no 2027 entries → YTD absent; December 2026 entries power primary | **High** | RP-017 |
| TD-RP-058 | system_date | `2027-04-01` | Valid-Normal | April 2027; current year = 2027; with 30 Jan 2027 entries: YTD label shows "At your **2027** pace" | **High** | RP-032 |
| TD-RP-059 | system_date | `2026-12-31` | Valid-Boundary (last day of year) | Current year = 2026; YTD entries for full year valid; year rolls over at midnight | **High** | — |

---

## Combination Data (Multi-Field Interactions)

These data sets combine specific count values, entry counts, and total lifetime counts to produce verifiable predicted dates.

| Data ID | Fields | Values | Data Class | Expected Behaviour | Risk | Linked TC |
|---------|--------|--------|------------|-------------------|------|-----------|
| TD-RP-C01 | count + ytd_entry_count + total | 30 entries × `50000` + 1 entry × `80000` on 2026-04-11; total at start = `9,000,000` | Combination | Before save: YTD avg = 50,000/day, predicted = 1 May 2026. After save: YTD total = 1,580,000 ÷ 31 = 50,968/day; remaining = 9,20,000; predicted = 30 Apr 2026 | High | RP-019 |
| TD-RP-C02 | count + ytd_entry_count + total | 30 entries × `50000` + 1 entry × `100000` on 2026-04-11; total at start = `9,000,000` | Combination | Before save: YTD = 50,000/day, predicted = 1 May 2026. After save: 1,600,000 ÷ 31 = 51,613/day; remaining = 9,00,000; predicted = 29 Apr 2026 | High | RP-033 |
| TD-RP-C03 | count + ytd_entry_count | 30 entries × `40000` (2026-01-01 to 2026-01-30) + 30 entries × `60000` (2026-02-01 to 2026-03-02); total = `9,000,000` | Combination | Primary avg = 60,000/day (last 30 entries only); YTD avg = (12,00,000 + 18,00,000) ÷ 60 = 50,000/day; primary predicted = 28 Apr 2026; YTD predicted = 1 May 2026 | High | RP-016 |
| TD-RP-C04 | count + entry_date (year isolation) | 100 entries (2025-01-01 to 2025-04-10) × `100000` + 30 entries (2026-01-01 to 2026-01-30) × `50000`; total = `11,500,000` | Combination | YTD avg must be 50,000/day (2026 only), NOT 88,462/day (blended) — prior year excluded | High | RP-034 |
| TD-RP-C05 | count + entry_date (primary isolation) | 100 entries (2024-01-01 to 2024-04-10) × `1000` + 30 entries (2026-01-01 to 2026-01-30) × `50000`; total = `1,600,000` | Combination | Primary avg must be 50,000/day (last 30 entries only), NOT 12,308/day (blended) — `.slice(-30)` behaviour confirmed | High | RP-023 |
| TD-RP-C06 | count + total_lifetime_count (milestone boundary) | 1 entry × `9500000` (2025-01-01) + 30 entries × `50000` (2026-01-01 to 2026-01-30); total = `11,000,000` | Combination | Progress = 10.0% toward 2 Crore; milestone history shows 1 Crore crossed; prediction block below progress bar; history section unaffected | High | RP-036 |

---

## Data Class Summary

| Data Class | Count |
|------------|-------|
| Valid-Normal | 19 |
| Valid-Boundary | 12 |
| Invalid-Boundary | 4 |
| Invalid-Type | 4 |
| Invalid-Edge | 11 |
| Security | 6 |
| Combination | 6 |
| **Total** | **62** |

---

## Critical Risk Items

| Data ID | Field | Value | Why Critical |
|---------|-------|-------|-------------|
| TD-RP-019 | count | `<script>alert('xss')</script>` | XSS — could execute in browser if count value is rendered without escaping |
| TD-RP-020 | count | `'; DROP TABLE entries; --` | SQL injection pattern — harmless for IndexedDB but must be stored safely without causing app errors |
| TD-RP-021 | count | `javascript:alert(1)` | Protocol injection — must not be interpreted if the count value is ever used in a URL or event handler |
| TD-RP-022 | count | `<<50000>>` | HTML injection — angle brackets could be parsed as tags if value is inserted into DOM unsafely |
| TD-RP-053 | entry_date | `<script>alert(1)</script>` | XSS in date field — date strings are displayed in the Ledger; if not escaped they could execute |
| TD-RP-054 | entry_date | `'; DROP TABLE; --` | Injection in date field — date is used in filter expressions; must be sanitised |

---

## Data Gaps

**1. Maximum count boundary — product decision pending**
No hard upper limit is defined for the `count` field. TD-RP-010 tests `100000000` (10 Crore in one day) as a practical ceiling. The product should define a maximum and the field should validate against it. Until defined, this is a gap.

**2. count = 0 saved-then-edited behaviour**
What happens if a user saves `count: 0` today, then edits it to `50000`? Does the YTD threshold count update live? This edge is not covered by any test case and is not addressed in the requirements. Recommend adding a state test for this flow.

**3. Duplicate dates in IndexedDB**
The requirements and test cases assume one entry per date. No test covers what happens if IndexedDB contains two entries for the same date (e.g. a sync conflict). YTD calculation behaviour under duplicate dates is undefined.

**4. Very large number of YTD entries (>300)**
TD-RP-025 covers 200 entries. No test covers 300+ entries. At very high entry counts the YTD average stabilises and predicted dates should still be accurate — but performance has not been addressed in any test case.

**5. Fractional YTD average — rounding behaviour**
When total YTD count is not evenly divisible by the entry count, the average is a decimal. For example, 1,00,003 ÷ 30 = 3,333.43. The exact rounding rule (floor vs. ceil vs. round) is not specified in the requirements. TD-RP-C01 and TD-RP-C02 produce 50,968 and 51,613 respectively — both confirmed in test cases — but the general rounding policy should be documented.
