# 🪔 Sumiran — सुमिरन

> *Remembrance of God through repetition*

**Sumiran** is a beautiful, offline-first Progressive Web App (PWA) for tracking your daily chanting (Jaap) practice. Built with devotion for sadhaks who wish to keep a faithful record of their spiritual discipline.

---

## ✨ Features

- **Today Card** — Enter your daily Jaap count and notes. Pre-populates if you've already saved today.
- **Reflection Card** — See your lifetime total, current year total, milestone progress, predicted completion date, and full milestone history.
- **Ledger** — A complete history of your practice, grouped by year. Sundays highlighted in crimson. Editable within 7 days.
- **Milestones** — Every Crore (1,00,00,000) is celebrated with the date achieved and days since the previous milestone.
- **Prediction** — Two predictions side by side: your **30-day rolling pace** and your **year-to-date (YTD) pace**. The YTD prediction appears once you have 30 or more non-zero entry days in the current calendar year, letting you see both your recent momentum and your annual average at a glance.
- **Sankalpa Layer** — A single, sacred, immutable record of the intent with which your sādhanā began. Not a goal. A remembrance.
- **Antaryātrā** — A once-a-year reflective practice. On the last day of each year, a quiet invitation appears to record your inner journey. The window stays open for 14 days.
- **Antaryātrā Archive** — A silent, read-only record of all past annual reflections, with days of practice and average per day for each year.
- **Import** — Bring in years of past data from a JSON or CSV file.
- **Export** — Download your complete data as JSON or CSV backup anytime.
- **Google Drive Backup** — Connect your Google account once and your data is automatically backed up to Google Drive every week. Each sadhak backs up to their own Drive. Export as JSON also triggers a Drive upload when connected.
- **Colour Palettes** — Three devotional themes: Midnight Sanctum, Sacred Saffron, Forest Ashram.
- **Offline First** — Works completely without internet after first load.
- **Indian Number Format** — All counts displayed in Indian format (1,00,00,000).

---

## 🕯️ The Three Layers

> *Most apps track what you did. Sumiran also preserves why you began — and what each year held.*

| Layer | What it holds |
|---|---|
| **Sankalpa** | Why you began — a vow of intent, set once, enduring always |
| **Ledger** | What you did — every day, every count, every year |
| **Antaryātrā** | What the year held — a once-a-year reflection, sealed and silent |

---

## 🕯️ Sankalpa Layer

The Sankalpa Layer is a single sacred record — set once, enduring always — that lives quietly behind the ledger. It records your vow of intent, an optional context (Guru, Devatā, occasion), and the date of establishment.

It is not shown loudly. It does not alter any count. Changing it requires deliberate confirmation — a moment of pause that mirrors the gravity of rewriting a vow.

---

## 🚶 Antaryātrā

Antaryātrā (अन्तर्यात्रा) means the inner journey. It is a once-a-year reflective practice — not analytics, not tracking, but स्मृति (smṛti): remembrance and integration.

**How it works:**
- On 31 December of each year, a subtle "Reflect on [year] →" reminder appears under the year header in the Ledger
- Long-pressing the year header (or clicking on mobile) opens the Antaryātrā page
- The reflection window stays open for 14 days (until 13 January)
- Once recorded, the reflection is sealed — it cannot be edited
- If skipped or expired, no further prompts are shown
- All past reflections are accessible in the Antaryātrā Archive (Settings)

---

## ☁️ Google Drive Backup

Sumiran can automatically back up your ledger to your personal Google Drive once a week.

**How it works:**
- Go to **Settings → Google Drive Backup** and click **Connect Google Drive**
- Sign in with your Google account — a one-time step
- From that point on, every time you open the app after 7 or more days since the last backup, it silently uploads `sumiran-backup.json` to your Drive
- **Export as JSON** also uploads to Drive automatically when connected
- Each backup overwrites the previous file — no duplicates

**Privacy:**
- Each sadhak connects their **own** Google account
- Data goes to **their own** Drive — no one else can see it
- Disconnecting removes all stored credentials from the device

**For sadhaks using the Netlify app:**
The app is currently in Google's Testing mode. To enable Drive backup for a fellow sadhak, the developer must add their Gmail address as a Test User in the Google Cloud Console.

---

## 📱 Install as an App

Sumiran is a PWA — it can be installed on any device like a native app.

### Android (Chrome)
1. Open Chrome and visit the app URL
2. Tap the three dots menu (⋮)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **Install**

### iOS (Safari)
1. Open **Safari** (must be Safari, not Chrome)
2. Visit the app URL
3. Tap the **Share button** (□↑)
4. Tap **"Add to Home Screen"**
5. Tap **Add**

