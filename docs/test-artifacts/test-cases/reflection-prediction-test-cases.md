# Test Cases — Reflection Card YTD Milestone Prediction

*Agent: Test Case Agent*
*Date: 11 April 2026*
*Input: docs/test-artifacts/scenarios/reflection-prediction-scenarios.md*
*Batches completed: 7 of 7 — COMPLETE*

> **Test data note:** All test cases require pre-loaded IndexedDB entries. For E2E tests, seed data must be injected via `page.evaluate()` before the test navigates to the app. For manual tests, entries must be added through the Today Card before running.

---

## RP-001 — Both Predictions Visible When ≥ 30 YTD Entries Exist

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-001 |
| **Title** | Both prediction lines appear in Reflection Card when user has 30+ non-zero YTD entries |
| **Module** | Reflection Card → Prediction Block |
| **Type** | Happy Path |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 35 entries dated 2026-01-01 to 2026-04-11, each with `count: 50000`
3. Total lifetime Jaap count = 9,250,000 (next milestone = 1,00,00,000)
4. These 35 entries are also the most recent 35 non-zero entries — satisfying the 30-entry requirement for the primary prediction
5. The new `predictNextMilestoneYTD` function is deployed and wired to the Reflection Card
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Splash screen appears, then Today Card is visible |
| 2 | Scroll down until the Reflection Card is visible | Reflection Card is visible — shows "Lifetime Jaap", milestone progress bar |
| 3 | Locate the prediction block within the Reflection Card | A prediction block is visible below the progress bar |
| 4 | Read the first prediction line | Text begins with "At current pace (30-day avg:" |
| 5 | Read the second prediction line directly below the first | Text begins with "At your 2026 pace (" |
| 6 | Verify the primary line appears above the YTD line | Primary line is first; YTD line is directly below it |
| 7 | Verify no other prediction lines are present | Exactly two prediction lines — no third line |

**Test Data:**
- 35 entries dated 2026-01-01 through 2026-04-11, each `count: 50000`
- Total lifetime count: `9,250,000`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries
2. Reload the app and confirm the Reflection Card shows no prediction lines (or only primary if prior entries remain)

**Automation Feasibility:** Yes — Playwright can seed IndexedDB via `page.evaluate()`, then assert two prediction line elements are visible and in the correct order using `nth(0)` and `nth(1)` locators.

---

## RP-002 — Primary Prediction Shows Correct 30-Day Label Format

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-002 |
| **Title** | Primary prediction line displays correct label, Indian number format, and D MMM YYYY date |
| **Module** | Reflection Card → Primary Prediction Line |
| **Type** | Happy Path |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains exactly 30 entries as the most recent non-zero entries, each with `count: 50000` (total = 15,00,000; 30-day average = 50,000/day)
3. All 30 entries are dated in 2026 (satisfying YTD threshold — both predictions will be visible)
4. Total lifetime count = `9,950,000` (remaining to next 1 Crore milestone = 50,000)
5. Today's date is 2026-04-11 — days remaining = ceil(50,000 ÷ 50,000) = 1 — predicted date = 12 Apr 2026
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll down to the Reflection Card | Reflection Card visible |
| 3 | Locate the first prediction line (primary) | First prediction line is visible |
| 4 | Read the full text of the primary prediction line | Text reads exactly: `At current pace (30-day avg: 50,000/day): 12 Apr 2026` |
| 5 | Verify the average "50,000" uses Indian number format | "50,000" — not "50000" and not "50k" |
| 6 | Verify the date reads "12 Apr 2026" — not "2026-04-12" | Date is in D MMM YYYY format, not ISO format |
| 7 | Verify the label text is verbatim: "At current pace (30-day avg: " | No variation in wording or punctuation |

**Test Data:**
- 30 entries, each `count: 50000`, all dated in 2026
- Total lifetime count: `9,950,000`
- Expected primary line: `At current pace (30-day avg: 50,000/day): 12 Apr 2026`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright can seed IndexedDB, navigate to the app, and assert the primary prediction element contains the exact string `At current pace (30-day avg: 50,000/day): 12 Apr 2026` using `toHaveText()` or `toContainText()`.

---

## RP-003 — YTD Prediction Shows Correct Label Format

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-003 |
| **Title** | YTD prediction line displays correct label, Indian number format, and D MMM YYYY date |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Happy Path |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated 2026-01-01 to 2026-03-31, each with `count: 51200` (total YTD = 15,36,000; YTD average = 51,200/day)
3. Total lifetime count = `9,974,800` (remaining to next 1 Crore milestone = 25,200)
4. Today's date is 2026-04-11 — days remaining = ceil(25,200 ÷ 51,200) = 1 — YTD predicted date = 12 Apr 2026
5. These 30 entries are also the last 30 non-zero entries (primary average = 51,200/day; primary predicted date = 12 Apr 2026)
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll down to the Reflection Card | Reflection Card visible |
| 3 | Locate the second prediction line (YTD) | Second prediction line is visible below the primary |
| 4 | Read the full text of the YTD prediction line | Text reads exactly: `At your 2026 pace (51,200/day YTD): 12 Apr 2026` |
| 5 | Verify the average "51,200" uses Indian number format | "51,200" — not "51200" and not "51.2k" |
| 6 | Verify the date reads "12 Apr 2026" — not "2026-04-12" | Date is in D MMM YYYY format, not ISO format |
| 7 | Verify the year in the label reads "2026" | Label says "At your 2026 pace" — year matches current calendar year |
| 8 | Verify the label text is verbatim: "At your 2026 pace (" | No variation in wording or punctuation |

**Test Data:**
- 30 entries dated 2026-01-01 to 2026-03-31, each `count: 51200`
- Total lifetime count: `9,974,800`
- Expected YTD line: `At your 2026 pace (51,200/day YTD): 12 Apr 2026`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright can seed IndexedDB and assert the YTD prediction element contains the exact string `At your 2026 pace (51,200/day YTD): 12 Apr 2026` using `toHaveText()`.

---

## RP-004 — YTD Average Calculation Is Mathematically Correct

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-004 |
| **Title** | YTD daily average = total YTD count ÷ number of non-zero YTD entries (Method B) |
| **Module** | `predictNextMilestoneYTD` in `src/logic/milestoneLogic.js` |
| **Type** | Happy Path |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated 2026-01-01 to 2026-03-31, each with `count: 51200` (total = 15,36,000; expected average = 15,36,000 ÷ 30 = 51,200/day)
3. Total lifetime count = `9,000,000`
4. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll down to the Reflection Card | Reflection Card visible |
| 3 | Locate the YTD prediction line | YTD line is visible (30 entries = threshold met) |
| 4 | Read the average value shown in the YTD line | Average displayed is `51,200/day` |
| 5 | Verify the displayed average matches 15,36,000 ÷ 30 = 51,200 | Displayed value confirms Method B: total ÷ non-zero entry count |
| 6 | Open browser DevTools → Application → IndexedDB | Confirm 30 entries with count = 51,200 exist for 2026 |
| 7 | Manually calculate: 30 × 51,200 = 15,36,000 ÷ 30 = 51,200 | Calculation confirms displayed average is correct |

**Test Data:**
- 30 entries dated 2026-01-01 to 2026-03-31, each `count: 51200`
- Total YTD sum: `1,536,000`
- Expected YTD average: `51,200` (= 1,536,000 ÷ 30)
- Total lifetime count: `9,000,000`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright can seed entries, navigate to the app, and assert the YTD line contains `51,200/day`. Additionally, a unit test for `predictNextMilestoneYTD` with this exact data set should assert `averagePerDay === 51200`.

---

