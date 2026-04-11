# Module 02 — Requirements Analysis Agent

## What This Agent Does

When a **new requirement** arrives — from a client email, a user story, a Jira ticket, or a verbal discussion — it is rarely perfect. It may be:
- **Ambiguous** — open to different interpretations
- **Incomplete** — missing error scenarios, edge cases, or empty states
- **Untestable** — acceptance criteria that cannot result in a clear Pass/Fail
- **Assumptive** — depends on something that hasn't been built or agreed upon

The Requirements Analysis Agent reads the raw requirement and produces a **quality-reviewed, improved version** that is ready to be handed to the Test Scenario Agent.

> As a 21-year QA veteran, you already do this mentally. This agent externalises and documents that thinking — at speed, at scale.

---

## Where It Sits in the STLC

```
📄 Raw Requirement (user story / email / BRD excerpt)
          │
          ▼
  [REQUIREMENTS ANALYSIS AGENT]   ← This module
  Analyses for: Ambiguity, Completeness, Testability, AC Quality
          │
          ▼
  Improved Requirement + Quality Report
          │
          ▼
  [TEST SCENARIO AGENT]  →  Module 03
```

---

## The Agent Prompt

Copy everything inside the box and paste it into Claude Code, replacing the placeholder at the bottom with your actual requirement:

```
Act as a Senior Business Analyst and QA Lead reviewing an incoming requirement.

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
   - AC quality issues (table: AC | Status | Improvement needed)
   - Dependencies and assumptions
## Improved Requirement (rewritten version, ready for test scenario generation)
## Suggested Acceptance Criteria (if missing or weak — write them properly)
## Verdict: Ready for Test Scenario Generation?
   YES / NO / CONDITIONAL (with reason)

---
REQUIREMENT TO ANALYSE:

[PASTE YOUR REQUIREMENT HERE]
```

---

## Exercise — Try It on a New Sumiran Feature

Here is a realistic new requirement for the Sumiran app. Paste the full agent prompt above into Claude Code, replacing the placeholder with this:

```
As a user, I want to set a daily Jaap goal so that I can track whether
I have met my target each day.

Acceptance Criteria:
- User can enter a daily goal
- The app shows if the goal was met
- The goal should be saved
```

Watch how the agent finds what is missing, what is vague, and what acceptance criteria need to be added.

---

## What Good Output Looks Like

The agent should flag issues like:
- "User can enter a daily goal" — what is the valid range? Can the goal be 0? Can it be changed daily or is it fixed?
- "The app shows if the goal was met" — where? In the Today Card? In the Ledger? As a colour, icon, or text?
- "The goal should be saved" — saved per day or as a permanent setting? What happens if no goal is set?
- Missing: What happens if today's count exceeds the goal? What if the goal is set after the count is already saved?

---

## Save the Output

Ask Claude to save the quality report as:
```
docs/test-artifacts/requirements/[feature-name]-requirement-review.md
```

This becomes the verified input for the Test Scenario Agent in Module 03.

---

**Next:** [Module 02b — Test Coverage Analysis Agent](./02b-coverage-analysis-agent.md)
