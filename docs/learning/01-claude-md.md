# Module 01 — CLAUDE.md: Your Project Briefing File

## What is CLAUDE.md?

Every time you open Claude Code in a project folder, Claude starts fresh — it has no memory of previous conversations.

**CLAUDE.md solves this problem.** It is a special text file you place at the root of your project. Claude Code reads it *automatically* at the start of every conversation. Think of it as:

> **The test manager's onboarding document** — the briefing you give a new team member before they start testing your application.

Without CLAUDE.md, you would have to re-explain your app every single session.  
With CLAUDE.md, Claude already knows the app, how to run tests, and your testing philosophy.

---

## What Goes in CLAUDE.md?

| Section | Why It Matters for Testing |
|---------|---------------------------|
| **App Overview** | Claude knows what the app does — so test scenarios make sense |
| **Tech Stack** | Claude knows what test tools are available (Vitest, Playwright, etc.) |
| **How to Run Tests** | Claude can execute tests without asking you |
| **Project Structure** | Claude knows where test files live |
| **Key Features** | Claude can target the right components for testing |
| **Testing Philosophy** | Sets expectations (unit vs E2E, what to test where) |

---

## The CLAUDE.md We Created for JAAP-LEDGER

We already created your CLAUDE.md. Open it here: [CLAUDE.md](../../CLAUDE.md)

Key sections it contains:
- **What is this app** — explains Sumiran is a Jaap tracking PWA
- **Project Structure** — where components, logic, and tests live
- **How to Run Tests** — exact commands for unit and E2E tests
- **Key Features table** — all 6 major features with their components
- **Testing Context** — tells Claude this is a learning project for STLC agents

---

## How to Update CLAUDE.md (Your Job as QA Lead)

As the application grows and you learn more, update CLAUDE.md to reflect:

1. **New features** — add them to the Key Features table
2. **Known issues** — "Note: Antaryatra page is still being built, skip for now"
3. **Test coverage gaps** — "Sankalpa page has no unit tests yet"
4. **Testing rules** — "Always test in Midnight Sanctum palette (default)"

### Example — Adding a new rule to CLAUDE.md

Say you notice tests fail when the palette is not reset. You would add to CLAUDE.md:
```
## Testing Rules
- Always reset palette to Midnight Sanctum after palette tests
- E2E tests require the dev server to be running on port 5173
```

---

## Try It Now — Exercise 1

Type this prompt into Claude Code (in the jaap-ledger folder):

```
Read the CLAUDE.md and tell me:
1. What are the 6 key features of this app?
2. What test command runs E2E tests?
3. Where do the unit tests live?
```

Claude should answer all three from CLAUDE.md without needing to explore the project — because it already read it.

---

## Key Takeaway

> **CLAUDE.md = your project's test strategy briefing document**  
> Write it once. Claude reads it every session. No repeated explanations.

---

**Next:** [Module 02 — Requirements Analysis Agent](./02-requirements-agent.md)