## RP-005 — YTD Predicted Date Is Calculated Correctly

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-005 |
| **Title** | YTD predicted date = today + ceil(remaining ÷ YTD average) |
| **Module** | `predictNextMilestoneYTD` in `src/logic/milestoneLogic.js` |
| **Type** | Happy Path |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated 2026-01-01 to 2026-03-31, each with `count: 51200`
3. Total lifetime count = `9,488,000` (remaining to next 1 Crore milestone = 512,000)
4. YTD average = 51,200/day — days remaining = ceil(512,000 ÷ 51,200) = ceil(10.0) = 10
5. Today's date is 2026-04-11 — predicted date = 2026-04-11 + 10 days = **21 Apr 2026**
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll down to the Reflection Card | Reflection Card visible |
| 3 | Locate the YTD prediction line | YTD line is visible |
| 4 | Read the predicted date shown in the YTD line | Date reads `21 Apr 2026` |
| 5 | Manually verify: remaining = 1,00,00,000 − 94,88,000 = 5,12,000 | Remaining confirmed as 5,12,000 |
| 6 | Manually verify: ceil(5,12,000 ÷ 51,200) = ceil(10.0) = 10 days | Days remaining confirmed as 10 |
| 7 | Manually verify: 11 Apr 2026 + 10 days = 21 Apr 2026 | Predicted date confirmed as 21 Apr 2026 |
| 8 | Confirm the displayed date "21 Apr 2026" matches the manual calculation | Date is arithmetically correct |

**Test Data:**
- 30 entries dated 2026-01-01 to 2026-03-31, each `count: 51200`
- Total lifetime count: `9,488,000`
- Next milestone: `10,000,000` (1 Crore)
- Remaining: `512,000`
- YTD average: `51,200/day`
- Days remaining: `10`
- Expected predicted date: `21 Apr 2026`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds the exact data, navigates to the app, and asserts the YTD line contains `21 Apr 2026`. A unit test for `predictNextMilestoneYTD` with `totalCount: 9488000` and these 30 entries should assert `predictedDate === '2026-04-21'`.

---

---

## RP-006 — Exactly 29 Non-Zero YTD Entries — YTD Prediction Absent

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-006 |
| **Title** | YTD prediction does not appear when user has exactly 29 non-zero current-year entries |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Boundary Value Analysis |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 1 entry dated `2025-12-31` with `count: 50000` (this is the 30th entry for the primary prediction)
3. IndexedDB contains exactly 29 entries dated `2026-01-01` to `2026-03-29`, each with `count: 50000`
4. Total non-zero YTD entries (2026 only) = **29** — one below the threshold
5. Total last 30 non-zero entries across all years = 30 (29 from 2026 + 1 from 2025) — primary prediction will show
6. Total lifetime count = `9,000,000`
7. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll down to the Reflection Card | Reflection Card visible — shows Lifetime Jaap and milestone progress bar |
| 3 | Locate the prediction area (below the progress bar) | Primary prediction line is visible: "At current pace (30-day avg: 50,000/day): [date]" |
| 4 | Look for a second prediction line below the primary | **No second line is present** — YTD line is absent |
| 5 | Verify no blank space or empty container exists below the primary line | The area below the primary line is clean — the milestone history section or card border follows immediately |
| 6 | Scroll through the full Reflection Card | No YTD text of any kind appears anywhere on the card |

**Test Data:**
- 1 entry: `date: 2025-12-31`, `count: 50000`
- 29 entries: `date: 2026-01-01` through `2026-03-29`, each `count: 50000`
- Total lifetime count: `9,000,000`
- YTD non-zero entry count: **29** (threshold not met)

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds 30 entries (1 from 2025, 29 from 2026), navigates to app, asserts primary prediction line is visible and asserts YTD line element does not exist using `not.toBeVisible()` or `not.toBeAttached()`.

---

## RP-007 — Exactly 30 Non-Zero YTD Entries — YTD Prediction Appears

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-007 |
| **Title** | YTD prediction appears for the first time when user crosses the 30 non-zero YTD entry threshold |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Boundary Value Analysis |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains exactly 30 entries dated `2026-01-01` to `2026-03-30`, each with `count: 50000`
3. Total non-zero YTD entries (2026 only) = **30** — exactly at the threshold
4. These 30 entries are also the last 30 non-zero entries — primary prediction will also show
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll down to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area (below the progress bar) | Primary prediction line is visible |
| 4 | Look for a second prediction line directly below the primary | **YTD line is present**: "At your 2026 pace (50,000/day YTD): [date]" |
| 5 | Verify the primary line appears above the YTD line | Primary is first, YTD is directly below |
| 6 | Verify the YTD line contains "2026" as the year | Year in label reads "2026" |

**Test Data:**
- 30 entries: `date: 2026-01-01` through `2026-03-30`, each `count: 50000`
- Total lifetime count: `9,000,000`
- YTD non-zero entry count: **30** (threshold exactly met)

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds 30 entries from 2026, navigates to app, and asserts the YTD line element is visible and contains `At your 2026 pace`. Run immediately after RP-006 to confirm the single-entry difference is the only variable.

---

## RP-008 — Exactly 31 Non-Zero YTD Entries — YTD Prediction Remains

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-008 |
| **Title** | YTD prediction continues to show when user has 31 non-zero YTD entries — threshold is a floor, not exact |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Boundary Value Analysis |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains exactly 31 entries dated `2026-01-01` to `2026-03-31`, each with `count: 50000`
3. Total non-zero YTD entries (2026 only) = **31** — one above the threshold
4. Last 30 non-zero entries for primary = the 30 most recent of the 31 (2026-01-02 to 2026-03-31)
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll down to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Both prediction lines are visible |
| 4 | Verify the YTD prediction line is present | YTD line reads: "At your 2026 pace (50,000/day YTD): [date]" |
| 5 | Verify the YTD average is calculated across all 31 entries | YTD average = 31 × 50,000 ÷ 31 = 50,000/day (same as RP-007 — correct for uniform data) |
| 6 | Verify both lines remain visible | Neither line has disappeared |

**Test Data:**
- 31 entries: `date: 2026-01-01` through `2026-03-31`, each `count: 50000`
- Total lifetime count: `9,000,000`
- YTD non-zero entry count: **31** (above threshold — must still show)
- YTD average: `50,000/day` (31 × 50,000 ÷ 31 = 50,000)

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds 31 entries and asserts YTD line visible. This case is most valuable when run as part of a sequence with RP-006 and RP-007 to confirm the threshold is ≥ 30 not = 30.

---

## RP-009 — Transition from 29th to 30th Entry — YTD Appears After Save

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-009 |
| **Title** | YTD prediction appears live — without page reload — when 30th non-zero entry is saved |
| **Module** | Today Card → Reflection Card (reactive update) |
| **Type** | Boundary Value Analysis |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 28 entries dated `2026-01-01` to `2026-01-28`, each with `count: 50000` (these are pre-existing entries)
3. Today's entry (`2026-04-11`) has NOT been saved yet — Today Card count field is empty
4. Total non-zero YTD entries at start = **28** (two below threshold — so the 29th entry can also be tested first)
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll down to the Reflection Card | Prediction area shows primary line only — YTD line is absent (28 entries < 30 threshold) |
| 3 | Note the layout: no blank space below the primary line | Confirmed — layout is compact, only primary prediction visible |
| 4 | Scroll back up to the Today Card | Today Card visible — count field is empty |
| 5 | Click the Jaap count field | Field is focused |
| 6 | Type: `50000` | Field displays "50000" |
| 7 | Click Save | Save button shows "✓ Saved!" briefly, then reverts to "Save" |
| 8 | Scroll down to the Reflection Card — **do NOT reload the page** | Reflection Card has updated |
| 9 | Locate the prediction area | Primary line is still visible — unchanged |
| 10 | Look for the YTD prediction line | **YTD line is still absent** — now 29 entries, still below threshold |
| 11 | Scroll back to Today Card — note that today's entry is now saved (count = 50000) | Today Card shows the saved count |
| 12 | Open the Ledger and manually add one more entry for a different 2026 date (e.g. tap a past date with `count: 50000`) | Entry saved — total non-zero YTD entries = 30 |
| 13 | Scroll to the Reflection Card — **do NOT reload** | Reflection Card has updated again |
| 14 | Look for the YTD prediction line | **YTD line is now visible**: "At your 2026 pace (50,000/day YTD): [date]" |
| 15 | Verify this appeared without a page reload | Page URL is unchanged; no reload occurred between steps 12 and 14 |

**Test Data:**
- Pre-seeded: 28 entries `2026-01-01` to `2026-01-28`, each `count: 50000`
- Save via Today Card: `count: 50000` (29th entry)
- Save via Ledger edit: any 2026 date not already used, `count: 50000` (30th entry)
- Total lifetime count at start: `9,000,000`

