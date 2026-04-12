import { useState, useEffect } from 'react'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('visible') // visible → fading → done

  useEffect(() => {
    // Start fade after 3 seconds
    const fadeTimer = setTimeout(() => {
      setPhase('fading')
    }, 3000)

    // Complete after fade animation (2s + 0.8s fade)
    const doneTimer = setTimeout(() => {
      setPhase('done')
      if (onComplete) onComplete()
    }, 3800)

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

    <style>{`
        @keyframes rotateSunburst {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
      `}</style>  

      {/* Deity Image with golden glow */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Sunburst rays — brilliant tapered prabhāvali */}
        <svg
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            animation: 'rotateSunburst 12s linear infinite',
            zIndex: 0,
          }}
          viewBox="0 0 420 420"
        >
          <defs>
            {/* Glow filter for luminous bloom */}
            <filter id="rayGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Radial gradient — bright at base, fades to transparent */}
            <radialGradient id="rayGrad" cx="50%" cy="50%" r="50%">
              <stop offset="30%" stopColor="#FFE484" stopOpacity="1" />
              <stop offset="60%" stopColor="#C9A84C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
            </radialGradient>
          </defs>

          {Array.from({ length: 24 }).map((_, i) => {
            const isMajor = i % 2 === 0
            const angle = (i * 360) / 24
            const rad = (angle * Math.PI) / 180
            const perpRad = rad + Math.PI / 2

            const halfBase = isMajor ? 7 : 3.5
            const innerR = 128
            const outerR = isMajor ? 200 : 168

            const bx1 = 210 + innerR * Math.cos(rad) + halfBase * Math.cos(perpRad)
            const by1 = 210 + innerR * Math.sin(rad) + halfBase * Math.sin(perpRad)
            const bx2 = 210 + innerR * Math.cos(rad) - halfBase * Math.cos(perpRad)
            const by2 = 210 + innerR * Math.sin(rad) - halfBase * Math.sin(perpRad)
            const tx = 210 + outerR * Math.cos(rad)
            const ty = 210 + outerR * Math.sin(rad)

            return (
              <g key={i} filter="url(#rayGlow)">
                <polygon
                  points={`${bx1},${by1} ${bx2},${by2} ${tx},${ty}`}
                  fill="url(#rayGrad)"
                  fillOpacity={isMajor ? 1 : 0.55}
                />
              </g>
            )
          })}
        </svg>
        {/* Glow ring */}
        <div style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,192,64,0.4) 0%, rgba(201,168,76,0.2) 45%, transparent 70%)',
          animation: 'pulse 2s ease-in-out infinite',
          zIndex: 2
        }} />

        {/* Deity Image */}
        <img
          src={import.meta.env.BASE_URL + 'deity.png'}
          alt="deity"
          style={{
            width: 250,
            height: 250,
            objectFit: 'contain',
            borderRadius: '50%',
            position: 'relative',
            zIndex: 3,
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
          Sumiran
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          सुमिरन · Daily Practice Tracker
        </div>
      </div>

    </div>
  )
}