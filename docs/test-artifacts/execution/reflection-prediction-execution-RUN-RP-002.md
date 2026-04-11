# Test Execution Log — Reflection Card YTD Milestone Prediction

*Agent: Test Execution Agent*
*Run ID: RUN-RP-002*
*Date: 11 April 2026*
*Note: RUN-RP-001 was a practice run with manually crafted results. RUN-RP-002 is the first run against actual automated output.*

---

## 1. Run Summary

| Field | Value |
|-------|-------|
| Run ID | RUN-RP-002 |
| Feature | Reflection Card YTD Milestone Prediction |
| Tester | Arijit Kundu |
| Execution Date | 11 Apr 2026 |
| Browser | Chrome (system install) |
| OS | Windows 11 |
| App URL | http://localhost:5173 |
| Branch | feature/ytd-milestone-prediction |
| Commit | 0b81c92 (working tree — implementation uncommitted at time of run) |
| Execution Mode | Both — Vitest unit tests + Playwright E2E |
| Unit test command | `npm test` |
| E2E test command | `npx playwright test reflection-prediction.spec.js` |
| **Total Test Cases** | **36** |
| **Pass** | **36** |
| **Fail** | **0** |
| **Blocked** | **0** |
| **Skipped** | **0** |
| **Pass Rate** | **100%** |

### Execution Timings

| Suite | Tests | Duration |
|-------|-------|----------|
| Vitest — full unit suite (4 files) | 64 unit assertions | 2.20s |
| Vitest — milestoneLogic.test.js only | 20 tests (14 existing + 6 new YTD) | part of above |
| Playwright — reflection-prediction.spec.js | 34 E2E tests | 1.2 min |

---

## 2. Execution Results Table

