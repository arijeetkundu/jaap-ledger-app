import { useState } from 'react'
import { saveAntaryatra } from '../db/db'
import {
  canRecord, getLocalDateString, getTimezone, getYearStats
} from '../logic/antaryatraLogic'
import { formatIndianNumber } from '../logic/formatIndianNumber'

export default function AntaryatraPage({ year, record, allEntries, onClose, onSaved }) {
  const [text, setText] = useState(record?.text || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmSkip, setConfirmSkip] = useState(false)

  const recordable = canRecord(record, year)
  const isReadOnly = !recordable
  const { daysOfPractice, averagePerDay } = getYearStats(allEntries, year)

  async function handleSave() {
    if (!text.trim() || saving) return
    setSaving(true)
    await saveAntaryatra({
      year,
      status: 'recorded',
      text: text.trim(),
      recordedOn: getLocalDateString(),
      timezone: getTimezone()
    })
    setSaved(true)
    setTimeout(() => {
      if (onSaved) onSaved()
      onClose()
    }, 2000)
  }

  async function handleSkip() {
    await saveAntaryatra({
      year,
      status: 'skipped',
      text: '',
      recordedOn: getLocalDateString(),
      timezone: getTimezone()
    })
    if (onSaved) onSaved()
    onClose()
  }

  function statusLabel() {
    if (!record) return null
    if (record.status === 'recorded') return { text: 'Reflected', color: 'var(--color-gold)' }
    if (record.status === 'skipped') return { text: 'Skipped', color: 'var(--color-text-muted)' }
    return null
  }

  const status = statusLabel()

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
          to   { transform: translateX(0);    opacity: 1; }
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
            {year} · Inner Journey
          </div>
        </div>
        {status && (
          <div style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            color: status.color,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>
            {status.text}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '32px 24px',
        position: 'relative', zIndex: 1
      }}>

        {/* Year stats */}
        <div style={{
          display: 'flex', gap: 24, marginBottom: 36,
          animation: 'fadeInUp 0.4s ease'
        }}>
          <div>
            <div style={{
              fontSize: '0.65rem', color: 'var(--color-text-muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4
            }}>Days of Practice</div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.4rem',
              color: 'var(--color-gold)', fontWeight: '700'
            }}>
              {formatIndianNumber(daysOfPractice)}
            </div>
          </div>
          <div style={{
            width: 1, background: 'var(--color-border)', alignSelf: 'stretch'
          }} />
          <div>
            <div style={{
              fontSize: '0.65rem', color: 'var(--color-text-muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4
            }}>Avg Jaap / Day</div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.4rem',
              color: 'var(--color-gold)', fontWeight: '700'
            }}>
              {averagePerDay > 0 ? formatIndianNumber(averagePerDay) : '—'}
            </div>
          </div>
        </div>

        {/* Intro — only when recording */}
        {recordable && (
          <div style={{ marginBottom: 32, animation: 'fadeInUp 0.5s ease' }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '0.95rem',
              color: 'var(--color-text-primary)', lineHeight: 1.8, marginBottom: 6
            }}>
              A year of sādhanā has passed.
            </p>
            <p style={{
              fontSize: '0.88rem', color: 'var(--color-text-muted)',
              lineHeight: 1.7, fontStyle: 'italic'
            }}>
              Not what you counted — what you carried.
            </p>
          </div>
        )}

        {/* Reflection text — read only */}
        {isReadOnly && record?.text && (
          <div style={{
            background: 'rgba(201, 168, 76, 0.04)',
            border: '1px solid var(--color-border)',
            borderLeft: '3px solid var(--color-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '20px', marginBottom: 24,
            animation: 'fadeInUp 0.4s ease'
          }}>
            <div style={{
              fontSize: '0.68rem', color: 'var(--color-gold)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12
            }}>Reflection</div>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '1rem',
              color: 'var(--color-text-primary)', lineHeight: 1.9,
              whiteSpace: 'pre-wrap'
            }}>
              {record.text}
            </p>
          </div>
        )}

        {/* Skipped notice */}
        {isReadOnly && record?.status === 'skipped' && (
          <div style={{
            padding: '16px 20px', marginBottom: 24,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeInUp 0.4s ease'
          }}>
            <p style={{
              fontSize: '0.88rem', color: 'var(--color-text-muted)',
              fontStyle: 'italic', lineHeight: 1.7
            }}>
              This year's reflection was not recorded.
            </p>
          </div>
        )}

        {/* No record — window expired */}
        {isReadOnly && !record && (
          <div style={{
            padding: '16px 20px', marginBottom: 24,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeInUp 0.4s ease'
          }}>
            <p style={{
              fontSize: '0.88rem', color: 'var(--color-text-muted)',
              fontStyle: 'italic', lineHeight: 1.7
            }}>
              The reflection window for {year} has passed.
            </p>
          </div>
        )}

        {/* Recorded date */}
        {record?.recordedOn && (
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: '0.68rem', color: 'var(--color-text-muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4
            }}>
              {record.status === 'recorded' ? 'Recorded on' : 'Decided on'}
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-subtle)' }}>
              {record.recordedOn}
            </p>
          </div>
        )}

        {/* Textarea — only when recordable */}
        {recordable && !saved && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div style={{
              fontSize: '0.68rem', color: 'var(--color-gold)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10
            }}>
              Reflection
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={'What did this year hold for your practice?\nWhat shifted? What deepened? What remains?'}
              rows={8}
              style={{
                width: '100%',
                background: 'rgba(201, 168, 76, 0.04)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem', lineHeight: 1.8,
                resize: 'vertical', outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* Commitment notice */}
            <p style={{
              fontSize: '0.78rem', color: 'var(--color-text-subtle)',
              textAlign: 'center', lineHeight: 1.7,
              margin: '20px 0', fontStyle: 'italic'
            }}>
              Once recorded, this reflection is sealed.<br />
              It cannot be edited.
            </p>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!text.trim() || saving}
              style={{
                width: '100%', padding: '16px',
                background: text.trim()
                  ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))'
                  : 'rgba(201,168,76,0.2)',
                border: 'none', borderRadius: 'var(--radius-md)',
                color: text.trim() ? '#0B1628' : 'var(--color-text-muted)',
                fontWeight: '600', fontSize: '0.95rem',
                letterSpacing: '0.06em',
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                transition: 'all var(--transition-smooth)'
              }}
            >
              {saving ? 'Recording...' : 'Record Reflection'}
            </button>

            {/* Skip */}
            {!confirmSkip && (
              <button
                onClick={() => setConfirmSkip(true)}
                style={{
                  width: '100%', padding: '12px', marginTop: 12,
                  background: 'transparent', border: 'none',
                  color: 'var(--color-text-subtle)',
                  cursor: 'pointer', fontSize: '0.82rem'
                }}
              >
                Skip this year's reflection
              </button>
            )}

            {/* Skip confirmation */}
            {confirmSkip && (
              <div style={{
                marginTop: 16, padding: '16px 20px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                animation: 'fadeInUp 0.3s ease'
              }}>
                <p style={{
                  fontSize: '0.85rem', color: 'var(--color-text-muted)',
                  textAlign: 'center', lineHeight: 1.7, marginBottom: 16,
                  fontStyle: 'italic'
                }}>
                  Skipping will close this window permanently for {year}.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setConfirmSkip(false)}
                    style={{
                      flex: 1, padding: '10px',
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer', fontSize: '0.85rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSkip}
                    style={{
                      flex: 1, padding: '10px',
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-subtle)',
                      cursor: 'pointer', fontSize: '0.85rem'
                    }}
                  >
                    Skip Reflection
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved confirmation */}
        {saved && (
          <div style={{
            textAlign: 'center', marginTop: 24,
            animation: 'fadeInUp 0.3s ease'
          }}>
            <p style={{
              fontSize: '0.95rem', color: 'var(--color-gold)',
              fontFamily: 'var(--font-serif)', lineHeight: 1.8
            }}>
              Reflection recorded.<br />
              <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                May this year's practice continue to bear fruit.
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}