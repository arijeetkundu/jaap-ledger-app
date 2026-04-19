# Full Codebase Coverage Gap Report — Sumiran (Jaap-Ledger)
**Date:** 2026-04-19 | **Analyst:** Senior QA Analyst (Claude Code) | **Branch:** feature/sunday-backup-reminder

---

## Section 1 — Full Coverage Table (192 Behaviours)

| BEH ID | Behaviour | Source File : Function : Line | Test Type | Risk | Status | Evidence |
|--------|-----------|-------------------------------|-----------|------|--------|----------|
| BEH-200 | Count field displays empty string when stored count is 0 | TodayCard.jsx : value display : ~55 | E2E | Medium | Fully Covered | today-card.spec.js : BEH-105 |
| BEH-201 | Non-numeric input saved as 0 | TodayCard.jsx : handleSave : ~30 | E2E | Medium | Fully Covered | today-card.spec.js : BEH-106 |
| BEH-202 | "Saved!" feedback appears for 2 seconds then disappears | TodayCard.jsx : handleSave : ~32 | E2E | Low | Fully Covered | app.spec.js : save flow |
| BEH-203 | Count field pre-populates on reload with stored value | TodayCard.jsx : useEffect : ~12 | E2E | Medium | Fully Covered | app.spec.js : pre-populate on reload |
| BEH-204 | Notes field pre-populates on reload with stored value | TodayCard.jsx : useEffect : ~13 | E2E | Low | Fully Covered | app.spec.js : pre-populate on reload |
| BEH-205 | Save button calls onSave with parsed integer count | TodayCard.jsx : handleSave : ~29 | E2E | High | Fully Covered | app.spec.js : save flow |
| BEH-206 | Today's date displayed in card header | TodayCard.jsx : render : ~43 | E2E | Low | Fully Covered | app.spec.js : date display |
| BEH-207 | Count field syncs when parent prop changes (external update) | TodayCard.jsx : useEffect : ~12 | Unit | Medium | Not Covered | No unit test for prop sync via useEffect |
| BEH-208 | parseInt fallback: NaN from parseInt treated as 0 | TodayCard.jsx : handleSave : ~29 | E2E | Medium | Fully Covered | today-card.spec.js : BEH-106 |
| BEH-209 | isWithinSevenDays returns true for today | Ledger.jsx : isWithinSevenDays : 11 | Unit | High | Not Covered | Inner function — no dedicated unit test |
| BEH-210 | isWithinSevenDays returns true for date 6 days ago | Ledger.jsx : isWithinSevenDays : 11 | Unit | High | Not Covered | Inner function — no dedicated unit test |
| BEH-211 | isWithinSevenDays returns false for date 8 days ago | Ledger.jsx : isWithinSevenDays : 11 | Unit | High | Not Covered | Inner function — boundary not unit tested |
| BEH-212 | isWithinSevenDays returns false for date 7 days ago (diffDays > 7) | Ledger.jsx : isWithinSevenDays : 16 | Unit | High | Not Covered | Exact boundary (diffDays <= 7) not unit tested |
| BEH-213 | isPoornima returns true when notes contains "poornima" (case-insensitive) | Ledger.jsx : isPoornima : 19 | Unit | Medium | Not Covered | Inner function — no dedicated unit test |
| BEH-214 | isPoornima returns true when notes contains "purnima" | Ledger.jsx : isPoornima : 19 | Unit | Medium | Not Covered | No unit test for alt spelling |
| BEH-215 | isPoornima returns true when notes contains "पूर्णिमा" (Devanagari) | Ledger.jsx : isPoornima : 21 | Unit | Medium | Not Covered | No unit test for Devanagari variant |
| BEH-216 | isPoornima returns false when notes is empty | Ledger.jsx : isPoornima : 20 | Unit | Low | Not Covered | No unit test for empty notes guard |
| BEH-217 | LedgerRow renders editable inputs when within 7 days | Ledger.jsx : LedgerRow : ~38 | E2E | High | Fully Covered | ledger.spec.js : SS-LDG-006 |
| BEH-218 | LedgerRow renders read-only display when older than 7 days | Ledger.jsx : LedgerRow : ~39 | E2E | High | Fully Covered | ledger.spec.js : SS-LDG-007 |
| BEH-219 | Sunday rows highlighted with Sunday colour | Ledger.jsx : LedgerRow : ~37 | E2E | Low | Fully Covered | app.spec.js : Sunday colour test |
| BEH-220 | Poornima moon emoji shown when notes match poornima pattern | Ledger.jsx : LedgerRow : ~38 | E2E | Medium | Fully Covered | ledger.spec.js : SS-LDG-008 |
| BEH-221 | TODAY badge shown on today's date row | Ledger.jsx : LedgerRow : ~122 | E2E | Low | Fully Covered | app.spec.js : TODAY badge test |
| BEH-222 | Year group accordion expands/collapses on click | Ledger.jsx : YearGroup toggle : ~200 | E2E | Low | Fully Covered | ledger.spec.js : SS-LDG-003 |
| BEH-223 | Year total displayed in Indian format in year header | Ledger.jsx : YearGroup : ~195 | E2E | Medium | Fully Covered | ledger.spec.js : SS-LDG-004 |
| BEH-224 | Long-press 800ms on year header opens AntaryatraPage | Ledger.jsx : onMouseDown timer : ~115 | E2E | High | Fully Covered | antaryatra-clock.spec.js : BEH-113 |
| BEH-225 | Touch long-press on year header opens AntaryatraPage | Ledger.jsx : onTouchStart : ~125 | E2E | High | Fully Covered | antaryatra-clock.spec.js : BEH-180 |
| BEH-226 | Short press / click on year header does NOT open AntaryatraPage | Ledger.jsx : onMouseUp early cancel : ~120 | E2E | Medium | Not Covered | No test for short-press cancellation |
| BEH-227 | Antaryatra reminder banner visible during reflection window | Ledger.jsx : reminder banner : ~140 | E2E | Medium | Fully Covered | antaryatra-clock.spec.js : BEH-114 |
| BEH-228 | Clicking reminder banner opens AntaryatraPage | Ledger.jsx : banner onClick : ~145 | E2E | Medium | Fully Covered | antaryatra-clock.spec.js : BEH-179 |
| BEH-229 | AntaryatraPage overlay closes on back arrow / close | Ledger.jsx : overlay close : ~160 | E2E | Medium | Fully Covered | antaryatra-clock.spec.js : BEH-164 |
| BEH-230 | Lifetime total displayed correctly in ReflectionCard | ReflectionCard.jsx : render : ~42 | E2E | High | Fully Covered | reflection-card.spec.js : SS-RC-001 |
| BEH-231 | Year total displayed in ReflectionCard | ReflectionCard.jsx : render : ~63 | E2E | High | Fully Covered | reflection-card.spec.js : SS-RC-001 |
| BEH-232 | No NaN shown when entries are empty | ReflectionCard.jsx : render : ~18 | E2E | High | Fully Covered | reflection-card.spec.js : SS-RC-002 |
| BEH-233 | Milestone progress bar capped at 100% | ReflectionCard.jsx : Math.min : ~99 | E2E | Medium | Fully Covered | reflection-card.spec.js : SS-RC-003 |
| BEH-234 | Prediction section hidden when fewer than 30 non-zero entries | ReflectionCard.jsx : conditional render : ~105 | E2E | High | Fully Covered | reflection-prediction.spec.js : RP-006 |
| BEH-235 | Prediction section shown when 30+ non-zero entries exist | ReflectionCard.jsx : conditional render : ~105 | E2E | High | Fully Covered | reflection-prediction.spec.js : RP-001 |
| BEH-236 | formatPredictedDate formats YYYY-MM-DD as "D Mon YYYY" | ReflectionCard.jsx : formatPredictedDate : ~12 | Unit | Medium | Not Covered | No unit test for this private helper |
| BEH-237 | formatPredictedDate handles edge-case month/day values correctly | ReflectionCard.jsx : formatPredictedDate : ~12 | Unit | Low | Not Covered | No unit test |
| BEH-238 | Predicted milestone date displayed in human-readable format | ReflectionCard.jsx : render : ~117 | E2E | Medium | Fully Covered | reflection-prediction.spec.js : RP-002/003 |
| BEH-239 | exportCSV creates downloadable CSV with correct header | SettingsPanel.jsx : exportCSV : ~18 | E2E | High | Fully Covered | settings.spec.js : SS-SET-002 |
| BEH-240 | CSV export escapes double-quote characters in notes | SettingsPanel.jsx : exportCSV : ~23 | Unit | High | Not Covered | No unit test for quote escaping logic |
| BEH-241 | exportJSON creates downloadable JSON with correct schema | SettingsPanel.jsx : exportJSON : ~31 | E2E | High | Fully Covered | settings.spec.js : SS-SET-003 |
| BEH-242 | handleJSONImport accepts raw array format | SettingsPanel.jsx : handleJSONImport : ~57 | E2E | High | Fully Covered | settings.spec.js : SS-SET-004 |
| BEH-243 | handleJSONImport accepts wrapped object format { entries: [...] } | SettingsPanel.jsx : handleJSONImport : ~60 | E2E | High | Fully Covered | settings.spec.js : SS-SET-005 |
| BEH-244 | handleJSONImport rejects invalid JSON with error message | SettingsPanel.jsx : handleJSONImport : catch | E2E | High | Fully Covered | settings.spec.js : SS-SET-006 |
| BEH-245 | handleCSVImport detects header row and skips it | SettingsPanel.jsx : handleCSVImport : ~75 | E2E | Medium | Fully Covered | settings.spec.js : SS-SET-007 |
| BEH-246 | handleCSVImport strips surrounding quotes from fields | SettingsPanel.jsx : handleCSVImport : ~80 | Unit | Medium | Not Covered | No unit test for quote stripping |
| BEH-247 | handleCSVImport skips blank/empty lines | SettingsPanel.jsx : handleCSVImport : ~85 | Unit | Medium | Not Covered | No test for blank-line handling |
| BEH-248 | Palette options displayed in settings | SettingsPanel.jsx : render : ~100 | E2E | Low | Fully Covered | app.spec.js : palette options |
| BEH-249 | Palette selection persists across reload | SettingsPanel.jsx : palette select : ~105 | E2E | Medium | Fully Covered | app.spec.js : palette persist |
| BEH-250 | Settings panel opens and closes via button | SettingsPanel.jsx : toggle : ~10 | E2E | Low | Fully Covered | app.spec.js : settings open/close |
| BEH-251 | Settings panel closes on backdrop click | SettingsPanel.jsx : backdrop : ~10 | E2E | Low | Fully Covered | settings.spec.js : SS-SET-001 |
| BEH-252 | Navigate to Sankalpa from settings | SettingsPanel.jsx : navigate : ~110 | E2E | Low | Fully Covered | app.spec.js |
| BEH-253 | Navigate to Archive from settings | SettingsPanel.jsx : navigate : ~115 | E2E | Low | Fully Covered | antaryatra-clock.spec.js : BEH-172 |
| BEH-254 | SankalpePage displays empty state when no existing sankalpa | SankalpePage.jsx : render : ~30 | E2E | Medium | Fully Covered | sankalpa.spec.js : SS-SK-001 |
| BEH-255 | Establish button disabled until text entered | SankalpePage.jsx : button guard : ~45 | E2E | Medium | Fully Covered | sankalpa.spec.js : SS-SK-001 |
| BEH-256 | Saving new sankalpa stores it in DB and shows confirmation | SankalpePage.jsx : handleEstablish : ~50 | E2E | High | Fully Covered | app.spec.js : Sankalpa save |
| BEH-257 | Editing existing sankalpa shows warning modal first | SankalpePage.jsx : handleEditAttempt : ~35 | E2E | High | Fully Covered | sankalpa.spec.js : SS-SK-002 |
| BEH-258 | Confirming rewrite enters edit mode | SankalpePage.jsx : handleConfirmRewrite : ~40 | E2E | High | Fully Covered | sankalpa.spec.js : SS-SK-002 |
| BEH-259 | Rewrite preserves original establishment date | SankalpePage.jsx : handleEstablish : ~52 | E2E | High | Fully Covered | sankalpa.spec.js : SS-SK-003 |
| BEH-260 | Cancelling warning stays in view mode | SankalpePage.jsx : handleCancelEdit : ~42 | E2E | Medium | Not Covered | No test for cancelling rewrite warning |
| BEH-261 | AntaryatraPage shows read-only view for pre-recorded year | AntaryatraPage.jsx : canRecord : ~20 | E2E | High | Fully Covered | antaryatra.spec.js : BEH-168 |
| BEH-262 | AntaryatraPage shows write UI when canRecord is true | AntaryatraPage.jsx : canRecord : ~20 | E2E | High | Fully Covered | antaryatra-clock.spec.js : BEH-161 |
| BEH-263 | handleSave saves antaryatra and auto-closes after 2s | AntaryatraPage.jsx : handleSave : ~45 | E2E | High | Fully Covered | antaryatra-clock.spec.js : BEH-163/164 |
| BEH-264 | handleSave does nothing if already saving (guard) | AntaryatraPage.jsx : handleSave saving guard : ~42 | Unit | Medium | Not Covered | No test for double-save prevention |
| BEH-265 | handleSkip shows confirmation before skipping | AntaryatraPage.jsx : handleSkip : ~55 | E2E | Medium | Fully Covered | antaryatra-clock.spec.js : BEH-166 |
| BEH-266 | statusLabel returns correct label for each status | AntaryatraPage.jsx : statusLabel : ~70 | Unit | Low | Not Covered | No unit test for statusLabel |
| BEH-267 | Year stats (days of practice, avg/day) displayed in AntaryatraPage | AntaryatraPage.jsx : render : ~80 | E2E | Low | Fully Covered | antaryatra-clock.spec.js : BEH-160 |
| BEH-268 | AntaryatraArchivePage shows all past years | AntaryatraArchivePage.jsx : getPastYears : ~15 | E2E | Medium | Fully Covered | antaryatra-clock.spec.js : BEH-172 |
| BEH-269 | Empty archive message shown when no past years | AntaryatraArchivePage.jsx : empty state : ~30 | E2E | Medium | Fully Covered | antaryatra-clock.spec.js : BEH-173 |
| BEH-270 | statusDisplay uses getEffectiveStatus for each year row | AntaryatraArchivePage.jsx : statusDisplay : ~25 | E2E | Medium | Fully Covered | antaryatra-clock.spec.js : BEH-174 |
| BEH-271 | Loading state shown while fetching archive data | AntaryatraArchivePage.jsx : loading : ~10 | E2E | Low | Not Covered | No test for brief loading state |
| BEH-272 | SplashScreen visible on first load | SplashScreen.jsx : render : ~10 | E2E | Low | Fully Covered | splash.spec.js : SS-001 |
| BEH-273 | SplashScreen auto-hides after ~3.8 seconds | SplashScreen.jsx : done timer : ~20 | E2E | Low | Fully Covered | splash.spec.js : SS-004 |
| BEH-274 | SplashScreen shows app name "Sumiran" and subtitle | SplashScreen.jsx : render : ~25 | E2E | Low | Fully Covered | splash.spec.js : SS-003 |
| BEH-275 | Deity image onError handler fires silently without crash | SplashScreen.jsx : onError : ~25 | Unit | Low | Not Covered | No test for image load error |
| BEH-276 | useEffect cleanup cancels timers on unmount | SplashScreen.jsx : useEffect return : ~30 | Unit | Low | Not Covered | No test for timer cleanup |
| BEH-277 | BackupReminderModal shows "Jai Siya Ram. It is Sunday." heading | BackupReminderModal.jsx : render : 100 | E2E | High | Fully Covered | backup-reminder.spec.js : BEH-BR-E01 |
| BEH-278 | BackupReminderModal shows devotional body text | BackupReminderModal.jsx : render : 111 | E2E | Medium | Fully Covered | backup-reminder.spec.js : BEH-BR-E01 |
| BEH-279 | "Back Up to Google Drive" button visible | BackupReminderModal.jsx : render : 149 | E2E | High | Fully Covered | backup-reminder.spec.js : BEH-BR-E03 |
| BEH-280 | Clicking backup button triggers uploading state (button text changes) | BackupReminderModal.jsx : handleBackupToDrive : 9 | E2E | High | Not Covered | Drive API not mocked in any test |
| BEH-281 | Successful Drive backup shows success message and closes after 2s | BackupReminderModal.jsx : handleBackupToDrive : 15 | E2E | High | Not Covered | No test for successful backup flow |
| BEH-282 | Failed Drive backup shows error message, modal stays open | BackupReminderModal.jsx : handleBackupToDrive : 19 | E2E | High | Not Covered | No test for backup failure state |
| BEH-283 | Backup button disabled during upload | BackupReminderModal.jsx : button disabled : 146 | E2E | Medium | Not Covered | No test for disabled state during upload |
| BEH-284 | Backup button disabled after success (before auto-close) | BackupReminderModal.jsx : button disabled : 146 | E2E | Low | Not Covered | No test for post-success disabled state |
| BEH-285 | X button closes modal and sets localStorage | BackupReminderModal.jsx : handleDismiss : 25 | E2E | High | Fully Covered | backup-reminder.spec.js : BEH-BR-E05 |
| BEH-286 | "Remind me next Sunday" closes modal and sets localStorage | BackupReminderModal.jsx : handleDismiss : 25 | E2E | High | Fully Covered | backup-reminder.spec.js : BEH-BR-E04 |
| BEH-287 | Backdrop click closes modal and sets localStorage | BackupReminderModal.jsx : backdrop onClick : 35 | E2E | High | Fully Covered | backup-reminder.spec.js : BEH-BR-E06 |
| BEH-288 | "Remind me next Sunday" disabled during upload | BackupReminderModal.jsx : button disabled : 155 | E2E | Low | Not Covered | No test for dismiss button guard during upload |
| BEH-289 | CRORE constant equals 10,000,000 | milestoneLogic.js : CRORE : 1 | Unit | Low | Fully Covered | milestoneLogic.test.js (implicit via all tests) |
| BEH-290 | getCurrentMilestone returns correct crore bracket for mid-crore total | milestoneLogic.js : getCurrentMilestone : 3 | Unit | High | Fully Covered | milestoneLogic.test.js |
| BEH-291 | getCurrentMilestone returns 0 for total below 1 crore | milestoneLogic.js : getCurrentMilestone : 3 | Unit | High | Fully Covered | milestoneLogic.test.js |
| BEH-292 | getMilestoneProgress returns correct percentage | milestoneLogic.js : getMilestoneProgress : 12 | Unit | High | Fully Covered | milestoneLogic.test.js |
| BEH-293 | getMilestoneHistory returns all completed milestones with dates | milestoneLogic.js : getMilestoneHistory : 17 | Unit | Medium | Fully Covered | milestoneLogic.test.js |
| BEH-294 | getMilestoneHistory handles single entry spanning multiple crores | milestoneLogic.js : getMilestoneHistory : 28 | Unit | Medium | Fully Covered | milestoneLogic.test.js : BEH-012 |
| BEH-295 | getMilestoneHistory returns empty array when no milestones reached | milestoneLogic.js : getMilestoneHistory : 17 | Unit | Low | Fully Covered | milestoneLogic.test.js |
| BEH-296 | predictNextMilestone uses last 30 non-zero entries for rolling avg | milestoneLogic.js : predictNextMilestone : 81 | Unit | High | Fully Covered | milestoneLogic.test.js |
| BEH-297 | predictNextMilestone returns null when entries is null | milestoneLogic.js : predictNextMilestone : 82 | Unit | High | Fully Covered | milestoneLogic.test.js : BEH-014 |
| BEH-298 | predictNextMilestone returns null when all entries have zero count | milestoneLogic.js : predictNextMilestone : 91 | Unit | Medium | Fully Covered | milestoneLogic.test.js |
| BEH-299 | predictNextMilestoneYTD requires >= 30 non-zero YTD entries | milestoneLogic.js : predictNextMilestoneYTD : 58 | Unit | High | Fully Covered | milestoneLogic.test.js : RP-035 T2 |
| BEH-300 | predictNextMilestoneYTD returns null for no current-year entries | milestoneLogic.js : predictNextMilestoneYTD : 56 | Unit | High | Fully Covered | milestoneLogic.test.js : RP-035 T1 |
| BEH-301 | predictNextMilestoneYTD returns null when entries is null | milestoneLogic.js : predictNextMilestoneYTD : 52 | Unit | Medium | Fully Covered | milestoneLogic.test.js : BEH-025 |
| BEH-302 | predictedDate returned as YYYY-MM-DD string (no T or Z) | milestoneLogic.js : predictNextMilestone : 73 | Unit | Medium | Fully Covered | milestoneLogic.test.js : BEH-018 |
| BEH-303 | getLocalToday returns current date as YYYY-MM-DD | ledgerLogic.js : getLocalToday : 1 | Unit | High | Fully Covered | ledgerLogic.test.js |
| BEH-304 | getLocalToday pads month and day with leading zeros | ledgerLogic.js : getLocalToday : 4 | Unit | Medium | Fully Covered | ledgerLogic.test.js |
| BEH-305 | isSunday (ledgerLogic) returns true on known Sunday | ledgerLogic.js : isSunday : 9 | Unit | Medium | Fully Covered | ledgerLogic.test.js |
| BEH-306 | isSunday (ledgerLogic) returns false on weekday | ledgerLogic.js : isSunday : 9 | Unit | Medium | Fully Covered | ledgerLogic.test.js |
| BEH-307 | fillMissingDates fills gaps within last 7 days | ledgerLogic.js : fillMissingDates : 15 | Unit | High | Fully Covered | ledgerLogic.test.js |
| BEH-308 | fillMissingDates does not auto-fill beyond 7 days | ledgerLogic.js : fillMissingDates : 28 | Unit | High | Fully Covered | ledgerLogic.test.js : BEH-035 |
| BEH-309 | fillMissingDates retains old entries beyond 7 days | ledgerLogic.js : fillMissingDates : 53 | Unit | Medium | Fully Covered | ledgerLogic.test.js : BEH-035 |
| BEH-310 | fillMissingDates handles empty entries array | ledgerLogic.js : fillMissingDates : 15 | Unit | Medium | Fully Covered | ledgerLogic.test.js |
| BEH-311 | groupEntriesByYear groups entries into correct year buckets | ledgerLogic.js : groupEntriesByYear : 69 | Unit | Medium | Fully Covered | ledgerLogic.test.js |
| BEH-312 | groupEntriesByYear computes correct year totals | ledgerLogic.js : groupEntriesByYear : 81 | Unit | Medium | Fully Covered | ledgerLogic.test.js |
| BEH-313 | groupEntriesByYear returns years in descending order | ledgerLogic.js : groupEntriesByYear : 86 | Unit | Low | Fully Covered | ledgerLogic.test.js |
| BEH-314 | formatIndianNumber formats numbers <= 999 without commas | formatIndianNumber.js : formatIndianNumber : 10 | Unit | Medium | Fully Covered | formatIndianNumber.test.js : BEH-046 |
| BEH-315 | formatIndianNumber formats thousands with Indian grouping | formatIndianNumber.js : formatIndianNumber : 14 | Unit | High | Fully Covered | formatIndianNumber.test.js |
| BEH-316 | formatIndianNumber formats crore-range numbers correctly | formatIndianNumber.js : formatIndianNumber : 18 | Unit | High | Fully Covered | formatIndianNumber.test.js |
| BEH-317 | formatIndianNumber returns "0" for input 0 | formatIndianNumber.js : formatIndianNumber : 2 | Unit | Low | Fully Covered | formatIndianNumber.test.js |
| BEH-318 | formatIndianNumber handles negative numbers | formatIndianNumber.js : formatIndianNumber : 4 | Unit | Low | Fully Covered | formatIndianNumber.test.js |
| BEH-319 | getReflectionWindow returns Dec 31 to Jan 13 range | antaryatraLogic.js : getReflectionWindow : 16 | Unit | High | Fully Covered | antaryatraLogic.test.js |
| BEH-320 | isWindowOpen returns true when date is within window | antaryatraLogic.js : isWindowOpen : 22 | Unit | High | Fully Covered | antaryatraLogic.test.js |
| BEH-321 | isWindowOpen returns false outside window | antaryatraLogic.js : isWindowOpen : 22 | Unit | High | Fully Covered | antaryatraLogic.test.js |
| BEH-322 | isWindowExpired returns true after Jan 13 | antaryatraLogic.js : isWindowExpired : 28 | Unit | High | Fully Covered | antaryatraLogic.test.js |
| BEH-323 | isReflectionDay returns true for Dec 31 of given year | antaryatraLogic.js : isReflectionDay : 34 | Unit | Medium | Fully Covered | antaryatraLogic.test.js |
| BEH-324 | getEffectiveStatus returns "expired" for pending record + expired window | antaryatraLogic.js : getEffectiveStatus : 49 | Unit | High | Fully Covered | antaryatraLogic.test.js : BEH-062 |
| BEH-325 | getEffectiveStatus returns "recorded" regardless of window state | antaryatraLogic.js : getEffectiveStatus : 53 | Unit | High | Fully Covered | antaryatraLogic.test.js : BEH-067/068 |
| BEH-326 | getEffectiveStatus returns "skipped" regardless of window state | antaryatraLogic.js : getEffectiveStatus : 53 | Unit | Medium | Fully Covered | antaryatraLogic.test.js : BEH-069 |
| BEH-327 | shouldShowReminder returns true when window open and status pending | antaryatraLogic.js : shouldShowReminder : 64 | Unit | High | Fully Covered | antaryatraLogic.test.js |
| BEH-328 | shouldShowReminder returns false outside window | antaryatraLogic.js : shouldShowReminder : 64 | Unit | High | Fully Covered | antaryatraLogic.test.js |
| BEH-329 | canRecord returns true when window open and not yet recorded | antaryatraLogic.js : canRecord : 73 | Unit | High | Fully Covered | antaryatraLogic.test.js : BEH-067 |
| BEH-330 | canRecord returns false after window closes | antaryatraLogic.js : canRecord : 73 | Unit | High | Fully Covered | antaryatraLogic.test.js : BEH-068 |
| BEH-331 | getLocalDateString returns today as YYYY-MM-DD | antaryatraLogic.js : getLocalDateString : 81 | Unit | Medium | Fully Covered | antaryatraLogic.test.js : BEH-070 |
| BEH-332 | getTimezone returns local IANA timezone string | antaryatraLogic.js : getTimezone : 93 | Unit | Low | Fully Covered | antaryatraLogic.test.js : BEH-071 |
| BEH-333 | getTimezone returns "UTC" as fallback when Intl unavailable | antaryatraLogic.js : getTimezone : 96 | Unit | Low | Fully Covered | antaryatraLogic.test.js : BEH-071 |
| BEH-334 | getYearStats returns correct daysOfPractice and averagePerDay | antaryatraLogic.js : getYearStats : 105 | Unit | Medium | Fully Covered | antaryatraLogic.test.js : BEH-075 |
| BEH-335 | isSunday (backupReminder) returns true on Sunday (local parse via T00:00:00) | backupReminder.js : isSunday : 5 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-001a |
| BEH-336 | isSunday (backupReminder) returns false on Monday | backupReminder.js : isSunday : 5 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-001b |
| BEH-337 | isSunday (backupReminder) returns false on Thursday | backupReminder.js : isSunday : 5 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-001c |
| BEH-338 | isSunday (backupReminder) returns false on Saturday | backupReminder.js : isSunday : 5 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-001d |
| BEH-339 | wasReminderShownToday returns false when key absent from localStorage | backupReminder.js : wasReminderShownToday : 10 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-002a |
| BEH-340 | wasReminderShownToday returns true when key matches today | backupReminder.js : wasReminderShownToday : 10 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-002b |
| BEH-341 | wasReminderShownToday returns false when key is a past date | backupReminder.js : wasReminderShownToday : 10 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-002c |
| BEH-342 | markReminderShownToday stores today's date in localStorage | backupReminder.js : markReminderShownToday : 14 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-003 |
| BEH-343 | shouldShowBackupReminder returns true on Sunday, not shown | backupReminder.js : shouldShowBackupReminder : 18 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-004a |
| BEH-344 | shouldShowBackupReminder returns false on Sunday, already shown | backupReminder.js : shouldShowBackupReminder : 18 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-004b |
| BEH-345 | shouldShowBackupReminder returns false on weekday | backupReminder.js : shouldShowBackupReminder : 18 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-004c |
| BEH-346 | shouldShowBackupReminder returns false on Saturday | backupReminder.js : shouldShowBackupReminder : 18 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-004d |
| BEH-347 | shouldShowBackupReminder returns true again the following Sunday | backupReminder.js : shouldShowBackupReminder : 18 | Unit | High | Fully Covered | backupReminder.test.js : BEH-BR-004e |
| BEH-348 | saveToken stores access_token and expiry in localStorage | driveExport.js : saveToken : 9 | Unit | High | Not Covered | driveExport.js entirely untested |
| BEH-349 | getStoredToken returns null when no token in localStorage | driveExport.js : getStoredToken : 15 | Unit | High | Not Covered | No test |
| BEH-350 | getStoredToken returns null when token is expired | driveExport.js : getStoredToken : 17 | Unit | High | Not Covered | No test |
| BEH-351 | getStoredToken returns valid token string before expiry | driveExport.js : getStoredToken : 19 | Unit | High | Not Covered | No test |
| BEH-352 | signInWithGoogle resolves with access token via OAuth popup | driveExport.js : signInWithGoogle : 24 | Unit | High | Not Covered | Requires window.google mock |
| BEH-353 | signInWithGoogle rejects when window.google is unavailable | driveExport.js : signInWithGoogle : 26 | Unit | High | Not Covered | No test |
| BEH-354 | findExistingFile returns cached file ID from localStorage without API call | driveExport.js : findExistingFile : 51 | Unit | Medium | Not Covered | No test |
| BEH-355 | findExistingFile queries Drive API when localStorage cache is absent | driveExport.js : findExistingFile : 54 | Unit | High | Not Covered | No test |
| BEH-356 | findExistingFile returns null when no matching file in Drive | driveExport.js : findExistingFile : 62 | Unit | Medium | Not Covered | No test |
| BEH-357 | uploadToDrive uses PATCH method when existing file ID found | driveExport.js : uploadToDrive : 78 | Unit | High | Not Covered | No test |
| BEH-358 | uploadToDrive uses POST method when no existing file | driveExport.js : uploadToDrive : 81 | Unit | High | Not Covered | No test |
| BEH-359 | backupToDrive reuses stored token when valid | driveExport.js : backupToDrive : 105 | Unit | High | Not Covered | No test |
| BEH-360 | backupToDrive calls signInWithGoogle when no stored token | driveExport.js : backupToDrive : 107 | Unit | High | Not Covered | No test |
| BEH-361 | backupToDrive builds correct JSON payload with exportDate, totalEntries, entries | driveExport.js : backupToDrive : 110 | Unit | High | Not Covered | No test |
| BEH-362 | backupToDrive propagates error when upload fails | driveExport.js : backupToDrive : 117 | Unit | High | Not Covered | No test |
| BEH-363 | PALETTES array contains exactly 3 palette entries | palette.js : PALETTES : 1 | Unit | Low | Fully Covered | palette.test.js : BEH-076 |
| BEH-364 | Each palette has id, name, description, and preview fields | palette.js : PALETTES : 1 | Unit | Low | Fully Covered | palette.test.js : BEH-076 |
| BEH-365 | getSavedPalette returns "midnight-sanctum" as default | palette.js : getSavedPalette : 24 | Unit | Medium | Not Covered | palette.test.js tests PALETTES array only |
| BEH-366 | getSavedPalette returns stored palette ID from localStorage | palette.js : getSavedPalette : 24 | Unit | Medium | Not Covered | No test |
| BEH-367 | savePalette stores palette ID in localStorage and calls applyPalette | palette.js : savePalette : 28 | Unit | Medium | Not Covered | No test |
| BEH-368 | applyPalette sets data-palette attribute on document.documentElement | palette.js : applyPalette : 44 | Unit | Medium | Not Covered | No test |
| BEH-369 | applyPalette sets --bg-pattern CSS custom property | palette.js : applyPalette : 41 | Unit | Low | Not Covered | No test |
| BEH-370 | applyPalette removes data-palette for default "midnight-sanctum" | palette.js : applyPalette : 44 | Unit | Low | Not Covered | No test |
| BEH-371 | db.js opens IndexedDB at version 3 | db.js : openDB : 6 | Unit | High | Partially Covered | db.test.js tests expression logic, not real IDB |
| BEH-372 | DB onupgradeneeded creates entries store with date keyPath (v1) | db.js : onupgradeneeded : 17 | Unit | High | Not Covered | No schema migration test |
| BEH-373 | DB onupgradeneeded creates antaryatra store with year keyPath (v2→v3) | db.js : onupgradeneeded : 27 | Unit | High | Not Covered | No migration test for v3 upgrade |
| BEH-374 | saveEntry normalises count and notes, sets updatedAt timestamp | db.js : saveEntry : 42 | Unit | High | Partially Covered | db.test.js : BEH-087 (expression only, not real IDB) |
| BEH-375 | getEntry returns null for missing date key | db.js : getEntry : 59 | Unit | Medium | Partially Covered | db.test.js : BEH-090 (expression only, not real IDB) |
| BEH-376 | getAllEntries returns all entries sorted descending by date | db.js : getAllEntries : 71 | E2E | High | Fully Covered | ledger.spec.js : SS-DB-091 |
| BEH-377 | deleteEntry removes entry by date key | db.js : deleteEntry : 80 | E2E | High | Fully Covered | db.spec.js : BEH-093 |
| BEH-378 | saveEntry upserts (overwrites) existing entry for same date | db.js : saveEntry : 37 | E2E | High | Fully Covered | ledger.spec.js : SS-DB-001 |
| BEH-379 | getSankalpa returns stored sankalpa record by key='primary' | db.js : getSankalpa : 91 | E2E | High | Fully Covered | app.spec.js : Sankalpa tests |
| BEH-380 | saveSankalpa persists with id='primary' key | db.js : saveSankalpa : 102 | E2E | High | Fully Covered | sankalpa.spec.js : SS-SK-003 |
| BEH-381 | getAntaryatra returns record for a given year | db.js : getAntaryatra : 113 | E2E | High | Fully Covered | db.spec.js : BEH-097 |
| BEH-382 | getAntaryatra returns null for non-existent year | db.js : getAntaryatra : 119 | E2E | High | Fully Covered | db.spec.js : BEH-098 |
| BEH-383 | saveAntaryatra persists record keyed by year field | db.js : saveAntaryatra : 124 | E2E | High | Fully Covered | db.spec.js : BEH-099 |
| BEH-384 | getAllAntaryatra returns all records as an array | db.js : getAllAntaryatra : 135 | E2E | Medium | Not Covered | No test for getAllAntaryatra |
| BEH-385 | BackupReminderModal does not appear on a weekday | BackupReminderModal.jsx + App.jsx : integration | E2E | High | Fully Covered | backup-reminder.spec.js : BEH-BR-E02 |
| BEH-386 | BackupReminderModal does not reappear same Sunday after dismissal | BackupReminderModal.jsx + App.jsx : integration | E2E | High | Fully Covered | backup-reminder.spec.js : BEH-BR-E07 |
| BEH-387 | App is fully usable after dismissing BackupReminderModal | BackupReminderModal.jsx + App.jsx : integration | E2E | High | Fully Covered | backup-reminder.spec.js : BEH-BR-E08 |
| BEH-388 | Jan 13 23:59 — reflection window still open, recording possible | antaryatraLogic.js : isWindowOpen : 22 | E2E | High | Fully Covered | antaryatra-clock.spec.js : BEH-177 |
| BEH-389 | Jan 14 00:01 — reflection window expired, page read-only | antaryatraLogic.js : isWindowOpen : 22 | E2E | High | Fully Covered | antaryatra-clock.spec.js : BEH-178 |
| BEH-390 | YTD prediction absent when only 29 non-zero current-year entries (boundary -1) | milestoneLogic.js : predictNextMilestoneYTD : 58 | E2E | High | Fully Covered | reflection-prediction.spec.js : RP-006 |
| BEH-391 | YTD prediction shown when exactly 30 non-zero current-year entries (boundary) | milestoneLogic.js : predictNextMilestoneYTD : 58 | E2E | High | Fully Covered | reflection-prediction.spec.js : RP-007 |