**Post-Conditions:**
1. Clear today's saved entry (enter `0` and save, or delete via Ledger)
2. Clear the manually added past entry via Ledger
3. Clear all seeded IndexedDB entries

**Automation Feasibility:** Partial — Playwright can seed 28 entries, save via Today Card, assert YTD absent (29 entries), then save a 30th entry and assert YTD appears — all without reload. The multi-step reactive assertion makes this moderately complex but achievable with `page.waitForSelector()`.

---

---

## RP-010 — 1 January — YTD Prediction Not Shown

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-010 |
| **Title** | YTD prediction is absent on 1 January when no current-year entries exist |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Negative |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. System date is set to `2027-01-01` (or Playwright clock mocked to `2027-01-01`)
3. IndexedDB contains 30 entries dated `2026-11-01` to `2026-11-30`, each `count: 50000` (prior year — for primary prediction)
4. IndexedDB contains **zero** entries dated `2027-01-01` or later
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible — date shown is 1 Jan 2027 |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Primary prediction line is visible: "At current pace (30-day avg: 50,000/day): [date]" |
| 4 | Look for a YTD prediction line | **No YTD line present** — zero 2027 entries exist |
| 5 | Verify no blank space or empty container below the primary line | Layout is compact — no gap where YTD would appear |
| 6 | Verify the primary prediction continues to show unaffected | Primary line shows normally based on November 2026 entries |

**Test Data:**
- 30 entries dated `2026-11-01` to `2026-11-30`, each `count: 50000`
- Zero entries in 2027
- Total lifetime count: `9,000,000`
- Mocked/system date: `2027-01-01`

**Post-Conditions:**
1. Restore system clock to actual date
2. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright can mock the clock using `page.clock.setFixedTime('2027-01-01')`, seed prior year entries, and assert YTD element `not.toBeAttached()` while asserting primary line is visible.

---

## RP-011 — All YTD Entries Have Count = 0 — YTD Prediction Not Shown

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-011 |
| **Title** | YTD prediction absent when all current-year entries have count = 0 |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Negative |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2025-11-01` to `2025-11-30`, each `count: 50000` (non-zero, prior year — for primary prediction)
3. IndexedDB contains 35 entries dated `2026-01-01` to `2026-02-04`, each with `count: 0`
4. YTD non-zero entry count = **0** — all 2026 entries are count = 0
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Primary prediction line is visible (based on 30 non-zero entries from 2025) |
| 4 | Look for a YTD prediction line | **No YTD line present** — zero non-zero entries in 2026 |
| 5 | Verify no blank space below the primary line | Layout is compact |
| 6 | Open DevTools → Application → IndexedDB | Confirm 35 entries exist for 2026, all with `count: 0` |
| 7 | Verify primary line still shows correctly | "At current pace (30-day avg: 50,000/day): [date]" — unaffected by zero-count 2026 entries |

**Test Data:**
- 30 entries `2025-11-01` to `2025-11-30`, each `count: 50000`
- 35 entries `2026-01-01` to `2026-02-04`, each `count: 0`
- Total lifetime count: `9,000,000`
- YTD non-zero count: **0**

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds both entry sets, asserts primary visible, asserts YTD `not.toBeAttached()`. Also verify zero-count 2026 entries do not corrupt the primary average.

---

## RP-012 — Mix of Zero and Non-Zero YTD Entries — Only Non-Zero Counted

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-012 |
| **Title** | YTD prediction absent when only 20 of 50 current-year entries are non-zero (below threshold) |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Negative |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 10 entries dated `2025-12-01` to `2025-12-10`, each `count: 50000` (prior year, for primary)
3. IndexedDB contains 20 entries dated `2026-01-01` to `2026-01-20`, each `count: 50000` (non-zero, current year)
4. IndexedDB contains 30 entries dated `2026-02-01` to `2026-03-02`, each `count: 0` (zero-count, current year)
5. Total YTD entries = 50; non-zero YTD entries = **20** — below threshold of 30
6. Total lifetime count = `9,000,000`
7. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Primary prediction line visible (based on 30 most recent non-zero entries: 20 from 2026 + 10 from 2025) |
| 4 | Look for a YTD prediction line | **No YTD line present** — only 20 non-zero 2026 entries, threshold is 30 |
| 5 | Verify no blank space below primary | Layout is compact |
| 6 | Open DevTools → IndexedDB | Confirm 20 entries with `count > 0` and 30 entries with `count = 0` exist for 2026 |
| 7 | Verify zero-count entries did not count toward the threshold | YTD threshold count = 20, not 50 |

**Test Data:**
- 10 entries `2025-12-01` to `2025-12-10`, each `count: 50000`
- 20 entries `2026-01-01` to `2026-01-20`, each `count: 50000`
- 30 entries `2026-02-01` to `2026-03-02`, each `count: 0`
- Total lifetime count: `9,000,000`
- Total YTD entries: 50 | Non-zero YTD: **20** | Zero YTD: 30

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds all three entry batches, asserts primary visible, asserts YTD `not.toBeAttached()`.

---

## RP-013 — New User With 29 Non-Zero Entry Days — YTD Absent

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-013 |
| **Title** | YTD prediction absent for a new user who has 29 non-zero entry days since their first entry |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Negative |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains **no prior year entries** — this is a new user
3. IndexedDB contains exactly 29 entries dated `2026-03-13` to `2026-04-10`, each `count: 50000`
4. Today's entry (`2026-04-11`) has NOT been saved yet
5. Total non-zero YTD entries = **29** — one below the threshold
6. Total lifetime count = `1,450,000` (= 29 × 50,000)
7. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Primary prediction line is visible — based on all 29 available non-zero entries (`.slice(-30)` returns all 29) |
| 4 | Look for a YTD prediction line | **No YTD line present** — 29 non-zero entries < threshold of 30 |
| 5 | Verify no blank space below the primary line | Layout is compact |
| 6 | Verify the primary line shows the average based on all 29 entries | "At current pace (30-day avg: 50,000/day): [date]" — 29 entries used |

**Test Data:**
- No prior year entries
- 29 entries dated `2026-03-13` to `2026-04-10`, each `count: 50000`
- Total lifetime count: `1,450,000`
- YTD non-zero count: **29**

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds 29 entries from a mid-year start date, asserts primary visible, asserts YTD `not.toBeAttached()`.

---

## RP-014 — Prior Year Entries Alone Do Not Trigger YTD Prediction

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-014 |
| **Title** | YTD prediction absent when user has 200 prior year entries but only 5 current year entries |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | Negative |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 200 entries dated `2024-01-01` to `2025-09-18`, each `count: 50000` (prior years)
3. IndexedDB contains exactly 5 entries dated `2026-01-01` to `2026-01-05`, each `count: 50000`
4. Total non-zero YTD entries (2026 only) = **5** — far below threshold
5. Total lifetime count = `10,250,000` (205 × 50,000)
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible — Lifetime Jaap shows `1,02,50,000` |
| 3 | Locate the prediction area | Primary prediction line is visible (based on last 30 non-zero entries — all from prior years) |
| 4 | Look for a YTD prediction line | **No YTD line present** — only 5 non-zero 2026 entries |
| 5 | Verify prior year entries did not count toward the YTD threshold | YTD threshold count = 5 (2026 entries only), not 205 |
| 6 | Verify no blank space below the primary line | Layout is compact |
| 7 | Verify the primary line shows correctly | Primary uses last 30 non-zero entries from prior years — unaffected |

**Test Data:**
- 200 entries dated `2024-01-01` to `2025-09-18`, each `count: 50000`
- 5 entries dated `2026-01-01` to `2026-01-05`, each `count: 50000`
- Total lifetime count: `10,250,000`
- YTD non-zero count: **5** (2026 only)

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds 205 entries across two years, asserts primary visible, asserts YTD `not.toBeAttached()`. Most important negative test for year isolation.

---

---

## RP-015 — Primary Prediction Only — YTD Below Threshold

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-015 |
| **Title** | Reflection Card shows only the primary prediction line when YTD entries are below threshold |
| **Module** | Reflection Card → Prediction Block |
| **Type** | State |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 5 entries dated `2025-12-15` to `2025-12-19`, each `count: 50000` (prior year, for primary)
3. IndexedDB contains 15 entries dated `2026-01-01` to `2026-01-15`, each `count: 50000` (current year, non-zero)
4. Total non-zero YTD entries = **15** — well below threshold of 30
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area below the progress bar | Prediction block is visible |
| 4 | Verify exactly one prediction line is present | One line only: "At current pace (30-day avg: 50,000/day): [date]" |
| 5 | Verify no YTD line is present below the primary line | No second line |
| 6 | Verify no blank space or empty padding below the primary line | Prediction block ends cleanly — milestone history or card border follows immediately |
| 7 | Verify the Reflection Card layout looks identical to the pre-feature layout | No extra whitespace, no placeholder text, no empty divs |

**Test Data:**
- 5 entries `2025-12-15` to `2025-12-19`, each `count: 50000`
- 15 entries `2026-01-01` to `2026-01-15`, each `count: 50000`
- Total lifetime count: `9,000,000`
- YTD non-zero count: **15**

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright asserts exactly one prediction element is visible, YTD element `not.toBeAttached()`, and checks for absence of unexpected blank space using bounding box height comparison.

---

## RP-016 — Both Predictions Visible — Mid-Year Experienced User

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-016 |
| **Title** | Both prediction lines show different dates for a mid-year user with varied daily counts |
| **Module** | Reflection Card → Prediction Block |
| **Type** | State |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 40000` (early year — lower pace)
3. IndexedDB contains 30 entries dated `2026-02-01` to `2026-03-02`, each `count: 60000` (recent — higher pace)
4. Total YTD entries = 60 (all non-zero) — threshold met
5. Last 30 non-zero entries (for primary) = the 30 entries from `2026-02-01` to `2026-03-02` at 60,000/day
6. YTD avg = (30×40,000 + 30×60,000) ÷ 60 = **50,000/day**
7. Total lifetime count = `9,000,000` — remaining to 1 Crore = 1,000,000
8. Browser: Chrome, latest version

