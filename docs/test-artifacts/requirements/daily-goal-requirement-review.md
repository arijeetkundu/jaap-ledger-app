# Requirement Quality Report — Daily Jaap Goal Feature

*Agent: Requirements Analysis Agent*
*Date: 9 April 2026*
*Status: NOT READY for Test Scenario Generation*

---

## Original Requirement (quoted exactly)

> "As a user, I want to set a daily Jaap goal so that I can track whether I have met my target each day.
> Acceptance Criteria:
> - User can enter a daily goal
> - The app shows if the goal was met
> - The goal should be saved"

---

## Issues Found

### Ambiguity Issues

| Phrase | Why It Is Ambiguous | Suggested Fix |
|--------|--------------------|----|
| "set a daily Jaap goal" | Does "daily" mean the same goal every day (global setting) or a different goal per day? | "set a single Jaap count target that applies to every day until changed" |
| "set" | Location not specified — Settings? Today Card? Elsewhere? | "in the Settings panel, the user can define a daily target count" |
| "track whether I have met my target" | Track how and where? Colour? Badge? Progress bar? Today Card only or also Ledger? | "a visual indicator on the Today Card shows: Not Met / Met / Exceeded" |
| "The app shows if the goal was met" | Shows when (live or post-save)? Shown where? | "after saving today's count, the Today Card displays whether the saved count meets the goal" |
| "The goal should be saved" | Global or per-day? localStorage or IndexedDB? Retroactive effect on past entries? | "stored as a global setting in localStorage; changing it does not affect past entries" |

### Completeness Gaps

- No goal set (empty state) — what does Today Card look like?
- Goal = 0 or negative — valid or rejected?
- Count equals goal exactly (boundary value) — "Met" or "Not yet Met"?
- Count exceeds goal — separate "Exceeded" state or same as "Met"?
- Changing goal mid-day without re-saving count — what indicator shows?
- Retroactive display in Ledger — past dates show met/not-met?
- Deleting the goal — how, and what happens to Today Card?
- New user first use — is there an onboarding nudge?
- Maximum valid goal value — is 1 crore (10,000,000) valid?
- Conflict with Sankalpa — is this feature related to or separate from Sankalpa?

### Acceptance Criteria Quality

| AC | Status | Improvement Needed |
|----|--------|--------------------|
| "User can enter a daily goal" | NEEDS IMPROVEMENT | No data type, no range, no location, no validation rules |
| "The app shows if the goal was met" | NEEDS IMPROVEMENT | No specification of how, where, or when it shows |
| "The goal should be saved" | NEEDS IMPROVEMENT | Scope unclear — global or per-day; storage not specified |

All 3 ACs are happy path only. None cover validation, error states, empty state, boundary values, or deletion.

### Dependencies and Assumptions

| Dependency | Risk |
|------------|------|
| TodayCard.jsx needs a new UI section for the indicator | Medium — not mentioned in requirement |
| SettingsPanel.jsx needs a new "Daily Goal" input | Medium — not mentioned |
| Goal does NOT appear in Ledger for past days | High — never stated; developer may add it |
| Feature is separate from Sankalpa | High — never confirmed |

---

## Improved Requirement

> As a returning user of Sumiran, I want to set a single numeric daily Jaap count target in the Settings panel, so that the Today Card shows me — after I save my daily count — whether I have not yet met, exactly met, or exceeded my target for that day.
>
> The goal is a global setting (one value that applies to every day) stored in the browser's localStorage. It persists across sessions until the user explicitly changes or removes it. When no goal is set, no goal-related UI is visible anywhere in the app. The goal indicator appears only on the Today Card and does NOT retroactively appear on past dates in the Ledger.

---

## Suggested Acceptance Criteria

1. A "Daily Goal" numeric input is available in Settings, accepting integers from 1 to 10,00,000
2. Field rejects 0, negative numbers, decimals, and text — shows: "Please enter a whole number between 1 and 10,00,000"
3. Saved goal persists in localStorage and pre-populates the field on every page load
4. When no goal is set, Today Card shows no goal-related UI
5. After Save — count < goal → amber indicator: "X remaining to reach your goal"
6. After Save — count = goal → gold indicator: "Goal met!"
7. After Save — count > goal → green indicator: "Goal exceeded by X"
8. If goal is changed in Settings, indicator updates against already-saved count without re-saving
9. Clearing the goal field and saving removes the indicator from Today Card
10. No goal indicator appears in the Ledger — past or present
11. Feature is visually and conceptually separate from Sankalpa

---

## Verdict: NOT READY for Test Scenario Generation

Confirm with product owner before proceeding:
1. Is the goal global (same every day) or per-day?
2. Where does the goal input live — Settings or Today Card?
3. Does "met" mean >= goal or == goal exactly?
4. Does the Ledger show historical goal tracking or not?