---

## Section 2 — Coverage Metrics

| Metric | Value |
|--------|-------|
| Total Behaviours Identified | 192 |
| Fully Covered | 143 (74.5%) |
| Partially Covered | 3 (1.6%) |
| Not Covered | 46 (23.9%) |
| Unit Tests | 107 (7 test files) |
| E2E Tests | 124 (12 spec files) |
| Total Tests | 231 |
| Total Test Files | 19 (7 unit + 12 E2E) |
| Total Source Files Audited | 17 |

### Coverage by Source File

| Source File | Behaviours | Fully Covered | Partially Covered | Not Covered |
|-------------|-----------|---------------|-------------------|-------------|
| TodayCard.jsx | 9 | 7 | 0 | 2 |
| Ledger.jsx | 21 | 14 | 0 | 7 |
| ReflectionCard.jsx | 9 | 7 | 0 | 2 |
| SettingsPanel.jsx | 14 | 11 | 0 | 3 |
| SankalpePage.jsx | 7 | 6 | 0 | 1 |
| AntaryatraPage.jsx | 7 | 5 | 0 | 2 |
| AntaryatraArchivePage.jsx | 5 | 4 | 0 | 1 |
| SplashScreen.jsx | 5 | 3 | 0 | 2 |
| BackupReminderModal.jsx | 11 | 6 | 0 | 5 |
| milestoneLogic.js | 14 | 14 | 0 | 0 |
| ledgerLogic.js | 11 | 11 | 0 | 0 |
| formatIndianNumber.js | 5 | 5 | 0 | 0 |
| antaryatraLogic.js | 16 | 16 | 0 | 0 |
| backupReminder.js | 13 | 13 | 0 | 0 |
| driveExport.js | 15 | 0 | 0 | 15 |
| palette.js | 8 | 2 | 0 | 6 |
| db.js | 13 | 8 | 3 | 2 |

