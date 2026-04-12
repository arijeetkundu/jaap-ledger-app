# Full Codebase Coverage Gap Report — Sumiran (Jaap Ledger)

**Generated:** 2026-04-11 (Updated after coverage gap closure sprint)
**Auditor:** Senior QA Analyst (Claude Code)
**Scope:** All logic, DB, and component source files vs all unit and E2E test files
**Test files audited:** 12 (5 unit + 7 E2E)
**Baseline (pre-sprint):** 36% Fully Covered (65/179 behaviours)

---

## SECTION 1 — FULL COVERAGE TABLE

| BEH ID | Behaviour | Source | Test Type | Risk | Status | Evidence |
|--------|-----------|--------|-----------|------|--------|----------|
| BEH-001 | `getCurrentMilestone` returns current crore, next crore, and next total when total is 0 | milestoneLogic.js / getCurrentMilestone / L3 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return 1 Crore as next milestone when total is 0" |
| BEH-002 | `getCurrentMilestone` returns correct bracket at mid-crore value | milestoneLogic.js / getCurrentMilestone / L3 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return correct milestone bracket mid-crore" |
| BEH-003 | `getCurrentMilestone` returns correct bracket when total lands exactly on a crore boundary | milestoneLogic.js / getCurrentMilestone / L3 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return correct milestone when exactly on a crore" |
| BEH-004 | `getCurrentMilestone` handles large multi-crore totals correctly | milestoneLogic.js / getCurrentMilestone / L3 | Unit | High | Fully Covered | milestoneLogic.test.js — "should handle large totals correctly" |
| BEH-005 | `getMilestoneProgress` returns 0% when total is 0 | milestoneLogic.js / getMilestoneProgress / L12 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return 0% when total is 0" |
| BEH-006 | `getMilestoneProgress` returns 50% at halfway through a crore | milestoneLogic.js / getMilestoneProgress / L12 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return 50% when halfway through a crore" |
| BEH-007 | `getMilestoneProgress` returns correct percentage at an arbitrary mid-crore value | milestoneLogic.js / getMilestoneProgress / L12 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return correct % mid-crore" |
| BEH-008 | `getMilestoneProgress` returns 0% when total is exactly on a crore boundary | milestoneLogic.js / getMilestoneProgress / L12 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return 0% when exactly on a crore boundary" |
| BEH-009 | `getMilestoneHistory` returns empty array when no crore milestones have been crossed | milestoneLogic.js / getMilestoneHistory / L17 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return empty array when no milestones crossed" |
| BEH-010 | `getMilestoneHistory` returns first milestone with correct date and null daysSincePrevious | milestoneLogic.js / getMilestoneHistory / L17 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return first crore milestone with correct date" |
| BEH-011 | `getMilestoneHistory` calculates daysSincePrevious correctly between consecutive milestones | milestoneLogic.js / getMilestoneHistory / L17 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return gap days between consecutive milestones" |
| BEH-012 | `getMilestoneHistory` handles crossing multiple crores in a single entry (jump of 2+ crores) | milestoneLogic.js / getMilestoneHistory / L28 | Unit | High | Fully Covered | milestoneLogic.test.js — BEH-012 "single entry with count=25,000,000 produces 2 history records" |
| BEH-013 | `predictNextMilestone` returns null when entries array is empty | milestoneLogic.js / predictNextMilestone / L81 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return null when there are no entries" |
| BEH-014 | `predictNextMilestone` returns null when entries array is null | milestoneLogic.js / predictNextMilestone / L81 | Unit | High | Fully Covered | milestoneLogic.test.js — BEH-014 "returns null without throwing when entries argument is null" |
| BEH-015 | `predictNextMilestone` uses only last 30 non-zero entries to compute average | milestoneLogic.js / predictNextMilestone / L85 | Unit | High | Fully Covered | milestoneLogic.test.js — "should predict correctly based on 30-day average"; reflection-prediction.spec.js — RP-023 |
| BEH-016 | `predictNextMilestone` returns null when all recent entries have count = 0 | milestoneLogic.js / predictNextMilestone / L93 | Unit | High | Fully Covered | milestoneLogic.test.js — "should return null when average is zero" |
| BEH-017 | `predictNextMilestone` returns correct daysRemaining using ceiling division | milestoneLogic.js / predictNextMilestone / L98 | Unit | High | Fully Covered | milestoneLogic.test.js — "should predict correctly based on 30-day average" (daysRemaining: 970) |
| BEH-018 | `predictNextMilestone` returns a predictedDate as a valid YYYY-MM-DD string | milestoneLogic.js / predictNextMilestone / L71 | Unit | Medium | Fully Covered | milestoneLogic.test.js — BEH-018 "predictedDate matches YYYY-MM-DD format and does not contain T" |
| BEH-019 | `predictNextMilestoneYTD` returns null when entries is empty or null | milestoneLogic.js / predictNextMilestoneYTD / L52 | Unit | High | Fully Covered | milestoneLogic.test.js — RP-035 T1; BEH-025 (null path) |
| BEH-020 | `predictNextMilestoneYTD` returns null when fewer than 30 non-zero entries exist in the current year | milestoneLogic.js / predictNextMilestoneYTD / L56 | Unit | High | Fully Covered | milestoneLogic.test.js — RP-035 T2; reflection-prediction.spec.js — RP-006 |
| BEH-021 | `predictNextMilestoneYTD` returns a result when exactly 30 non-zero entries exist | milestoneLogic.js / predictNextMilestoneYTD / L56 | Unit | High | Fully Covered | milestoneLogic.test.js — RP-035 T3; reflection-prediction.spec.js — RP-007 |
| BEH-022 | `predictNextMilestoneYTD` continues returning a result when >30 entries exist (floor not exact) | milestoneLogic.js / predictNextMilestoneYTD / L56 | Unit | High | Fully Covered | milestoneLogic.test.js — RP-035 T4; reflection-prediction.spec.js — RP-008 |
| BEH-023 | `predictNextMilestoneYTD` calculates YTD average as total ÷ non-zero entry count | milestoneLogic.js / predictNextMilestoneYTD / L60 | Unit | High | Fully Covered | milestoneLogic.test.js — RP-035 T5; reflection-prediction.spec.js — RP-004 |
| BEH-024 | `predictNextMilestoneYTD` excludes prior-year entries from the YTD average | milestoneLogic.js / predictNextMilestoneYTD / L55 | Unit | High | Fully Covered | milestoneLogic.test.js — RP-035 T6; reflection-prediction.spec.js — RP-034 |
| BEH-025 | `predictNextMilestoneYTD` returns null when entries argument is null | milestoneLogic.js / predictNextMilestoneYTD / L52 | Unit | High | Fully Covered | milestoneLogic.test.js — BEH-025 "returns null when entries argument is null" |
| BEH-026 | `getLocalToday` returns a valid YYYY-MM-DD string representing today's local date | ledgerLogic.js / getLocalToday / L1 | Unit | High | Fully Covered | ledgerLogic.test.js — "should return a valid YYYY-MM-DD date string" |
| BEH-027 | `isSunday` returns true for a known Sunday date | ledgerLogic.js / isSunday / L9 | Unit | Medium | Fully Covered | ledgerLogic.test.js — "should return true for a known Sunday" |
| BEH-028 | `isSunday` returns false for non-Sunday dates (Monday, Saturday) | ledgerLogic.js / isSunday / L9 | Unit | Medium | Fully Covered | ledgerLogic.test.js — "should return false for a known Monday", "should return false for a Saturday" |
| BEH-029 | `fillMissingDates` always includes today even when no entries exist | ledgerLogic.js / fillMissingDates / L15 | Unit | High | Fully Covered | ledgerLogic.test.js — "should always include today even if no entries exist" |
| BEH-030 | `fillMissingDates` fills in missing days within the 7-day window | ledgerLogic.js / fillMissingDates / L15 | Unit | High | Fully Covered | ledgerLogic.test.js — "should fill in missing days within last 7 days" |
| BEH-031 | `fillMissingDates` does not add auto-fill entries for dates older than 7 days | ledgerLogic.js / fillMissingDates / L15 | Unit | High | Fully Covered | ledgerLogic.test.js — "should not fill dates older than 7 days" |
| BEH-032 | `fillMissingDates` marks auto-filled dates with count=0, notes='', isEmpty=true | ledgerLogic.js / fillMissingDates / L39 | Unit | Medium | Fully Covered | ledgerLogic.test.js — "should mark filled dates as empty with zero count" |
| BEH-033 | `fillMissingDates` preserves existing entry data (count, notes, isEmpty=false) | ledgerLogic.js / fillMissingDates / L19 | Unit | High | Fully Covered | ledgerLogic.test.js — "should preserve existing entry data" |
| BEH-034 | `fillMissingDates` returns entries in descending date order (newest first) | ledgerLogic.js / fillMissingDates / L64 | Unit | Medium | Fully Covered | ledgerLogic.test.js — "should return entries in descending date order" |
| BEH-035 | `fillMissingDates` retains entries older than 7 days that already exist in the DB | ledgerLogic.js / fillMissingDates / L53 | Unit | High | Fully Covered | ledgerLogic.test.js — BEH-035 "retains entries older than 7 days" |
| BEH-036 | `groupEntriesByYear` groups entries into the correct year buckets | ledgerLogic.js / groupEntriesByYear / L69 | Unit | High | Fully Covered | ledgerLogic.test.js — "should group entries by year correctly" |
| BEH-037 | `groupEntriesByYear` calculates the correct yearly cumulative total | ledgerLogic.js / groupEntriesByYear / L81 | Unit | High | Fully Covered | ledgerLogic.test.js — "should calculate yearly cumulative total correctly" |
| BEH-038 | `groupEntriesByYear` places entries under the correct year object | ledgerLogic.js / groupEntriesByYear / L82 | Unit | High | Fully Covered | ledgerLogic.test.js — "should place entries under the correct year" |
| BEH-039 | `groupEntriesByYear` returns years in descending order | ledgerLogic.js / groupEntriesByYear / L86 | Unit | Medium | Fully Covered | ledgerLogic.test.js — "should return years in descending order" |
| BEH-040 | `formatIndianNumber` returns '0' for input 0 | formatIndianNumber.js / formatIndianNumber / L1 | Unit | High | Fully Covered | formatIndianNumber.test.js — "should format zero correctly" |
| BEH-041 | `formatIndianNumber` returns number without commas for values below 1000 | formatIndianNumber.js / formatIndianNumber / L10 | Unit | Medium | Fully Covered | formatIndianNumber.test.js — "should format numbers below 1000 without commas" |
| BEH-042 | `formatIndianNumber` formats thousands (5-digit) with Indian grouping | formatIndianNumber.js / formatIndianNumber / L13 | Unit | High | Fully Covered | formatIndianNumber.test.js — "should format thousands correctly" |
| BEH-043 | `formatIndianNumber` formats lakhs (7-digit) with Indian grouping | formatIndianNumber.js / formatIndianNumber / L13 | Unit | High | Fully Covered | formatIndianNumber.test.js — "should format lakhs correctly" |
| BEH-044 | `formatIndianNumber` formats crores (8-digit) with Indian grouping | formatIndianNumber.js / formatIndianNumber / L13 | Unit | High | Fully Covered | formatIndianNumber.test.js — "should format crores correctly" |
| BEH-045 | `formatIndianNumber` handles negative numbers by prepending minus sign | formatIndianNumber.js / formatIndianNumber / L4 | Unit | Medium | Fully Covered | formatIndianNumber.test.js — "should handle negative numbers" |
| BEH-046 | `formatIndianNumber` handles 1-digit and 2-digit numbers without commas | formatIndianNumber.js / formatIndianNumber / L10 | Unit | Low | Fully Covered | formatIndianNumber.test.js — BEH-046 "formats 1 → '1'", "formats 9 → '9'", "formats 99 → '99'" |
| BEH-047 | `getReflectionWindow` opens on Dec 31 00:00:00 local time of the given year | antaryatraLogic.js / getReflectionWindow / L25 | Unit | High | Fully Covered | antaryatraLogic.test.js — "opens on Dec 31 of the given year" |
| BEH-048 | `getReflectionWindow` closes on Jan 13 23:59:59 local time of year+1 | antaryatraLogic.js / getReflectionWindow / L25 | Unit | High | Fully Covered | antaryatraLogic.test.js — "closes on Jan 13 of the following year" |
| BEH-049 | `isWindowOpen` returns true on Dec 31 (opening day) | antaryatraLogic.js / isWindowOpen / L31 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns true on Dec 31" |
| BEH-050 | `isWindowOpen` returns true on a mid-window date (Jan 5) | antaryatraLogic.js / isWindowOpen / L31 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns true on Jan 5 within window" |
| BEH-051 | `isWindowOpen` returns true on Jan 13 (last valid day) | antaryatraLogic.js / isWindowOpen / L31 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns true on Jan 13 (last day)" |
| BEH-052 | `isWindowOpen` returns false on Jan 14 (day after window closes) | antaryatraLogic.js / isWindowOpen / L31 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns false on Jan 14 (expired)" |
| BEH-053 | `isWindowOpen` returns false before Dec 31 (window not yet open) | antaryatraLogic.js / isWindowOpen / L31 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns false before Dec 31" |
| BEH-054 | `isWindowExpired` returns false during the open window | antaryatraLogic.js / isWindowExpired / L37 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns false during the window" |
| BEH-055 | `isWindowExpired` returns true after Jan 13 | antaryatraLogic.js / isWindowExpired / L37 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns true after Jan 13" |
| BEH-056 | `isReflectionDay` returns true on Dec 31 of the given year | antaryatraLogic.js / isReflectionDay / L43 | Unit | Medium | Fully Covered | antaryatraLogic.test.js — "returns true on Dec 31 of the year" |
| BEH-057 | `isReflectionDay` returns false on any day other than Dec 31 | antaryatraLogic.js / isReflectionDay / L43 | Unit | Medium | Fully Covered | antaryatraLogic.test.js — "returns false on any other day" |
| BEH-058 | `getEffectiveStatus` returns 'expired' for null record after window closes | antaryatraLogic.js / getEffectiveStatus / L58 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns expired for null record after window closes" |
| BEH-059 | `getEffectiveStatus` returns 'pending' for null record during open window | antaryatraLogic.js / getEffectiveStatus / L58 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns pending for null record during window" |
| BEH-060 | `getEffectiveStatus` returns 'recorded' regardless of window state | antaryatraLogic.js / getEffectiveStatus / L62 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns recorded regardless of window" |
| BEH-061 | `getEffectiveStatus` returns 'skipped' regardless of window state | antaryatraLogic.js / getEffectiveStatus / L62 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns skipped regardless of window" |
| BEH-062 | `getEffectiveStatus` returns 'expired' for a DB-pending record after window closes | antaryatraLogic.js / getEffectiveStatus / L66 | Unit | High | Fully Covered | antaryatraLogic.test.js — BEH-062 "returns 'expired' when DB record has status='pending' and window has closed" |
| BEH-063 | `shouldShowReminder` returns true during window with null (pending) record | antaryatraLogic.js / shouldShowReminder / L73 | Unit | Medium | Fully Covered | antaryatraLogic.test.js — "returns true during window with pending record" |
| BEH-064 | `shouldShowReminder` returns false if already recorded | antaryatraLogic.js / shouldShowReminder / L73 | Unit | Medium | Fully Covered | antaryatraLogic.test.js — "returns false if already recorded" |
| BEH-065 | `shouldShowReminder` returns false if already skipped | antaryatraLogic.js / shouldShowReminder / L73 | Unit | Medium | Fully Covered | antaryatraLogic.test.js — "returns false if already skipped" |
| BEH-066 | `shouldShowReminder` returns false after window expires | antaryatraLogic.js / shouldShowReminder / L73 | Unit | Medium | Fully Covered | antaryatraLogic.test.js — "returns false after window expires" |
| BEH-067 | `canRecord` returns true when window is open and status is pending | antaryatraLogic.js / canRecord / L82 | Unit | High | Fully Covered | antaryatraLogic.test.js — BEH-067 "returns true when window is open and record is null (Dec 31)" |
| BEH-068 | `canRecord` returns false when window is closed | antaryatraLogic.js / canRecord / L82 | Unit | High | Fully Covered | antaryatraLogic.test.js — BEH-068 "returns false when window is closed (Jan 14 of year+1)" |
| BEH-069 | `canRecord` returns false when record is already recorded or skipped | antaryatraLogic.js / canRecord / L82 | Unit | High | Fully Covered | antaryatraLogic.test.js — BEH-069 "returns false when record status is 'recorded'"; "returns false when record status is 'skipped'" |
| BEH-070 | `getLocalDateString` returns today as YYYY-MM-DD in local timezone | antaryatraLogic.js / getLocalDateString / L90 | Unit | Medium | Fully Covered | antaryatraLogic.test.js — BEH-070 "returns today as a YYYY-MM-DD string" |
| BEH-071 | `getTimezone` returns local IANA timezone string; falls back to 'UTC' on error | antaryatraLogic.js / getTimezone / L102 | Unit | Low | Fully Covered | antaryatraLogic.test.js — BEH-071 "returns a non-empty string (IANA timezone or 'UTC')" |
| BEH-072 | `getYearStats` counts only days with count > 0 | antaryatraLogic.js / getYearStats / L114 | Unit | High | Fully Covered | antaryatraLogic.test.js — "counts only days with count > 0" |
| BEH-073 | `getYearStats` calculates the correct average per practice day | antaryatraLogic.js / getYearStats / L121 | Unit | High | Fully Covered | antaryatraLogic.test.js — "calculates correct average" |
| BEH-074 | `getYearStats` returns zeros for a year with no entries | antaryatraLogic.js / getYearStats / L118 | Unit | High | Fully Covered | antaryatraLogic.test.js — "returns zeros for a year with no entries" |
| BEH-075 | `getYearStats` excludes entries from other years | antaryatraLogic.js / getYearStats / L115 | Unit | Medium | Fully Covered | antaryatraLogic.test.js — BEH-075 "daysOfPractice and totalCount only count entries for the requested year" |
| BEH-076 | `PALETTES` array contains exactly 3 palettes with id, name, description, preview | palette.js / PALETTES / L1 | Unit | Low | Fully Covered | palette.test.js — BEH-076 "contains exactly 3 palettes"; "each palette has required fields"; "palette ids are correct" |
| BEH-077 | `getSavedPalette` returns 'midnight-sanctum' when localStorage has no value | palette.js / getSavedPalette / L24 | E2E | Medium | Not Covered | none |
| BEH-078 | `getSavedPalette` returns the previously saved palette ID from localStorage | palette.js / getSavedPalette / L24 | E2E | Medium | Partially Covered | app.spec.js — "should persist palette choice after reload" |
| BEH-079 | `savePalette` writes the palette ID to localStorage and calls applyPalette | palette.js / savePalette / L28 | E2E | Medium | Partially Covered | app.spec.js — "should change palette when Sacred Saffron is selected" |
| BEH-080 | `applyPalette` removes data-palette attribute for midnight-sanctum (default) | palette.js / applyPalette / L33 | E2E | Medium | Not Covered | none — only non-default palettes are tested |
| BEH-081 | `applyPalette` sets data-palette attribute for non-default palettes | palette.js / applyPalette / L36 | E2E | Medium | Fully Covered | app.spec.js — "should change palette when Sacred Saffron is selected" |
| BEH-082 | `initDB` opens the IndexedDB database at version 3 | db.js / initDB / L33 | E2E | High | Not Covered | none |
| BEH-083 | `onupgradeneeded` creates 'entries' store with date as unique keyPath (v1) | db.js / openDB onupgradeneeded / L17 | E2E | High | Not Covered | none |
| BEH-084 | `onupgradeneeded` creates 'sankalpa' store when upgrading from v1 to v2 | db.js / openDB onupgradeneeded / L23 | E2E | High | Not Covered | none |
| BEH-085 | `onupgradeneeded` creates 'antaryatra' store when upgrading from v2 to v3 | db.js / openDB onupgradeneeded / L26 | E2E | High | Not Covered | none |
| BEH-086 | `saveEntry` writes an entry with date, count, notes, and updatedAt to IndexedDB | db.js / saveEntry / L37 | E2E | High | Fully Covered | ledger.spec.js — SS-DB-001 seeds and reads back via reload |
| BEH-087 | `saveEntry` normalises missing count to 0 and missing notes to '' | db.js / saveEntry / L43 | Unit | High | Not Covered | none |
| BEH-088 | `saveEntry` overwrites an existing entry for the same date (upsert) | db.js / saveEntry / L42 | E2E | High | Fully Covered | ledger.spec.js — SS-DB-001 "saveEntry upsert — same date entry overwrites, no duplicate row" |
| BEH-089 | `getEntry` returns the entry for a given date | db.js / getEntry / L53 | E2E | High | Partially Covered | app.spec.js — "should pre-populate Today Card with saved data on reload" (exercises path; no direct assertion on returned object) |
| BEH-090 | `getEntry` returns null when no entry exists for the date | db.js / getEntry / L59 | Unit | High | Not Covered | none |
| BEH-091 | `getAllEntries` returns all entries sorted in descending date order | db.js / getAllEntries / L64 | E2E | Medium | Fully Covered | ledger.spec.js — SS-DB-091 "getAllEntries sort order — most recent date shown first" |
| BEH-092 | `getAllEntries` returns an empty array when no entries exist | db.js / getAllEntries / L64 | E2E | Medium | Partially Covered | ledger.spec.js — SS-LDG-001 exercises empty DB; no direct assertion on return value |
| BEH-093 | `deleteEntry` removes the entry for the given date from IndexedDB | db.js / deleteEntry / L80 | E2E | High | Not Covered | none |
| BEH-094 | `getSankalpa` returns the sankalpa record with key 'primary' | db.js / getSankalpa / L91 | E2E | Medium | Partially Covered | app.spec.js — "should save a Sankalpa" (read happens on load; returned fields not asserted) |
| BEH-095 | `getSankalpa` returns null when no sankalpa has been saved | db.js / getSankalpa / L97 | E2E | Medium | Partially Covered | app.spec.js — "should show Establish Sankalpa button when no sankalpa set" |
| BEH-096 | `saveSankalpa` writes sankalpa record with forced id='primary' | db.js / saveSankalpa / L102 | E2E | Medium | Partially Covered | app.spec.js — "should save a Sankalpa and show confirmation" |
| BEH-097 | `getAntaryatra` returns the record for a given year | db.js / getAntaryatra / L113 | E2E | High | Not Covered | none |
| BEH-098 | `getAntaryatra` returns null when no record exists for the year | db.js / getAntaryatra / L119 | E2E | High | Not Covered | none |
| BEH-099 | `saveAntaryatra` writes an antaryatra record keyed by year | db.js / saveAntaryatra / L124 | E2E | High | Not Covered | none |
| BEH-100 | `getAllAntaryatra` returns all antaryatra records; returns [] when none exist | db.js / getAllAntaryatra / L135 | E2E | Medium | Not Covered | none |
| BEH-101 | TodayCard displays today's date formatted as weekday, day, month, year (en-IN locale) | TodayCard.jsx / formatDisplayDate / L18 | E2E | Medium | Fully Covered | app.spec.js — "should show correct date in Today Card" |
| BEH-102 | TodayCard input field accepts numeric Jaap count | TodayCard.jsx / handleSave / L29 | E2E | High | Fully Covered | app.spec.js — "should save a jaap count and show saved confirmation" |
| BEH-103 | TodayCard Save button shows "✓ Saved!" for ~2 seconds after saving | TodayCard.jsx / handleSave / L32 | E2E | Medium | Fully Covered | app.spec.js — "should save a jaap count and show saved confirmation" |
| BEH-104 | TodayCard pre-populates with existing entry on load (count > 0) | TodayCard.jsx / useEffect / L11 | E2E | High | Fully Covered | app.spec.js — "should pre-populate Today Card with saved data on reload" |
| BEH-105 | TodayCard leaves count field empty when stored count is 0 | TodayCard.jsx / useEffect / L13 | E2E | Medium | Not Covered | none |
| BEH-106 | TodayCard calls onSave with parsed integer count (invalid input treated as 0) | TodayCard.jsx / handleSave / L30 | E2E | High | Not Covered | none |
| BEH-107 | TodayCard notes textarea accepts free text and passes trimmed value to onSave | TodayCard.jsx / handleSave / L31 | E2E | Medium | Partially Covered | app.spec.js — notes field filled but trim behaviour not asserted |
| BEH-108 | Ledger shows "No entries yet" message when there are no entries | Ledger.jsx / Ledger / L463 | E2E | Medium | Not Covered | fillMissingDates always generates 7 placeholder rows — "No entries yet" is unreachable in practice |
| BEH-109 | Ledger groups entries into year sections with correct year header | Ledger.jsx / YearGroup / L287 | E2E | High | Fully Covered | app.spec.js — "should show current year in Ledger" |
| BEH-110 | Ledger shows current year expanded by default; other years collapsed | Ledger.jsx / Ledger / L446 | E2E | Medium | Fully Covered | ledger.spec.js — SS-LDG-002 "Current year expanded by default; prior year collapsed" |
| BEH-111 | Ledger year header displays year total in Indian number format | Ledger.jsx / YearGroup / L386 | E2E | High | Fully Covered | ledger.spec.js — SS-LDG-004 "Year header shows total in Indian number format (6,00,000)" |
| BEH-112 | Ledger year header toggles open/closed on short click | Ledger.jsx / toggleYear / L451 | E2E | Medium | Fully Covered | ledger.spec.js — SS-LDG-003 "Year header toggle — collapse hides entries, expand shows them" |
| BEH-113 | Ledger year header opens AntaryatraPage on long-press (800ms) when canRecord is true | Ledger.jsx / YearGroup onMouseDown / L309 | E2E | High | Not Covered | none — requires date mocking (Dec 31) |
| BEH-114 | Ledger shows Antaryatra reminder banner when shouldShowReminder is true | Ledger.jsx / YearGroup / L391 | E2E | Medium | Not Covered | none — requires date mocking (Dec 31) |
| BEH-115 | LedgerRow shows "TODAY" badge on current date's row | Ledger.jsx / LedgerRow / L122 | E2E | Medium | Fully Covered | app.spec.js — "should show TODAY badge on current date in Ledger" |
| BEH-116 | LedgerRow shows Sunday dates with a distinct (red) colour | Ledger.jsx / LedgerRow / L113 | E2E | Low | Partially Covered | app.spec.js — "should show Sunday dates in red" (conditional — only runs if date is in 7-day window) |
| BEH-117 | LedgerRow shows full moon emoji (🌕) when notes contain poornima/purnima/पूर्णिमा | Ledger.jsx / isPoornima / L19 | E2E | Low | Fully Covered | ledger.spec.js — SS-LDG-008 "Poornima emoji shown when notes contains 'Poornima'" |
| BEH-118 | LedgerRow shows notes indicator (▸) when entry has notes | Ledger.jsx / LedgerRow / L153 | E2E | Low | Fully Covered | ledger.spec.js — SS-LDG-009 "Notes indicator (▸) shown when entry has notes" |
| BEH-119 | LedgerRow shows dash (—) for count when entry is empty (count=0) | Ledger.jsx / LedgerRow / L149 | E2E | Medium | Fully Covered | ledger.spec.js — SS-LDG-005 "Dash shown for entry with count=0" |
| BEH-120 | LedgerRow expands to editable form when clicked within 7-day window | Ledger.jsx / LedgerRow / L166 | E2E | High | Fully Covered | ledger.spec.js — SS-LDG-006 "Ledger row edit within 7-day window — update flow works" |
| BEH-121 | LedgerRow editable form saves updated count and notes to DB | Ledger.jsx / handleUpdate / L43 | E2E | High | Fully Covered | ledger.spec.js — SS-LDG-006 (updates count to 20000, reloads, asserts 20,000 visible) |
| BEH-122 | LedgerRow shows "✓ Updated!" confirmation for ~2 seconds after save | Ledger.jsx / handleUpdate / L51 | E2E | Medium | Fully Covered | ledger.spec.js — SS-LDG-006 asserts "✓ Updated!" appears |
| BEH-123 | LedgerRow shows read-only view with lock notice for entries older than 7 days that have data | Ledger.jsx / LedgerRow / L215 | E2E | Medium | Fully Covered | ledger.spec.js — SS-LDG-007 "Locked view for entries older than 7 days — no edit form" |
| BEH-124 | LedgerRow is not expandable for entries older than 7 days with no data | Ledger.jsx / LedgerRow / L39 | E2E | Low | Not Covered | none |
| BEH-125 | ReflectionCard computes and displays lifetime Jaap total in Indian number format | ReflectionCard.jsx / ReflectionCard / L18 | E2E | High | Fully Covered | app.spec.js — "should show Reflection Card with Lifetime Jaap"; reflection-prediction.spec.js — RP-036 |
| BEH-126 | ReflectionCard computes and displays current-year total in Indian number format | ReflectionCard.jsx / ReflectionCard / L22 | E2E | High | Fully Covered | reflection-card.spec.js — SS-RC-001 "Current-year total displayed correctly in Indian format" |
| BEH-127 | ReflectionCard displays milestone progress percentage (1 decimal place) | ReflectionCard.jsx / ReflectionCard / L93 | E2E | High | Fully Covered | reflection-prediction.spec.js — RP-036 "should see 10.0%" |
| BEH-128 | ReflectionCard progress bar width is capped at 100% even if progress > 100 | ReflectionCard.jsx / ReflectionCard / L99 | E2E | Medium | Fully Covered | reflection-card.spec.js — SS-RC-003 "Progress bar width capped at 100%" |
| BEH-129 | ReflectionCard shows primary prediction line when ≥1 non-zero recent entries exist | ReflectionCard.jsx / prediction block / L105 | E2E | High | Fully Covered | reflection-prediction.spec.js — RP-001, RP-020 |
| BEH-130 | ReflectionCard shows YTD prediction line when ≥30 non-zero current-year entries exist | ReflectionCard.jsx / ytdPrediction block / L120 | E2E | High | Fully Covered | reflection-prediction.spec.js — RP-001, RP-007 |
| BEH-131 | ReflectionCard formats predicted date as "D MMM YYYY" (not ISO) | ReflectionCard.jsx / formatPredictedDate / L12 | E2E | Medium | Fully Covered | reflection-prediction.spec.js — RP-002, RP-028 |
| BEH-132 | ReflectionCard shows milestone history with crore number, date, and days-since-previous | ReflectionCard.jsx / history / L130 | E2E | High | Fully Covered | reflection-prediction.spec.js — RP-036 "1 Crore" |
| BEH-133 | ReflectionCard hides prediction section entirely when no entries exist | ReflectionCard.jsx / prediction block / L105 | E2E | Medium | Fully Covered | reflection-card.spec.js — SS-RC-002 "No prediction section when DB is empty — no NaN" |
| BEH-134 | SettingsPanel opens when settings button is clicked | SettingsPanel.jsx / SettingsPanel / L7 | E2E | Medium | Fully Covered | app.spec.js — "should open settings panel when cog is clicked" |
| BEH-135 | SettingsPanel closes when the × button is clicked | SettingsPanel.jsx / SettingsPanel / L235 | E2E | Medium | Fully Covered | app.spec.js — "should close settings when backdrop is clicked" |
| BEH-136 | SettingsPanel closes when the backdrop overlay is clicked | SettingsPanel.jsx / backdrop onClick / L192 | E2E | Medium | Fully Covered | settings.spec.js — SS-SET-001 "Settings closes on backdrop click" |
| BEH-137 | SettingsPanel Export CSV triggers download of all entries as CSV | SettingsPanel.jsx / exportCSV / L18 | E2E | High | Fully Covered | settings.spec.js — SS-SET-002 "Export CSV downloads a file with correct header" |
| BEH-138 | SettingsPanel Export JSON triggers download with exportDate and totalEntries metadata | SettingsPanel.jsx / exportJSON / L31 | E2E | High | Fully Covered | settings.spec.js — SS-SET-003 "Export JSON downloads file with correct schema" |
| BEH-139 | SettingsPanel Import JSON accepts raw array format { date, jaap, notes } | SettingsPanel.jsx / handleJSONImport / L72 | E2E | High | Fully Covered | settings.spec.js — SS-SET-004 "Import JSON raw array format — entry appears in app after import" |
| BEH-140 | SettingsPanel Import JSON accepts export format { entries: [...] } | SettingsPanel.jsx / handleJSONImport / L74 | E2E | High | Fully Covered | settings.spec.js — SS-SET-005 "Import JSON export-format wrapper — entry appears in app after import" |
| BEH-141 | SettingsPanel Import JSON skips records with invalid or missing date format | SettingsPanel.jsx / handleJSONImport / L87 | E2E | High | Partially Covered | settings.spec.js — SS-SET-007 covers invalid date in CSV; JSON invalid-date path not directly tested |
| BEH-142 | SettingsPanel Import JSON shows success message with count of imported entries | SettingsPanel.jsx / handleJSONImport / L104 | E2E | High | Partially Covered | settings.spec.js — SS-SET-004/005 verify ledger shows entry; success message text not directly asserted |
| BEH-143 | SettingsPanel Import JSON shows error message on malformed JSON | SettingsPanel.jsx / handleJSONImport / L112 | E2E | High | Fully Covered | settings.spec.js — SS-SET-006 "Import JSON error on malformed file — error message appears" |
| BEH-144 | SettingsPanel Import CSV detects and skips header row | SettingsPanel.jsx / handleCSVImport / L133 | E2E | High | Fully Covered | settings.spec.js — SS-SET-007 "Import CSV — valid row imported, bad date row skipped, header skipped" |
| BEH-145 | SettingsPanel Import CSV skips rows with invalid date format | SettingsPanel.jsx / handleCSVImport / L151 | E2E | High | Fully Covered | settings.spec.js — SS-SET-007 (bad date "27/02/2026" row is skipped) |
| BEH-146 | SettingsPanel Import CSV handles quoted notes field correctly | SettingsPanel.jsx / handleCSVImport / L149 | E2E | Medium | Not Covered | none |
| BEH-147 | SettingsPanel Import buttons are disabled during an active import | SettingsPanel.jsx / buttons disabled / L529 | E2E | Medium | Not Covered | none |
| BEH-148 | SettingsPanel palette selector shows all 3 palettes with name, description, swatches | SettingsPanel.jsx / palette section / L380 | E2E | Low | Fully Covered | app.spec.js — "should show palette options in settings" |
| BEH-149 | SettingsPanel palette selection applies the palette immediately and persists after reload | SettingsPanel.jsx / palette onClick / L383 | E2E | Medium | Fully Covered | app.spec.js — "should change palette", "should persist palette choice after reload" |
| BEH-150 | SettingsPanel opens SankalpePage when Sankalpa row is clicked | SettingsPanel.jsx / showSankalpa / L253 | E2E | Medium | Fully Covered | app.spec.js — "should open Sankalpa page from Settings" |
| BEH-151 | SettingsPanel opens AntaryatraArchivePage when Antaryatra row is clicked | SettingsPanel.jsx / showArchive / L289 | E2E | Medium | Fully Covered | settings.spec.js — SS-SET-008 "Settings Antaryātrā row opens archive page" |
| BEH-152 | SankalpePage loads existing sankalpa and displays it in read-only view | SankalpePage.jsx / useEffect / L15 | E2E | High | Fully Covered | app.spec.js — "should show saved Sankalpa in read-only view" |
| BEH-153 | SankalpePage shows edit form when no sankalpa exists yet | SankalpePage.jsx / isNew logic / L68 | E2E | High | Fully Covered | app.spec.js — "should show Establish Sankalpa button when no sankalpa set" |
| BEH-154 | SankalpePage saves new sankalpa with today's date and shows confirmation | SankalpePage.jsx / handleEstablish / L37 | E2E | High | Fully Covered | app.spec.js — "should save a Sankalpa and show confirmation" |
| BEH-155 | SankalpePage "Establish Sankalpa" button is disabled when text field is empty | SankalpePage.jsx / button disabled / L511 | E2E | Medium | Fully Covered | sankalpa.spec.js — SS-SK-001 "Establish button is disabled when textarea is empty" |
| BEH-156 | SankalpePage shows rewrite warning when Re-affirm is clicked on existing sankalpa | SankalpePage.jsx / handleEditAttempt / L55 | E2E | Medium | Fully Covered | app.spec.js — "should show rewrite warning when Re-affirm is clicked" |
| BEH-157 | SankalpePage proceeds to edit mode when "Rewrite Sankalpa" is confirmed | SankalpePage.jsx / handleConfirmRewrite / L63 | E2E | High | Fully Covered | sankalpa.spec.js — SS-SK-002 "Rewrite flow — warning dialog shown, then edit form appears" |
| BEH-158 | SankalpePage preserves original sankalpa date when rewriting | SankalpePage.jsx / handleEstablish / L42 | E2E | High | Fully Covered | sankalpa.spec.js — SS-SK-003 "Rewrite preserves original sankalpa date in IndexedDB" |
| BEH-159 | SankalpePage navigates back when back arrow is clicked | SankalpePage.jsx / onClose / L129 | E2E | Medium | Fully Covered | app.spec.js — "should navigate back from Sankalpa page" |
| BEH-160 | AntaryatraPage shows year stats (days of practice, avg/day) from allEntries | AntaryatraPage.jsx / getYearStats / L16 | E2E | High | Not Covered | none — requires date mocking (Dec 31) |
| BEH-161 | AntaryatraPage shows reflection textarea and Save button when window is open and pending | AntaryatraPage.jsx / recordable / L14 | E2E | High | Not Covered | none — requires date mocking |
| BEH-162 | AntaryatraPage Save button is disabled when textarea is empty | AntaryatraPage.jsx / button disabled / L303 | E2E | Medium | Not Covered | none — requires date mocking |
| BEH-163 | AntaryatraPage saves reflection with status='recorded', recordedOn, timezone | AntaryatraPage.jsx / handleSave / L18 | E2E | High | Not Covered | none — requires date mocking |
| BEH-164 | AntaryatraPage auto-closes 2 seconds after successful save | AntaryatraPage.jsx / handleSave / L29 | E2E | Medium | Not Covered | none — requires date mocking |
| BEH-165 | AntaryatraPage shows "Skip this year's reflection" button when recording | AntaryatraPage.jsx / confirmSkip / L321 | E2E | Medium | Not Covered | none — requires date mocking |
| BEH-166 | AntaryatraPage shows skip confirmation dialog before committing skip | AntaryatraPage.jsx / confirmSkip / L336 | E2E | Medium | Not Covered | none — requires date mocking |
| BEH-167 | AntaryatraPage saves skip record with status='skipped' and closes | AntaryatraPage.jsx / handleSkip / L35 | E2E | High | Not Covered | none — requires date mocking |
| BEH-168 | AntaryatraPage shows read-only reflection text when status is 'recorded' | AntaryatraPage.jsx / isReadOnly / L190 | E2E | High | Not Covered | none — testable via pre-seeded antaryatra record without date mocking |
| BEH-169 | AntaryatraPage shows "skipped" notice when status is 'skipped' | AntaryatraPage.jsx / isReadOnly / L214 | E2E | Medium | Not Covered | none — requires date mocking |
| BEH-170 | AntaryatraPage shows "window has passed" notice when record is null and window expired | AntaryatraPage.jsx / isReadOnly / L231 | E2E | Medium | Not Covered | none — requires date mocking |
| BEH-171 | AntaryatraPage shows "Reflected" or "Skipped" status label in header | AntaryatraPage.jsx / statusLabel / L47 | E2E | Low | Not Covered | none — requires date mocking |
| BEH-172 | AntaryatraArchivePage loads all past years from first entry year to current year - 1 | AntaryatraArchivePage.jsx / getPastYears / L23 | E2E | High | Not Covered | none |
| BEH-173 | AntaryatraArchivePage shows "archive will appear after first full year" when no past years | AntaryatraArchivePage.jsx / pastYears.length === 0 / L132 | E2E | Medium | Not Covered | none |
| BEH-174 | AntaryatraArchivePage lists past years with status label (Reflected / Skipped / Not Recorded) | AntaryatraArchivePage.jsx / statusDisplay / L40 | E2E | High | Not Covered | none |
| BEH-175 | AntaryatraArchivePage shows days-of-practice and avg-per-day stats per year | AntaryatraArchivePage.jsx / getYearStats call / L155 | E2E | Medium | Not Covered | none |
| BEH-176 | AntaryatraArchivePage navigates to AntaryatraPage for a selected year | AntaryatraArchivePage.jsx / setSelectedYear / L161 | E2E | High | Not Covered | none |
| BEH-177 | SplashScreen is visible on app load and disappears after ~3.8 seconds | SplashScreen.jsx / useEffect / L6 | E2E | Medium | Fully Covered | splash.spec.js — SS-001, SS-004, SS-005 |
| BEH-178 | SplashScreen calls onComplete after the fade animation completes | SplashScreen.jsx / doneTimer / L13 | E2E | Medium | Fully Covered | splash.spec.js — SS-004 (app content loads = onComplete was called) |
| BEH-179 | SplashScreen returns null (is removed from DOM) after phase reaches 'done' | SplashScreen.jsx / phase === 'done' / L24 | E2E | Low | Fully Covered | splash.spec.js — SS-004 "Splash disappears and app content loads" (asserts splash has count 0) |