| TC ID | Title | Type | Priority | Execution | Result | Duration | Defect ID |
|-------|-------|------|----------|-----------|--------|----------|-----------|
| RP-001 | Both prediction lines visible with 30+ YTD entries | Happy Path | P1 | Playwright | ✅ Pass | 2.1s | — |
| RP-002 | Primary label format correct (label, Indian number, D MMM YYYY) | Happy Path | P1 | Playwright | ✅ Pass | 1.6s | — |
| RP-003 | YTD label format correct (label, Indian number, D MMM YYYY) | Happy Path | P1 | Playwright | ✅ Pass | 1.7s | — |
| RP-004 | YTD average = total ÷ non-zero entry count (Method B) | Happy Path | P1 | Playwright | ✅ Pass | 1.6s | — |
| RP-005 | YTD predicted date = today + ceil(remaining ÷ YTD average) | Happy Path | P1 | Playwright | ✅ Pass | 1.7s | — |
| RP-006 | 29 non-zero YTD entries — YTD line absent | BVA | P1 | Playwright | ✅ Pass | 1.6s | — |
| RP-007 | 30 non-zero YTD entries — YTD line appears | BVA | P1 | Playwright | ✅ Pass | 1.5s | — |
| RP-008 | 31 non-zero YTD entries — YTD line remains (threshold is a floor) | BVA | P2 | Playwright | ✅ Pass | 1.5s | — |
| RP-009 | Saving 30th entry live — YTD appears without page reload | BVA | P1 | Playwright | ✅ Pass | 5.3s | — |
| RP-010 | 1 January — YTD prediction absent (zero current-year entries) | Negative | P1 | Playwright | ✅ Pass | 1.5s | — |
| RP-011 | All current-year entries have count = 0 — YTD prediction absent | Negative | P1 | Playwright | ✅ Pass | 1.6s | — |
| RP-012 | Mix of zero and non-zero YTD entries — only non-zero counted | Negative | P2 | Playwright | ✅ Pass | 1.8s | — |
| RP-013 | New user with 29 non-zero entries since first entry — YTD absent | Negative | P2 | Playwright | ✅ Pass | 1.6s | — |
| RP-014 | 200 prior-year entries — YTD absent when only 5 current-year entries | Negative | P1 | Playwright | ✅ Pass | 1.7s | — |
| RP-015 | Primary prediction only — YTD below threshold, no blank space | State | P1 | Playwright | ✅ Pass | 1.5s | — |
| RP-016 | Both predictions visible with different dates — mid-year varied pace | State | P1 | Playwright | ✅ Pass | 1.8s | — |
| RP-017 | New year — YTD resets, primary continues (1 Feb 2027) | State | P1 | Playwright | ✅ Pass | 1.6s | — |
| RP-018 | New user — YTD appears on 30th entry day (not from 1 Jan) | State | P2 | Playwright | ✅ Pass | 1.6s | — |
| RP-019 | YTD average recalculates after new entry is saved | State | P2 | Playwright | ✅ Pass | 5.3s | — |
| RP-020 | Primary prediction unchanged after YTD feature is added | Regression | P1 | Playwright | ✅ Pass | 1.7s | — |
| RP-021 | Primary shows normally when YTD threshold is not met | Regression | P1 | Playwright | ✅ Pass | 1.5s | — |
| RP-022 | All existing predictNextMilestone unit tests pass | Regression | P1 | Vitest | ✅ Pass | — | — |
| RP-023 | Primary avg reflects only last 30 entries — prior year excluded | Regression | P2 | Playwright | ✅ Pass | 1.6s | — |
| RP-024 | Primary label text is verbatim correct | UI | P1 | Playwright | ✅ Pass | 1.6s | — |
| RP-025 | YTD label text is verbatim correct | UI | P1 | Playwright | ✅ Pass | 1.6s | — |
| RP-026 | Primary average of 100,000/day displays in Indian format (1,00,000/day) | UI | P2 | Playwright | ✅ Pass | 1.5s | — |
| RP-027 | YTD average of 100,000/day displays in Indian format (1,00,000/day) | UI | P2 | Playwright | ✅ Pass | 1.6s | — |
| RP-028 | Primary date displays as D MMM YYYY — not ISO format | UI | P1 | Playwright | ✅ Pass | 1.5s | — |
| RP-029 | YTD date displays as D MMM YYYY — not ISO format | UI | P1 | Playwright | ✅ Pass | 1.5s | — |
| RP-030 | No blank space or empty div when YTD is absent | UI | P2 | Playwright | ✅ Pass | 2.5s | — |
| RP-031 | Both lines render separately when predicted dates are identical | UI | P2 | Playwright | ✅ Pass | 1.6s | — |
| RP-032 | Year in YTD label updates to 2027 in 2027 | UI | P2 | Playwright | ✅ Pass | 1.6s | — |
| RP-033 | Today Card save recalculates YTD prediction without reload | Integration | P1 | Playwright | ✅ Pass | 6.4s | — |
| RP-034 | Prior year entries have zero effect on YTD average | Integration | P1 | Playwright | ✅ Pass | 1.5s | — |
| RP-035 | New unit tests for predictNextMilestoneYTD exist and pass | Integration | P1 | Vitest | ✅ Pass | — | — |
| RP-036 | Milestone progress bar and history unaffected | Integration | P2 | Playwright | ✅ Pass | 1.6s | — |

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

---

## 4. Priority Breakdown

| Priority | Total | Pass | Fail | Pass Rate |
|----------|-------|------|------|-----------|
| P1-Critical | 22 | 22 | 0 | 100% |
| P2-High | 14 | 14 | 0 | 100% |
| **Total** | **36** | **36** | **0** | **100%** |

---

## 5. Failed Test Cases — Detail

No failures — all 36 test cases passed on first automated execution.

---

## 6. Blocked / Skipped Test Cases

None. All 36 test cases were executed.

---

## 7. Coverage Summary

All 20 Acceptance Criteria fully covered. All linked test cases passed.

