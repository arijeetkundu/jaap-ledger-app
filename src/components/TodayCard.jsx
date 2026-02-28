import { useState, useEffect } from 'react'
import { getLocalToday } from '../logic/ledgerLogic'

export default function TodayCard({ todayEntry, onSave }) {
  const today = getLocalToday()
  const [count, setCount] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  // Sync from parent whenever todayEntry changes
  useEffect(() => {
    if (todayEntry) {
      setCount(todayEntry.count > 0 ? String(todayEntry.count) : '')
      setNotes(todayEntry.notes || '')
    }
  }, [todayEntry?.count, todayEntry?.notes])

  function formatDisplayDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  async function handleSave() {
    const countNum = parseInt(count) || 0
    if (onSave) await onSave(countNum, notes.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card animate-in">
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-label">Today</div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--color-text-card)'
        }}>
          {formatDisplayDate(today)}
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label className="card-label" htmlFor="jaap-count">
          Jaap Count
        </label>
        <input
          id="jaap-count"
          type="number"
          className="input input-number"
          placeholder="Enter today's count"
          value={count}
          onChange={e => setCount(e.target.value)}
          min="0"
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label className="card-label" htmlFor="jaap-notes">
          Notes
        </label>
        <textarea
          id="jaap-notes"
          className="input"
          placeholder="Optional notes..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSave}
        style={{ width: '100%' }}
      >
        {saved ? '✓ Saved!' : 'Save'}
      </button>
    </div>
  )
}