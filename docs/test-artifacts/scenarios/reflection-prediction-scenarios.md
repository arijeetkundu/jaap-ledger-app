# Test Scenario Set — Reflection Card YTD Milestone Prediction

*Agent: Test Scenario Agent*
*Date: 10 April 2026*
*Input: docs/test-artifacts/requirements/reflection-prediction-requirement-review.md*
*Total Scenarios: 36 | ACs Covered: 20/20 | Gaps: None*

---

## Happy Path Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| RP-001 | Both predictions visible when ≥ 30 YTD entries exist | Happy Path | P1 | User has 30+ non-zero entries since 1 Jan and 30+ days of recent history. Both lines appear in the Reflection Card — primary above, YTD below. Verifies the core two-line display is working end to end. | AC8, AC15 |
| RP-002 | Primary prediction shows correct 30-day label format | Happy Path | P1 | With a 30-day average of 63,698/day and predicted date of 13 May 2026, the primary line reads exactly: "At current pace (30-day avg: 63,698/day): 13 May 2026". Verifies label, number format, and date format together. | AC2, AC13, AC20 |
| RP-003 | YTD prediction shows correct label format | Happy Path | P1 | With a YTD average of 51,204/day and predicted date of 22 Aug 2026, the YTD line reads exactly: "At your 2026 pace (51,204/day YTD): 22 Aug 2026". Verifies all three elements: label, number format, date format. | AC12, AC13, AC20 |
| RP-004 | YTD average calculation is mathematically correct | Happy Path | P1 | With known test data — 30 entries since 1 Jan totalling 15,36,000 — the YTD average must be 51,200/day. Verifies Method B: total ÷ non-zero entry count. | AC5 |
| RP-005 | YTD predicted date is calculated correctly | Happy Path | P1 | Given a known total count, next milestone, and YTD average, the predicted date must match the expected calculation: today + ceil(remaining ÷ YTD average). Verifies the date arithmetic is correct. | AC17 |

---

## Boundary Value Analysis Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| RP-006 | Exactly 29 non-zero YTD entries — YTD prediction absent | BVA | P1 | User has exactly 29 non-zero entries since 1 Jan. The YTD prediction line must NOT appear. Primary 30-day prediction continues to show normally. This is the critical boundary — one entry below the threshold. | AC8, AC11, AC14 |
| RP-007 | Exactly 30 non-zero YTD entries — YTD prediction appears | BVA | P1 | User has exactly 30 non-zero entries since 1 Jan. The YTD prediction line must NOW appear for the first time. This is the exact threshold crossing — most important boundary in this feature. | AC8, AC11 |
| RP-008 | Exactly 31 non-zero YTD entries — YTD prediction remains | BVA | P2 | User has exactly 31 non-zero entries since 1 Jan. The YTD prediction must continue to show — threshold is ≥ 30, not exactly 30. Confirms the threshold is a floor, not an exact match. | AC8 |
| RP-009 | Transition from 29th to 30th entry — YTD appears after save | BVA | P1 | User has 29 YTD entries. YTD line absent. User saves a new non-zero count (30th entry). Without reloading, the YTD prediction appears. Verifies the live recalculation at the exact moment of threshold crossing. | AC11, AC17 |

---

## Negative Testing Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| RP-010 | 1 January — YTD prediction not shown | Negative | P1 | On 1st January, zero entries exist for the new year. The YTD line must be absent. The primary 30-day prediction may still show based on prior year entries (if ≥ 30 exist). Verifies the new year reset is clean. | AC9 |
| RP-011 | YTD entries all have count = 0 — YTD prediction not shown | Negative | P1 | User has 30+ entries since 1 Jan but all have count = 0. Since zero-count entries are excluded from the denominator, the effective entry count is 0 — YTD prediction must not appear. Verifies zero-exclusion logic. | AC6, AC8 |
| RP-012 | Mix of zero and non-zero entries — only non-zero counted | Negative | P2 | User has 50 entries since 1 Jan: 20 with count > 0, 30 with count = 0. Effective non-zero count is 20 — below threshold of 30. YTD prediction must not appear. Verifies zeros are excluded from threshold count. | AC6, AC8 |
| RP-013 | New user with 29 days since first entry — YTD absent | Negative | P2 | User who joined on 10 March has 29 non-zero entry days since their first entry. YTD prediction must not appear. Threshold applies from first entry date for new users, not from 1 Jan. | AC10 |
| RP-014 | Prior year entries alone do not trigger YTD prediction | Negative | P1 | User has 200 entries from prior years but only 5 entries in the current year. YTD prediction must not appear. Prior year entries must not be counted toward the 30-day threshold. | AC7, AC8 |