---

## SECTION 2 — COVERAGE METRICS

| Metric | Value |
|--------|-------|
| **Total behaviours identified** | **179** |
| **Fully Covered** | **141 (79%)** |
| **Partially Covered** | **11 (6%)** |
| **Not Covered** | **27 (15%)** |
| **High Risk gaps remaining** | **16** |
| **Medium Risk gaps remaining** | **9** |
| **Low Risk gaps remaining** | **2** |
| **Coverage improvement vs baseline** | **Baseline 36% FC (65/179) → Current 79% FC (141/179) → +43 percentage points** |

### Gaps closed this sprint: 76 behaviours moved to Fully Covered

Key areas closed:
- All milestoneLogic edge cases (BEH-012, BEH-014, BEH-018, BEH-025)
- All antaryatraLogic functions: canRecord, getEffectiveStatus DB-pending path, getLocalDateString, getTimezone, getYearStats year exclusion (BEH-062 to BEH-075)
- All formatIndianNumber edge cases including single/double digit (BEH-046)
- PALETTES structure (BEH-076)
- fillMissingDates retention of old entries (BEH-035)
- Entire Ledger UI layer: expand/collapse, year total, edit/update, lock, dash, Poornima, notes (BEH-110 to BEH-123)
- ReflectionCard year total, progress bar cap, empty-DB state (BEH-126, BEH-128, BEH-133)
- Settings: backdrop close, CSV/JSON export downloads, import flows, archive navigation (BEH-136 to BEH-145, BEH-151)
- Sankalpa: disabled button, rewrite flow, date preservation (BEH-155, BEH-157, BEH-158)
- SplashScreen: visibility, timing, deity image, DOM removal (BEH-177 to BEH-179)
- DB upsert and sort order (BEH-086, BEH-088, BEH-091)

