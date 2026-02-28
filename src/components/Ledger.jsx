import { saveEntry } from '../db/db'
import { isSunday, groupEntriesByYear, getLocalToday } from '../logic/ledgerLogic'
import { formatIndianNumber } from '../logic/formatIndianNumber'
import { useState, useEffect } from 'react'

const today = getLocalToday()

function isWithinSevenDays(dateStr) {
  const entryDate = new Date(dateStr)
  const todayDate = new Date(today)
  const diffMs = todayDate - entryDate
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 7
}

function LedgerRow({ entry, isExpanded, onToggle, onUpdate }) {
  const [count, setCount] = useState(
    entry.count > 0 ? String(entry.count) : ''
  )
  const [notes, setNotes] = useState(entry.notes || '')

  // Sync when entry data updates from parent
  useEffect(() => {
    setCount(entry.count > 0 ? String(entry.count) : '')
    setNotes(entry.notes || '')
  }, [entry.count, entry.notes])
  const [saved, setSaved] = useState(false)

  const sunday = isSunday(entry.date)
  const editable = isWithinSevenDays(entry.date)
  const viewable = !editable && (entry.count > 0 || entry.notes)
  const expandable = editable || viewable
  const isEmpty = entry.isEmpty || entry.count === 0

async function handleUpdate() {
    try {
      await saveEntry({
        date: entry.date,
        count: parseInt(count) || 0,
        notes: notes.trim()
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (onUpdate) await onUpdate()
    } catch (err) {
      console.error('Failed to update entry:', err)
    }
  }

  // Format date for display: "27 Feb 2026"
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div style={{
      borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
    }}>
      {/* Row Header */}
      <div
        onClick={() => expandable && onToggle(entry.date)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px var(--spacing-md)',
          cursor: expandable ? 'pointer' : 'default',
          transition: 'background var(--transition-fast)',
          gap: 'var(--spacing-sm)',
        }}
        onMouseEnter={e => {
          if (editable) e.currentTarget.style.background = 'rgba(201,168,76,0.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        {/* Expand Arrow */}
        {/* Expand Arrow */}
        <div style={{
          width: 16,
          fontSize: '0.65rem',
          color: editable
            ? 'var(--color-gold)'
            : viewable
              ? 'var(--color-text-muted)'
              : 'transparent',
          transition: 'transform var(--transition-fast)',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          flexShrink: 0
        }}>
          {expandable ? '▶' : ''}
        </div>

        {/* Date */}
        <div style={{
          flex: 1,
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          fontWeight: entry.date === today ? '700' : '400',
          color: sunday
            ? 'var(--color-sunday)'
            : entry.date === today
              ? 'var(--color-text-primary)'
              : 'var(--color-text-primary)',
        }}>
          {formatDate(entry.date)}
          {entry.date === today && (
            <span style={{
              marginLeft: 8,
              fontSize: '0.7rem',
              color: 'var(--color-gold)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Today
            </span>
          )}
        </div>

        {/* Count */}
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1rem',
          fontWeight: '600',
          color: isEmpty
            ? 'var(--color-text-subtle)'
            : 'var(--color-text-primary)',
          minWidth: 80,
          textAlign: 'right'
        }}>
          {isEmpty ? '—' : formatIndianNumber(entry.count)}
        </div>

        {/* Notes indicator */}
        {entry.notes && (
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--color-gold)',
            marginLeft: 4
          }}>
            ▸
          </div>
        )}
      </div>

      {/* Expanded Edit Form */}
      {/* Expanded Form — Editable */}
      {isExpanded && editable && (
        <div style={{
          padding: 'var(--spacing-md)',
          background: 'rgba(201, 168, 76, 0.05)',
          borderTop: '1px solid rgba(201, 168, 76, 0.1)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ marginBottom: 'var(--spacing-sm)' }}>
            <label className="card-label" style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.7rem'
            }}>
              Jaap Count
            </label>
            <input
              type="number"
              className="input input-number"
              value={count}
              onChange={e => setCount(e.target.value)}
              min="0"
              style={{ marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="card-label" style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.7rem'
            }}>
              Notes
            </label>
            <textarea
              className="input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Optional notes..."
              style={{ marginTop: 4, minHeight: 60 }}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleUpdate}
            style={{ width: '100%' }}
          >
            {saved ? '✓ Updated!' : 'Update'}
          </button>
        </div>
      )}

      {/* Expanded View — Read Only (locked entries) */}
      {isExpanded && viewable && (
        <div style={{
          padding: 'var(--spacing-md)',
          background: 'rgba(136, 153, 170, 0.05)',
          borderTop: '1px solid rgba(136, 153, 170, 0.1)',
          animation: 'fadeIn 0.2s ease'
        }}>
          {/* Lock notice */}
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-locked)',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            🔒 <span>This entry is locked for editing</span>
          </div>

          {/* Count display */}
          <div style={{ marginBottom: 'var(--spacing-sm)' }}>
            <div className="card-label" style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.7rem',
              marginBottom: 4
            }}>
              Jaap Count
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              padding: '8px 12px',
              background: 'rgba(136,153,170,0.08)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(136,153,170,0.15)'
            }}>
              {entry.count > 0 ? entry.count.toLocaleString('en-IN') : '—'}
            </div>
          </div>

          {/* Notes display */}
          {entry.notes && (
            <div>
              <div className="card-label" style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.7rem',
                marginBottom: 4
              }}>
                Notes
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-primary)',
                padding: '8px 12px',
                background: 'rgba(136,153,170,0.08)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(136,153,170,0.15)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {entry.notes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function YearGroup({ yearData, isOpen, onToggle, onUpdate, expandedDate, onRowToggle }) {
  return (
    <div style={{
      marginBottom: 'var(--spacing-sm)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
    }}>
      {/* Year Header */}
      <div
        onClick={() => onToggle(yearData.year)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--spacing-md)',
          background: 'var(--color-gold-track)',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--color-gold)',
            transition: 'transform var(--transition-fast)',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-block'
          }}>
            ▶
          </span>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--color-gold)'
          }}>
            {yearData.year}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--color-gold)'
        }}>
          {formatIndianNumber(yearData.yearTotal)}
        </span>
      </div>

      {/* Entries */}
      {isOpen && (
        <div style={{ background: 'var(--color-bg)' }}>
          {yearData.entries.map(entry => (
            <LedgerRow
              key={entry.date}
              entry={entry}
              isExpanded={expandedDate === entry.date}
              onToggle={onRowToggle}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Ledger({ entries, onUpdate }) {
  const currentYear = new Date().getFullYear()
  const [openYears, setOpenYears] = useState([currentYear])
  const [expandedDate, setExpandedDate] = useState(null)

  const grouped = groupEntriesByYear(entries)

  function toggleYear(year) {
    setOpenYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  function toggleRow(date) {
    setExpandedDate(prev => prev === date ? null : date)
  }

  if (grouped.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        padding: 'var(--spacing-xl)',
        fontStyle: 'italic'
      }}>
        No entries yet. Start by saving today's Jaap count!
      </div>
    )
  }

  return (
    <div className="animate-in">
      {/* Ledger Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-sm)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.3rem',
          fontWeight: '700',
          color: 'var(--color-gold)'
        }}>
          Ledger
        </h2>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          🔴 Sunday &nbsp; ▸ Notes
        </div>
      </div>

      {grouped.map(yearData => (
        <YearGroup
          key={yearData.year}
          yearData={yearData}
          isOpen={openYears.includes(yearData.year)}
          onToggle={toggleYear}
          onUpdate={onUpdate}
          expandedDate={expandedDate}
          onRowToggle={toggleRow}
        />
      ))}
    </div>
  )
}