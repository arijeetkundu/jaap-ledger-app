import { useState, useEffect } from 'react'
import { getSankalpa, saveSankalpa } from '../db/db'
import { getLocalToday } from '../logic/ledgerLogic'

export default function SankalpePage({ onClose }) {
  const [sankalpa, setSankalpa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('view') // 'view' | 'edit' | 'confirm'
  const [text, setText] = useState('')
  const [context, setContext] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    async function load() {
      const s = await getSankalpa()
      setSankalpa(s)
      if (s) {
        setText(s.text)
        setContext(s.context || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  async function handleEstablish() {
    if (!text.trim()) return
    const today = getLocalToday()
    const record = {
      text: text.trim(),
      context: context.trim(),
      date: sankalpa?.date || today,
      updatedAt: today
    }
    await saveSankalpa(record)
    setSankalpa(record)
    setMode('view')
    setWarning(false)
    setConfirmed(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleEditAttempt() {
    if (sankalpa) {
      setWarning(true)
    } else {
      setMode('edit')
    }
  }

  function handleConfirmRewrite() {
    setWarning(false)
    setMode('edit')
  }

  const isNew = !sankalpa

  if (loading) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--color-bg)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.35s ease',
      overflow: 'hidden'
    }}>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Lotus Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          width: '70vw',
          height: '70vw',
          maxWidth: 340,
          maxHeight: 340,
          backgroundImage: 'var(--bg-pattern)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          opacity: 0.06,
          filter: 'blur(1px)'
        }} />
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        position: 'relative',
        zIndex: 1,
        borderBottom: '1px solid var(--color-border)'
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '1.4rem',
            cursor: 'pointer',
            padding: '4px 8px',
            marginRight: 12,
            lineHeight: 1
          }}
        >
          ←
        </button>
        <div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.3rem',
            fontWeight: '700',
            color: 'var(--color-gold)',
            lineHeight: 1.2
          }}>
            Sankalpa
          </div>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            A vow of intent
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 24px',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Intro */}
        <div style={{
          marginBottom: 40,
          animation: 'fadeInUp 0.5s ease'
        }}>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--color-text-primary)',
            lineHeight: 1.8,
            marginBottom: 6,
            fontFamily: 'var(--font-serif)'
          }}>
            This Sankalpa records the intent with which this sādhanā began.
          </p>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.7,
            fontStyle: 'italic'
          }}>
            It is not a goal. It is a remembrance.
          </p>
        </div>

        {/* View Mode — existing sankalpa */}
        {mode === 'view' && sankalpa && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>

            {/* Sankalpa Text */}
            <div style={{
              background: 'rgba(201, 168, 76, 0.06)',
              border: '1px solid var(--color-border)',
              borderLeft: '3px solid var(--color-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 20px',
              marginBottom: 24
            }}>
              <div style={{
                fontSize: '0.68rem',
                color: 'var(--color-gold)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 10
              }}>
                Sankalpa
              </div>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                color: 'var(--color-text-primary)',
                lineHeight: 1.9,
                whiteSpace: 'pre-wrap'
              }}>
                {sankalpa.text}
              </p>
            </div>

            {/* Context */}
            {sankalpa.context && (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: '0.68rem',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 6
                }}>
                  Context
                </div>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                  lineHeight: 1.6
                }}>
                  {sankalpa.context}
                </p>
              </div>
            )}

            {/* Date */}
            <div style={{ marginBottom: 40 }}>
              <div style={{
                fontSize: '0.68rem',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 6
              }}>
                Date of Sankalpa
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-subtle)',
              }}>
                {formatDate(sankalpa.date)}
              </p>
            </div>

            {/* Saved confirmation */}
            {saved && (
              <div style={{
                textAlign: 'center',
                marginBottom: 24,
                animation: 'fadeInUp 0.3s ease'
              }}>
                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-gold)',
                  fontStyle: 'italic',
                  lineHeight: 1.7
                }}>
                  Sankalpa recorded.<br />
                  May your practice remain steady.
                </p>
              </div>
            )}

            {/* Inline warning */}
            {warning && (
              <div style={{
                background: 'rgba(201, 168, 76, 0.06)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: 20,
                animation: 'fadeInUp 0.3s ease'
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  marginBottom: 16,
                  textAlign: 'center'
                }}>
                  Rewriting a Sankalpa should be done with care.
                </p>

                {/* Show original */}
                <div style={{
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  marginBottom: 16,
                  fontSize: '0.82rem',
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                  lineHeight: 1.6
                }}>
                  You established this Sankalpa on {formatDate(sankalpa.date)}:<br />
                  <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)' }}>
                    "{sankalpa.text}"
                  </span>
                </div>

                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-subtle)',
                  textAlign: 'center',
                  marginBottom: 16,
                  lineHeight: 1.6
                }}>
                  Proceed only if this change is intentional.
                </p>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setWarning(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRewrite}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'rgba(201, 168, 76, 0.15)',
                      border: '1px solid var(--color-gold)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-gold)',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Rewrite Sankalpa
                  </button>
                </div>
              </div>
            )}

            {/* Re-affirm button */}
            {!warning && !saved && (
              <button
                onClick={handleEditAttempt}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  letterSpacing: '0.04em'
                }}
              >
                Re-affirm Sankalpa
              </button>
            )}
          </div>
        )}

        {/* Edit Mode — new or rewriting */}
        {(mode === 'edit' || isNew) && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>

            {/* Sankalpa field */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: 'block',
                fontSize: '0.68rem',
                color: 'var(--color-gold)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 10
              }}>
                Sankalpa (Intent)
              </label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={'e.g.\n"May every jaap be offered at the feet of Śrī Rāma,\nuntil remembrance becomes effortless."'}
                rows={5}
                style={{
                  width: '100%',
                  background: 'rgba(201, 168, 76, 0.04)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Context field */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: 'block',
                fontSize: '0.68rem',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 6
              }}>
                Context <span style={{ fontSize: '0.65rem' }}>(optional)</span>
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-subtle)',
                marginBottom: 8,
                fontStyle: 'italic'
              }}>
                Guru, Devatā, or occasion — if relevant.
              </p>
              <input
                type="text"
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="e.g. Hanumān-ji, Guru Kripā, Gṛhastha sādhanā"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Date — read only */}
            <div style={{ marginBottom: 36 }}>
              <div style={{
                fontSize: '0.68rem',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 6
              }}>
                Date of Sankalpa
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-subtle)',
                fontStyle: 'italic'
              }}>
                {sankalpa ? formatDate(sankalpa.date) : formatDate(getLocalToday())} — automatically recorded
              </p>
            </div>

            {/* Commitment notice */}
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-subtle)',
              textAlign: 'center',
              lineHeight: 1.7,
              marginBottom: 20,
              fontStyle: 'italic'
            }}>
              This Sankalpa is meant to endure.<br />
              Changes should be rare and deliberate.
            </p>

            {/* Establish button */}
            <button
              onClick={handleEstablish}
              disabled={!text.trim()}
              style={{
                width: '100%',
                padding: '16px',
                background: text.trim()
                  ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))'
                  : 'rgba(201,168,76,0.2)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: text.trim() ? '#0B1628' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-sans)',
                fontWeight: '600',
                fontSize: '0.95rem',
                letterSpacing: '0.06em',
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                transition: 'all var(--transition-smooth)'
              }}
            >
              {isNew ? 'Establish Sankalpa' : 'Rewrite Sankalpa'}
            </button>

            {/* Cancel if rewriting */}
            {!isNew && (
              <button
                onClick={() => { setMode('view'); setWarning(false) }}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: 12,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}