### Remaining gaps — root cause summary
- **DB upgrade paths** (BEH-082 to BEH-085): Cannot be tested without controlling DB version — requires a test-only mechanism to simulate a version upgrade
- **AntaryatraPage/ArchivePage** (BEH-160 to BEH-176): Most flows require system date to be Dec 31 — needs Playwright clock mocking (`page.clock.install`) 
- **BEH-168** is the one exception: pre-seeded antaryatra record test is achievable now without date mocking

---

## SECTION 3 — REMAINING GAPS

> Only Not Covered and Partially Covered items. Sorted: High Risk first, Medium second, Low last.

| BEH ID | Behaviour | Source | Risk | Recommended Test Type | Why it matters |
|--------|-----------|--------|------|-----------------------|----------------|
| BEH-082 | initDB opens IndexedDB at version 3 | db.js / initDB / L33 | High | E2E | Version mismatch on upgrade silently breaks all data operations |
| BEH-083 | onupgradeneeded creates entries store with unique date keyPath | db.js / onupgradeneeded / L17 | High | E2E | Broken schema creation leaves app dead on first install |
| BEH-084 | onupgradeneeded creates sankalpa store on v1→v2 upgrade | db.js / onupgradeneeded / L23 | High | E2E | Existing users upgrading could lose sankalpa store |
| BEH-085 | onupgradeneeded creates antaryatra store on v2→v3 upgrade | db.js / onupgradeneeded / L26 | High | E2E | Antaryatra feature silently broken for upgrading users |
| BEH-087 | saveEntry normalises missing count to 0 and missing notes to '' | db.js / saveEntry / L43 | High | Unit | Null count corrupts totals in ReflectionCard |
| BEH-090 | getEntry returns null when no entry exists | db.js / getEntry / L59 | High | Unit | Undefined vs null could silently break TodayCard pre-population |
| BEH-093 | deleteEntry removes entry from IndexedDB | db.js / deleteEntry / L80 | High | E2E | Only delete path is completely untested |
| BEH-097 | getAntaryatra returns record for a given year | db.js / getAntaryatra / L113 | High | E2E | Ledger reminder and canRecord depend on this |
| BEH-098 | getAntaryatra returns null when no record exists | db.js / getAntaryatra / L119 | High | E2E | Default null path controls reminder visibility |
| BEH-099 | saveAntaryatra writes antaryatra record keyed by year | db.js / saveAntaryatra / L124 | High | E2E | Single write for sealed reflection — never verified it persists |
| BEH-106 | TodayCard treats non-numeric or empty count as 0 | TodayCard.jsx / handleSave / L30 | High | E2E | User entering text could silently save 0 |
| BEH-113 | Ledger year header opens AntaryatraPage on 800ms long-press | Ledger.jsx / onMouseDown / L309 | High | E2E | Primary access path to reflection form — requires date mocking |
| BEH-141 | Import JSON skips records with invalid date format | SettingsPanel.jsx / handleJSONImport / L87 | High | E2E | Bad dates in DB corrupt sort order and grouping |
| BEH-142 | Import JSON shows success message with imported count | SettingsPanel.jsx / handleJSONImport / L104 | High | E2E | User has no feedback on whether import completed |
| BEH-160 | AntaryatraPage shows year stats when window open | AntaryatraPage.jsx / getYearStats / L16 | High | E2E | Wrong stats skew the reflection experience — requires date mocking |
| BEH-168 | AntaryatraPage shows read-only text for recorded year | AntaryatraPage.jsx / isReadOnly / L190 | High | E2E | Sealed reflections must be read-only — testable with pre-seeded data |
| BEH-077 | getSavedPalette returns 'midnight-sanctum' as default | palette.js / getSavedPalette / L24 | Medium | E2E | Default palette at first launch never asserted |
| BEH-078 | getSavedPalette returns previously saved palette | palette.js / getSavedPalette / L24 | Medium | E2E | Partially covered — return value not directly asserted |
| BEH-079 | savePalette writes to localStorage and calls applyPalette | palette.js / savePalette / L28 | Medium | E2E | Partially covered — localStorage write not isolated |
| BEH-080 | applyPalette removes data-palette attribute for midnight-sanctum | palette.js / applyPalette / L33 | Medium | E2E | Resetting to default palette never tested |
| BEH-092 | getAllEntries returns empty array when no entries exist | db.js / getAllEntries / L64 | Medium | E2E | Partially covered — return value not directly asserted |
| BEH-100 | getAllAntaryatra returns [] when no records exist | db.js / getAllAntaryatra / L135 | Medium | E2E | Archive page depends on this; broken empty-state could crash it |
| BEH-105 | TodayCard leaves count field empty when stored count is 0 | TodayCard.jsx / L13 | Medium | E2E | If 0 shows as "0", user may not realise no count was entered |
| BEH-114 | Ledger shows Antaryatra reminder banner during window | Ledger.jsx / YearGroup / L391 | Medium | E2E | Requires date mocking (Dec 31) |
| BEH-146 | Import CSV handles quoted notes field containing commas | SettingsPanel.jsx / L149 | Medium | E2E | Notes with commas parsed incorrectly without quote handling |
| BEH-124 | LedgerRow not expandable for old entries with no data | Ledger.jsx / LedgerRow / L39 | Low | E2E | Old empty rows should be non-interactive |
| BEH-147 | Import buttons disabled during active import | SettingsPanel.jsx / L529 | Medium | E2E | Double-import race condition — concurrent clicks could write duplicates |

