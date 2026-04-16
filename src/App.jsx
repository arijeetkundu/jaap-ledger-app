import { useState, useEffect, useCallback } from 'react'
import { getAllEntries, getEntry, saveEntry } from './db/db'
import { fillMissingDates, getLocalToday } from './logic/ledgerLogic'
import TodayCard from './components/TodayCard'
import ReflectionCard from './components/ReflectionCard'
import Ledger from './components/Ledger'
import SplashScreen from './components/SplashScreen'
import SettingsPanel from './components/SettingsPanel'
import './App.css'
import { getSavedPalette, applyPalette } from './logic/palette'
import { shouldAutoExport, exportToDrive } from './logic/driveExport'

export default function App() {
  const today = getLocalToday()
  const [entries, setEntries] = useState([])
  const [todayEntry, setTodayEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [toast, setToast] = useState(null) // { message, type: 'success' | 'error' }

  // Apply saved palette on mount
  useEffect(() => {
    applyPalette(getSavedPalette())
  }, [])

  // Auto-export to Drive on load if 7+ days have passed
  useEffect(() => {
    if (!shouldAutoExport()) return
    exportToDrive()
      .then(() => {
        setToast({ message: 'Weekly backup saved to Google Drive.', type: 'success' })
        setTimeout(() => setToast(null), 4000)
      })
      .catch(() => {
        setToast({ message: 'Weekly Drive backup failed. Check Settings.', type: 'error' })
        setTimeout(() => setToast(null), 5000)
      })
  }, [])

  const loadAll = useCallback(async () => {
    try {
      const [all, todayDB] = await Promise.all([
        getAllEntries(),
        getEntry(today)
      ])
      const filled = fillMissingDates(all, today)
      setEntries(filled)
      setTodayEntry(todayDB || { date: today, count: 0, notes: '' })
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  async function handleTodaySave(count, notes) {
    try {
      await saveEntry({ date: today, count, notes })
      await loadAll()
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--color-gold)',
        fontFamily: 'var(--font-serif)',
        fontSize: '1.2rem'
      }}>
        Loading Sumiran...
      </div>
    )
  }

  return (
    <>
      <SplashScreen />

      {/* Drive backup toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          padding: '10px 20px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.82rem',
          background: toast.type === 'success' ? 'rgba(201,168,76,0.15)' : 'rgba(192,57,43,0.15)',
          color: toast.type === 'success' ? 'var(--color-gold)' : 'var(--color-sunday)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(201,168,76,0.4)' : 'rgba(192,57,43,0.4)'}`,
          backdropFilter: 'blur(8px)',
          whiteSpace: 'nowrap'
        }}>
          {toast.message}
        </div>
      )}

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onImportComplete={() => {
            loadAll()
            setShowSettings(false)
          }}
          allEntries={entries}
        />
      )}
      <div id="app">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)',
          paddingTop: 'var(--spacing-md)'
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            fontWeight: '700',
            color: 'var(--color-gold)',
          }}>
            Sumiran
          </h1>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              background: 'var(--color-gold-track)',
              border: '1px solid var(--color-border)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Settings"
          >
            ⚙️
          </button>
        </div>

        {/* Today Card */}
        <TodayCard
          todayEntry={todayEntry}
          onSave={handleTodaySave}
        />

        {/* Reflection Card */}
        <ReflectionCard
          entries={entries.filter(e => e.count > 0)}
        />

        {/* Ledger */}
        <Ledger
          entries={entries}
          onUpdate={loadAll}
        />
      </div>
    </>
  )
}