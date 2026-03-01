import { useState, useEffect } from 'react'
import { getAllAntaryatra, getAllEntries } from '../db/db'
import { getEffectiveStatus, getYearStats } from '../logic/antaryatraLogic'
import { formatIndianNumber } from '../logic/formatIndianNumber'
import AntaryatraPage from './AntaryatraPage'

export default function AntaryatraArchivePage({ onClose, allEntries }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    async function load() {
      const all = await getAllAntaryatra()
      setRecords(all)
      setLoading(false)
    }
    load()
  }, [])

  // Build list of years that have passed — from first entry year to last completed year
  function getPastYears() {
    const currentYear = new Date().getFullYear()
    if (!allEntries || allEntries.length === 0) return []
    const firstYear = Math.min(
      ...allEntries.map(e => parseInt(e.date.substring(0, 4)))
    )
    const years = []
    for (let y = currentYear - 1; y >= firstYear; y--) {
      years.push(y)
    }
    return years
  }

  function getRecord(year) {
    return records.find(r => r.year === year) || null
  }

  function statusDisplay(record, year) {
    const status = getEffectiveStatus(record, year)
    if (status === 'recorded') return { label: 'Reflected', color: 'var(--color-gold)' }
    if (status === 'skipped') return { label: 'Skipped', color: 'var(--color-text-subtle)' }
    return { label: 'Not Recorded', color: 'var(--color-text-subtle)' }
  }

  const pastYears = getPastYears()

  if (selectedYear !== null) {
    return (
      <AntaryatraPage
        year={selectedYear}
        record={selectedRecord}
        allEntries={allEntries}
        onClose={() => { setSelectedYear(null); setSelectedRecord(null) }}
        onSaved={null}
      />
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--color-bg)',
      zIndex: 200,
      display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 0.35s ease',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Lotus background */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', zIndex: 0
      }}>
        <div style={{
          width: '70vw', height: '70vw', maxWidth: 340, maxHeight: 340,
          backgroundImage: 'var(--bg-pattern)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          borderRadius: '50%', opacity: 0.05, filter: 'blur(1px)'
        }} />
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '16px 20px', position: 'relative', zIndex: 1,
        borderBottom: '1px solid var(--color-border)'
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none',
          color: 'var(--color-text-muted)',
          fontSize: '1.4rem', cursor: 'pointer',
          padding: '4px 8px', marginRight: 12, lineHeight: 1
        }}>←</button>
        <div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.3rem',
            fontWeight: '700', color: 'var(--color-gold)', lineHeight: 1.2
          }}>
            Antaryātrā
          </div>
          <div style={{
            fontSize: '0.72rem', color: 'var(--color-text-muted)',
            letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            Annual Reflections
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '24px', position: 'relative', zIndex: 1
      }}>
        {loading && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Loading...</p>
        )}

        {!loading && pastYears.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60, animation: 'fadeInUp 0.4s ease' }}>
            <p style={{
              fontSize: '0.9rem', color: 'var(--color-text-muted)',
              fontStyle: 'italic', lineHeight: 1.8
            }}>
              The archive will appear here<br />after your first full year of practice.
            </p>
          </div>
        )}

        {!loading && pastYears.length > 0 && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            <p style={{
              fontSize: '0.82rem', color: 'var(--color-text-muted)',
              fontStyle: 'italic', lineHeight: 1.7, marginBottom: 28
            }}>
              A silent record of years lived in practice.
            </p>

            {pastYears.map(year => {
              const record = getRecord(year)
              const { label, color } = statusDisplay(record, year)
              const { daysOfPractice, averagePerDay } = getYearStats(allEntries, year)

              return (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year)
                    setSelectedRecord(record)
                  }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 0',
                    borderBottom: '1px solid var(--color-border)',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-serif)', fontSize: '1.1rem',
                      color: 'var(--color-text-primary)', fontWeight: '600',
                      marginBottom: 4
                    }}>
                      {year}
                    </div>
                    <div style={{
                      fontSize: '0.75rem', color: 'var(--color-text-muted)'
                    }}>
                      {daysOfPractice > 0
                        ? `${formatIndianNumber(daysOfPractice)} days · avg ${formatIndianNumber(averagePerDay)}/day`
                        : 'No entries recorded'
                      }
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: '0.75rem', color,
                      letterSpacing: '0.05em'
                    }}>
                      {label}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>→</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}