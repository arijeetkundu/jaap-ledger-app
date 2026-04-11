# Test Scenario Set — Daily Jaap Goal Feature

*Agent: Test Scenario Agent*
*Date: 10 April 2026*
*Input: docs/test-artifacts/requirements/daily-goal-requirement-review.md*
*Total Scenarios: 41 | All 11 ACs covered*

---

## Happy Path Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| DG-001 | Set a valid daily goal in Settings and save | Happy Path | P1 | User navigates to Settings, enters a valid integer (e.g. 108) in the Daily Goal field, and saves. The goal is stored and the field shows the saved value on return. Verifies the core setup flow works end to end. | AC1, AC3 |
| DG-002 | Save a count below goal — amber indicator appears | Happy Path | P1 | User has a goal of 108. Saves today's count as 50. The Today Card shows the amber indicator with text "58 remaining to reach your goal". Verifies the primary not-yet-met state. | AC5 |
| DG-003 | Save a count equal to goal — gold indicator appears | Happy Path | P1 | User has a goal of 108. Saves today's count as exactly 108. The Today Card shows the gold "Goal met!" indicator. Verifies the exact-match state which is the most important success moment. | AC6 |
| DG-004 | Save a count exceeding goal — green indicator appears | Happy Path | P1 | User has a goal of 108. Saves today's count as 200. The Today Card shows the green indicator with text "Goal exceeded by 92". Verifies the overachievement state. | AC7 |
| DG-005 | Change the goal value in Settings | Happy Path | P2 | User has an existing goal of 108. Returns to Settings and changes it to 216. Saves. The new goal value persists and the indicator on Today Card reflects the new target. | AC1, AC3, AC8 |
| DG-006 | Remove the goal by clearing the field in Settings | Happy Path | P2 | User has an existing goal set. Clears the Daily Goal field in Settings and saves. Today Card returns to its no-goal state with no indicator visible. | AC9 |

---

## Boundary Value Analysis Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| DG-007 | Enter minimum valid goal value (1) | BVA | P1 | User enters 1 in the Daily Goal field. This is the lowest valid value. The field accepts it, saves it, and the indicator logic works correctly against a count of 0 vs 1. | AC1 |
| DG-008 | Enter 0 in the goal field — rejected | BVA | P1 | User enters 0. This is one below the minimum valid value. The field should reject it and display the validation message. 0 is not a meaningful goal. | AC2 |
| DG-009 | Enter maximum valid goal value (10,00,000) | BVA | P1 | User enters 10,00,000 (one million). This is the highest valid value. The field accepts it and the indicator logic functions correctly at this scale. | AC1 |
| DG-010 | Enter one above maximum (10,00,001) — rejected | BVA | P2 | User enters 10,00,001. This is one above the maximum. The field rejects it with the validation message. Tests the upper boundary enforcement. | AC2 |
| DG-011 | Count exactly equals goal — boundary between not-met and met | BVA | P1 | With a goal of 500, user saves count = 500. Verifies the boundary condition: count == goal must show "Goal met!" (gold), NOT the amber "remaining" indicator. This is the most critical boundary. | AC6 |
| DG-012 | Count is one below goal — still shows amber | BVA | P1 | With a goal of 500, user saves count = 499. Must show amber "1 remaining to reach your goal". Confirms the boundary is exclusive (< goal = not met). | AC5 |
| DG-013 | Count is one above goal — shows green | BVA | P1 | With a goal of 500, user saves count = 501. Must show green "Goal exceeded by 1". Confirms the boundary between "met" and "exceeded". | AC7 |

---

