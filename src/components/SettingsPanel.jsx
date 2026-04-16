import { useState, useRef } from 'react'
import { getAllEntries, saveEntry } from '../db/db'
import { PALETTES, getSavedPalette, savePalette } from '../logic/palette'
import {
  signInWithGoogle,
  exportToDrive,
  clearDriveAuth,
  isDriveConnected,
  getLastExportDate,
  getDriveUserEmail
} from '../logic/driveExport'
import SankalpePage from './SankalpePage'
import AntaryatraArchivePage from './AntaryatraArchivePage'

export default function SettingsPanel({ onClose, onImportComplete, allEntries }) {
  const [importStatus, setImportStatus] = useState(null) // null | 'importing' | 'success' | 'error'
  const [importMessage, setImportMessage] = useState('')
  const [currentPalette, setCurrentPalette] = useState(getSavedPalette())
  const [showSankalpa, setShowSankalpa] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [driveConnected, setDriveConnected] = useState(isDriveConnected)
  const [driveEmail, setDriveEmail] = useState(getDriveUserEmail)
  const [driveLastExport, setDriveLastExport] = useState(getLastExportDate)
  const [driveStatus, setDriveStatus] = useState(null) // null | 'uploading' | 'success' | 'error'
  const [driveMessage, setDriveMessage] = useState('')
  const jsonInputRef = useRef()
  const csvInputRef = useRef()

  // ── EXPORT ──────────────────────────────────────────

  async function exportCSV() {
    try {
      const entries = await getAllEntries()
      const header = 'Date,Jaap Count,Notes\n'
      const rows = entries.map(e =>
        `${e.date},${e.count},"${(e.notes || '').replace(/"/g, '""')}"`
      ).join('\n')
      downloadFile('jaap-ledger-export.csv', header + rows, 'text/csv')
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  async function exportJSON() {
    try {
      const entries = await getAllEntries()
      const data = JSON.stringify({
        exportDate: new Date().toISOString(),
        totalEntries: entries.length,
        entries
      }, null, 2)
      downloadFile('jaap-ledger-export.json', data, 'application/json')

      // Also upload to Drive if connected
      if (isDriveConnected()) {
        setDriveStatus('uploading')
        setDriveMessage('Uploading to Google Drive...')
        await exportToDrive()
        setDriveLastExport(getLastExportDate())
        setDriveStatus('success')
        setDriveMessage('Backed up to Google Drive.')
      }
    } catch (err) {
      console.error('Export failed:', err)
      setDriveStatus('error')
      setDriveMessage('Drive upload failed. Local file was saved.')
    }
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── GOOGLE DRIVE ────────────────────────────────────

  async function handleDriveConnect() {
    try {
      setDriveStatus('uploading')
      setDriveMessage('Connecting to Google Drive...')
      await signInWithGoogle()
      setDriveConnected(true)
      setDriveEmail(getDriveUserEmail())
      setDriveStatus('success')
      setDriveMessage('Connected successfully.')
    } catch (err) {
      setDriveStatus('error')
      setDriveMessage('Could not connect. Please try again.')
      console.error('Drive connect failed:', err)
    }
  }

  function handleDriveDisconnect() {
    clearDriveAuth()
    setDriveConnected(false)
    setDriveEmail(null)
    setDriveLastExport(null)
    setDriveStatus(null)
    setDriveMessage('')
  }

  // ── IMPORT ──────────────────────────────────────────

  async function handleJSONImport(e) {
    const file = e.target.files[0]
    if (!file) return

    setImportStatus('importing')
    setImportMessage('Reading file...')

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)

      // Handle both formats:
      // 1. Raw array: [ { date, jaap, notes }, ... ]
      // 2. Our export format: { entries: [ { date, count, notes }, ... ] }
      let records = []
      if (Array.isArray(parsed)) {
        records = parsed
      } else if (parsed.entries && Array.isArray(parsed.entries)) {
        records = parsed.entries
      } else {
        throw new Error('Unrecognised JSON format')
      }

      setImportMessage(`Importing ${records.length} entries...`)

      let imported = 0
      let skipped = 0

      for (const record of records) {
        // Validate date
        if (!record.date || !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
          skipped++
          continue
        }

        // Map both formats: { jaap } or { count }
        const count = record.jaap ?? record.count ?? 0
        const notes = record.notes || ''

        await saveEntry({
          date: record.date,
          count: Number(count),
          notes: String(notes)
        })
        imported++
      }

      setImportStatus('success')
      setImportMessage(
        `✓ Imported ${imported} entries successfully!` +
        (skipped > 0 ? ` (${skipped} skipped — invalid format)` : '')
      )

      if (onImportComplete) onImportComplete()

    } catch (err) {
      setImportStatus('error')
      setImportMessage(`✗ Import failed: ${err.message}`)
    }

    // Reset file input
    e.target.value = ''
  }

  async function handleCSVImport(e) {
    const file = e.target.files[0]
    if (!file) return

    setImportStatus('importing')
    setImportMessage('Reading CSV...')

    try {
      const text = await file.text()
      const lines = text.trim().split('\n')

      // Detect and skip header row
      const firstLine = lines[0].toLowerCase()
      const startIndex = firstLine.includes('date') ? 1 : 0
      const dataLines = lines.slice(startIndex)

      let imported = 0
      let skipped = 0

      for (const line of dataLines) {
        if (!line.trim()) continue

        // Parse CSV line (handle quoted notes field)
        const match = line.match(/^([^,]+),([^,]*),?(.*)$/)
        if (!match) { skipped++; continue }

        const date = match[1].trim()
        const count = parseInt(match[2].trim()) || 0
        const notes = match[3].replace(/^"|"$/g, '').trim()

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          skipped++
          continue
        }

        await saveEntry({ date, count, notes })
        imported++
      }

      setImportStatus('success')
      setImportMessage(
        `✓ Imported ${imported} entries successfully!` +
        (skipped > 0 ? ` (${skipped} skipped)` : '')
      )

      if (onImportComplete) onImportComplete()

    } catch (err) {
      setImportStatus('error')
      setImportMessage(`✗ Import failed: ${err.message}`)
    }

    e.target.value = ''
  }

  // ── RENDER ──────────────────────────────────────────

  return (
    <>
      {showSankalpa && (
        <SankalpePage onClose={() => setShowSankalpa(false)} />
      )}

      {showArchive && (
        <AntaryatraArchivePage
          onClose={() => setShowArchive(false)}
          allEntries={allEntries}
        />
      )}

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 100,
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 101,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-xl)',
        width: 'min(90vw, 380px)',
        maxHeight: '85vh',
        overflowY: 'auto',
        animation: 'fadeIn 0.2s ease'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'var(--color-gold)'
          }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '1.4rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: 4
            }}
          >
            ×
          </button>
        </div>
        
        {/* ── SANKALPA ENTRY ── */}
        <div
          onClick={() => setShowSankalpa(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: 'var(--spacing-xl)',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1rem',
              color: 'var(--color-gold)',
              marginBottom: 3
            }}>
              Sankalpa
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontStyle: 'italic'
            }}>
              A vow of intent
            </div>
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            →
          </div>
        </div>

        {/* ── ANTARYĀTRĀ ARCHIVE ENTRY ── */}
        <div
          onClick={() => setShowArchive(true)}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: 'var(--spacing-xl)',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: '1rem',
              color: 'var(--color-gold)', marginBottom: 3
            }}>
              Antaryātrā
            </div>
            <div style={{
              fontSize: '0.75rem', color: 'var(--color-text-muted)',
              fontStyle: 'italic'
            }}>
              Annual Reflections
            </div>
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>→</div>
        </div>

        {/* ── EXPORT SECTION ── */}

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-label" style={{
            color: 'var(--color-gold)',
            marginBottom: 'var(--spacing-sm)',
            fontSize: '0.7rem'
          }}>
            Export Data
          </div>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-md)',
            lineHeight: 1.6
          }}>
            Download a backup of all your Jaap entries.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary" onClick={exportCSV} style={{ width: '100%' }}>
              ⬇ Export as CSV
            </button>
            <button
              className="btn btn-primary"
              onClick={exportJSON}
              style={{
                width: '100%',
                background: 'var(--color-gold-track)',
                color: 'var(--color-gold)'
              }}
            >
              ⬇ Export as JSON
            </button>
          </div>
        </div>

        {/* ── GOOGLE DRIVE SECTION ── */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-label" style={{
            color: 'var(--color-gold)',
            marginBottom: 'var(--spacing-sm)',
            fontSize: '0.7rem'
          }}>
            Google Drive Backup
          </div>

          {driveConnected ? (
            <>
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-sm)',
                lineHeight: 1.6
              }}>
                Connected{driveEmail ? ` as ${driveEmail}` : ''}.
              </div>
              {driveLastExport && (
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-text-subtle)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  Last backup: {new Date(driveLastExport).toLocaleDateString()}
                </div>
              )}
              {driveStatus && (
                <div style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--spacing-md)',
                  fontSize: '0.82rem',
                  background: driveStatus === 'success'
                    ? 'rgba(201,168,76,0.1)'
                    : driveStatus === 'error'
                      ? 'rgba(192,57,43,0.1)'
                      : 'var(--color-gold-track)',
                  color: driveStatus === 'success'
                    ? 'var(--color-gold)'
                    : driveStatus === 'error'
                      ? 'var(--color-sunday)'
                      : 'var(--color-text-muted)',
                  border: `1px solid ${driveStatus === 'success'
                    ? 'rgba(201,168,76,0.3)'
                    : driveStatus === 'error'
                      ? 'rgba(192,57,43,0.3)'
                      : 'transparent'}`
                }}>
                  {driveMessage}
                </div>
              )}
              <button
                className="btn btn-primary"
                onClick={handleDriveDisconnect}
                style={{
                  width: '100%',
                  background: 'var(--color-gold-track)',
                  color: 'var(--color-text-muted)'
                }}
              >
                Disconnect Google Drive
              </button>
            </>
          ) : (
            <>
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-md)',
                lineHeight: 1.6
              }}>
                Auto-backup your entries to Google Drive every week. Export as JSON will also upload to Drive.
              </p>
              {driveStatus === 'error' && (
                <div style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--spacing-md)',
                  fontSize: '0.82rem',
                  background: 'rgba(192,57,43,0.1)',
                  color: 'var(--color-sunday)',
                  border: '1px solid rgba(192,57,43,0.3)'
                }}>
                  {driveMessage}
                </div>
              )}
              <button
                className="btn btn-primary"
                onClick={handleDriveConnect}
                disabled={driveStatus === 'uploading'}
                style={{ width: '100%' }}
              >
                {driveStatus === 'uploading' ? 'Connecting...' : 'Connect Google Drive'}
              </button>
            </>
          )}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'var(--color-border)',
          marginBottom: 'var(--spacing-xl)'
        }} />

        {/* ── APPEARANCE SECTION ── */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-label" style={{
            color: 'var(--color-gold)',
            marginBottom: 'var(--spacing-sm)',
            fontSize: '0.7rem'
          }}>
            Appearance
          </div>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-md)',
            lineHeight: 1.6
          }}>
            Choose your colour palette.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            {PALETTES.map(palette => (
              <div
                key={palette.id}
                onClick={() => {
                  savePalette(palette.id)
                  setCurrentPalette(palette.id)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${currentPalette === palette.id
                    ? 'var(--color-gold)'
                    : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  background: currentPalette === palette.id
                    ? 'rgba(201,168,76,0.08)'
                    : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Colour swatches */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {palette.preview.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: color,
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    />
                  ))}
                </div>

                {/* Name and description */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: 2
                  }}>
                    {palette.name}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)'
                  }}>
                    {palette.description}
                  </div>
                </div>

                {/* Selected indicator */}
                {currentPalette === palette.id && (
                  <div style={{
                    color: 'var(--color-gold)',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'var(--color-border)',
          marginBottom: 'var(--spacing-xl)'
        }} />

        {/* ── IMPORT SECTION ── */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-label" style={{
            color: 'var(--color-gold)',
            marginBottom: 'var(--spacing-sm)',
            fontSize: '0.7rem'
          }}>
            Import Data
          </div>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-md)',
            lineHeight: 1.6
          }}>
            Import from your existing data file. Supported formats: JSON (with <code style={{ color: 'var(--color-gold)', fontSize: '0.78rem' }}>date</code>, <code style={{ color: 'var(--color-gold)', fontSize: '0.78rem' }}>jaap</code>, <code style={{ color: 'var(--color-gold)', fontSize: '0.78rem' }}>notes</code>) or CSV.
            Existing entries for the same date will be overwritten.
          </p>

          {/* Status Message */}
          {importStatus && (
            <div style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--spacing-md)',
              fontSize: '0.82rem',
              background: importStatus === 'success'
                ? 'rgba(201,168,76,0.1)'
                : importStatus === 'error'
                  ? 'rgba(192,57,43,0.1)'
                  : 'var(--color-gold-track)',
              color: importStatus === 'success'
                ? 'var(--color-gold)'
                : importStatus === 'error'
                  ? 'var(--color-sunday)'
                  : 'var(--color-text-muted)',
              border: `1px solid ${importStatus === 'success'
                ? 'rgba(201,168,76,0.3)'
                : importStatus === 'error'
                  ? 'rgba(192,57,43,0.3)'
                  : 'transparent'}`
            }}>
              {importMessage}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Hidden file inputs */}
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleJSONImport}
            />
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleCSVImport}
            />

            <button
              className="btn btn-primary"
              onClick={() => {
                setImportStatus(null)
                jsonInputRef.current.click()
              }}
              style={{ width: '100%' }}
              disabled={importStatus === 'importing'}
            >
              ⬆ Import JSON
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setImportStatus(null)
                csvInputRef.current.click()
              }}
              style={{
                width: '100%',
                background: 'var(--color-gold-track)',
                color: 'var(--color-gold)'
              }}
              disabled={importStatus === 'importing'}
            >
              ⬆ Import CSV
            </button>
          </div>
        </div>

        {/* Version */}
        <div style={{
          paddingTop: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-text-subtle)'
        }}>
          Sumiran v1.0.0 · Built with 🙏
        </div>
      </div>
    </>
  )
}