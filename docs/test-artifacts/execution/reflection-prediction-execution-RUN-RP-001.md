# Test Execution Log — Reflection Card YTD Milestone Prediction

*Agent: Test Execution Agent*
*Run ID: RUN-RP-001*
*Date: 11 April 2026*

---

## 1. Run Summary

| Field | Value |
|-------|-------|
| Run ID | RUN-RP-001 |
| Feature | Reflection Card YTD Milestone Prediction |
| Tester | Arijit Kundu |
| Execution Date | 11 Apr 2026 |
| Browser | Chrome 124 |
| OS | Windows 11 |
| App URL | http://localhost:5173 |
| Branch | feature/ytd-milestone-prediction |
| Commit | 0b81c92 (working tree — implementation uncommitted at time of run) |
| Execution Mode | Both — Vitest (unit) + Playwright (E2E) |
| **Total Tests** | **41** |
| **Pass** | **41** |
| **Fail** | **0** |
| **Blocked** | **0** |
| **Skipped** | **0** |
| **Pass Rate** | **100%** |

---

## 2. Execution Results Table

| TC ID | Title | Type | Priority | Result | Defect ID |
|-------|-------|------|----------|--------|-----------|
| RP-001 | Both prediction lines visible with 30+ YTD entries | Happy Path | P1 | ✅ Pass | — |
| RP-002 | Primary label format correct (label, Indian number, D MMM YYYY) | Happy Path | P1 | ✅ Pass | — |
| RP-003 | YTD label format correct (label, Indian number, D MMM YYYY) | Happy Path | P1 | ✅ Pass | — |
| RP-004 | YTD average = total ÷ non-zero entry count (Method B) | Happy Path | P1 | ✅ Pass | — |
| RP-005 | YTD predicted date = today + ceil(remaining ÷ avg) | Happy Path | P1 | ✅ Pass | — |
| RP-006 | 29 non-zero YTD entries — YTD line absent | BVA | P1 | ✅ Pass | — |
| RP-007 | 30 non-zero YTD entries — YTD line appears | BVA | P1 | ✅ Pass | — |
| RP-008 | 31 non-zero YTD entries — YTD line remains | BVA | P2 | ✅ Pass | — |
| RP-009 | Save 30th entry live — YTD appears without page reload | BVA | P1 | ✅ Pass | — |
| RP-010 | 1 January — YTD absent, primary continues | Negative | P1 | ✅ Pass | — |
| RP-011 | All 2026 entries count = 0 — YTD absent | Negative | P1 | ✅ Pass | — |
| RP-012 | 20 non-zero + 30 zero YTD entries — threshold count is 20 | Negative | P2 | ✅ Pass | — |
| RP-013 | New user, 29 non-zero entries since first entry — YTD absent | Negative | P2 | ✅ Pass | — |
| RP-014 | 200 prior year entries, 5 current year — YTD absent | Negative | P1 | ✅ Pass | — |
| RP-015 | Primary prediction only — YTD below threshold, no blank space | State | P1 | ✅ Pass | — |
| RP-016 | Both predictions show different dates — mid-year varied pace | State | P1 | ✅ Pass | — |
| RP-017 | New year state — YTD absent, primary continues (1 Feb 2027) | State | P1 | ✅ Pass | — |
| RP-018 | New user — YTD appears on 30th entry day (not from 1 Jan) | State | P2 | ✅ Pass | — |
| RP-019 | YTD average recalculates after new entry saved | State | P2 | ✅ Pass | — |
| RP-020 | Primary prediction unchanged after YTD feature added | Regression | P1 | ✅ Pass | — |
| RP-021 | Primary shows normally when YTD threshold not met | Regression | P1 | ✅ Pass | — |
| RP-022 | All existing predictNextMilestone unit tests pass | Regression | P1 | ✅ Pass | — |
| RP-023 | Primary avg reflects only last 30 entries — prior year excluded | Regression | P2 | ✅ Pass | — |
| RP-024 | Primary label text is verbatim correct | UI | P1 | ✅ Pass | — |
| RP-025 | YTD label text is verbatim correct | UI | P1 | ✅ Pass | — |
| RP-026 | Primary average uses Indian number format (1,00,000/day) | UI | P2 | ✅ Pass | — |
| RP-027 | YTD average uses Indian number format (1,00,000/day) | UI | P2 | ✅ Pass | — |
| RP-028 | Primary date displays as D MMM YYYY — not ISO | UI | P1 | ✅ Pass | — |
| RP-029 | YTD date displays as D MMM YYYY — not ISO | UI | P1 | ✅ Pass | — |
| RP-030 | No blank space or empty div when YTD absent | UI | P2 | ✅ Pass | — |
| RP-031 | Both lines render separately when predicted dates are identical | UI | P2 | ✅ Pass | — |
| RP-032 | Year in YTD label updates to 2027 in 2027 | UI | P2 | ✅ Pass | — |
| RP-033 | Today Card save recalculates YTD prediction without reload | Integration | P1 | ✅ Pass | — |
| RP-034 | Prior year entries have zero effect on YTD average | Integration | P1 | ✅ Pass | — |
| RP-035 | New unit tests for predictNextMilestoneYTD exist and pass | Integration | P1 | ✅ Pass | — |
| RP-036 | Milestone progress bar and history unaffected | Integration | P2 | ✅ Pass | — |

*Note: RP-022 and RP-035 executed as Vitest unit tests. All remaining 34 executed as Playwright E2E tests.*

---

## 3. Pass/Fail by Type

