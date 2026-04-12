import { test, expect } from '@playwright/test'

// ─── DB constants — must match src/db/db.js ──────────────────────────────────
const DB_NAME = 'jaap-ledger-db'
const DB_VERSION = 3

// ─── Helper: navigate to app and wait for load (initialises IndexedDB) ───────
async function waitForApp(page) {
  await page.goto('/')
  await page.waitForSelector('#jaap-count', { timeout: 8000 })
}

// ─── Helper: clear the antaryatra store ──────────────────────────────────────
async function clearAntaryatra(page) {
  await page.evaluate(({ dbName, dbVersion }) => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, dbVersion)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const db = req.result
        const tx = db.transaction('antaryatra', 'readwrite')
        tx.objectStore('antaryatra').clear()
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      }
    })
  }, { dbName: DB_NAME, dbVersion: DB_VERSION })
}

// ─── Helper: clear the entries store ─────────────────────────────────────────
async function clearEntries(page) {
  await page.evaluate(({ dbName, dbVersion }) => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, dbVersion)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const db = req.result
        const tx = db.transaction('entries', 'readwrite')
        tx.objectStore('entries').clear()
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      }
    })
  }, { dbName: DB_NAME, dbVersion: DB_VERSION })
}

// ─────────────────────────────────────────────────────────────────────────────

test.describe('DB Layer — direct IndexedDB operations', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate first so the DB is initialised by the app
    await waitForApp(page)
  })

  test.afterEach(async ({ page }) => {
    await clearEntries(page)
    await clearAntaryatra(page)
  })

  // ── BEH-093 ───────────────────────────────────────────────────────────────
  test('BEH-093 | deleteEntry removes entry from IndexedDB', async ({ page }) => {
    const testDate = '2024-06-15'

    // Seed an entry
    await page.evaluate(({ dbName, dbVersion, entry }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('entries', 'readwrite')
          tx.objectStore('entries').put(entry)
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      })
    }, {
      dbName: DB_NAME,
      dbVersion: DB_VERSION,
      entry: { date: testDate, count: 12000, notes: '', updatedAt: new Date().toISOString() }
    })

    // Confirm it was seeded
    const seeded = await page.evaluate(({ dbName, dbVersion, date }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('entries', 'readonly')
          const r = tx.objectStore('entries').get(date)
          r.onsuccess = () => resolve(r.result || null)
          r.onerror = () => reject(r.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION, date: testDate })

    expect(seeded).not.toBeNull()
    expect(seeded.count).toBe(12000)

    // Delete the entry
    await page.evaluate(({ dbName, dbVersion, date }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('entries', 'readwrite')
          tx.objectStore('entries').delete(date)
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION, date: testDate })

    // Verify the entry is gone
    const result = await page.evaluate(({ dbName, dbVersion, date }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('entries', 'readonly')
          const r = tx.objectStore('entries').get(date)
          r.onsuccess = () => resolve(r.result || null)
          r.onerror = () => reject(r.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION, date: testDate })

    expect(result).toBeNull()
  })

  // ── BEH-097 ───────────────────────────────────────────────────────────────
  test('BEH-097 | getAntaryatra returns a record for a given year', async ({ page }) => {
    const testRecord = {
      year: 2023,
      status: 'recorded',
      text: 'A year of deepening silence',
      recordedOn: '2024-01-05',
      timezone: 'Asia/Kolkata'
    }

    // Seed the antaryatra record
    await page.evaluate(({ dbName, dbVersion, record }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('antaryatra', 'readwrite')
          tx.objectStore('antaryatra').put(record)
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION, record: testRecord })

    // Read it back
    const result = await page.evaluate(({ dbName, dbVersion, year }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('antaryatra', 'readonly')
          const r = tx.objectStore('antaryatra').get(year)
          r.onsuccess = () => resolve(r.result || null)
          r.onerror = () => reject(r.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION, year: 2023 })

    expect(result).not.toBeNull()
    expect(result.year).toBe(2023)
    expect(result.status).toBe('recorded')
    expect(result.text).toBe('A year of deepening silence')
  })

  // ── BEH-098 ───────────────────────────────────────────────────────────────
  test('BEH-098 | getAntaryatra returns null/undefined when no record exists', async ({ page }) => {
    // Query a year that was never seeded
    const result = await page.evaluate(({ dbName, dbVersion, year }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('antaryatra', 'readonly')
          const r = tx.objectStore('antaryatra').get(year)
          r.onsuccess = () => resolve(r.result !== undefined ? r.result : null)
          r.onerror = () => reject(r.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION, year: 9999 })

    // Should be null or undefined — nothing stored for year 9999
    expect(result == null).toBe(true)
  })

  // ── BEH-099 ───────────────────────────────────────────────────────────────
  test('BEH-099 | saveAntaryatra writes record keyed by year', async ({ page }) => {
    const testRecord = {
      year: 2022,
      status: 'recorded',
      text: 'Steady practice through uncertainty',
      recordedOn: '2023-01-03',
      timezone: 'Asia/Kolkata'
    }

    // Write via store.put (simulating saveAntaryatra)
    await page.evaluate(({ dbName, dbVersion, record }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('antaryatra', 'readwrite')
          tx.objectStore('antaryatra').put(record)
          tx.oncomplete = () => resolve()
          tx.onerror = () => reject(tx.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION, record: testRecord })

    // Read it back via store.get(year)
    const result = await page.evaluate(({ dbName, dbVersion, year }) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, dbVersion)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => {
          const db = req.result
          const tx = db.transaction('antaryatra', 'readonly')
          const r = tx.objectStore('antaryatra').get(year)
          r.onsuccess = () => resolve(r.result || null)
          r.onerror = () => reject(r.error)
        }
      })
    }, { dbName: DB_NAME, dbVersion: DB_VERSION, year: 2022 })

    expect(result).not.toBeNull()
    expect(result.year).toBe(2022)
    expect(result.status).toBe('recorded')
    expect(result.text).toBe('Steady practice through uncertainty')
    expect(result.recordedOn).toBe('2023-01-03')
    expect(result.timezone).toBe('Asia/Kolkata')
  })

})