| AC | Description | Linked TCs | Status |
|----|-------------|------------|--------|
| AC1 | predictNextMilestone unchanged | RP-020, RP-021, RP-022, RP-023, RP-036 | ✅ Fully Covered |
| AC2 | Primary line format correct | RP-002, RP-024, RP-026, RP-028 | ✅ Fully Covered |
| AC3 | Existing unit tests pass | RP-022 | ✅ Fully Covered |
| AC4 | predictNextMilestoneYTD added | RP-004, RP-005 | ✅ Fully Covered |
| AC5 | YTD avg = total ÷ non-zero count | RP-004 | ✅ Fully Covered |
| AC6 | count=0 entries excluded | RP-011, RP-012 | ✅ Fully Covered |
| AC7 | Prior year entries excluded | RP-014, RP-034 | ✅ Fully Covered |
| AC8 | YTD shown only when ≥ 30 non-zero YTD entries | RP-006, RP-007, RP-008, RP-011, RP-012, RP-013, RP-014 | ✅ Fully Covered |
| AC9 | 1 January — YTD not shown | RP-010, RP-017 | ✅ Fully Covered |
| AC10 | New user — 30 entry days from first entry | RP-013, RP-018 | ✅ Fully Covered |
| AC11 | Appears on 30th entry, absent on 29th | RP-006, RP-007, RP-009 | ✅ Fully Covered |
| AC12 | YTD line format correct | RP-003, RP-025, RP-027, RP-029, RP-032 | ✅ Fully Covered |
| AC13 | formatIndianNumber used for both averages | RP-002, RP-003, RP-026, RP-027 | ✅ Fully Covered |
| AC14 | No blank space when YTD absent | RP-006, RP-015, RP-021, RP-030 | ✅ Fully Covered |
| AC15 | YTD below primary when both visible | RP-001, RP-016 | ✅ Fully Covered |
| AC16 | Same date — both lines still separate | RP-031 | ✅ Fully Covered |
| AC17 | YTD recalculates on new entry saved | RP-005, RP-009, RP-019, RP-033 | ✅ Fully Covered |
| AC18 | 31 Dec → 1 Jan boundary graceful | RP-017 | ✅ Fully Covered |
| AC19 | New unit tests for YTD function | RP-035 | ✅ Fully Covered |
| AC20 | D MMM YYYY date format on both lines | RP-028, RP-029 | ✅ Fully Covered |

**All 20 ACs: Fully Covered. No ACs at risk.**

---

## 8. Observations

- **RP-009 (5.3s) and RP-019 (5.3s) are the slowest E2E tests** — both involve a Today Card save and waiting for a reactive UI update. They are within acceptable limits but should be baselined for CI monitoring.
- **RP-033 (6.4s) is the slowest individual test** — it saves an entry, waits for Reflection Card to update, and asserts specific calculated values. The extra time is expected given the multi-step interaction.
- **All date-mocked tests (RP-010, RP-017, RP-032) passed cleanly** — `page.clock.setFixedTime()` worked reliably. No interference between mocked-clock tests and real-clock tests despite sharing the same worker.
- **Total E2E suite duration: 1.2 minutes for 34 tests** — average ~2.1s per test. Fast enough for a pre-commit or pre-merge hook.
- **Vitest suite (64 tests across 4 files): 2.20s total** — negligible cost. Safe to run on every file save.
- **The full Vitest suite (64 tests) ran cleanly** — the 6 new `predictNextMilestoneYTD` tests in `milestoneLogic.test.js` did not break any of the 58 pre-existing tests in the other 3 files.

---

## 9. Sign-Off

| Field | Value |
|-------|-------|
| Tester | Arijit Kundu |
| Sign-off Date | 11 Apr 2026 |
| Recommended Next Action | **Ready for commit and merge to main.** All 36 test cases pass (100%), all 20 ACs fully covered, 0 open defects. Commit branch `feature/ytd-milestone-prediction` and merge to `main`. |
