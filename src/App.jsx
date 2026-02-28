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

export default function App() {
  const today = getLocalToday()
  const [entries, setEntries] = useState([])
  const [todayEntry, setTodayEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // Apply saved palette on mount
  useEffect(() => {
    applyPalette(getSavedPalette())
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
        Loading Jaap Ledger...
      </div>
    )
  }

  return (
    <>
      <SplashScreen />
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onImportComplete={() => {
            loadAll()
            setShowSettings(false)
          }}
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
            Jaap Ledger
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