**Expected calculations:**
- Primary avg = 60,000/day — days remaining = ceil(1,000,000 ÷ 60,000) = 17 — predicted = **28 Apr 2026**
- YTD avg = 50,000/day — days remaining = ceil(1,000,000 ÷ 50,000) = 20 — predicted = **1 May 2026**

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Both prediction lines are visible |
| 4 | Read the primary prediction line | `At current pace (30-day avg: 60,000/day): 28 Apr 2026` |
| 5 | Read the YTD prediction line | `At your 2026 pace (50,000/day YTD): 1 May 2026` |
| 6 | Verify the two predicted dates are different | Primary: 28 Apr 2026 | YTD: 1 May 2026 — each uses its own calculation |
| 7 | Verify primary average (60,000) is higher than YTD average (50,000) | Primary reflects the faster recent pace; YTD reflects the full year including the slower January pace |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 40000`
- 30 entries `2026-02-01` to `2026-03-02`, each `count: 60000`
- Total lifetime count: `9,000,000`
- Expected primary: `At current pace (30-day avg: 60,000/day): 28 Apr 2026`
- Expected YTD: `At your 2026 pace (50,000/day YTD): 1 May 2026`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds two batches with different counts, asserts both lines contain their exact expected strings, and asserts the dates differ.

---

## RP-017 — New Year State — YTD Resets, Primary Continues

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-017 |
| **Title** | On 1 February of a new year with no current-year entries, YTD is absent and primary continues |
| **Module** | Reflection Card → Prediction Block |
| **Type** | State |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. System date is set to `2027-02-01` (or Playwright clock mocked to `2027-02-01`)
3. IndexedDB contains 30 entries dated `2026-12-01` to `2026-12-30`, each `count: 50000` (prior year — for primary)
4. IndexedDB contains **zero** entries dated `2027-01-01` or later
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible — date shown is 1 Feb 2027 |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Primary prediction line is visible: "At current pace (30-day avg: 50,000/day): [date]" |
| 4 | Verify the primary prediction is based on December 2026 entries | Primary shows — these are the last 30 non-zero entries regardless of year |
| 5 | Look for a YTD prediction line | **No YTD line present** — zero 2027 entries |
| 6 | Verify no blank space below the primary line | Layout is compact |
| 7 | Note the YTD label would say "At your **2027** pace" if it appeared | Year has rolled over — app correctly identifies current year as 2027 |

**Test Data:**
- 30 entries dated `2026-12-01` to `2026-12-30`, each `count: 50000`
- Zero entries in 2027
- Total lifetime count: `9,000,000`
- Mocked/system date: `2027-02-01`

**Post-Conditions:**
1. Restore system clock to actual date
2. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright mocks clock to `2027-02-01` with `page.clock.setFixedTime()`, seeds December 2026 entries, asserts primary visible, asserts YTD `not.toBeAttached()`.

---

## RP-018 — New User — YTD Appears 30 Entry Days After First Entry

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-018 |
| **Title** | New user's YTD prediction appears on their 30th non-zero entry day — not from 1 Jan |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | State |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains **no prior year entries** — this is a new user who joined mid-year
3. IndexedDB contains exactly 30 entries dated `2026-03-01` to `2026-03-30`, each `count: 50000`
4. Total non-zero YTD entries = **30** — threshold exactly met
5. Total lifetime count = `1,500,000` (= 30 × 50,000)
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Both prediction lines are visible |
| 4 | Verify the primary prediction line is present | "At current pace (30-day avg: 50,000/day): [date]" |
| 5 | Verify the YTD prediction line is present | "At your 2026 pace (50,000/day YTD): [date]" — appears on the 30th entry day |
| 6 | Verify YTD avg = total ÷ 30 non-zero entries = 50,000/day | Denominator is 30 entries from 1 Mar — not 101 calendar days since 1 Jan |
| 7 | Verify both averages are equal (50,000/day) | Correct — same data set used for both in this uniform scenario |

**Test Data:**
- No prior year entries
- 30 entries dated `2026-03-01` to `2026-03-30`, each `count: 50000`
- Total lifetime count: `1,500,000`
- YTD non-zero count: **30** — first day the YTD line appears

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds 30 mid-year entries with no prior year data, asserts both lines visible, and asserts YTD average is `50,000/day` (not a lower value from dividing by 101 calendar days).

---

## RP-019 — YTD Average Changes as Year Progresses

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-019 |
| **Title** | YTD predicted date recalculates correctly after a new entry is saved |
| **Module** | Today Card → Reflection Card (reactive update) |
| **Type** | State |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 50000`
3. Today's entry (`2026-04-11`) has NOT been saved yet
4. Total lifetime count = `9,000,000` (remaining to 1 Crore = 1,000,000)
5. Current YTD avg = 50,000/day — days remaining = ceil(1,000,000 ÷ 50,000) = 20 — YTD predicted = **1 May 2026**
6. Browser: Chrome, latest version

**Expected state after saving `count: 80000` today:**
- New YTD total = 30 × 50,000 + 80,000 = 1,580,000
- New YTD non-zero entry count = 31
- New YTD avg = 1,580,000 ÷ 31 = **50,968/day** (rounded)
- New total lifetime = 9,080,000 — remaining = 920,000
- New days remaining = ceil(920,000 ÷ 50,968) = 19 — new predicted = **30 Apr 2026**

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | YTD line shows: "At your 2026 pace (50,000/day YTD): 1 May 2026" |
| 3 | Note the starting YTD predicted date: `1 May 2026` | Confirmed as starting state |
| 4 | Scroll back to the Today Card | Count field is empty |
| 5 | Click the Jaap count field | Field focused |
| 6 | Type: `80000` | Field displays "80000" |
| 7 | Click Save | "✓ Saved!" shown briefly, reverts to "Save" |
| 8 | Scroll to the Reflection Card — **do NOT reload** | Reflection Card has updated |
| 9 | Read the YTD prediction line | "At your 2026 pace (50,968/day YTD): 30 Apr 2026" |
| 10 | Verify the YTD average changed from 50,000 to 50,968 | Average increased — new high-count entry raised the annual average |
| 11 | Verify the predicted date moved earlier from 1 May to 30 Apr | Predicted date moved closer — faster pace |
| 12 | Verify the change happened without a page reload | Page URL unchanged; no reload between steps 7 and 9 |