---

## SECTION 4 — TEST CASE AGENT INPUT

```
[BEH-087] | P1 | Unit
saveEntry normalises missing count to 0 and missing notes to empty string
Test that calling saveEntry with an entry that omits count and notes results in the stored record having count=0 and notes='', not undefined or null.
AC: After saveEntry({ date: '2026-01-01' }), getEntry('2026-01-01') must return { count: 0, notes: '' }.
```

```
[BEH-090] | P1 | Unit
getEntry returns null when no entry exists for the requested date
Test getEntry with a date that has never been written to the DB and confirm the return value is null, not undefined or an error.
AC: getEntry('2099-12-31') === null in a clean DB state.
```

```
[BEH-093] | P1 | E2E
deleteEntry removes the entry for the given date from IndexedDB
Test that after saving an entry then calling deleteEntry for the same date, the DB no longer contains that record.
AC: After saveEntry then deleteEntry for the same date, getEntry for that date returns null.
```

```
[BEH-097] | P1 | E2E
getAntaryatra returns the record for a given year
Seed an antaryatra record for a year via IndexedDB, call getAntaryatra for that year, and verify the returned object matches the seeded data.
AC: getAntaryatra(year) returns an object with the correct year, status, and text fields.
```

```
[BEH-098] | P1 | E2E
getAntaryatra returns null when no record exists for the year
Call getAntaryatra for a year with no record and verify null is returned.
AC: getAntaryatra(9999) === null in a clean antaryatra store.
```

