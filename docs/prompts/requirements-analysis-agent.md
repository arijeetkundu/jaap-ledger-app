# Requirements Analysis Agent — Reusable Prompt Template

**Purpose:** Analyse an incoming requirement for quality before it enters the test pipeline.  
**When to use:** Every time a new requirement, user story, or feature request arrives.  
**Output location:** `docs/test-artifacts/requirements/[FEATURE-NAME]-requirement-review.md`

---

## How to Use This Template

1. Copy everything inside the prompt block below
2. Paste it into Claude Code
3. Replace every `[PLACEHOLDER]` with your actual content
4. Run it — review the output before passing to the Test Scenario Agent

---

## Prompt

```
Act as a Senior Business Analyst and QA Lead reviewing an incoming requirement
for the [PROJECT NAME] application.

Analyse the requirement I provide below for these 5 quality dimensions:

1. AMBIGUITY
   - Identify any vague words or phrases (e.g. "fast", "user-friendly",
     "should work correctly", "appropriate", "valid")
   - For each: quote the exact phrase, explain why it is ambiguous,
     and suggest a precise, measurable replacement

2. COMPLETENESS
   - What scenarios are NOT mentioned but should be?
   - Consider: error states, empty states, boundary values,
     new user vs returning user, offline behaviour, concurrent use
   - List each missing scenario as a gap

3. ACCEPTANCE CRITERIA QUALITY
   For each acceptance criterion (AC), assess:
   - Is it MEASURABLE? (specific number/state, not a feeling)
   - Is it TESTABLE? (clear Pass/Fail outcome possible)
   - Does it cover NEGATIVE scenarios? (not just happy path)
   - Flag each AC as: GOOD / NEEDS IMPROVEMENT / MISSING

4. DEPENDENCIES
   - Does this requirement assume another feature exists?
   - Does it depend on another team, API, or system?
   - List all assumptions being made

5. RISK
   - What is the risk if this requirement is misunderstood by developers?
   - What is the risk if this requirement is misunderstood by testers?

OUTPUT FORMAT:
Produce a REQUIREMENT QUALITY REPORT with these sections:

## Original Requirement (quoted exactly)
## Issues Found
   - Ambiguity issues (table: Phrase | Why Ambiguous | Suggested Fix)
   - Completeness gaps (bulleted list)
   - AC quality issues (table: AC | Status | Improvement Needed)
   - Dependencies and assumptions (table: Dependency | Risk)
## Improved Requirement (rewritten version, ready for test scenario generation)
## Suggested Acceptance Criteria (rewritten properly — measurable and testable)
## Verdict: Ready for Test Scenario Generation?
   YES / NO / CONDITIONAL (with specific reason)

Save the output to:
docs/test-artifacts/requirements/[FEATURE-NAME]-requirement-review.md

---
REQUIREMENT TO ANALYSE:

[PASTE THE RAW REQUIREMENT HERE — user story, BRD excerpt, email, or ticket text]

```

---

## Placeholder Reference

| Placeholder | Replace With |
|-------------|-------------|
| `[PROJECT NAME]` | Your app name (e.g. Sumiran, Banking Portal) |
| `[FEATURE-NAME]` | Short name for the feature in kebab-case (e.g. daily-goal, fund-transfer) |
| `[PASTE THE RAW REQUIREMENT HERE]` | The exact requirement text as received — do not clean it up first |

---

## Example (for reference)

- Project Name: `Sumiran`
- Feature Name: `daily-goal`
- Output saved at: `docs/test-artifacts/requirements/daily-goal-requirement-review.md`