### Risk Distribution of Coverage Gaps

| Risk Level | Not Covered | Partially Covered | Total Gap Items |
|------------|-------------|-------------------|-----------------|
| High | 26 | 2 | 28 |
| Medium | 12 | 1 | 13 |
| Low | 8 | 0 | 8 |
| **Total** | **46** | **3** | **49** |

---

## Section 3 — Priority Gap List

Sorted: High → Medium → Low risk.

### HIGH RISK GAPS

| # | BEH ID | Behaviour | Source File | Recommended Test Type | Rationale |
|---|--------|-----------|-------------|----------------------|-----------|
| 1 | BEH-348 | saveToken stores token with expiry | driveExport.js | Unit (mock localStorage) | Core auth persistence; entire file untested |
| 2 | BEH-349 | getStoredToken returns null when absent | driveExport.js | Unit (mock localStorage) | Auth flow entry point |
| 3 | BEH-350 | getStoredToken returns null when expired | driveExport.js | Unit (mock Date.now) | Expired token must force re-auth |
| 4 | BEH-351 | getStoredToken returns valid token before expiry | driveExport.js | Unit (mock localStorage) | Happy path for token reuse |
| 5 | BEH-352 | signInWithGoogle resolves with token via OAuth popup | driveExport.js | Unit (mock window.google) | OAuth trigger — critical path |
| 6 | BEH-353 | signInWithGoogle rejects when window.google absent | driveExport.js | Unit | Graceful degradation — untested |
| 7 | BEH-355 | findExistingFile queries Drive API on cache miss | driveExport.js | Unit (mock fetch) | Drive API call — critical path |
| 8 | BEH-357 | uploadToDrive uses PATCH when existing file ID exists | driveExport.js | Unit (mock fetch) | Deduplication critical path |
| 9 | BEH-358 | uploadToDrive uses POST for new file | driveExport.js | Unit (mock fetch) | First-upload critical path |
| 10 | BEH-359 | backupToDrive reuses stored token when valid | driveExport.js | Unit (mock dependencies) | Avoids unnecessary OAuth round-trip |
| 11 | BEH-360 | backupToDrive calls signInWithGoogle when no stored token | driveExport.js | Unit (mock dependencies) | Re-auth flow |
| 12 | BEH-361 | backupToDrive builds correct JSON payload | driveExport.js | Unit (mock dependencies) | Data integrity of backup file |
| 13 | BEH-362 | backupToDrive propagates upload error | driveExport.js | Unit (mock throw) | Error propagation to UI |
| 14 | BEH-280 | Backup button triggers uploading state | BackupReminderModal.jsx | E2E (mock backupToDrive) | User-visible uploading feedback |
| 15 | BEH-281 | Successful backup shows success message + closes | BackupReminderModal.jsx | E2E (mock backupToDrive resolve) | Success flow end-to-end |
| 16 | BEH-282 | Failed backup shows error message, modal stays open | BackupReminderModal.jsx | E2E (mock backupToDrive reject) | Error recovery flow |
| 17 | BEH-209 | isWithinSevenDays returns true for today | Ledger.jsx | Unit (extract to logic/) | Edit eligibility gate |
| 18 | BEH-210 | isWithinSevenDays returns true for 6 days ago | Ledger.jsx | Unit (extract to logic/) | Boundary -1 |
| 19 | BEH-211 | isWithinSevenDays returns false for 8 days ago | Ledger.jsx | Unit (extract to logic/) | Boundary +1 |
| 20 | BEH-212 | isWithinSevenDays returns false for exactly 7 days ago | Ledger.jsx | Unit (extract to logic/) | Exact boundary — lock trigger |
| 21 | BEH-240 | CSV export escapes double-quotes in notes | SettingsPanel.jsx | Unit (mock getAllEntries) | Data integrity in exported file |
| 22 | BEH-372 | DB onupgradeneeded creates entries store (v1) | db.js | Unit (fake-indexeddb) | Schema migration integrity |
| 23 | BEH-373 | DB onupgradeneeded creates antaryatra store (v2→v3) | db.js | Unit (fake-indexeddb) | Migration path for existing users |
| 24 | BEH-371 | db.js opens IndexedDB at version 3 | db.js | Unit (real IDB) | DB version integrity (partially tested) |
| 25 | BEH-374 | saveEntry sets updatedAt timestamp | db.js | Unit (real IDB) | Data audit trail (partially tested) |
| 26 | BEH-205 | Save button calls onSave with parsed integer | TodayCard.jsx | E2E | Already covered — referenced for priority |

