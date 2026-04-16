import { getAllEntries } from '../db/db.js'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/drive.file'
const DRIVE_FILE_NAME = 'sumiran-backup.json'

// ── TOKEN MANAGEMENT ─────────────────────────────────────────────────────────

function saveToken(token) {
  localStorage.setItem('driveAccessToken', token.access_token)
  // token.expires_in is in seconds; store absolute expiry time
  const expiry = Date.now() + token.expires_in * 1000
  localStorage.setItem('driveTokenExpiry', expiry)
}

function getStoredToken() {
  const token = localStorage.getItem('driveAccessToken')
  const expiry = parseInt(localStorage.getItem('driveTokenExpiry') || '0')
  if (!token || Date.now() >= expiry) return null
  return token
}

export function clearDriveAuth() {
  localStorage.removeItem('driveAccessToken')
  localStorage.removeItem('driveTokenExpiry')
  localStorage.removeItem('driveFileId')
  localStorage.removeItem('driveLastExportDate')
  localStorage.removeItem('driveUserEmail')
}

export function isDriveConnected() {
  return !!getStoredToken()
}

export function getLastExportDate() {
  return localStorage.getItem('driveLastExportDate') || null
}

export function getDriveUserEmail() {
  return localStorage.getItem('driveUserEmail') || null
}

// ── SIGN IN ───────────────────────────────────────────────────────────────────

export function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Identity Services not loaded'))
      return
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (response) => {
        if (response.error) {
          reject(new Error(response.error))
          return
        }
        saveToken(response)

        // Fetch user email from Google's userinfo endpoint
        try {
          const info = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${response.access_token}` }
          })
          const data = await info.json()
          localStorage.setItem('driveUserEmail', data.email || '')
        } catch {
          // email is optional — don't fail the whole sign-in
        }

        resolve(response.access_token)
      }
    })

    client.requestAccessToken()
  })
}

// ── DRIVE FILE OPERATIONS ─────────────────────────────────────────────────────

async function findExistingFile(token) {
  const storedId = localStorage.getItem('driveFileId')
  if (storedId) return storedId

  // Search Drive for a file with our backup filename
  const query = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and trashed=false`)
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  if (data.files && data.files.length > 0) {
    const fileId = data.files[0].id
    localStorage.setItem('driveFileId', fileId)
    return fileId
  }
  return null
}

async function uploadToDrive(token, jsonString) {
  const existingFileId = await findExistingFile(token)
  const metadata = { name: DRIVE_FILE_NAME, mimeType: 'application/json' }
  const blob = new Blob([jsonString], { type: 'application/json' })

  const form = new FormData()
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  form.append('file', blob)

  let url, method
  if (existingFileId) {
    // Overwrite existing file
    url = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    method = 'PATCH'
  } else {
    // Create new file
    url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
    method = 'POST'
  }

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Drive upload failed')
  }

  const file = await res.json()
  localStorage.setItem('driveFileId', file.id)
  localStorage.setItem('driveLastExportDate', new Date().toISOString())
  return file.id
}

// ── MAIN EXPORT FUNCTION ──────────────────────────────────────────────────────

export async function exportToDrive() {
  let token = getStoredToken()

  // Token expired or not signed in — request a new one
  if (!token) {
    token = await signInWithGoogle()
  }

  const entries = await getAllEntries()
  const payload = JSON.stringify({
    exportDate: new Date().toISOString(),
    totalEntries: entries.length,
    entries
  }, null, 2)

  await uploadToDrive(token, payload)
}

// ── AUTO-EXPORT CHECK ─────────────────────────────────────────────────────────

export function shouldAutoExport() {
  if (!isDriveConnected()) return false

  const last = getLastExportDate()
  if (!last) return true

  const daysSinceLast = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceLast >= 7
}
