# Test Cases — Daily Jaap Goal Feature

*Agent: Test Case Agent*
*Date: 10 April 2026*
*Input: docs/test-artifacts/scenarios/daily-goal-scenarios.md*
*Scenarios converted: DG-001, DG-011, DG-014, DG-037*

---

## DG-001 — Set a Valid Daily Goal in Settings and Save

| Field | Detail |
|-------|--------|
| **Test Case ID** | DG-001 |
| **Title** | Set a valid daily goal in Settings and verify it persists |
| **Module** | Settings Panel → Daily Goal |
| **Type** | Happy Path |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. No Daily Goal is currently set (localStorage contains no goal value)
3. Browser: Chrome, latest version
4. Today's Jaap count has not been saved yet

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the app in the browser | Splash screen appears, then Today Card is visible |
| 2 | Click the ⚙️ Settings button (top right) | Settings panel opens with heading "Settings" |
| 3 | Scroll through Settings panel and locate the "Daily Goal" section | A labelled section is visible with a numeric input field |
| 4 | Click into the Daily Goal input field | Field is focused and empty |
| 5 | Type: `108` | Field displays "108" |
| 6 | Click the Save button for the Daily Goal | Goal is saved; a confirmation is shown (e.g. "✓ Saved") |
| 7 | Close Settings by clicking × | Settings panel closes; Today Card is visible |
| 8 | Click ⚙️ Settings button again | Settings panel reopens |
| 9 | Locate the Daily Goal input field | Field is pre-populated with "108" — not blank |

**Test Data:**
- Daily Goal value: `108`

**Post-Conditions:**
1. Open Settings
2. Clear the Daily Goal field
3. Save — to restore the no-goal state for subsequent tests

**Automation Feasibility:** Yes — Playwright can open Settings, fill the field, save, reopen Settings, and assert the pre-populated value using a `toHaveValue('108')` assertion.

---

## DG-011 — Count Exactly Equals Goal (Critical Boundary)

| Field | Detail |
|-------|--------|
| **Test Case ID** | DG-011 |
| **Title** | Save count equal to goal — verify gold "Goal met!" indicator, not amber |
| **Module** | Today Card → Goal Indicator |
| **Type** | Boundary Value Analysis |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. Daily Goal is already set to `500` in Settings
3. Today's Jaap count has not been saved yet (count field is empty)
4. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open app | Today Card visible; count field is empty |
| 2 | Open Settings and verify the Daily Goal field | Field shows "500" — confirming pre-condition |
| 3 | Close Settings | Today Card visible |
| 4 | Click into the Jaap count field (`#jaap-count`) | Field is focused |
| 5 | Type: `500` | Field displays "500" |
| 6 | Click Save | Button shows "✓ Saved!" briefly then reverts to "Save" |
| 7 | Observe the Today Card after save | **Gold** indicator is visible with text: "Goal met!" |
| 8 | Verify NO amber indicator is present | No text reading "X remaining to reach your goal" |
| 9 | Verify the indicator colour is gold — not amber, not green | Indicator colour matches the app's gold palette (`var(--color-gold)`) |

**Test Data:**
- Daily Goal: `500`
- Today's Jaap count: `500` (exactly equal to goal)

**Post-Conditions:**
1. Clear today's count (enter `0` and save)
2. Run DG-012 (count = 499) and DG-013 (count = 501) in the same session to fully verify the boundary behaviour

**Automation Feasibility:** Yes — Playwright can set the count to 500, save, and assert `toContainText('Goal met!')` and absence of the amber indicator text.

---

## DG-014 — Enter Negative Number in Goal Field