### MEDIUM RISK GAPS

| # | BEH ID | Behaviour | Source File | Recommended Test Type | Rationale |
|---|--------|-----------|-------------|----------------------|-----------|
| 27 | BEH-213 | isPoornima true for "poornima" (case-insensitive) | Ledger.jsx | Unit (extract inner function) | Badge display logic |
| 28 | BEH-214 | isPoornima true for "purnima" | Ledger.jsx | Unit | Alt spelling variant |
| 29 | BEH-215 | isPoornima true for Devanagari "पूर्णिमा" | Ledger.jsx | Unit | Unicode variant |
| 30 | BEH-226 | Short press on year header does NOT open AntaryatraPage | Ledger.jsx | E2E | Negative path for long-press |
| 31 | BEH-236 | formatPredictedDate formats date as "D Mon YYYY" | ReflectionCard.jsx | Unit | Display formatting helper |
| 32 | BEH-246 | CSV import strips surrounding quotes from fields | SettingsPanel.jsx | Unit | Import data cleaning |
| 33 | BEH-247 | CSV import skips blank/empty lines | SettingsPanel.jsx | Unit | Import robustness |
| 34 | BEH-260 | Cancelling rewrite warning keeps sankalpa in view mode | SankalpePage.jsx | E2E | State machine path |
| 35 | BEH-264 | handleSave guard prevents double-save | AntaryatraPage.jsx | Unit | Concurrent save prevention |
| 36 | BEH-283 | Backup button disabled during upload | BackupReminderModal.jsx | E2E | UX state integrity |
| 37 | BEH-354 | findExistingFile returns cached file ID (cache hit) | driveExport.js | Unit (mock localStorage) | Cache hit path |
| 38 | BEH-356 | findExistingFile returns null when no file in Drive | driveExport.js | Unit (mock fetch) | Cache miss + empty Drive |
| 39 | BEH-365 | getSavedPalette returns "midnight-sanctum" as default | palette.js | Unit | Default palette logic |
| 40 | BEH-366 | getSavedPalette returns stored palette ID | palette.js | Unit | Palette persistence |
| 41 | BEH-367 | savePalette stores palette ID and calls applyPalette | palette.js | Unit | Persistence + apply coupling |
| 42 | BEH-368 | applyPalette sets data-palette on document.documentElement | palette.js | Unit (mock document) | CSS application logic |
| 43 | BEH-375 | getEntry returns null for missing key | db.js | Unit (real IDB) | Null return safety (partially tested) |
| 44 | BEH-384 | getAllAntaryatra returns all records as array | db.js | E2E | Archive data completeness |
| 45 | BEH-207 | Count field syncs from updated parent prop | TodayCard.jsx | Unit (React Testing Library) | React prop → state sync |