**Test Data:**
- 30 seeded entries `2026-01-01` to `2026-01-30`, each `count: 50000`
- Today Card save: `count: 80000`
- Total lifetime count at start: `9,000,000`
- YTD predicted date before save: `1 May 2026`
- YTD predicted date after save: `30 Apr 2026`

**Post-Conditions:**
1. Clear today's saved entry (enter `0` and save, or delete via Ledger)
2. Clear all seeded IndexedDB entries

**Automation Feasibility:** Partial — Playwright seeds entries, captures initial YTD text, saves a new entry, and asserts YTD text has changed to the new values. Requires `waitForFunction` or a text-change assertion pattern.

---

---

## RP-020 — Existing 30-Day Prediction Value Unchanged After Feature Addition

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-020 |
| **Title** | Primary prediction average and date are identical before and after YTD feature is added |
| **Module** | `predictNextMilestone` in `src/logic/milestoneLogic.js` |
| **Type** | Regression |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173` on the feature branch (YTD feature implemented)
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 10000`
3. Total lifetime count = `300,000`
4. These are identical inputs to the existing unit test at `milestoneLogic.test.js` line 117
5. Browser: Chrome, latest version

**Baseline (pre-feature, from existing unit test):**
- `averagePerDay` = 10,000
- `daysRemaining` = 970 (= ceil(9,700,000 ÷ 10,000))
- `basedOnDays` = 30

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the primary prediction line | Primary line visible |
| 4 | Read the average shown in the primary line | `10,000/day` — unchanged from pre-feature baseline |
| 5 | Open browser DevTools → Console | No errors related to `predictNextMilestone` or `predictNextMilestoneYTD` |
| 6 | Run the unit test: `npm test -- milestoneLogic` in terminal | All `predictNextMilestone` tests pass — output shows green ticks |
| 7 | Verify test at line 117 (`predict correctly based on 30-day average`) passes | `averagePerDay: 10000`, `daysRemaining: 970` — both assertions green |
| 8 | Verify test at line 112 (`return null when no entries`) passes | Passes — null returned for empty array |
| 9 | Verify test at line 131 (`return null when average is zero`) passes | Passes — null returned for all-zero counts |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 10000`
- Total lifetime count: `300,000`
- Expected primary avg: `10,000/day`
- Expected `daysRemaining`: `970`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — unit tests cover this completely. E2E portion can be automated with Playwright seeding the same 30-entry dataset and asserting `10,000/day` in the primary line.

---

## RP-021 — Primary Prediction Still Appears When YTD Is Absent

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-021 |
| **Title** | Primary prediction renders normally when YTD threshold is not met — YTD logic does not suppress primary |
| **Module** | Reflection Card → Primary Prediction Line |
| **Type** | Regression |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2025-12-01` to `2025-12-30`, each `count: 50000` (prior year — primary uses these)
3. IndexedDB contains 10 entries dated `2026-01-01` to `2026-01-10`, each `count: 50000` (current year — YTD count = 10)
4. Total non-zero YTD entries = **10** — threshold not met
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Primary prediction line is visible |
| 4 | Read the primary prediction line | "At current pace (30-day avg: 50,000/day): [date]" — shows normally |
| 5 | Verify the primary uses the 30 December 2025 entries | Average = 50,000/day — based on the 30 most recent non-zero entries (Dec 2025) |
| 6 | Verify the primary line is NOT blank, empty, or missing | Full text present — not suppressed by YTD absence |
| 7 | Verify the YTD line is absent | No second prediction line |

**Test Data:**
- 30 entries `2025-12-01` to `2025-12-30`, each `count: 50000`
- 10 entries `2026-01-01` to `2026-01-10`, each `count: 50000`
- Total lifetime count: `9,000,000`
- YTD non-zero count: **10**

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds both entry batches, asserts primary visible with `50,000/day`, asserts YTD `not.toBeAttached()`.

---

## RP-022 — All Existing `predictNextMilestone` Unit Tests Pass

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-022 |
| **Title** | Full unit test suite passes without modification after new `predictNextMilestoneYTD` function is added |
| **Module** | `src/tests/unit/milestoneLogic.test.js` |
| **Type** | Regression |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. Feature branch has `predictNextMilestoneYTD` added to `src/logic/milestoneLogic.js`
2. The existing `predictNextMilestone` function has **not been modified**
3. `milestoneLogic.test.js` has **not been modified** — all 11 original tests intact
4. Terminal is open at project root `c:\Users\ariji\jaap-ledger`
5. `npm install` has been run — all dependencies present

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | In terminal, run: `npm test` | Vitest starts and runs the full unit test suite |
| 2 | Observe the `milestoneLogic.test.js` results | All 11 tests shown — `getCurrentMilestone` (4), `getMilestoneProgress` (4), `getMilestoneHistory` (3) |
| 3 | Verify all 3 `predictNextMilestone` tests show a green tick | Lines 112, 117, 131 — all pass |
| 4 | Verify total count in summary: `11 passed` | No tests removed, no failures, no skips |
| 5 | Verify no test shows `FAIL` or `ERROR` | Clean run — no stack traces |
| 6 | Verify new `predictNextMilestoneYTD` tests also appear and pass | New tests are green — existing tests unaffected |

**Test Data:**
- No IndexedDB entries required — unit test run only
- Input data is embedded in `milestoneLogic.test.js`

**Post-Conditions:**
- None — unit test run leaves no state

**Automation Feasibility:** Yes — this test case IS the automation. Executed by `npm test` in CI. Pass/fail determined by Vitest exit code.

---

## RP-023 — Primary Prediction Not Affected by Prior Year Entries

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-023 |
| **Title** | Primary prediction average reflects only the 30 most recent non-zero entries, unaffected by prior year data |
| **Module** | `predictNextMilestone` in `src/logic/milestoneLogic.js` |
| **Type** | Regression |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 100 entries dated `2024-01-01` to `2024-04-10`, each `count: 1000` (prior year — low count)
3. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 50000` (recent — high count)
4. Total lifetime count = `1,600,000` (= 100 × 1,000 + 30 × 50,000)
5. The 30 most recent non-zero entries = the 30 entries from 2026 at 50,000/day
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the primary prediction line | Primary prediction line is visible |
| 4 | Read the average shown in the primary line | `50,000/day` — based on the 30 recent 2026 entries only |
| 5 | Verify the average is NOT influenced by the 2024 entries | Not `1,000/day` (2024 pace) and not ~`11,538/day` (blended average of all 130 entries) |
| 6 | Manually verify: last 30 non-zero entries = 30 × 50,000 = 15,00,000 ÷ 30 = 50,000/day | Confirms `.slice(-30)` correctly limits to recent entries only |

**Test Data:**
- 100 entries `2024-01-01` to `2024-04-10`, each `count: 1000`
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 50000`
- Total lifetime count: `1,600,000`
- Expected primary avg: `50,000/day` (2026 entries only)
- Wrong if prior year bleeds in: blended avg = 1,600,000 ÷ 130 ≈ 12,308/day

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds both batches, asserts primary contains `50,000/day`, and asserts it does not contain `1,000/day` or any blended value.

---

---

## RP-024 — Primary Label Text Is Verbatim Correct

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-024 |
| **Title** | Primary prediction line text matches the exact required wording and punctuation |
| **Module** | Reflection Card → Primary Prediction Line |
| **Type** | UI |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 60000`
3. All 30 entries are dated in 2026 — YTD threshold met, both lines visible
4. Total lifetime count = `9,000,000`
5. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the primary prediction line | First prediction line visible |
| 4 | Read the full text character by character | Text reads: `At current pace (30-day avg: 60,000/day): [D MMM YYYY]` |
| 5 | Verify opening words are exactly "At current pace" | Not "At your current pace", not "At this pace", not "Based on current pace" |
| 6 | Verify bracket format is `(30-day avg:` — with colon inside brackets | Not `(30-day average:`, not `(30 day avg:`, not `(30-day avg -` |
| 7 | Verify `/day)` closes the bracket section | Not `/day )` (no space before bracket), not `/day],` |
| 8 | Verify a colon and space separate the bracket section from the date | Format is `): [date]` — colon immediately after bracket, single space before date |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 60000`
- Total lifetime count: `9,000,000`
- Expected label template: `At current pace (30-day avg: 60,000/day): [D MMM YYYY]`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright uses `toContainText('At current pace (30-day avg: 60,000/day):')` to assert exact wording and punctuation in a single assertion.

