import { formatIndianNumber } from '../logic/formatIndianNumber'
import {
  getCurrentMilestone,
  getMilestoneProgress,
  getMilestoneHistory,
  predictNextMilestone
} from '../logic/milestoneLogic'

export default function ReflectionCard({ entries }) {
  const totalCount = entries.reduce((sum, e) => sum + (e.count || 0), 0)

  // Current year total
  const currentYear = new Date().getFullYear()
  const yearTotal = entries
    .filter(e => e.date.startsWith(String(currentYear)))
    .reduce((sum, e) => sum + (e.count || 0), 0)

  const milestone = getCurrentMilestone(totalCount)
  const progress = getMilestoneProgress(totalCount)
  const history = getMilestoneHistory(entries.slice().reverse())
  const prediction = predictNextMilestone(totalCount, entries.slice().reverse())

  return (
    <div className="card animate-in" style={{
      background: 'var(--color-bg)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text-primary)'
    }}>

      {/* Lifetime Total */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-label" style={{ color: 'var(--color-text-muted)' }}>
          Lifetime Jaap
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '2.2rem',
          fontWeight: '700',
          color: 'var(--color-gold-bright)',
          lineHeight: 1.2
        }}>
          {formatIndianNumber(totalCount)}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'var(--color-border)',
        marginBottom: 'var(--spacing-lg)'
      }} />

      {/* Current Year Total */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-label" style={{ color: 'var(--color-text-muted)' }}>
          {currentYear} Total
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.4rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)'
        }}>
          {formatIndianNumber(yearTotal)}
        </div>
      </div>

      {/* Milestone Progress */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xs)'
        }}>
          <div className="card-label" style={{ color: 'var(--color-text-muted)' }}>
            Next Milestone
          </div>
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--color-gold)',
            fontWeight: '600'
          }}>
            {milestone.next} Crore ({progress.toFixed(1)}%)
          </div>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Prediction */}
      {prediction && (
        <div style={{
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          background: 'var(--color-gold-track)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem'
        }}>
          <div style={{ color: 'var(--color-gold)', fontWeight: '600', marginBottom: 4 }}>
            Predicted: {prediction.predictedDate}
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            Based on {prediction.basedOnDays}-day average of{' '}
            {formatIndianNumber(prediction.averagePerDay)}/day
          </div>
        </div>
      )}

      {/* Milestone History */}
      {history.length > 0 && (
        <div>
          <div className="card-label" style={{
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            Milestones Crossed
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                fontSize: '0.9rem'
              }}>
                <span style={{ fontSize: '1rem' }}>🪔</span>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: '600',
                  color: 'var(--color-gold)'
                }}>
                  {m.crore} Crore
                </span>
                <span style={{ color: 'var(--color-text-primary)' }}>
                  — {m.date}
                </span>
                {m.daysSincePrevious && (
                  <span style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.8rem'
                  }}>
                    (+{m.daysSincePrevious} days)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}