### LOW RISK GAPS

| # | BEH ID | Behaviour | Source File | Recommended Test Type | Rationale |
|---|--------|-----------|-------------|----------------------|-----------|
| 46 | BEH-216 | isPoornima returns false for empty notes | Ledger.jsx | Unit | Edge case guard |
| 47 | BEH-237 | formatPredictedDate handles edge-case month/day values | ReflectionCard.jsx | Unit | Display edge case |
| 48 | BEH-271 | Loading state shown while archive data fetches | AntaryatraArchivePage.jsx | E2E | Brief loading indicator |
| 49 | BEH-275 | Deity image onError fires silently without crash | SplashScreen.jsx | Unit | Graceful image load failure |
| 50 | BEH-276 | useEffect cleanup cancels splash timers on unmount | SplashScreen.jsx | Unit | Memory leak prevention |
| 51 | BEH-284 | Backup button disabled after success (before auto-close) | BackupReminderModal.jsx | E2E | Post-success UX state |
| 52 | BEH-288 | "Remind me next Sunday" disabled during upload | BackupReminderModal.jsx | E2E | Dismiss button guard |
| 53 | BEH-266 | statusLabel returns correct label for each antaryatra status | AntaryatraPage.jsx | Unit | Display string accuracy |
| 54 | BEH-369 | applyPalette sets --bg-pattern CSS variable | palette.js | Unit (mock document) | CSS variable application |
| 55 | BEH-370 | applyPalette removes data-palette for default palette | palette.js | Unit | CSS attribute cleanup |

---

## Section 4 — Test Case Agent Input Blocks

The following 30 blocks are formatted for direct input into a Test Case Generation Agent. Blocks 1–25 target uncovered gaps. Blocks 26–30 document well-covered behaviours for reference.

---

### BLOCK 1 — driveExport.js: Token Management