---

## RP-025 — YTD Label Text Is Verbatim Correct

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-025 |
| **Title** | YTD prediction line text matches the exact required wording, year, and punctuation |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | UI |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 60000`
3. Total lifetime count = `9,000,000`
4. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the YTD prediction line (second line) | Second prediction line visible |
| 4 | Read the full text character by character | Text reads: `At your 2026 pace (60,000/day YTD): [D MMM YYYY]` |
| 5 | Verify opening words are exactly "At your 2026 pace" | Not "At current 2026 pace", not "At your pace (2026)", not "2026 YTD pace" |
| 6 | Verify the year "2026" is present and matches current calendar year | Year is dynamic — derived from the current date, not hardcoded |
| 7 | Verify bracket format is `(60,000/day YTD)` — "YTD" appears after `/day` | Not `(YTD: 60,000/day)`, not `(60,000/day — YTD)`, not `(60,000 YTD/day)` |
| 8 | Verify a colon and space separate the bracket section from the date | Format is `): [date]` — same punctuation pattern as primary line |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 60000`
- Total lifetime count: `9,000,000`
- Expected label template: `At your 2026 pace (60,000/day YTD): [D MMM YYYY]`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright uses `toContainText('At your 2026 pace (60,000/day YTD):')` to assert exact wording, year, and punctuation.

---

## RP-026 — Daily Average Uses Indian Number Format in Primary Line

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-026 |
| **Title** | Primary prediction average of 1,00,000/day displays in Indian format — not international format |
| **Module** | Reflection Card → Primary Prediction Line |
| **Type** | UI |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 100000`
3. All 30 entries are dated in 2026 — YTD threshold met
4. Total lifetime count = `9,000,000`
5. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the primary prediction line | Primary line visible |
| 4 | Read the average value in the primary line | Average displays as `1,00,000/day` |
| 5 | Verify it is NOT displayed as `100,000/day` | International format (comma after 3 digits) is NOT used |
| 6 | Verify it is NOT displayed as `100000/day` | Raw unformatted number is NOT used |
| 7 | Verify it is NOT displayed as `1L/day` or `1 Lakh/day` | Abbreviated format is NOT used |
| 8 | Confirm comma placement: `1,00,000` — first comma after 1 digit, then every 2 digits | Indian grouping: 1 → 00 → 000 confirmed |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 100000`
- 30-day avg = `100,000/day`
- Expected display: `1,00,000/day`
- Wrong formats to reject: `100,000/day` | `100000/day`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright asserts `toContainText('1,00,000/day')` and `not.toContainText('100,000/day')`.

---

## RP-027 — Daily Average Uses Indian Number Format in YTD Line

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-027 |
| **Title** | YTD prediction average of 1,00,000/day displays in Indian format — not international format |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | UI |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 100000`
3. Total lifetime count = `9,000,000`
4. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the YTD prediction line (second line) | YTD line visible |
| 4 | Read the average value in the YTD line | Average displays as `1,00,000/day` |
| 5 | Verify it is NOT displayed as `100,000/day` | International format is NOT used |
| 6 | Verify it is NOT displayed as `100000/day` | Raw unformatted number is NOT used |
| 7 | Confirm both lines use the same Indian format | Primary: `1,00,000/day` | YTD: `1,00,000/day` — consistent |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 100000`
- YTD avg = `100,000/day`
- Expected YTD display: `1,00,000/day`
- Wrong formats to reject: `100,000/day` | `100000/day`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — run as a pair with RP-026 using identical test data. Playwright asserts YTD line `toContainText('1,00,000/day')` and `not.toContainText('100,000/day')`.

---

## RP-028 — Date Format Is D MMM YYYY in Primary Line

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-028 |
| **Title** | Primary prediction date displays as "13 Apr 2026" — not as ISO "2026-04-13" |
| **Module** | Reflection Card → Primary Prediction Line |
| **Type** | UI |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 50000`
3. Total lifetime count = `9,900,000` (remaining to 1 Crore = 100,000)
4. Today = 2026-04-11 — days remaining = ceil(100,000 ÷ 50,000) = 2 — predicted date = **13 Apr 2026**
5. All 30 entries are in 2026 — YTD threshold met, both lines visible
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the primary prediction line | Primary line visible |
| 4 | Read the date portion of the primary line | Date reads `13 Apr 2026` |
| 5 | Verify the date is NOT in ISO format | `2026-04-13` does NOT appear anywhere in the primary line |
| 6 | Verify the month is abbreviated text — not a number | "Apr" — not "04" or "4" |
| 7 | Verify the day has no leading zero | "13" displayed — a single-digit day like "5" would show as "5 Apr 2026", not "05 Apr 2026" |
| 8 | Verify the year is 4 digits | "2026" — not "26" |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 50000`
- Total lifetime count: `9,900,000`
- Expected predicted date: `13 Apr 2026`
- Wrong format to reject: `2026-04-13`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright asserts primary line `toContainText('13 Apr 2026')` and `not.toContainText('2026-04-13')`.

---

## RP-029 — Date Format Is D MMM YYYY in YTD Line

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-029 |
| **Title** | YTD prediction date displays as "13 Apr 2026" — not as ISO "2026-04-13" |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | UI |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 50000`
3. Total lifetime count = `9,900,000` (remaining = 100,000)
4. Today = 2026-04-11 — YTD avg = 50,000/day — days remaining = 2 — YTD predicted date = **13 Apr 2026**
5. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the YTD prediction line (second line) | YTD line visible |
| 4 | Read the date portion of the YTD line | Date reads `13 Apr 2026` |
| 5 | Verify the date is NOT in ISO format | `2026-04-13` does NOT appear anywhere in the YTD line |
| 6 | Verify the month is abbreviated text | "Apr" — not "04" or "4" |
| 7 | Verify both prediction lines show the same date format | Primary: `13 Apr 2026` | YTD: `13 Apr 2026` — consistent format across both lines |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 50000`
- Total lifetime count: `9,900,000`
- Expected YTD predicted date: `13 Apr 2026`
- Wrong format to reject: `2026-04-13`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — run as a pair with RP-028 using identical test data. Playwright asserts YTD line `toContainText('13 Apr 2026')` and `not.toContainText('2026-04-13')`.

---

## RP-030 — No Blank Space When YTD Is Absent

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-030 |
| **Title** | When YTD is below threshold, no empty container or extra padding appears in the prediction area |
| **Module** | Reflection Card → Prediction Block |
| **Type** | UI |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 20 entries dated `2026-01-01` to `2026-01-20`, each `count: 50000`
3. Total non-zero YTD entries = **20** — threshold not met
4. Total lifetime count = `9,000,000`
5. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Primary prediction line is visible |
| 4 | Inspect the area immediately below the primary line | No visible gap, whitespace, or padding block |
| 5 | Open DevTools → Elements panel | No empty `<div>` or hidden element exists where the YTD line would appear |
| 6 | Confirm the section following the primary prediction is the milestone history or card bottom | Layout flows directly from primary to next section — no gap |
| 7 | Compare prediction block height to the pre-feature single-prediction layout | Height matches — not expanded |

**Test Data:**
- 20 entries `2026-01-01` to `2026-01-20`, each `count: 50000`
- Total lifetime count: `9,000,000`
- YTD non-zero count: **20**

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright asserts YTD element `not.toBeAttached()` (confirms not in DOM at all, not just hidden). Bounding box height check on prediction block confirms no extra space.

---

## RP-031 — Both Lines Show Separately When Dates Are Identical

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-031 |
| **Title** | When primary and YTD predicted dates are the same, both lines still render as separate entries |
| **Module** | Reflection Card → Prediction Block |
| **Type** | UI |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 50000`
3. These 30 are also the last 30 non-zero entries — primary avg = YTD avg = 50,000/day
4. Total lifetime count = `9,950,000` (remaining = 50,000)
5. Both predictions: ceil(50,000 ÷ 50,000) = 1 day — both predicted dates = **12 Apr 2026**
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the prediction area | Two prediction lines are visible |
| 4 | Read the primary prediction line | `At current pace (30-day avg: 50,000/day): 12 Apr 2026` |
| 5 | Read the YTD prediction line | `At your 2026 pace (50,000/day YTD): 12 Apr 2026` |
| 6 | Verify both lines show the same date "12 Apr 2026" | Confirmed — both predicted dates are equal |
| 7 | Verify the two lines have NOT been collapsed into one | Two distinct lines rendered, each with its own label |
| 8 | Verify both labels are present and distinct | "At current pace..." on line 1 | "At your 2026 pace..." on line 2 |
| 9 | Verify no deduplication or merge logic combined them | App shows two lines regardless of matching dates |

**Test Data:**
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 50000`
- Total lifetime count: `9,950,000`
- Both predicted dates: `12 Apr 2026`

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright asserts both prediction elements visible, primary `toContainText('At current pace')`, YTD `toContainText('At your 2026 pace')`, and both `toContainText('12 Apr 2026')`.