| Type | Total | Pass | Fail | Blocked | Skipped | Pass Rate |
|------|-------|------|------|---------|---------|-----------|
| Happy Path | 5 | 5 | 0 | 0 | 0 | 100% |
| BVA | 4 | 4 | 0 | 0 | 0 | 100% |
| Negative | 5 | 5 | 0 | 0 | 0 | 100% |
| State | 5 | 5 | 0 | 0 | 0 | 100% |
| Regression | 4 | 4 | 0 | 0 | 0 | 100% |
| UI | 9 | 9 | 0 | 0 | 0 | 100% |
| Integration | 4 | 4 | 0 | 0 | 0 | 100% |
| **Total** | **36** | **36** | **0** | **0** | **0** | **100%** |

*Unit tests (RP-022 subset + RP-035 = 6 Vitest tests) included in Regression and Integration counts above.*

---

## 4. Priority Breakdown

| Priority | Total | Pass | Fail | Pass Rate |
|----------|-------|------|------|-----------|
| P1-Critical | 22 | 22 | 0 | 100% |
| P2-High | 14 | 14 | 0 | 100% |
| **Total** | **36** | **36** | **0** | **100%** |

---

## 5. Failed Test Cases — Detail

No failures — all 36 test cases passed on first execution.

---

## 6. Blocked / Skipped Test Cases

None. All 36 test cases were executed in this run.

---

## 7. Coverage Summary

Reference: `docs/test-artifacts/scenarios/reflection-prediction-scenarios.md` — 20 ACs, all covered.

| AC | Description | Linked TCs | TCs Passed | Status |
|----|-------------|------------|------------|--------|
| AC1 | predictNextMilestone unchanged | RP-020, RP-021, RP-022, RP-023, RP-036 | 5/5 | ✅ Fully Covered |
| AC2 | Primary line format correct | RP-002, RP-024, RP-026, RP-028 | 4/4 | ✅ Fully Covered |
| AC3 | Existing unit tests pass | RP-022 | 1/1 | ✅ Fully Covered |
| AC4 | predictNextMilestoneYTD added | RP-004, RP-005 | 2/2 | ✅ Fully Covered |
| AC5 | YTD avg = total ÷ non-zero count | RP-004 | 1/1 | ✅ Fully Covered |
| AC6 | count=0 entries excluded | RP-011, RP-012 | 2/2 | ✅ Fully Covered |
| AC7 | Prior year entries excluded | RP-014, RP-034 | 2/2 | ✅ Fully Covered |
| AC8 | YTD shown only when ≥ 30 non-zero YTD entries | RP-006 to RP-008, RP-011 to RP-014 | 7/7 | ✅ Fully Covered |
| AC9 | 1 January — YTD not shown | RP-010, RP-017 | 2/2 | ✅ Fully Covered |
| AC10 | New user — 30 entry days from first entry | RP-013, RP-018 | 2/2 | ✅ Fully Covered |
| AC11 | Appears on 30th entry, absent on 29th | RP-006, RP-007, RP-009 | 3/3 | ✅ Fully Covered |
| AC12 | YTD line format correct | RP-003, RP-025, RP-027, RP-029, RP-032 | 5/5 | ✅ Fully Covered |
| AC13 | formatIndianNumber used for both averages | RP-002, RP-003, RP-026, RP-027 | 4/4 | ✅ Fully Covered |
| AC14 | No blank space when YTD absent | RP-006, RP-015, RP-021, RP-030 | 4/4 | ✅ Fully Covered |
| AC15 | YTD below primary when both visible | RP-001, RP-016 | 2/2 | ✅ Fully Covered |
| AC16 | Same date — both lines still separate | RP-031 | 1/1 | ✅ Fully Covered |
| AC17 | YTD recalculates on new entry saved | RP-005, RP-009, RP-019, RP-033 | 4/4 | ✅ Fully Covered |
| AC18 | 31 Dec → 1 Jan boundary graceful | RP-017 | 1/1 | ✅ Fully Covered |
| AC19 | New unit tests for YTD function | RP-035 | 1/1 | ✅ Fully Covered |
| AC20 | D MMM YYYY date format on both lines | RP-028, RP-029 | 2/2 | ✅ Fully Covered |

**All 20 ACs: Fully Covered. No ACs at risk.**

---

## 8. Observations

- **TDD workflow validated end to end:** All 41 tests were written before implementation (Red phase). After implementation, all passed on first run without modification to any test (Green phase). No test needed to be adjusted to accommodate the implementation — a strong signal that the test cases were written against the requirement, not the code.
- **Date-sensitive tests (RP-010, RP-017, RP-032) passed cleanly** using Playwright's `page.clock.setFixedTime()` — clock mocking worked reliably without side effects on other tests.
- **RP-009 (live threshold crossing) is the most complex E2E test** — it relies on IndexedDB seeding mid-test and a re-save to trigger a re-render. It passed, but should be monitored for flakiness in CI environments with slower rendering.
- **RP-019 and RP-033 (reactive recalculation tests)** both passed without needing `waitForFunction` — the React state update was fast enough for standard Playwright assertion timeouts. Consider adding explicit waits if these become intermittent in CI.
- **DEF-RP-001 is a hypothetical defect** raised for training purposes only — it does not reflect an actual failure in this run. In a real execution log, the Defect ID column would only be populated for genuine failures.

---

## 9. Sign-Off

| Field | Value |
|-------|-------|
| Tester | Arijit Kundu |
| Sign-off Date | 11 Apr 2026 |
| Recommended Next Action | **Ready for commit and merge** — all 36 test cases pass, all 20 ACs fully covered, 0 defects open. Commit the feature branch and raise a PR to main. |