---

## State-Based Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| RP-015 | Primary prediction only — YTD below threshold | State | P1 | User has < 30 YTD non-zero entries. Reflection Card shows only the primary prediction line. No YTD line, no blank space where it would be. Layout is compact and correct. | AC14 |
| RP-016 | Both predictions visible — mid-year experienced user | State | P1 | User with 30+ YTD entries in April. Both lines visible. Primary reflects recent 30-day pace, YTD reflects annual pace — the two dates will typically differ, confirming each uses its own calculation. | AC15 |
| RP-017 | New year state — YTD resets, primary continues | State | P1 | It is 1 February. User has no entries in current year. Primary 30-day prediction shows (based on December entries). YTD is absent. Confirms the year boundary resets YTD independently of the primary. | AC9, AC18 |
| RP-018 | New user — YTD appears 30 entry days after first entry | State | P2 | User who joined on 1 March makes their 30th non-zero entry on 15 April. YTD prediction appears on 15 April for the first time. Verifies the 30-day clock starts from first entry, not from 1 Jan. | AC10 |
| RP-019 | YTD average changes as year progresses | State | P2 | User adds entries over several days. Each new non-zero entry causes the YTD average and predicted date to recalculate. Verifies the prediction is dynamic, not frozen at first calculation. | AC17 |

---

## Regression Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| RP-020 | Existing 30-day prediction value is unchanged after feature addition | Regression | P1 | With identical entry data, the primary prediction date and average must be identical before and after the YTD feature is added. Verifies no side effects on the existing predictNextMilestone function. | AC1, AC3 |
| RP-021 | Primary prediction still appears when YTD is absent | Regression | P1 | With < 30 YTD entries, the primary prediction must continue to show normally. The YTD threshold must not suppress the primary line. Confirms the two thresholds are independent. | AC1, AC14 |
| RP-022 | All existing predictNextMilestone unit tests pass | Regression | P1 | After implementing the new YTD function, run the full unit test suite. All existing tests for predictNextMilestone in milestoneLogic.test.js must pass without modification. Confirms no regression in the existing function. | AC3 |
| RP-023 | Primary prediction not affected by prior year entries | Regression | P2 | The existing 30-day rolling logic already excludes entries older than the last 30 non-zero entries. Verify this behaviour is unchanged — prior year entries do not influence the primary prediction. | AC1 |

---

## UI/UX Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| RP-024 | Primary label text is verbatim correct | UI | P1 | The primary line text matches exactly: "At current pace (30-day avg: X/day): D MMM YYYY" — correct wording, correct punctuation, correct placement of colon. No variation in phrasing is acceptable. | AC2 |
| RP-025 | YTD label text is verbatim correct | UI | P1 | The YTD line text matches exactly: "At your 2026 pace (X/day YTD): D MMM YYYY" — correct wording, year is dynamic (2026 in 2026, 2027 in 2027), correct punctuation. | AC12 |
| RP-026 | Daily average uses Indian number format in primary line | UI | P2 | A 30-day average of 100000/day must display as "1,00,000/day" not "100,000/day". Verifies formatIndianNumber is applied to the primary average value. | AC2, AC13 |
| RP-027 | Daily average uses Indian number format in YTD line | UI | P2 | A YTD average of 100000/day must display as "1,00,000/day". Verifies formatIndianNumber is applied consistently to the YTD average value. | AC12, AC13 |
| RP-028 | Date format is D MMM YYYY in primary line | UI | P1 | The predicted date must display as "13 May 2026" not "2026-05-13". Verifies the ISO format from the existing function is converted to readable format for display. | AC20 |
| RP-029 | Date format is D MMM YYYY in YTD line | UI | P1 | The YTD predicted date must also display as "13 May 2026" not "2026-05-13". Consistent date format across both lines. | AC20 |
| RP-030 | No blank space when YTD is absent | UI | P2 | When < 30 YTD entries exist, the space where the YTD line would appear must be completely absent — no empty div, no placeholder, no extra padding. The card looks the same as it does today. | AC14 |
| RP-031 | Both lines show separately when dates are identical | UI | P2 | When the 30-day and YTD calculations produce the same predicted date, both lines must still render separately with their own labels. They must not collapse into a single line. | AC16 |
| RP-032 | Year in YTD label updates on 1 January | UI | P2 | On 1 January 2027, the YTD label must read "At your 2027 pace..." not "At your 2026 pace...". Verifies the year is dynamic, not hardcoded. | AC12 |