---

## RP-032 — Year in YTD Label Updates in New Calendar Year

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-032 |
| **Title** | YTD label shows "At your 2027 pace" in 2027 — year is dynamic, not hardcoded as 2026 |
| **Module** | Reflection Card → YTD Prediction Line |
| **Type** | UI |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. System date is set to `2027-04-01` (or Playwright clock mocked to `2027-04-01`)
3. IndexedDB contains 30 entries dated `2027-01-01` to `2027-01-30`, each `count: 50000`
4. Total non-zero YTD entries (2027 only) = **30** — threshold met
5. Total lifetime count = `9,000,000`
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible — date shown is in April 2027 |
| 2 | Scroll to the Reflection Card | Reflection Card visible |
| 3 | Locate the YTD prediction line | YTD line visible (30 entries in 2027 = threshold met) |
| 4 | Read the year shown in the YTD label | Year reads `2027` |
| 5 | Verify the label text is: "At your **2027** pace (...)" | Not "At your 2026 pace" — year updated correctly |
| 6 | Verify "2026" does NOT appear in the YTD label | Prior year is not hardcoded |
| 7 | Verify the full YTD label: `At your 2027 pace (50,000/day YTD): [D MMM YYYY]` | Year, average, and format all correct for 2027 |

**Test Data:**
- 30 entries dated `2027-01-01` to `2027-01-30`, each `count: 50000`
- Total lifetime count: `9,000,000`
- Mocked/system date: `2027-04-01`
- Expected YTD label: `At your 2027 pace (50,000/day YTD): [D MMM YYYY]`
- Wrong label to reject: `At your 2026 pace (...)`

**Post-Conditions:**
1. Restore system clock to actual date
2. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright mocks clock to `2027-04-01`, seeds 30 entries for 2027, asserts YTD line `toContainText('At your 2027 pace')` and `not.toContainText('At your 2026 pace')`.

---

---

## RP-033 — Saving a New Today Card Entry Recalculates YTD Prediction

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-033 |
| **Title** | YTD prediction in Reflection Card updates when a new Today Card entry is saved — without page reload |
| **Module** | Today Card → Reflection Card (data flow integration) |
| **Type** | Integration |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 50000`
3. Today's entry (`2026-04-11`) has NOT been saved yet
4. Total lifetime count = `9,000,000` (remaining to 1 Crore = 1,000,000)
5. Starting YTD avg = 50,000/day — days remaining = 20 — YTD predicted = **1 May 2026**
6. Browser: Chrome, latest version

**Expected state after saving `count: 100000` today:**
- New YTD total = 30 × 50,000 + 100,000 = 1,600,000
- New YTD entry count = 31
- New YTD avg = 1,600,000 ÷ 31 = **51,613/day** (rounded)
- New total lifetime = 9,100,000 — remaining = 900,000
- New days remaining = ceil(900,000 ÷ 51,613) = 18 — new predicted = **29 Apr 2026**

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | YTD line reads: "At your 2026 pace (50,000/day YTD): 1 May 2026" |
| 3 | Note starting YTD predicted date: `1 May 2026` | Confirmed as starting state |
| 4 | Scroll back to the Today Card | Count field is empty |
| 5 | Click the Jaap count field | Field focused |
| 6 | Type: `100000` | Field displays "100000" |
| 7 | Click Save | "✓ Saved!" shown briefly, reverts to "Save" |
| 8 | Scroll to the Reflection Card — **do NOT reload the page** | Reflection Card has updated |
| 9 | Read the YTD prediction line | "At your 2026 pace (51,613/day YTD): 29 Apr 2026" |
| 10 | Verify the YTD average updated from 50,000 to 51,613 | New entry raised the annual average |
| 11 | Verify the predicted date moved from 1 May to 29 Apr | Predicted date moved closer — faster pace |
| 12 | Verify the update happened without a page reload | Page URL unchanged; browser navigation history unaffected |
| 13 | Verify the primary prediction also updated | Primary line reflects the updated total and recent average |

**Test Data:**
- 30 seeded entries `2026-01-01` to `2026-01-30`, each `count: 50000`
- Today Card save: `count: 100000`
- Total at start: `9,000,000`
- YTD predicted before save: `1 May 2026`
- YTD predicted after save: `29 Apr 2026`

**Post-Conditions:**
1. Clear today's saved entry (enter `0` and save, or delete via Ledger)
2. Clear all seeded IndexedDB entries

**Automation Feasibility:** Partial — Playwright seeds entries, captures starting YTD text, saves via Today Card, asserts YTD text changed to new values. Requires `waitForFunction` or text-change assertion pattern.

---

## RP-034 — Prior Year Ledger Entries Have Zero Effect on YTD Average

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-034 |
| **Title** | YTD average is calculated from current year entries only — 100 prior year entries at 1,00,000/day do not influence it |
| **Module** | `predictNextMilestoneYTD` — year isolation |
| **Type** | Integration |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 100 entries dated `2025-01-01` to `2025-04-10`, each `count: 100000` (prior year — high count)
3. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 50000` (current year — lower count)
4. Total lifetime count = `11,500,000` (= 100 × 100,000 + 30 × 50,000)
5. YTD total (2026 only) = 30 × 50,000 = 1,500,000 — YTD avg = **50,000/day**
6. Wrong avg if prior year bleeds in: 11,500,000 ÷ 130 = **88,462/day** — clearly detectable
7. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card visible — Lifetime Jaap shows `1,15,00,000` |
| 3 | Locate the YTD prediction line | YTD line visible (30 non-zero 2026 entries = threshold met) |
| 4 | Read the YTD average | YTD avg reads `50,000/day` |
| 5 | Verify the avg is NOT `88,462/day` or any blended value | Prior year entries excluded from YTD calculation |
| 6 | Verify the avg is NOT `1,00,000/day` | Prior year pace has not leaked into YTD |
| 7 | Manually verify: 2026 total = 30 × 50,000 = 15,00,000 ÷ 30 = 50,000/day | Year isolation confirmed |
| 8 | Open DevTools → IndexedDB | Confirm 100 entries in 2025 and 30 entries in 2026 exist separately |