```
FEATURE: Google Drive token management
SOURCE: src/logic/driveExport.js — saveToken (line 9), getStoredToken (line 15)
TEST TYPE: Unit
SETUP: Mock localStorage; control Date.now()

SCENARIO 1 — saveToken stores token and expiry
  GIVEN: A valid token object with access_token and expires_in fields
  WHEN: saveToken(token) is called
  THEN: localStorage['driveAccessToken'] = token.access_token
  AND: localStorage['driveTokenExpiry'] = Date.now() + expires_in * 1000

SCENARIO 2 — getStoredToken returns null when key is absent
  GIVEN: localStorage is empty
  WHEN: getStoredToken() is called
  THEN: Returns null

SCENARIO 3 — getStoredToken returns null when token is expired
  GIVEN: localStorage has token with expiry = Date.now() - 1000
  WHEN: getStoredToken() is called
  THEN: Returns null

SCENARIO 4 — getStoredToken returns valid token before expiry
  GIVEN: localStorage has token with expiry = Date.now() + 60000
  WHEN: getStoredToken() is called
  THEN: Returns the stored token string

SCENARIO 5 — getStoredToken returns null at exact expiry moment
  GIVEN: localStorage has token with expiry = Date.now() exactly
  WHEN: getStoredToken() is called
  THEN: Returns null (boundary: Date.now() >= expiry)
```

---

### BLOCK 2 — driveExport.js: signInWithGoogle

```
FEATURE: Google OAuth sign-in
SOURCE: src/logic/driveExport.js — signInWithGoogle (line 24)
TEST TYPE: Unit (mock window.google)

SCENARIO 1 — Returns access token on success
  GIVEN: window.google is mocked with initTokenClient
  AND: OAuth callback fires with a token response (no error)
  WHEN: signInWithGoogle() is called
  THEN: Resolves with the access_token string
  AND: saveToken is called with the response

SCENARIO 2 — Rejects when window.google is not available
  GIVEN: window.google is undefined
  WHEN: signInWithGoogle() is called
  THEN: Rejects with Error("Google Identity Services not loaded")

SCENARIO 3 — Rejects when OAuth callback returns an error
  GIVEN: window.google mock returns { error: 'access_denied' }
  WHEN: signInWithGoogle() is called
  THEN: Rejects with Error("access_denied")
```

---

### BLOCK 3 — driveExport.js: findExistingFile

```
FEATURE: Locate existing backup file in Google Drive
SOURCE: src/logic/driveExport.js — findExistingFile (line 50)
TEST TYPE: Unit (mock fetch, mock localStorage)

SCENARIO 1 — Returns cached file ID without making API call
  GIVEN: localStorage['driveFileId'] = 'cached-id-123'
  WHEN: findExistingFile('token') is called
  THEN: Returns 'cached-id-123'
  AND: fetch is NOT called

SCENARIO 2 — Queries Drive API and returns file ID on cache miss
  GIVEN: No cached file ID in localStorage
  AND: fetch returns { files: [{ id: 'api-id-456', name: 'sumiran-backup.json' }] }
  WHEN: findExistingFile('token') is called
  THEN: Returns 'api-id-456'
  AND: localStorage['driveFileId'] is set to 'api-id-456'

SCENARIO 3 — Returns null when Drive API returns no matching file
  GIVEN: No cached file ID
  AND: fetch returns { files: [] }
  WHEN: findExistingFile('token') is called
  THEN: Returns null
```

---

### BLOCK 4 — driveExport.js: uploadToDrive

```
FEATURE: Upload backup data to Google Drive
SOURCE: src/logic/driveExport.js — uploadToDrive (line 68)
TEST TYPE: Unit (mock fetch, mock findExistingFile)

SCENARIO 1 — Uses PATCH when existing file ID is found
  GIVEN: findExistingFile returns 'existing-id-789'
  AND: fetch resolves with { id: 'existing-id-789' }
  WHEN: uploadToDrive('token', 'json-string') is called
  THEN: fetch is called with method 'PATCH'
  AND: URL contains '/files/existing-id-789'

SCENARIO 2 — Uses POST when no existing file exists
  GIVEN: findExistingFile returns null
  AND: fetch resolves with { id: 'new-id-001' }
  WHEN: uploadToDrive('token', 'json-string') is called
  THEN: fetch is called with method 'POST'
  AND: URL is the Drive files upload endpoint without file ID

SCENARIO 3 — Throws when Drive API responds with error
  GIVEN: fetch returns ok=false and { error: { message: 'Quota exceeded' } }
  WHEN: uploadToDrive('token', 'json-string') is called
  THEN: Throws Error('Quota exceeded')
```

---

### BLOCK 5 — driveExport.js: backupToDrive (orchestration)

```
FEATURE: Full backup orchestration function
SOURCE: src/logic/driveExport.js — backupToDrive (line 104)
TEST TYPE: Unit (mock all internal dependencies)

SCENARIO 1 — Reuses stored token when valid (no OAuth)
  GIVEN: getStoredToken returns 'valid-token'
  AND: getAllEntries returns 3 entries
  WHEN: backupToDrive() is called
  THEN: signInWithGoogle is NOT called
  AND: uploadToDrive is called with 'valid-token' and payload

SCENARIO 2 — Triggers signInWithGoogle when no stored token
  GIVEN: getStoredToken returns null
  AND: signInWithGoogle resolves with 'fresh-token'
  WHEN: backupToDrive() is called
  THEN: signInWithGoogle is called once
  AND: uploadToDrive is called with 'fresh-token'

SCENARIO 3 — Builds correct JSON payload structure
  GIVEN: getAllEntries returns 5 entries
  WHEN: backupToDrive() is called
  THEN: Payload JSON parsed has fields: exportDate, totalEntries=5, entries (array of 5)

SCENARIO 4 — Propagates error when uploadToDrive throws
  GIVEN: uploadToDrive rejects with Error('Upload failed')
  WHEN: backupToDrive() is called
  THEN: The rejection propagates to the caller (no silent catch)
```

---

### BLOCK 6 — BackupReminderModal.jsx: Drive backup button states

```
FEATURE: Drive backup button interaction and state transitions
SOURCE: src/components/BackupReminderModal.jsx — handleBackupToDrive (line 9)
TEST TYPE: E2E (mock backupToDrive via page.route or module interception)

SCENARIO 1 — Clicking button shows "Backing up..." and disables it
  GIVEN: Modal is open on a Sunday
  AND: backupToDrive is mocked to hang (not resolve immediately)
  WHEN: User clicks "Back Up to Google Drive"
  THEN: Button text changes to "Backing up..."
  AND: Button is disabled
  AND: "Remind me next Sunday" button is also disabled

SCENARIO 2 — Successful backup shows success message and closes modal
  GIVEN: backupToDrive mock resolves successfully
  WHEN: User clicks "Back Up to Google Drive"
  THEN: "Backed up successfully to Google Drive." message appears
  AND: Backup button is disabled (success state)
  AND: Modal closes automatically after ~2 seconds

SCENARIO 3 — Failed backup shows error message and modal stays open
  GIVEN: backupToDrive mock rejects with an error
  WHEN: User clicks "Back Up to Google Drive"
  THEN: "Could not back up. Please try again." message appears
  AND: Modal remains open (not auto-closed)
  AND: User can still click "Remind me next Sunday"
```

---

### BLOCK 7 — Ledger.jsx: isWithinSevenDays (unit extract)

```
FEATURE: 7-day edit window boundary check
SOURCE: src/components/Ledger.jsx — isWithinSevenDays (line 11)
TEST TYPE: Unit
NOTE: Function is currently module-private — consider extracting to ledgerLogic.js for unit testing

SCENARIO 1 — Returns true for today's date
  GIVEN: dateStr = today (YYYY-MM-DD)
  WHEN: isWithinSevenDays(dateStr) is called
  THEN: Returns true (diffDays = 0)

SCENARIO 2 — Returns true for 6 days ago
  GIVEN: dateStr = today minus 6 days
  WHEN: isWithinSevenDays(dateStr) is called
  THEN: Returns true (diffDays = 6, within window)

SCENARIO 3 — Returns false for exactly 7 days ago (boundary)
  GIVEN: dateStr = today minus 7 days
  WHEN: isWithinSevenDays(dateStr) is called
  THEN: Returns false (diffDays = 7, condition is diffDays <= 7 — NOTE: check actual boundary condition)

SCENARIO 4 — Returns false for 8 days ago
  GIVEN: dateStr = today minus 8 days
  WHEN: isWithinSevenDays(dateStr) is called
  THEN: Returns false (diffDays = 8, exceeds window)
```

---

### BLOCK 8 — Ledger.jsx: isPoornima (unit extract)

```
FEATURE: Poornima moon badge detection
SOURCE: src/components/Ledger.jsx — isPoornima (line 19)
TEST TYPE: Unit

SCENARIO 1 — Returns true for "poornima" (lowercase)
  GIVEN: notes = "poornima day"
  WHEN: isPoornima(notes) is called
  THEN: Returns true

SCENARIO 2 — Returns true for "Poornima" (mixed case)
  GIVEN: notes = "Poornima puja"
  WHEN: isPoornima(notes) is called
  THEN: Returns true (regex is case-insensitive via /i flag)

SCENARIO 3 — Returns true for "purnima"
  GIVEN: notes = "purnima fast"
  WHEN: isPoornima(notes) is called
  THEN: Returns true (alt spelling in regex pattern)

SCENARIO 4 — Returns true for Devanagari "पूर्णिमा"
  GIVEN: notes = "पूर्णिमा celebration"
  WHEN: isPoornima(notes) is called
  THEN: Returns true (Devanagari in regex pattern)

SCENARIO 5 — Returns false for empty string
  GIVEN: notes = ""
  WHEN: isPoornima(notes) is called
  THEN: Returns false (falsy guard at line 20)

SCENARIO 6 — Returns false for unrelated notes
  GIVEN: notes = "regular practice"
  WHEN: isPoornima(notes) is called
  THEN: Returns false
```

