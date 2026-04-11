# Module 10 — Self-Healing Agent

## The Problem This Solves

Imagine this scenario:
- You have 50 automated tests working perfectly
- A developer changes a button label from "Save" to "Save Entry"
- All 12 tests that look for "Save" button now fail
- You must find and fix every test manually

This is called **test brittleness** — a small UI change breaks many tests.

A **Self-Healing Agent** detects when tests break due to UI changes (not real bugs) and fixes the test selectors automatically.

---

## How Automation Scripts Find UI Elements (Selectors)

Playwright finds elements on the page using "selectors":
- `button:has-text("Save")` — find a button with text "Save"
- `#jaap-count` — find element with ID "jaap-count"
- `.card` — find element with class "card"

When the UI changes, these selectors may break.

---

## Types of Selector Failures

| Failure Type | Example | Self-Healable? |
|-------------|---------|----------------|
| Text changed | "Save" → "Save Entry" | YES |
| ID changed | `#jaap-count` → `#jaap-input` | YES |
| Element moved | Button in different location | SOMETIMES |
| Feature removed | Button no longer exists | NO (real bug) |
| Layout restructure | Completely different HTML | Needs review |

---

## Exercise 10A — Detect Broken Selectors

```
Act as a Self-Healing Test Agent.

Read the current UI component: src/components/TodayCard.jsx
Read the current E2E tests: src/tests/e2e/app.spec.js

For every selector used in the tests, verify:
1. Does the element still exist in the component code?
2. Is the selector still valid?
3. Is there a BETTER, more stable selector available?

Report:
- SELECTOR: what the test uses to find the element
- STATUS: Valid / Broken / At-Risk
- REASON: why it might break
- RECOMMENDED SELECTOR: a more stable alternative

Prioritize using these selector types (from most stable to least):
1. data-testid attributes (most stable — developers set these for testing)
2. ARIA roles (button[role="button"])
3. Unique IDs (#jaap-count)
4. Text content (least stable — changes with UI updates)
```

---

## Exercise 10B — Simulate a UI Change and Self-Heal

This is a simulation exercise to understand self-healing:

```
SIMULATION: Imagine the developer changed the Save button label from "Save" to "Save Jaap"

In src/tests/e2e/app.spec.js, find all places that look for a "Save" button.

For each one:
1. Show the current selector
2. Show what it would look like after this UI change breaks it
3. Propose a self-healing fix that is resilient to text changes
   (Hint: using data-testid attributes is more resilient than text)
4. Show the fixed selector

Do NOT actually change the test file yet — just show me the analysis.
```

---

## Exercise 10C — Add data-testid Attributes (Long-term Prevention)

The best self-healing strategy is prevention. Ask Claude to:

```
Review src/components/TodayCard.jsx

Add data-testid attributes to all interactive elements and important landmarks:
- The count input field
- The notes field
- The Save button
- The "Saved!" confirmation state
- The Today Card container

Then update src/tests/e2e/app.spec.js to use these data-testid selectors
instead of text-based selectors where possible.

Explain why data-testid makes tests more self-healing.
```

---

## The Self-Healing Philosophy

> **Prevention > Detection > Cure**

1. **Prevent** brittleness by using stable selectors (data-testid)
2. **Detect** broken selectors before they fail in production (selector audit)
3. **Cure** broken tests quickly by having Claude analyze and fix them

---

**Next:** [Module 11 — CI/CD Integration](./11-cicd-agent.md)