## Negative Testing Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| DG-014 | Enter negative number in goal field | Negative | P1 | User enters -1 in the Daily Goal field. The field must reject it with the validation message. A negative goal is logically meaningless and could break indicator calculations. | AC2 |
| DG-015 | Enter a decimal number in goal field | Negative | P2 | User enters 108.5. The field must reject it. Jaap counts are whole numbers — a decimal goal would create ambiguous met/not-met states. | AC2 |
| DG-016 | Enter alphabetic text in goal field | Negative | P2 | User enters "abc". The field must reject it and show the validation message. Verifies the field enforces numeric-only input. | AC2 |
| DG-017 | Enter special characters in goal field | Negative | P2 | User enters "@#$%" or "108!" in the goal field. Must be rejected. Tests that special characters don't bypass validation. | AC2 |
| DG-018 | Enter only whitespace in goal field and save | Negative | P2 | User presses spacebar several times and clicks save. Must be treated as empty/invalid, not as a valid value of 0 or blank. | AC2 |
| DG-019 | Leave goal field empty and attempt to save | Negative | P3 | User opens Settings, leaves the Daily Goal field blank and clicks save. Should either show a message or treat as "no goal" (remove existing goal). Behaviour must be clearly defined. | AC4, AC9 |
| DG-020 | Enter a number larger than maximum with extra digits | Negative | P2 | User enters 99999999 (far beyond 10,00,000). Must be rejected. Tests that the upper limit is strictly enforced even for very large inputs. | AC2 |
| DG-021 | Attempt to paste non-numeric content into goal field | Negative | P3 | User copies "one hundred and eight" and pastes it into the field. Must be rejected or automatically stripped. Tests input sanitisation beyond keyboard entry. | AC2 |

---

## State-Based Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| DG-022 | No goal set — Today Card shows no goal UI | State | P1 | Fresh install or after goal is removed. Today Card must look identical to its current design with no extra fields, indicators, or blank spaces where a goal indicator would be. | AC4 |
| DG-023 | Goal persists after page reload | State | P1 | User sets a goal and reloads the page. The goal value must be pre-populated in the Settings field. Verifies localStorage persistence is working correctly. | AC3 |
| DG-024 | Goal indicator persists after page reload | State | P1 | User sets a goal, saves a count, then reloads. The indicator (amber/gold/green) must still be visible on Today Card after reload — it re-calculates from saved count vs saved goal. | AC3, AC5, AC6, AC7 |
| DG-025 | Goal is set but count has not been saved yet today | State | P2 | User has a goal set. Opens the app today before saving any count. Today Card shows the empty count field. Determines whether a "0 saved" state shows the amber indicator or the no-goal state. | AC4, AC5 |
| DG-026 | Goal changed in Settings — indicator updates without re-saving count | State | P2 | User has saved count = 100 against goal = 200 (amber). Changes goal to 80 in Settings. Without re-saving the count, Today Card indicator must now show green (100 > 80). | AC8 |
| DG-027 | Goal cleared — indicator disappears immediately | State | P2 | User has an active goal and a visible indicator on Today Card. Clears the goal in Settings and saves. Returns to Today Card — the indicator must be gone and layout must return to normal. | AC9 |
| DG-028 | Goal set, today's count saved as 0 | State | P2 | User has a goal of 108. Saves today's count as 0 (no jaap done today). What shows — does it show "108 remaining" (amber) or is 0 treated as "no entry today" and shows no indicator? Requires a product decision. | AC4, AC5 |

---

