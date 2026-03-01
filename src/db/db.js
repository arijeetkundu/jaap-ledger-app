const DB_NAME = 'jaap-ledger-db'
const DB_VERSION = 2
const STORE_NAME = 'entries'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      const oldVersion = event.oldVersion

      // Create entries store (version 1)
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'date' })
        store.createIndex('date', 'date', { unique: true })
      }

      // Create sankalpa store (version 2)
      if (oldVersion < 2 && !db.objectStoreNames.contains('sankalpa')) {
        db.createObjectStore('sankalpa', { keyPath: 'id' })
      }
    }
  })
}

export async function initDB() {
  return await openDB()
}

export async function saveEntry(entry) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put({
      date: entry.date,
      count: entry.count || 0,
      notes: entry.notes || '',
      updatedAt: new Date().toISOString()
    })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getEntry(date) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(date)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllEntries() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => {
      const entries = request.result.sort((a, b) =>
        b.date.localeCompare(a.date)
      )
      resolve(entries)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function deleteEntry(date) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(date)
    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}

export async function getSankalpa() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sankalpa', 'readonly')
    const store = tx.objectStore('sankalpa')
    const req = store.get('primary')
    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => reject(req.error)
  })
}

export async function saveSankalpa(sankalpa) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sankalpa', 'readwrite')
    const store = tx.objectStore('sankalpa')
    const req = store.put({ ...sankalpa, id: 'primary' })
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}