| Field | Detail |
|-------|--------|
| **Test Case ID** | DG-014 |
| **Title** | Enter -1 in Daily Goal field — verify rejection and validation message |
| **Module** | Settings Panel → Daily Goal |
| **Type** | Negative Testing |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. Settings panel is accessible
3. The Daily Goal field may be empty or have a previously saved valid value — either state is acceptable
4. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open app | Today Card visible |
| 2 | Click ⚙️ Settings button | Settings panel opens |
| 3 | Locate the Daily Goal input field | Field visible (empty or showing a previous valid value) |
| 4 | Clear the field if it has an existing value | Field is empty |
| 5 | Type: `-1` | Field shows "-1" (or prevents entry — note actual behaviour) |
| 6 | Click the Save button for the Daily Goal | Validation message appears — goal is NOT saved |
| 7 | Read the validation message text | Message reads: "Please enter a whole number between 1 and 10,00,000" |
| 8 | Verify the message appears directly below the goal input field | Message is inline — not a popup or alert |
| 9 | Close Settings without taking any further action | Settings panel closes |
| 10 | Re-open Settings | Daily Goal field does NOT show `-1`; shows previous valid value or remains empty |

**Test Data:**
- Invalid input: `-1`

**Post-Conditions:**
- None required — the invalid value was never saved
- Verify by re-opening Settings and confirming the field is unchanged from its pre-test state

**Automation Feasibility:** Yes — Playwright can type `-1`, trigger the save action, and assert the validation message using `toBeVisible()` and `toContainText('Please enter a whole number')`.

---

## DG-037 — Goal Indicator Does NOT Appear in Ledger

| Field | Detail |
|-------|--------|
| **Test Case ID** | DG-037 |
| **Title** | Verify no goal indicator appears on today's or past Ledger entries |
| **Module** | Ledger → Integration with Daily Goal |
| **Type** | Integration |
| **Priority** | P1-Critical |

**Pre-Conditions:**
1. App is running at `http://localhost:5173`
2. Daily Goal is set to `108`
3. Today's Jaap count is saved as `200` (count > goal, so green indicator IS visible on Today Card)
4. Step 3 is critical: goal indicator must be actively showing on Today Card — confirming feature is ON before checking it stays OUT of the Ledger
5. At least one past entry exists in the Ledger (from a previous day)
6. Browser: Chrome, latest version

**Test Steps and Expected Results:**

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open app | Today Card shows green indicator: "Goal exceeded by 92" — confirming goal feature is active |
| 2 | Scroll down to the Ledger section | Ledger is visible with current year group expanded |
| 3 | Locate today's date row in the Ledger | Row shows: date, "Today" badge, count "2,00" (Indian format) — nothing else |
| 4 | Verify NO amber/gold/green indicator is in today's Ledger row | No colour-coded indicator visible in the row |
| 5 | Verify NO goal-related text in today's row | No text: "Goal met", "exceeded", "remaining" anywhere in the row |
| 6 | Click today's Ledger row to expand it | Edit form appears with count field, notes field, Update button |
| 7 | Verify the expanded form has NO goal indicator | Only count field, notes field, Update button — no goal-related UI |
| 8 | Click today's row again to collapse it | Row collapses |
| 9 | Locate any past entry row (a different date) | Past entry row visible |
| 10 | Click the past entry to expand it | Entry expands showing count and notes — no goal indicator |
| 11 | Scroll through the full visible Ledger | No row — today or past — shows any goal-related visual element |

**Test Data:**
- Daily Goal: `108`
- Today's count: `200`
- At least one existing past entry (any count value)

**Post-Conditions:**
1. This test is read-only on the Ledger — no Ledger cleanup needed
2. Optionally clear today's count and Daily Goal to restore clean state for the next test

**Automation Feasibility:** Yes — Playwright can assert absence of indicator text within Ledger row locators using `not.toBeVisible()` and `not.toContainText()`. The pre-condition (goal active on Today Card) can be set up in `beforeEach`.

---

## Summary

| TC ID | Title | Type | Priority | Automation |
|-------|-------|------|----------|------------|
| DG-001 | Set valid goal and verify persistence | Happy Path | P1 | Yes |
| DG-011 | Count == goal shows gold indicator | BVA | P1 | Yes |
| DG-014 | Negative number rejected with validation message | Negative | P1 | Yes |
| DG-037 | No goal indicator in Ledger | Integration | P1 | Yes |
