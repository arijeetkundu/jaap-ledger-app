# Claude Code for QA Engineers — Learning Path

> **Your Profile:** Senior QA/PM, 21 years testing experience, learning Claude Code from a tester's lens  
> **Learning Vehicle:** JAAP-LEDGER (Sumiran) app

---

## What You Will Learn (in order)

| Module | Topic | What You'll Be Able To Do |
|--------|-------|--------------------------|
| **01** | [CLAUDE.md — Your Project Briefing](./01-claude-md.md) | Make Claude understand your project without re-explaining every time |
| **02** | [Requirements Analysis Agent](./02-requirements-analysis-agent.md) | Analyse incoming requirements for ambiguity, completeness, and testability |
| **02b** | [Test Coverage Analysis Agent](./02b-coverage-analysis-agent.md) | Audit existing code vs existing tests to find coverage gaps |
| **03** | [Test Scenario Agent](./03-test-scenario-agent.md) | Generate complete test scenarios from verified requirements |
| **04** | [Test Case Agent](./04-test-case-agent.md) | Create detailed, step-by-step test cases |
| **05** | [Test Data Agent](./05-test-data-agent.md) | Generate test data (valid, invalid, boundary values) |
| **06** | [Automation Script Agent](./06-automation-agent.md) | Convert manual test cases into Playwright automation scripts |
| **07** | [Test Execution Agent](./07-execution-agent.md) | Run tests and capture results |
| **08** | [Defect Logging Agent](./08-defect-agent.md) | Auto-log failures as structured defect reports |
| **09** | [Test Report Agent](./09-report-agent.md) | Generate test summary reports |
| **10** | [Self-Healing Agent](./10-self-healing-agent.md) | Auto-fix broken test selectors when UI changes |
| **11** | [CI/CD Integration](./11-cicd-agent.md) | Wire everything into a pipeline |

---

## The Big Picture — What We Are Building

```
┌─────────────────────────────────────────────────────────┐
│                  STLC AGENT PIPELINE                    │
│                                                         │
│  📋 Requirements  →  🎯 Scenarios  →  📝 Test Cases     │
│         ↓                                               │
│  🔧 Automation Scripts  ←  📦 Test Data                 │
│         ↓                                               │
│  ▶️  Execution  →  🐛 Defect Log  →  📊 Report          │
│         ↓                                               │
│  🔄 Self-Healing (when UI changes break tests)          │
│         ↓                                               │
│  🚀 CI/CD (runs automatically on every code change)     │
└─────────────────────────────────────────────────────────┘
```

---

## How Claude Code "Agents" Work (Simple Explanation)

Think of a Claude Code **agent** as a **specialist tester** you can brief and deploy:

- A **Requirements Analysis Agent** is like a Business Analyst who reviews an incoming requirement for quality — before it reaches the test team
- A **Coverage Analysis Agent** is like a QA Auditor who reads existing code and tests to find gaps
- A **Test Case Agent** is like a senior QA who writes detailed test cases
- An **Automation Agent** is like an SDET who converts those cases into scripts
- A **Self-Healing Agent** is like a maintenance engineer who fixes broken scripts

You give each agent a **briefing** (a prompt or CLAUDE.md instructions), and Claude carries out the work.

---

## Start Here

Go to **[Module 01 — CLAUDE.md](./01-claude-md.md)** to begin.
