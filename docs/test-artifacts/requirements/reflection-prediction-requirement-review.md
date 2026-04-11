# Requirement Quality Report — Reflection Card Prediction Logic Change

*Agent: Requirements Analysis Agent*
*Date: 10 April 2026*
*Status: READY — requirement revised and approved on 10 April 2026*
*Source file reviewed: src/logic/milestoneLogic.js*

### Product Decisions Confirmed (10 April 2026)

| # | Decision | Confirmed Answer |
|---|----------|-----------------|
| 1 | Scope | **Additive** — keep existing 30-day prediction unchanged; add YTD prediction as a second line below it. Original "replace" approach was discarded after product design review (YTD average anchors to the past and cannot respond to changes in current practice). |
| 2 | YTD denominator formula | **Method B** — total YTD count ÷ number of days with a non-zero entry since 1 Jan (consistent with existing 30-day logic which also divides by non-zero entry count) |
| 3 | Minimum threshold for YTD | **30 non-zero entry days** in the current year — existing users: YTD line visible from ~1 Feb; new users who joined mid-year: visible 30 non-zero entry days after their first entry |

---

## Original Requirement (quoted exactly)

> "Currently, Sumiran predicts the date on which user will reach the next milestone based on trend or average chant count of past 30 days from the Ledger. The date should be predicted based on average or trend of chant count from 01 Jan of the current year in the Ledger."

---

## Issues Found

### Ambiguity Issues

| Phrase | Why It Is Ambiguous | Suggested Fix |
|--------|--------------------|----|
| "trend or average" | Two different calculations. Average = total ÷ days. Trend = regression line accounting for increasing/decreasing patterns. "Or" leaves the developer to choose. | Specify one: "simple daily average (total YTD count ÷ days elapsed since 1 Jan)" |
| "chant count from 01 Jan of the current year" | Two interpretations: (A) total ÷ calendar days since 1 Jan (including days with no entry). (B) total ÷ number of days with a non-zero entry since 1 Jan. Current code uses B (milestoneLogic.js line 63). The choice dramatically changes the predicted date. | Specify the denominator explicitly — see Product Decision 1 below |
| "from the Ledger" | Redundant but raises a question: does it include manually backfilled entries? | Replace with: "using all saved entries dated from 1 January of the current calendar year" |
| "should be replaced with" | Does this remove the 30-day window entirely, or add YTD as an additional option? | Confirm: "The 30-day rolling window must be completely removed and replaced" |
| "current year" | Calendar year (1 Jan – 31 Dec) or rolling 12 months? | Specify: "current calendar year, starting from 1 January" |

---

### Completeness Gaps

- **New year boundary (1 Jan):** Zero entries exist for the new year on 1st January. Does prediction show "not available" or fall back to prior year data?
- **Very few entries in early January:** A YTD average based on 2–3 entries is highly volatile. Is there a minimum entry threshold before showing the prediction?
- **New user who joined after 1 Jan:** Should their denominator be "days since 1 Jan" (includes days before they installed the app) or "days since first entry"?
- **Entries with count = 0:** Current code excludes these (`filter(e => e.count > 0)`). Should YTD calculation also exclude them? Requirement does not say.
- **Display label change:** Current UI shows "Based on X-day average of Y/day" (ReflectionCard.jsx, using `prediction.basedOnDays`). This label must change but the requirement is silent on it.
- **Unit tests:** `predictNextMilestone` in milestoneLogic.test.js uses 30-entry arrays. All tests will break after this change. Requirement does not mention updating them.
- **Year boundary mid-session:** If the app is open across midnight 31 Dec → 1 Jan, the prediction jumps from a full year of data to zero. Must not crash or show a blank screen.

---

### Acceptance Criteria Quality

| AC | Status | What Is Needed |
|----|--------|----------------|
| *(none provided)* | MISSING | All ACs must be written from scratch — none exist in the original requirement |

---

### Dependencies and Assumptions

| Dependency | Type | Risk |
|------------|------|------|
| `predictNextMilestone` in `src/logic/milestoneLogic.js` must be rewritten | Code change — confirmed by reading the file | High — existing unit tests will break |
| `ReflectionCard.jsx` display label must be updated | Code change — "Based on X-day average" label will be wrong | Medium |
| `milestoneLogic.test.js` unit tests must be updated | Test change — current tests use 30-entry arrays | High — all `predictNextMilestone` tests will fail |
| All entries use `YYYY-MM-DD` date format | Already confirmed in db.js and existing tests | Low — already in place |
| "Current year" resets on 1 Jan of each calendar year | Implicit assumption — not stated | Medium — new year boundary behaviour is undefined |