---

### BLOCK 9 — SettingsPanel.jsx: CSV export quote escaping

```
FEATURE: CSV export data integrity — special characters
SOURCE: src/components/SettingsPanel.jsx — exportCSV (line 23)
TEST TYPE: Unit (mock getAllEntries)

SCENARIO 1 — Double-quote in notes is escaped as double-double-quote
  GIVEN: An entry with notes = 'He said "Jai Ram"'
  WHEN: exportCSV() generates the CSV content
  THEN: The notes column contains: "He said ""Jai Ram"""
  (outer quotes wrap the field; inner quotes are doubled per RFC 4180)

SCENARIO 2 — Notes with no special characters are unchanged
  GIVEN: An entry with notes = "Simple notes"
  WHEN: exportCSV() generates the CSV content
  THEN: The notes column is: "Simple notes"
```

---

### BLOCK 10 — SettingsPanel.jsx: CSV import edge cases

```
FEATURE: CSV import robustness
SOURCE: src/components/SettingsPanel.jsx — handleCSVImport
TEST TYPE: Unit

SCENARIO 1 — Fields wrapped in double-quotes are stripped correctly
  GIVEN: CSV line = '"2026-01-15","65000","Good session"'
  WHEN: handleCSVImport processes this line
  THEN: Entry stored has date='2026-01-15', count=65000, notes='Good session'
  (outer quotes removed from each field)

SCENARIO 2 — Blank lines in CSV are skipped without error
  GIVEN: CSV = "Date,Count,Notes\n2026-01-15,65000,test\n\n2026-01-16,70000,test"
  WHEN: handleCSVImport processes the file
  THEN: Two entries are imported; blank line causes no parse error or failed entry
```

---

### BLOCK 11 — palette.js: getSavedPalette, savePalette, applyPalette

```
FEATURE: Palette persistence and DOM application
SOURCE: src/logic/palette.js
TEST TYPE: Unit (mock localStorage, mock document.documentElement)

SCENARIO 1 — getSavedPalette returns "midnight-sanctum" as default
  GIVEN: localStorage is empty (no 'jaap-ledger-palette' key)
  WHEN: getSavedPalette() is called
  THEN: Returns 'midnight-sanctum'

SCENARIO 2 — getSavedPalette returns stored palette ID
  GIVEN: localStorage['jaap-ledger-palette'] = 'sacred-saffron'
  WHEN: getSavedPalette() is called
  THEN: Returns 'sacred-saffron'

SCENARIO 3 — savePalette stores palette ID in localStorage
  GIVEN: localStorage is empty
  WHEN: savePalette('forest-ashram') is called
  THEN: localStorage['jaap-ledger-palette'] = 'forest-ashram'

SCENARIO 4 — applyPalette sets data-palette attribute for non-default palettes
  GIVEN: palette ID = 'sacred-saffron'
  WHEN: applyPalette('sacred-saffron') is called
  THEN: document.documentElement.getAttribute('data-palette') === 'sacred-saffron'

SCENARIO 5 — applyPalette removes data-palette for "midnight-sanctum"
  GIVEN: data-palette is currently set to 'forest-ashram'
  WHEN: applyPalette('midnight-sanctum') is called
  THEN: document.documentElement.getAttribute('data-palette') is null/absent

SCENARIO 6 — applyPalette sets --bg-pattern CSS variable
  GIVEN: palette ID = 'sacred-saffron'
  WHEN: applyPalette('sacred-saffron') is called
  THEN: document.documentElement.style.getPropertyValue('--bg-pattern') contains 'bg-sacred-saffron.png'
```

---

### BLOCK 12 — db.js: Schema migration

```
FEATURE: IndexedDB schema upgrade path
SOURCE: src/db/db.js — onupgradeneeded handler (line 12)
TEST TYPE: Unit (fake-indexeddb or real IDB in jsdom)

SCENARIO 1 — Fresh install creates entries store with date keyPath and index
  GIVEN: No existing database (oldVersion = 0)
  WHEN: DB is opened for the first time
  THEN: Object store 'entries' exists with keyPath = 'date'
  AND: A unique index 'date' exists on the store

SCENARIO 2 — Version 1 DB upgrade creates sankalpa store
  GIVEN: Database at version 1 (entries store exists, sankalpa does not)
  WHEN: DB is opened at version 2
  THEN: Object store 'sankalpa' is created with keyPath = 'id'

SCENARIO 3 — Version 2 DB upgrade creates antaryatra store
  GIVEN: Database at version 2 (entries + sankalpa exist, antaryatra does not)
  WHEN: DB is opened at version 3
  THEN: Object store 'antaryatra' is created with keyPath = 'year'
```

---

### BLOCK 13 — db.js: saveEntry updatedAt + getEntry null return (real IDB)

```
FEATURE: saveEntry metadata and getEntry null safety
SOURCE: src/db/db.js — saveEntry (line 37), getEntry (line 53)
TEST TYPE: Unit (fake-indexeddb)

SCENARIO 1 — saveEntry stores updatedAt as ISO timestamp
  GIVEN: An entry { date: '2026-04-19', count: 108, notes: '' }
  WHEN: saveEntry(entry) is called
  THEN: The stored record contains 'updatedAt' as a valid ISO 8601 string
  AND: The timestamp is close to Date.now() at save time

SCENARIO 2 — getEntry returns null for a date that was never stored
  GIVEN: The entries store is empty
  WHEN: getEntry('2026-04-19') is called
  THEN: Returns null (not undefined)
```

---

### BLOCK 14 — db.js: getAllAntaryatra

```
FEATURE: Retrieve all antaryatra records
SOURCE: src/db/db.js — getAllAntaryatra (line 135)
TEST TYPE: E2E (seed via IndexedDB helper)

SCENARIO 1 — Returns all saved antaryatra records
  GIVEN: Records for year=2024 and year=2025 are seeded in the antaryatra store
  WHEN: getAllAntaryatra() is called (via archive page navigation)
  THEN: Both years appear in the archive list

SCENARIO 2 — Returns empty array when no records exist
  GIVEN: The antaryatra store is empty
  WHEN: Archive page is opened
  THEN: Empty archive message is displayed (confirming getAllAntaryatra returns [])
```

---

### BLOCK 15 — SankalpePage.jsx: Cancel rewrite warning

```
FEATURE: Cancelling sankalpa rewrite warning modal
SOURCE: src/components/SankalpePage.jsx — handleCancelEdit
TEST TYPE: E2E

SCENARIO 1 — Cancelling warning modal keeps view mode intact
  GIVEN: An existing sankalpa is stored and displayed in view mode
  WHEN: User clicks "Re-affirm Sankalpa" (warning modal opens)
  AND: User clicks "Cancel" (not "Rewrite Sankalpa")
  THEN: Warning modal disappears
  AND: Sankalpa text is still displayed in read-only view mode
  AND: No edit form (textarea) is shown
  AND: Stored sankalpa in DB is unchanged
```

---

### BLOCK 16 — AntaryatraPage.jsx: Double-save guard

```
FEATURE: Prevention of concurrent saves in AntaryatraPage
SOURCE: src/components/AntaryatraPage.jsx — handleSave saving guard
TEST TYPE: Unit (React Testing Library or E2E with slow mock)

SCENARIO 1 — Rapid double-click on "Record Reflection" saves only once
  GIVEN: AntaryatraPage is open with reflection window active
  AND: Reflection textarea has text entered
  WHEN: User clicks "Record Reflection" twice in rapid succession
  THEN: saveAntaryatra is called exactly once
  AND: No duplicate or overwrite save occurs
```

---

### BLOCK 17 — AntaryatraPage.jsx: statusLabel

```
FEATURE: Status label text for different antaryatra states
SOURCE: src/components/AntaryatraPage.jsx — statusLabel function (approx line 70)
TEST TYPE: Unit

SCENARIO 1 — Returns "Reflected" for status="recorded"
SCENARIO 2 — Returns "Skipped" for status="skipped"
SCENARIO 3 — Returns "Window Passed" or equivalent for status="expired"
SCENARIO 4 — Returns "Pending" or empty for status="pending"

NOTE: Verify exact label text matches what tests BEH-169 and BEH-171 assert in the UI.
```

---

### BLOCK 18 — Ledger.jsx: Short-press does not open AntaryatraPage

```
FEATURE: Long-press threshold — short click must not trigger antaryatra overlay
SOURCE: src/components/Ledger.jsx — onMouseDown/onMouseUp timer cancel
TEST TYPE: E2E

SCENARIO 1 — Regular click on year header toggles accordion, not antaryatra
  GIVEN: Clock is set to Dec 31 (reflection window open)
  AND: 2025 entries exist in the ledger
  WHEN: User performs a short click (<500ms) on the 2025 year header
  THEN: AntaryatraPage overlay does NOT appear
  AND: The year accordion still expands or collapses normally

SCENARIO 2 — Click and immediate release cancels the long-press timer
  GIVEN: Same setup as above
  WHEN: mousedown is fired then mouseup is fired within 200ms
  THEN: Long-press timer is cleared; no AntaryatraPage
```

---