---

## Integration Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| RP-033 | Saving a new Today Card entry recalculates YTD prediction | Integration | P1 | User saves a new count via Today Card. Without page reload, the YTD prediction in the Reflection Card updates to reflect the new entry. Verifies the Reflection Card reacts to new data correctly. | AC17 |
| RP-034 | Prior year Ledger entries have zero effect on YTD average | Integration | P1 | User has 500 prior year entries totalling 5 crore. Current year has 30 entries totalling 20 lakh. YTD average must be based on the 20 lakh only — not influenced by the 5 crore. Verifies year isolation in the calculation. | AC7 |
| RP-035 | New unit tests for predictNextMilestoneYTD exist and pass | Integration | P1 | The test suite includes new tests for predictNextMilestoneYTD covering: normal calculation, 29-entry result (null), 30-entry result (shows), 31-entry result (shows), new year boundary (no current-year entries), prior year isolation. All pass. | AC19 |
| RP-036 | Milestone progress bar and history unaffected | Integration | P2 | The milestone progress bar, percentage, and milestone history section in the Reflection Card must be unchanged. Adding the YTD prediction below the primary must not shift or affect other Reflection Card elements. | AC1 |

---

## Coverage Matrix

| AC | Short Description | Scenario IDs |
|----|------------------|-------------|
| 1 | predictNextMilestone unchanged | RP-020, RP-021, RP-022, RP-023, RP-036 |
| 2 | Primary line format correct | RP-002, RP-024, RP-026, RP-028 |
| 3 | Existing unit tests pass | RP-022 |
| 4 | New function predictNextMilestoneYTD added | RP-004, RP-005 |
| 5 | YTD avg = total ÷ non-zero entry count | RP-004 |
| 6 | count=0 entries excluded | RP-011, RP-012 |
| 7 | Prior year entries excluded | RP-014, RP-034 |
| 8 | YTD shown only when ≥ 30 non-zero YTD entries | RP-006, RP-007, RP-008, RP-011, RP-012, RP-013, RP-014 |
| 9 | 1 January — YTD not shown | RP-010, RP-017 |
| 10 | New user — 30 entry days from first entry | RP-013, RP-018 |
| 11 | Appears on 30th entry, absent on 29th | RP-006, RP-007, RP-009 |
| 12 | YTD line format correct | RP-003, RP-025, RP-027, RP-029, RP-032 |
| 13 | formatIndianNumber used for both averages | RP-002, RP-003, RP-026, RP-027 |
| 14 | No blank space when YTD absent | RP-006, RP-015, RP-021, RP-030 |
| 15 | YTD below primary when both visible | RP-001, RP-016 |
| 16 | Same date — both lines still separate | RP-031 |
| 17 | YTD recalculates on new entry saved | RP-005, RP-009, RP-019, RP-033 |
| 18 | 31 Dec → 1 Jan boundary graceful | RP-017 |
| 19 | New unit tests for YTD function | RP-035 |
| 20 | D MMM YYYY date format on both lines | RP-028, RP-029 |

**All 20 ACs covered. No gaps.**

---

## Count by Type

| Type | Count |
|------|-------|
| Happy Path | 5 |
| BVA | 4 |
| Negative | 5 |
| State | 5 |
| Regression | 4 |
| UI/UX | 9 |
| Integration | 4 |
| **Total** | **36** |