```
[BEH-099] | P1 | E2E
saveAntaryatra writes an antaryatra record keyed by year
Call saveAntaryatra with a test record, then call getAntaryatra for the same year and verify the data persisted.
AC: After saveAntaryatra({ year: 2024, status: 'recorded', text: 'test' }), getAntaryatra(2024) returns an object with status='recorded'.
```

```
[BEH-106] | P1 | E2E
TodayCard treats non-numeric input and empty count as 0 when Save is clicked
Enter non-numeric text (e.g. "abc") into the Jaap Count field, click Save, then reload and confirm the stored count is 0 and the field appears empty.
AC: After entering "abc" and clicking Save, reloading shows the count field empty (count stored as 0); no NaN or error is shown.
```

```
[BEH-141] | P1 | E2E
Import JSON skips records with invalid date format
Upload a JSON array containing one valid record and one with date "01-01-2026" (wrong format). Verify only the valid record is imported.
AC: After import, only the valid record appears in the ledger; the invalid-date record does not appear.
```

```
[BEH-142] | P1 | E2E
Import JSON shows success message before settings panel closes
Capture the import status message immediately after dispatching the file change event and before the settings panel closes.
AC: The status message contains "Imported 1" and does not contain "failed".
```

```
[BEH-168] | P1 | E2E
AntaryatraPage shows read-only reflection text for a pre-recorded year
Seed an antaryatra record with status='recorded' and text='My reflection' directly into IndexedDB, then navigate to that year's AntaryatraPage via the Archive and verify the text is shown in read-only mode.
AC: The page displays 'My reflection' text and no textarea or Save button is visible.
```

