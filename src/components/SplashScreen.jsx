import { useState, useEffect } from 'react'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('visible') // visible → fading → done

  useEffect(() => {
    // Start fade after 2 seconds
    const fadeTimer = setTimeout(() => {
      setPhase('fading')
    }, 2000)

    // Complete after fade animation (2s + 0.8s fade)
    const doneTimer = setTimeout(() => {
      setPhase('done')
      if (onComplete) onComplete()
    }, 2800)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      opacity: phase === 'fading' ? 0 : 1,
      transition: 'opacity 0.8s ease',
      pointerEvents: phase === 'fading' ? 'none' : 'all'
    }}>

      {/* Deity Image with golden glow */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Glow ring */}
        <div style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,192,64,0.25) 0%, rgba(201,168,76,0.1) 50%, transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite'
        }} />

        {/* Deity Image */}
        <img
          src="/deity.png"
          alt="deity"
          style={{
            width: 250,
            height: 250,
            objectFit: 'contain',
            borderRadius: '50%',
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 0 24px rgba(240,192,64,0.4))'
          }}
          onError={e => {
            // Fallback if image not yet added
            e.target.style.display = 'none'
          }}
        />

        {/* Fallback lotus if no image */}
        <div style={{
          fontSize: '100px',
          position: 'absolute',
          zIndex: 0,
          filter: 'drop-shadow(0 0 20px rgba(240,192,64,0.5))'
        }}>
          🪷
        </div>
      </div>

      {/* App Name */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2.4rem',
          fontWeight: '700',
          color: 'var(--color-gold-bright)',
          letterSpacing: '0.03em',
          marginBottom: 8,
          textShadow: '0 0 40px rgba(240,192,64,0.3)'
        }}>
          Jaap Ledger
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          Daily Practice Tracker
        </div>
      </div>

    </div>
  )
}