**Test Data:**
- 100 entries `2025-01-01` to `2025-04-10`, each `count: 100000`
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 50000`
- Total lifetime count: `11,500,000`
- Expected YTD avg: `50,000/day` (2026 only)
- Wrong if prior year bleeds in: `88,462/day` (blended) or `1,00,000/day` (prior year pace)

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright seeds both batches, asserts YTD line `toContainText('50,000/day')`, and `not.toContainText('88,462/day')` and `not.toContainText('1,00,000/day')`. Deliberately contrasting counts make any isolation failure immediately visible.

---

## RP-035 — New Unit Tests for `predictNextMilestoneYTD` Exist and Pass

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-035 |
| **Title** | New unit tests for `predictNextMilestoneYTD` cover all required scenarios and all pass |
| **Module** | `src/tests/unit/milestoneLogic.test.js` — new `describe` block |
| **Type** | Integration |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. Feature branch has `predictNextMilestoneYTD` implemented in `src/logic/milestoneLogic.js`
2. New `describe('predictNextMilestoneYTD', ...)` block added to `milestoneLogic.test.js`
3. Terminal is open at project root `c:\Users\ariji\jaap-ledger`
4. `npm install` has been run

**Required new test coverage — minimum 6 tests:**

| # | Test Description | Input | Expected Output |
|---|-----------------|-------|----------------|
| 1 | Normal case — returns correct avg and date | 30 entries × 50,000, totalCount = 9,000,000 | `averagePerDay: 50000`, `predictedDate` defined |
| 2 | 29 entries — returns null (below threshold) | 29 entries × 50,000 in current year | `null` |
| 3 | 30 entries — returns result (threshold met) | 30 entries × 50,000 in current year | result is not null |
| 4 | 31 entries — returns result (threshold is a floor) | 31 entries × 50,000 in current year | result is not null |
| 5 | No current-year entries — returns null | 0 entries in current year | `null` |
| 6 | Prior year entries excluded | 30 prior year × 100,000 + 30 current year × 50,000 | `averagePerDay: 50000` |

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | In terminal, run: `npm test` | Vitest starts and runs full suite |
| 2 | Locate the `predictNextMilestoneYTD` describe block in output | New describe block visible in test results |
| 3 | Verify all 6 new tests show a green tick | No red crosses |
| 4 | Verify test 2 (29 entries) returns null | `expect(result).toBeNull()` passes |
| 5 | Verify test 3 (30 entries) returns a result | `expect(result).not.toBeNull()` passes |
| 6 | Verify test 6 (prior year excluded) shows `averagePerDay: 50000` | Not 75,000 (blended), not 100,000 (prior year pace) |
| 7 | Verify existing 11 tests in `milestoneLogic.test.js` still pass | No regressions |
| 8 | Verify total test count = 17 (11 existing + 6 new) | Count confirms new tests added, none removed |

**Test Data:**
- All data embedded in the new unit test code
- No IndexedDB or browser required

**Post-Conditions:**
- None — unit test run leaves no state

**Automation Feasibility:** Yes — this test case IS the automation. `npm test` is both the execution step and the pass/fail check. Vitest exit code 0 = all pass.

---

## RP-036 — Milestone Progress Bar and History Unaffected

| Field | Detail |
|-------|--------|
| **Test Case ID** | RP-036 |
| **Title** | Milestone progress bar, percentage, and crossed milestone history are unchanged after YTD prediction is added |
| **Module** | Reflection Card — full layout integration |
| **Type** | Integration |
| **Priority** | P2-High |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. IndexedDB contains 1 entry dated `2025-01-01` with `count: 9500000` (prior year — takes total just below 1 crore)
3. IndexedDB contains 30 entries dated `2026-01-01` to `2026-01-30`, each `count: 50000`
4. Total lifetime count = `11,000,000` (9,500,000 + 1,500,000)
5. Milestone crossed: 1 Crore (crossed during the 2026 entries)
6. Progress toward 2 Crore: 11,000,000 − 10,000,000 = 1,000,000 → **10.0%**
7. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app at `http://localhost:5173` | Today Card visible |
| 2 | Scroll to the Reflection Card | Reflection Card fully visible |
| 3 | Locate the "Next Milestone" section | Shows: "2 Crore (10.0%)" |
| 4 | Verify the progress bar reflects 10% | Bar is approximately 10% filled |
| 5 | Locate the primary prediction line | "At current pace (30-day avg: 50,000/day): [date]" — visible |
| 6 | Locate the YTD prediction line directly below | "At your 2026 pace (50,000/day YTD): [date]" — visible |
| 7 | Locate the "Milestones Crossed" section below the prediction block | Section visible — 1 Crore entry shown |
| 8 | Verify the milestone history entry is intact | "🪔 1 Crore — [date]" appears correctly |
| 9 | Verify the milestone history has NOT been displaced by the new YTD line | Only one line of height added — no large unexpected gap |
| 10 | Verify the progress percentage "10.0%" is unchanged | Not recalculated, not missing, not showing wrong value |
| 11 | Verify all Reflection Card sections are present in correct order | Lifetime Jaap → Current Year Total → Next Milestone → Prediction block → Milestones Crossed |

**Test Data:**
- 1 entry `2025-01-01`, `count: 9500000`
- 30 entries `2026-01-01` to `2026-01-30`, each `count: 50000`
- Total lifetime count: `11,000,000`
- Milestone crossed: 1 Crore | Progress toward 2 Crore: **10.0%**

**Post-Conditions:**
1. Clear all seeded IndexedDB entries

**Automation Feasibility:** Yes — Playwright asserts all sections visible in correct DOM order: progress `toContainText('10.0%')`, primary visible, YTD visible, history `toContainText('1 Crore')`. Sequential `nth()` locator checks confirm order is preserved.

---

## Summary — All 7 Batches — COMPLETE (Happy Path + BVA + Negative + State + Regression + UI/UX + Integration)

| TC ID | Title | Type | Priority | Automation |
|-------|-------|------|----------|------------|
| RP-001 | Both prediction lines visible with 30+ YTD entries | Happy Path | P1 | Yes |
| RP-002 | Primary label format correct (label, Indian number, D MMM YYYY) | Happy Path | P1 | Yes |
| RP-003 | YTD label format correct (label, Indian number, D MMM YYYY) | Happy Path | P1 | Yes |
| RP-004 | YTD average = total ÷ non-zero entry count (Method B) | Happy Path | P1 | Yes |
| RP-005 | YTD predicted date = today + ceil(remaining ÷ avg) | Happy Path | P1 | Yes |
| RP-006 | 29 non-zero YTD entries — YTD line absent | BVA | P1 | Yes |
| RP-007 | 30 non-zero YTD entries — YTD line appears | BVA | P1 | Yes |
| RP-008 | 31 non-zero YTD entries — YTD line remains | BVA | P2 | Yes |
| RP-009 | Save 30th entry live — YTD appears without page reload | BVA | P1 | Partial |
| RP-010 | 1 January — YTD absent, primary continues | Negative | P1 | Yes |
| RP-011 | All 2026 entries count = 0 — YTD absent | Negative | P1 | Yes |
| RP-012 | 20 non-zero + 30 zero YTD entries — threshold count is 20, YTD absent | Negative | P2 | Yes |
| RP-013 | New user, 29 non-zero entries since first entry — YTD absent | Negative | P2 | Yes |
| RP-014 | 200 prior year entries, 5 current year — YTD absent | Negative | P1 | Yes |
| RP-015 | Primary only visible when YTD below threshold — no blank space | State | P1 | Yes |
| RP-016 | Both lines show different dates — mid-year user with varied pace | State | P1 | Yes |
| RP-017 | New year, no current-year entries — YTD absent, primary continues | State | P1 | Yes |
| RP-018 | New user — YTD appears on 30th entry day, not from 1 Jan | State | P2 | Yes |
| RP-019 | YTD predicted date recalculates after new entry saved | State | P2 | Partial |
| RP-020 | Primary avg and date unchanged after YTD feature added | Regression | P1 | Yes |
| RP-021 | Primary shows normally when YTD threshold not met | Regression | P1 | Yes |
| RP-022 | All 11 existing unit tests pass after new function added | Regression | P1 | Yes |
| RP-023 | Primary avg reflects only last 30 non-zero entries — prior year excluded | Regression | P2 | Yes |
| RP-024 | Primary label wording and punctuation verbatim correct | UI | P1 | Yes |
| RP-025 | YTD label wording, year, and punctuation verbatim correct | UI | P1 | Yes |
| RP-026 | Primary avg uses Indian number format (1,00,000 not 100,000) | UI | P2 | Yes |
| RP-027 | YTD avg uses Indian number format — consistent with primary | UI | P2 | Yes |
| RP-028 | Primary date shows D MMM YYYY — not ISO 2026-04-13 | UI | P1 | Yes |
| RP-029 | YTD date shows D MMM YYYY — not ISO 2026-04-13 | UI | P1 | Yes |
| RP-030 | No blank space or empty container when YTD absent | UI | P2 | Yes |
| RP-031 | Both lines render separately even when predicted dates are identical | UI | P2 | Yes |
| RP-032 | Year in YTD label is dynamic — shows 2027 in 2027, not 2026 | UI | P2 | Yes |
| RP-033 | Saving Today Card entry recalculates YTD prediction without reload | Integration | P1 | Partial |
| RP-034 | Prior year entries have zero effect on YTD average | Integration | P1 | Yes |
| RP-035 | New unit tests for predictNextMilestoneYTD exist and all pass | Integration | P1 | Yes |
| RP-036 | Milestone progress bar and history unaffected by YTD addition | Integration | P2 | Yes |