### Windows / Mac (Chrome or Edge)
1. Visit the app URL
2. Click the install icon (⊕) in the address bar
3. Click **Install**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + Vite |
| Database | IndexedDB v3 (entries + sankalpa + antaryatra stores) |
| PWA | vite-plugin-pwa + Workbox |
| Unit Testing | Vitest |
| E2E Testing | Playwright |
| Styling | Pure CSS with CSS Variables |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Deployment | Netlify (auto-deploy from GitHub) |
| Drive Backup | Google Drive API + Google Identity Services (OAuth 2.0) |

---

## 🚀 Getting Started (Developers)

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
git clone https://github.com/arijeetkundu/jaap-ledger-app.git
cd jaap-ledger-app
npm install
npx playwright install
```

### Development

```bash
npm run dev
npm run dev -- --host   # expose on local network for mobile testing
```

### Testing

```bash
npm test                # unit tests
npm run test:watch      # watch mode
npm run test:e2e        # E2E tests
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
sumiran/
├── public/
│   ├── deity.png                        # Splash screen deity image
│   ├── icons/                           # PWA icons
│   └── bg-*.png                         # Background patterns per palette
├── src/
│   ├── components/
│   │   ├── TodayCard.jsx                # Daily entry form
│   │   ├── ReflectionCard.jsx           # Lifetime stats & milestones
│   │   ├── Ledger.jsx                   # Historical entries + Antaryātrā trigger
│   │   ├── SplashScreen.jsx             # App launch screen
│   │   ├── SettingsPanel.jsx            # Import, export, palette, Sankalpa, Archive
│   │   ├── SankalpePage.jsx             # Sacred Sankalpa full-screen page
│   │   ├── AntaryatraPage.jsx           # Annual reflection page (record & view)
│   │   └── AntaryatraArchivePage.jsx    # Archive of all past reflections
│   ├── logic/
│   │   ├── formatIndianNumber.js        # Indian number formatting
│   │   ├── milestoneLogic.js            # Crore milestones, 30-day & YTD prediction
│   │   ├── ledgerLogic.js               # Date filling, Sunday detection
│   │   ├── antaryatraLogic.js           # Window logic, status, stats
│   │   ├── driveExport.js               # Google Drive OAuth + backup logic
│   │   └── palette.js                   # Colour palette management
│   ├── db/
│   │   └── db.js                        # IndexedDB service (v3)
│   └── tests/
│       ├── unit/                        # Vitest unit tests (64 tests)
│       └── e2e/                         # Playwright E2E tests (55 tests)
├── vite.config.js
└── playwright.config.js
```

---

## 🧪 Test Coverage

```
Unit Tests      107 passing  ✅
E2E Tests       120 passing  ✅
──────────────────────────────
Total           227 passing  ✅
```

Unit test highlights:
- Antaryātrā logic — reflection window boundaries, expiry, status, year stats
- Milestone logic — getCurrentMilestone, getMilestoneProgress, getMilestoneHistory, predictNextMilestone, predictNextMilestoneYTD
- Ledger logic — date filling, Sunday detection
- Indian number formatting
- Palette — applyPalette, getSavedPalette
- DB layer — saveEntry, getAllEntries, deleteEntry
- Google Drive — token validity, expiry, clearAuth, shouldAutoExport (7-day logic)

E2E test highlights:
- Full Reflection Card YTD prediction suite — 35 tests across Happy Path, BVA, Negative, State, Regression, UI/UX, and Integration types
- Antaryātrā — 22 tests with Playwright clock mocking for Dec 31 flows, Jan 13/14 boundary conditions, mobile touch long-press, and reminder banner
- Ledger — upsert, sort order, year toggle, Indian number format, dash display, 7-day edit lock, Poornima emoji, notes indicator
- Settings — export CSV/JSON, import CSV/JSON, backdrop close, archive navigation, Google Drive connect/disconnect
- Splash screen, Today Card, Sankalpa, DB operations

---

## 📖 Data Format

### Import JSON Format
```json
[
  { "date": "2023-04-14", "jaap": 20000, "notes": "" },
  { "date": "2023-04-15", "jaap": 20000, "notes": "Good session" }
]
```

### Antaryātrā Record Schema
```json
{
  "year": 2025,
  "status": "recorded",
  "text": "This was the year I learned that consistency matters more than count.",
  "recordedOn": "2025-12-31",
  "timezone": "Asia/Kolkata"
}
```

---

## 🎨 Colour Palettes

| Palette | Background | Accent | Description |
|---|---|---|---|
| Midnight Sanctum | #0B1628 | #C9A84C | Default — serene and grounding |
| Sacred Saffron | #1A0A0A | #E8820A | Warm and fiery devotion |
| Forest Ashram | #0A1A0F | #B8A830 | Calm and earthy stillness |

---

## 🙏 Contributing

This app is built with love for the sadhak community. Contributions, suggestions and bug reports are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## 📄 Licence

MIT Licence — free to use, share and modify.

---

*Built with 🙏 for sadhaks everywhere.*

*Jai Shri Ram* 🪔