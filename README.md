# 🪔 Sumiran — सुमिरन

> *Remembrance of God through repetition*

**Sumiran** is a beautiful, offline-first Progressive Web App (PWA) for tracking your daily chanting (Jaap) practice. Built with devotion for sadhaks who wish to keep a faithful record of their spiritual discipline.

---

## ✨ Features

- **Today Card** — Enter your daily Jaap count and notes. Pre-populates if you've already saved today.
- **Reflection Card** — See your lifetime total, current year total, milestone progress, predicted completion date, and full milestone history.
- **Ledger** — A complete history of your practice, grouped by year. Sundays highlighted in crimson. Editable within 7 days.
- **Milestones** — Every Crore (1,00,00,000) is celebrated with the date achieved and days since the previous milestone.
- **Prediction** — Based on your 30-day average, Sumiran predicts when you'll reach your next Crore.
- **Import** — Bring in years of past data from a JSON or CSV file.
- **Export** — Download your complete data as JSON or CSV backup anytime.
- **Colour Palettes** — Three devotional themes: Midnight Sanctum, Sacred Saffron, Forest Ashram.
- **Offline First** — Works completely without internet after first load.
- **Indian Number Format** — All counts displayed in Indian format (1,00,00,000).

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
| Database | IndexedDB (offline, browser-local) |
| PWA | vite-plugin-pwa + Workbox |
| Unit Testing | Vitest + React Testing Library |
| E2E Testing | Playwright |
| Styling | Pure CSS with CSS Variables |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Deployment | Netlify (auto-deploy from GitHub) |

---

## 🚀 Getting Started (Developers)

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/arijeetkundu/jaap-ledger-app.git
cd jaap-ledger-app

# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

### Development

```bash
# Start dev server
npm run dev

# Run on local network (for mobile testing)
npm run dev -- --host
```

### Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
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
│   ├── deity.png                    # Splash screen deity image
│   ├── icons/                       # PWA icons
│   └── bg-*.png                     # Background patterns per palette
├── src/
│   ├── components/
│   │   ├── TodayCard.jsx            # Daily entry form
│   │   ├── ReflectionCard.jsx       # Lifetime stats & milestones
│   │   ├── Ledger.jsx               # Historical entries
│   │   ├── SplashScreen.jsx         # App launch screen
│   │   └── SettingsPanel.jsx        # Import, export, palette
│   ├── logic/
│   │   ├── formatIndianNumber.js    # Indian number formatting
│   │   ├── milestoneLogic.js        # Crore milestones & prediction
│   │   ├── ledgerLogic.js           # Date filling, Sunday detection
│   │   └── palette.js               # Colour palette management
│   ├── db/
│   │   └── db.js                    # IndexedDB service
│   └── tests/
│       ├── unit/                    # Vitest unit tests (36 tests)
│       └── e2e/                     # Playwright E2E tests (14 tests)
├── vite.config.js                   # Vite + PWA + Vitest config
└── playwright.config.js             # Playwright config
```

---

## 🧪 Test Coverage

```
Unit Tests      36 passing  ✅
E2E Tests       14 passing  ✅
─────────────────────────────
Total           50 passing  ✅
```

Tests cover:
- Indian number formatting (7 tests)
- Milestone logic — brackets, progress, history, prediction (14 tests)
- Ledger logic — date filling, Sunday detection, year grouping (15 tests)
- App load and navigation (3 tests)
- Today Card save and pre-populate (2 tests)
- Settings — open, export, palette, close (4 tests)
- Ledger — year display, TODAY badge, Sunday colours (3 tests)
- Palette — change and persist (2 tests)

---

## 📖 Data Format

### Import JSON Format
Sumiran accepts JSON files in the following format:

```json
[
  {
    "date": "2023-04-14",
    "jaap": 20000,
    "notes": ""
  },
  {
    "date": "2023-04-15",
    "jaap": 20000,
    "notes": "Good session"
  }
]
```

### Export Format
Exports include all entries with `date`, `count`, `notes` and `updatedAt` fields.

---

## 🎨 Colour Palettes

| Palette | Background | Accent | Description |
|---|---|---|---|
| Midnight Sanctum | #0B1628 (Deep Navy) | #C9A84C (Gold) | Default — serene and grounding |
| Sacred Saffron | #1A0A0A (Deep Burgundy) | #E8820A (Saffron) | Warm and fiery devotion |
| Forest Ashram | #0A1A0F (Deep Forest) | #B8A830 (Warm Gold) | Calm and earthy stillness |

---

## 🙏 Contributing

This app is built with love for the sadhak community. Contributions, suggestions and bug reports are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 Licence

MIT Licence — free to use, share and modify.

---

*Built with 🙏 for sadhaks everywhere.*

*Jai Shri Ram* 🪔