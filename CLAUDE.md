# JAAP-LEDGER (Sumiran) — Claude Code Guide

## What is this app?
**Sumiran** is a personal PWA (Progressive Web App) for tracking daily Jaap (prayer/mantra repetition) counts.
Built with React 19 + Vite. Data is stored locally in the browser using IndexedDB.

---

## Project Structure

```
src/
  components/       — UI components (Ledger, TodayCard, ReflectionCard, etc.)
  logic/            — Business logic (calculations, date handling, milestones)
  db/               — IndexedDB database layer
  tests/
    unit/           — Vitest unit tests (logic functions)
    e2e/            — Playwright end-to-end browser tests
```

---

## How to Run the App

```bash
npm run dev          # Start local dev server at http://localhost:5173
npm run build        # Build for production
```

---

## How to Run Tests

```bash
npm test                  # Run all unit tests (Vitest)
npm run test:watch        # Run unit tests in watch mode
npm run test:e2e          # Run E2E tests (Playwright) — app must be running first
npm run test:e2e:ui       # Run E2E tests with Playwright visual UI
```

> **Note for E2E tests:** Start the app with `npm run dev` in one terminal, then run `npm run test:e2e` in another.

---

## Architecture Decisions

- **No backend** — everything is local browser storage (IndexedDB via `src/db/db.js`)
- **Logic is separated** — all calculations live in `src/logic/` files, making them easy to unit test
- **PWA** — app works offline, can be installed on mobile/desktop

---

## Testing Philosophy

- **Unit tests** cover pure logic functions (date math, count calculations, milestone checks)
- **E2E tests** cover user flows (save count, change palette, open settings, etc.)
- Tests live alongside source code in `src/tests/`

---

## Key Features

| Feature | Component | What it does |
|---------|-----------|--------------|
| Today Card | TodayCard.jsx | Enter today's Jaap count + notes |
| Ledger | Ledger.jsx | View all historical entries by year/month |
| Reflection | ReflectionCard.jsx | Lifetime and streak statistics |
| Settings | SettingsPanel.jsx | Export data, change color palette |
| Sankalpa | SankalpePage.jsx | Set spiritual intention/commitment |
| Antaryatra | AntaryatraPage.jsx | Inner journey journaling |

---

## Learning Context

This project is used as a learning playground for exploring **Claude Code testing capabilities**:
- STLC Agents (Requirements → Scenarios → Cases → Automation → Data → Execution → Defects → Reports)
- Self-Healing test agents
- CI/CD integration

The user is a **Senior QA Engineer / Project Manager** (21 years testing experience) — all explanations should be from a **tester's perspective**, not a developer's.
