# Defect Reports — Reflection Card YTD Milestone Prediction

*Agent: Defect Logging Agent*
*Date: 11 April 2026*
*Feature: Reflection Card YTD Milestone Prediction*
*Branch: feature/ytd-milestone-prediction*

---

## DEF-RP-001

### 1. Defect ID
`DEF-RP-001`

### 2. Title
Reflection Card — Primary prediction average displayed in international format (`100,000/day`) instead of Indian format (`1,00,000/day`)

### 3. Severity
**Medium** — The predicted date and average value are mathematically correct. The defect is a display/formatting error only. No data is lost or corrupted. However, the app's entire number display contract is Indian format — this is a visible inconsistency on the most prominent card in the app.

### 4. Priority
**P2** — Should be fixed before release. Every user with a daily count ≥ 1 Lakh (1,00,000) will see the wrong format on the primary prediction line. The YTD line may have the same defect (see DEF-RP-002 if confirmed).

### 5. Detected In

| Field | Value |
|-------|-------|
| Run ID | RUN-RP-002 |
| Execution Log | docs/test-artifacts/execution/reflection-prediction-execution-RUN-RP-002.md |

All environment details (tester, date, browser, OS, branch, commit) are recorded in the execution log above.

### 6. Steps to Reproduce

1. Open the app at `http://localhost:5173`
2. Seed IndexedDB with 30 entries dated `2026-01-01` to `2026-01-30`, each with `count: 100000`
3. Seed one prior-year entry: `date: 2025-01-01`, `count: 6000000` (total lifetime = 9,000,000)
4. Reload the app
5. Scroll down to the Reflection Card
6. Locate the primary prediction line (first line in the prediction block)
7. Read the average value shown in the primary line

### 7. Expected Result
Primary prediction line reads:
```
At current pace (30-day avg: 1,00,000/day): [D MMM YYYY]
```
The average `100000` must be formatted using Indian number grouping: last 3 digits form the first group, then groups of 2 from the right → `1,00,000`.

Per Requirement AC13: *"Both [N] values (30-day avg and YTD avg) use the existing `formatIndianNumber` utility."*

### 8. Actual Result
Primary prediction line reads:
```
At current pace (30-day avg: 100,000/day): [D MMM YYYY]
```
International comma grouping is applied (groups of 3 from the right), producing `100,000` instead of `1,00,000`.

### 9. Root Cause Hypothesis
In `src/components/ReflectionCard.jsx`, the primary prediction line renders `prediction.averagePerDay` directly into the JSX without wrapping it in the `formatIndianNumber()` utility. The raw integer `100000` is then formatted by the browser's default locale (or a different formatter) which produces international grouping.

Likely offending line in `ReflectionCard.jsx`:
```jsx
At current pace (30-day avg: {prediction.averagePerDay}/day):
```
Should be:
```jsx
At current pace (30-day avg: {formatIndianNumber(prediction.averagePerDay)}/day):
```

### 10. Linked Artifacts

| Artifact | Reference |
|----------|-----------|
| Test Case | RP-026 |
| Requirement AC violated | AC2 (`primary line format correct`), AC13 (`formatIndianNumber used for both averages`) |
| Affected component | `src/components/ReflectionCard.jsx` — primary prediction line |
| Affected function | `predictNextMilestone` return value `averagePerDay` — not the function itself, but its consumer |

### 11. Suggested Fix
In `src/components/ReflectionCard.jsx`, wrap `prediction.averagePerDay` with `formatIndianNumber()` in the primary prediction line:
```jsx
{formatIndianNumber(prediction.averagePerDay)}/day
```
`formatIndianNumber` is already imported in this file — no new import needed. Verify the YTD line (`ytdPrediction.averagePerDay`) uses the same wrapper to prevent a sibling defect.

### 12. Status Tracking

| Field | Value |
|-------|-------|
| Status | Open |
| Detected in | RUN-RP-002 |
| Fixed in | — |
| Verified in | — |

### 13. Attachments
- Screenshot: `none` (hypothetical defect — for practice purposes)
- Console log: `none`
- Video: `none`

---

## Defect Summary

| Defect ID | Title | Severity | Priority | Detected In | Status |
|-----------|-------|----------|----------|-------------|--------|
| DEF-RP-001 | Reflection Card — Primary prediction average in international format instead of Indian format | Medium | P2 | Detected: RUN-RP-002 | Open |