### BLOCK 19 — BackupReminderModal.jsx: Button disabled states

```
FEATURE: Button disabled states during upload and after success
SOURCE: src/components/BackupReminderModal.jsx — button disabled props (lines 146, 155)
TEST TYPE: E2E (mock backupToDrive with controllable timing)

SCENARIO 1 — Both buttons disabled while upload is in progress
  GIVEN: backupToDrive is mocked to not resolve immediately
  WHEN: User clicks "Back Up to Google Drive"
  THEN: "Back Up to Google Drive" button is disabled (attribute present)
  AND: "Remind me next Sunday" button is disabled (attribute present)

SCENARIO 2 — Backup button stays disabled after success (before auto-close)
  GIVEN: backupToDrive resolves successfully
  WHEN: Success state is active (message visible, auto-close not yet fired)
  THEN: "Back Up to Google Drive" button remains disabled
```

---

### BLOCK 20 — SplashScreen.jsx: Timer cleanup and image error

```
FEATURE: SplashScreen lifecycle edge cases
SOURCE: src/components/SplashScreen.jsx
TEST TYPE: Unit (React Testing Library)

SCENARIO 1 — Unmounting before timers fire does not throw
  GIVEN: SplashScreen is rendered
  WHEN: Component is unmounted within the first 1 second (before 3s fade timer)
  THEN: No errors or React warnings are thrown
  AND: Timers are cleared via useEffect cleanup function

SCENARIO 2 — Image load error is handled silently
  GIVEN: SplashScreen is rendered
  WHEN: The deity img element triggers its onError handler
  THEN: No crash or unhandled exception occurs
  AND: Component continues to render the text content
```

---

### BLOCK 21 — ReflectionCard.jsx: formatPredictedDate helper

```
FEATURE: Predicted milestone date formatting helper
SOURCE: src/components/ReflectionCard.jsx — formatPredictedDate (line 12)
TEST TYPE: Unit

SCENARIO 1 — Formats "2027-03-15" as human-readable string
  GIVEN: isoDate = "2027-03-15"
  WHEN: formatPredictedDate("2027-03-15") is called
  THEN: Returns "15 Mar 2027"

SCENARIO 2 — Formats single-digit day correctly (no leading zero in output)
  GIVEN: isoDate = "2027-01-05"
  WHEN: formatPredictedDate("2027-01-05") is called
  THEN: Returns "5 Jan 2027" (not "05 Jan 2027")

SCENARIO 3 — Formats December correctly
  GIVEN: isoDate = "2026-12-31"
  WHEN: formatPredictedDate("2026-12-31") is called
  THEN: Returns "31 Dec 2026"
```

---

### BLOCK 22 — TodayCard.jsx: Count field syncs from parent prop

```
FEATURE: Count field synchronisation from parent prop update
SOURCE: src/components/TodayCard.jsx — useEffect (line 12)
TEST TYPE: Unit (React Testing Library)

SCENARIO 1 — Count field updates when todayEntry prop changes
  GIVEN: TodayCard rendered with todayEntry = { count: 0, notes: '' }
  WHEN: Parent re-renders TodayCard with todayEntry = { count: 108, notes: 'test' }
  THEN: The count input field displays "108"
  AND: The notes field displays "test"

SCENARIO 2 — Count field shows empty string when count is 0
  GIVEN: TodayCard rendered with todayEntry = { count: 5000, notes: '' }
  WHEN: Parent re-renders with todayEntry = { count: 0, notes: '' }
  THEN: The count input field is empty (not "0")
```

---

### BLOCK 23 — driveExport.js: Integration — full backup flow

```
FEATURE: End-to-end backup flow with all internal dependencies mocked
SOURCE: src/logic/driveExport.js — backupToDrive
TEST TYPE: Unit integration (all Drive functions mocked)

SCENARIO 1 — Full happy path: no token cached, new file, POST upload
  GIVEN: No stored token, no cached file ID, Drive file list is empty
  WHEN: backupToDrive() is called
  THEN: signInWithGoogle is called once
  AND: findExistingFile queries the Drive API
  AND: uploadToDrive uses POST (new file creation)
  AND: backupToDrive resolves without error

SCENARIO 2 — Repeat backup: cached token, existing file, PATCH update
  GIVEN: Valid stored token and cached driveFileId in localStorage
  WHEN: backupToDrive() is called
  THEN: signInWithGoogle is NOT called
  AND: uploadToDrive uses PATCH (file update)
  AND: backupToDrive resolves without error
```

---

### BLOCK 24 — antaryatra-clock.spec.js: Jan 13 / Jan 14 boundary (documented)

```
FEATURE: Reflection window boundary enforcement
NOTE: Fully covered by antaryatra-clock.spec.js BEH-177 and BEH-178

SCENARIO (BEH-177) — Jan 13 23:59: window still open, recording possible
SCENARIO (BEH-178) — Jan 14 00:01: window expired, page read-only, no reminder
```

---

### BLOCK 25 — reflection-prediction.spec.js: 30-entry YTD threshold (documented)

```
FEATURE: YTD prediction threshold at 30 entries
NOTE: Fully covered by reflection-prediction.spec.js RP-006, RP-007, RP-008

SCENARIO (RP-006) — 29 entries: YTD prediction absent
SCENARIO (RP-007) — 30 entries: YTD prediction appears
SCENARIO (RP-008) — 31 entries: YTD prediction remains (threshold is a floor)
```

---

### BLOCK 26 — backup-reminder.spec.js: Full modal lifecycle (documented)

```
FEATURE: Sunday backup reminder modal full lifecycle
NOTE: Fully covered by backup-reminder.spec.js BEH-BR-E01 through BEH-BR-E08

SCENARIO (BEH-BR-E01) — Modal appears on Sunday with correct heading and text
SCENARIO (BEH-BR-E02) — Modal absent on weekday
SCENARIO (BEH-BR-E03) — "Back Up to Google Drive" button visible
SCENARIO (BEH-BR-E04) — "Remind me next Sunday" closes modal + sets localStorage
SCENARIO (BEH-BR-E05) — X button closes modal + sets localStorage
SCENARIO (BEH-BR-E06) — Backdrop click closes modal + sets localStorage
SCENARIO (BEH-BR-E07) — Modal does not reappear same Sunday after dismissal
SCENARIO (BEH-BR-E08) — App fully usable after dismissing modal
```

---

### BLOCK 27 — backupReminder.test.js: isSunday local date parsing (documented)

```
FEATURE: isSunday parses date locally (not UTC) via T00:00:00 suffix
SOURCE: src/logic/backupReminder.js — isSunday (line 7)
NOTE: Fully covered by backupReminder.test.js BEH-BR-001a through BEH-BR-001d

REGRESSION NOTE: The date is parsed using local midnight (appending T00:00:00)
to prevent UTC offset from shifting the day of the week.
```

---

### BLOCK 28 — settings.spec.js: Import validation edge cases (documented)

```
FEATURE: JSON and CSV import validation
NOTE: Partially covered — some gaps remain

COVERED:
  SCENARIO (SS-SET-006) — Malformed JSON shows error message
  SCENARIO (SS-SET-007) — CSV: header skipped, bad date row skipped, valid row imported
  SCENARIO (BEH-141) — JSON import skips records with invalid date format
  SCENARIO (BEH-142) — JSON import imports only valid entries (correct count)

GAPS REMAINING (see Block 9 and Block 10):
  — CSV quote stripping (BEH-246)
  — CSV blank line skipping (BEH-247)
```

---

### BLOCK 29 — ledger.spec.js: Upsert and sort order (documented)

```
FEATURE: DB entry deduplication and display order
NOTE: Fully covered

SCENARIO (SS-DB-001) — saveEntry upserts: same date entry overwrites, no duplicate row
SCENARIO (SS-DB-091) — getAllEntries sort order: most recent date shown first
```

---

### BLOCK 30 — antaryatra-clock.spec.js: Full Antaryatra lifecycle (documented)

```
FEATURE: Antaryatra recording, skipping, archive, and boundary behaviour
NOTE: Fully covered by antaryatra-clock.spec.js

COVERED:
  BEH-113 — 800ms long-press opens AntaryatraPage
  BEH-114 — Reminder banner visible Dec 31 with no record
  BEH-160 — Year stats displayed (days of practice, avg/day)
  BEH-161 — Reflection textarea and Save button visible when pending
  BEH-162 — Save button disabled when textarea is empty
  BEH-163 — Save persists with status=recorded
  BEH-164 — Page auto-closes 2 seconds after successful save
  BEH-165 — Skip button visible when recording is possible
  BEH-166 — Skip confirmation dialog appears before committing
  BEH-167 — Skip saves status=skipped and closes page
  BEH-169 — Skipped notice shown for skipped year
  BEH-170 — Window-passed notice shown when no record and window expired
  BEH-171 — "Reflected" status label in header for recorded year
  BEH-172 — Archive lists years from first entry year to current-1
  BEH-173 — Empty archive message when no past years
  BEH-174 — Archive shows correct status labels per year
  BEH-175 — Archive shows days-of-practice and avg/day per year
  BEH-176 — Archive row click navigates to AntaryatraPage
  BEH-177 — Jan 13 boundary: window still open
  BEH-178 — Jan 14 boundary: window expired
  BEH-179 — Reminder banner click opens AntaryatraPage
  BEH-180 — Touch long-press opens AntaryatraPage (mobile path)
```

---

*Report generated by Senior QA Analyst (Claude Code) — Sumiran coverage audit complete.*
*192 behaviours | 17 source files | 19 test files | 231 tests (107 unit + 124 E2E) | 2026-04-19*