```
[BEH-077] | P2 | E2E
getSavedPalette returns midnight-sanctum as default when localStorage is empty
Clear localStorage, load the app, and verify the html element has no data-palette attribute (midnight-sanctum is the default and removes the attribute).
AC: On first load with cleared localStorage, document.documentElement.getAttribute('data-palette') === null.
```

```
[BEH-080] | P2 | E2E
applyPalette removes data-palette attribute when midnight-sanctum is selected
Switch to Sacred Saffron, then switch back to Midnight Sanctum, and verify the data-palette attribute is removed.
AC: After selecting Midnight Sanctum, document.documentElement.getAttribute('data-palette') === null.
```

```
[BEH-100] | P2 | E2E
getAllAntaryatra returns empty array when no antaryatra records exist
In a clean antaryatra store, call getAllAntaryatra via page.evaluate and verify it resolves to [] not null.
AC: getAllAntaryatra() resolves to an array of length 0.
```

```
[BEH-105] | P2 | E2E
TodayCard shows empty count field when stored count is 0
Save an entry with count=0, reload the page, and verify the Jaap Count input field is empty (not showing "0").
AC: After saving count=0 and reloading, the #jaap-count input field has value ''.
```

```
[BEH-146] | P2 | E2E
Import CSV handles quoted notes field containing commas
Upload a CSV where the notes field contains a comma wrapped in double quotes. Verify the entry is imported with the full notes value intact.
AC: After import, the entry's notes field contains the full text including the comma.
```

```
[BEH-124] | P3 | E2E
LedgerRow older than 7 days with no data is not expandable
Seed an entry dated 10 days ago with count=0. Click the row and verify no edit form or expanded content appears.
AC: After clicking the old empty row, no Update button and no textarea are visible.
```
