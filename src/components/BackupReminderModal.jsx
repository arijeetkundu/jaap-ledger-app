import { useState } from 'react'
import { backupToDrive } from '../logic/driveExport'
import { markReminderShownToday } from '../logic/backupReminder'

export default function BackupReminderModal({ onClose }) {
  const [status, setStatus] = useState(null) // null | 'uploading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  async function handleBackupToDrive() {
    try {
      setStatus('uploading')
      setMessage('Connecting to Google Drive...')
      await backupToDrive()
      setStatus('success')
      setMessage('Backed up successfully to Google Drive.')
      markReminderShownToday()
      setTimeout(() => onClose(), 2000)
    } catch (err) {
      console.error('Drive backup failed:', err)
      setStatus('error')
      setMessage('Could not back up. Please try again.')
    }
  }

  function handleDismiss() {
    markReminderShownToday()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="backup-backdrop"
        onClick={handleDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 100,
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Modal */}
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
        width: 'min(90vw, 360px)',
        animation: 'fadeIn 0.2s ease'
      }}>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
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

        {/* Icon */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--spacing-md)'
        }}>
          <img
            src={`${import.meta.env.BASE_URL}google-drive.svg`}
            alt="Google Drive"
            style={{ width: 40, height: 40 }}
          />
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'var(--color-gold)',
          textAlign: 'center',
          marginBottom: 'var(--spacing-sm)'
        }}>
          Jai Siya Ram. It is Sunday.
        </h2>

        {/* Message */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          lineHeight: 1.6,
          marginBottom: 'var(--spacing-xl)'
        }}>
          What has been chanted with devotion, let it be preserved with reverence.
        </p>

        {/* Status message */}
        {status && (
          <div style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--spacing-md)',
            fontSize: '0.82rem',
            textAlign: 'center',
            background: status === 'success'
              ? 'rgba(201,168,76,0.1)'
              : status === 'error'
                ? 'rgba(192,57,43,0.1)'
                : 'var(--color-gold-track)',
            color: status === 'success'
              ? 'var(--color-gold)'
              : status === 'error'
                ? 'var(--color-sunday)'
                : 'var(--color-text-muted)',
            border: `1px solid ${status === 'success'
              ? 'rgba(201,168,76,0.3)'
              : status === 'error'
                ? 'rgba(192,57,43,0.3)'
                : 'transparent'}`
          }}>
            {message}
          </div>
        )}

        {/* Back Up to Google Drive button */}
        <button
          className="btn btn-primary"
          onClick={handleBackupToDrive}
          disabled={status === 'uploading' || status === 'success'}
          style={{ width: '100%', marginBottom: 10 }}
        >
          {status === 'uploading' ? 'Backing up...' : 'Back Up to Google Drive'}
        </button>

        {/* Remind me next Sunday */}
        <button
          onClick={handleDismiss}
          disabled={status === 'uploading'}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '12px 0',
            textDecoration: 'underline'
          }}
        >
          Remind me next Sunday
        </button>
      </div>
    </>
  )
}