---

## Improved Requirement (Revised)

> The Reflection Card currently shows one predicted milestone date based on a 30-day rolling average. **This existing prediction must remain completely unchanged.**
>
> A second prediction line must be added below the existing one, showing the predicted milestone date based on the **year-to-date (YTD) daily average** — calculated as total Jaap count from all saved entries dated 1 January of the current calendar year to today, divided by the number of days with a non-zero entry since 1 Jan (Method B).
>
> The two predictions are displayed as a pair:
> - **Primary (unchanged):** "At current pace (30-day): [predicted date]"
> - **Secondary (new):** "At your [YYYY] pace: [predicted date]"
>
> The YTD prediction is only shown when at least **30 non-zero entry days** exist in the current year. Before that threshold, the YTD line is absent and the layout shows no blank space. The primary 30-day prediction continues to show normally regardless of the YTD threshold.
>
> A new function `predictNextMilestoneYTD` must be added to `src/logic/milestoneLogic.js`. The existing `predictNextMilestone` function must not be modified.

---

## Suggested Acceptance Criteria (Revised)

**Existing 30-day prediction — no changes:**
1. The existing `predictNextMilestone` function and its output are unchanged
2. The primary prediction displays as a single line: `At current pace (30-day avg: [N]/day): [D MMM YYYY]`
   — where [N] = 30-day daily average formatted using Indian number format (e.g. 63,698)
   — where [D MMM YYYY] = predicted date in readable format (e.g. 13 May 2026), not ISO format
3. All existing unit tests for `predictNextMilestone` continue to pass without modification

**New YTD prediction — additive:**
4. A new function `predictNextMilestoneYTD` is added to `src/logic/milestoneLogic.js`
5. YTD daily average = total Jaap count from entries dated 1 Jan of current year to today ÷ number of those entries with count > 0 (Method B)
6. Entries with count = 0 are excluded from both the numerator and denominator
7. Prior year entries (before 1 Jan of current year) have no effect on the YTD calculation
8. The YTD prediction is shown only when ≥ 30 non-zero entry days exist in the current year
9. On 1 January (zero entries for new year), the YTD prediction is not shown
10. For a user who started after 1 Jan, the YTD prediction appears after their 30th non-zero entry day
11. On the 30th non-zero entry day, the YTD prediction appears for the first time — absent on the 29th
12. The YTD prediction displays as a single line: `At your [YYYY] pace ([N]/day YTD): [D MMM YYYY]`
    — where [YYYY] = current calendar year (e.g. 2026)
    — where [N] = YTD daily average formatted using Indian number format (e.g. 51,204)
    — where [D MMM YYYY] = predicted date in readable format (e.g. 22 Aug 2026), not ISO format
13. Both [N] values (30-day avg and YTD avg) use the existing `formatIndianNumber` utility — no new formatting logic needed
14. When the YTD prediction is absent (< 30 days), no blank space appears — primary prediction displays normally by itself
15. When both predictions are visible, the YTD line appears directly below the primary prediction
16. When both predictions show the same date, both lines still display separately with their distinct labels
17. The YTD predicted date recalculates correctly when a new entry is saved
18. The 31 Dec → 1 Jan boundary is handled gracefully — YTD prediction disappears cleanly, primary 30-day prediction continues unaffected
19. New unit tests for `predictNextMilestoneYTD` cover: normal use, the 29/30/31 entry day threshold, new year boundary, prior year isolation
20. The date format in both lines uses `D MMM YYYY` (e.g. `13 May 2026`) — the same readable format used in the Ledger rows — not the ISO `YYYY-MM-DD` format currently shown in the existing prediction

---

## Verdict: YES — Ready for Test Scenario Generation

Product decisions confirmed and requirement revised on 10 April 2026.
Scope: additive — existing 30-day prediction unchanged, new YTD prediction added alongside it.

**Exact display format confirmed:**
```
At current pace (30-day avg: 63,698/day): 13 May 2026
At your 2026 pace (51,204/day YTD): 22 Aug 2026
```

Pass the Improved Requirement and ACs 1–20 to the Test Scenario Agent.