## UI/UX Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| DG-029 | Today Card layout is unchanged when no goal is set | UI | P1 | With no goal configured, the Today Card must be pixel-identical in layout to the current design. No empty spaces, no placeholder text, no invisible elements taking up space. | AC4 |
| DG-030 | Amber indicator shows correct colour and message format | UI | P2 | When count < goal, the indicator background/text must be amber/orange. The message must follow the exact format: "X remaining to reach your goal" where X is the correct calculated difference. | AC5 |
| DG-031 | Gold indicator shows correct colour and text | UI | P2 | When count = goal, the indicator must appear in gold (matching the app's gold palette). Text must read exactly "Goal met!" — not "Goal Met", not "Goal achieved". | AC6 |
| DG-032 | Green indicator shows correct colour and overage amount | UI | P2 | When count > goal, indicator must be green. Text must read "Goal exceeded by X" where X = count minus goal. Verifies the overage is calculated and displayed correctly. | AC7 |
| DG-033 | Validation message appears inline below the goal field | UI | P2 | When invalid input is submitted, the error message must appear directly below the Daily Goal field — not as a popup, not in a different section. Style must match the app's existing validation patterns. | AC2 |
| DG-034 | Daily Goal field in Settings pre-populates on return | UI | P2 | User sets goal and closes Settings. Re-opens Settings. The Daily Goal field must show the saved value — not blank, not a placeholder. Verifies the UI loads from localStorage correctly. | AC3 |
| DG-035 | Daily Goal section is visually separate from Sankalpa | UI | P3 | In the Settings panel, the Daily Goal input must be in its own clearly labelled section. It must not appear adjacent to or within the Sankalpa section. Labels must avoid spiritual language that could cause confusion with Sankalpa. | AC11 |

---

## Integration Scenarios

| ID | Title | Type | Priority | Description | AC |
|----|-------|------|----------|-------------|-----|
| DG-036 | Existing Today Card save flow is unaffected | Integration | P1 | With or without a goal set, the existing count+notes save flow must work exactly as before. No regression to the core daily entry feature. The goal feature adds to the Today Card but must not break it. | AC4, AC5 |
| DG-037 | Goal indicator does NOT appear on today's entry in the Ledger | Integration | P1 | After saving a count with a goal set, the Ledger row for today must show only the date and count as before — no amber/gold/green indicator, no goal-related text. | AC10 |
| DG-038 | Goal indicator does NOT appear on any past entries in the Ledger | Integration | P1 | With a goal set, scroll through past Ledger entries. No entry — regardless of its count value — must show any goal indicator. Goal tracking is Today Card only. | AC10 |
| DG-039 | Sankalpa page opens and functions normally when goal is set | Integration | P2 | With a Daily Goal configured, navigate to Settings → Sankalpa. The Sankalpa page must load, display, save, and navigate back exactly as before. Goal feature must not interfere. | AC11 |
| DG-040 | Palette change still works correctly when goal feature is active | Integration | P2 | With a goal and an active indicator on Today Card, open Settings and change the palette. The indicator must adopt the new palette colours correctly — amber/gold/green must still be visible in all themes. | AC5, AC6, AC7 |
| DG-041 | CSV and JSON export do not break with goal feature present | Integration | P3 | Export CSV and JSON from Settings with a goal configured. The export files must contain only the existing data structure (date, count, notes) — goal value must not corrupt or alter the export format. | AC10 |

---

## Coverage Matrix

| AC | Description | Covered by |
|----|-------------|------------|
| AC1 | Numeric input, 1 to 10,00,000 | DG-001, DG-005, DG-007, DG-009 |
| AC2 | Rejects invalid input | DG-008, DG-010, DG-014, DG-015, DG-016, DG-017, DG-018, DG-019, DG-020, DG-021, DG-033 |
| AC3 | Persists in localStorage | DG-001, DG-023, DG-024, DG-034 |
| AC4 | No goal = no UI in Today Card | DG-022, DG-025, DG-028, DG-029, DG-036 |
| AC5 | count < goal → amber | DG-002, DG-012, DG-025, DG-028, DG-030, DG-036, DG-040 |
| AC6 | count = goal → gold | DG-003, DG-011, DG-024, DG-031, DG-040 |
| AC7 | count > goal → green | DG-004, DG-013, DG-024, DG-032, DG-040 |
| AC8 | Goal change updates indicator without re-save | DG-005, DG-026 |
| AC9 | Clear goal → indicator removed | DG-006, DG-019, DG-027 |
| AC10 | No indicator in Ledger | DG-037, DG-038, DG-041 |
| AC11 | Separate from Sankalpa | DG-035, DG-039 |

**All 11 ACs covered. No gaps.**

---

## Count by Type

| Type | Count |
|------|-------|
| Happy Path | 6 |
| Boundary Value Analysis | 7 |
| Negative Testing | 8 |
| State-Based | 7 |
| UI/UX | 7 |
| Integration | 6 |
| **Total** | **41** |
