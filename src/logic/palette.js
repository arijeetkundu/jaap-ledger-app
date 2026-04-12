export const PALETTES = [
  {
    id: 'midnight-sanctum',
    name: 'Midnight Sanctum',
    description: 'Deep navy · Warm gold',
    preview: ['#0B1628', '#C9A84C', '#F0F4FF']
  },
  {
    id: 'sacred-saffron',
    name: 'Sacred Saffron',
    description: 'Deep burgundy · Saffron',
    preview: ['#1A0A0A', '#E8820A', '#FFF8F0']
  },
  {
    id: 'forest-ashram',
    name: 'Forest Ashram',
    description: 'Deep forest · Warm gold',
    preview: ['#0A1A0F', '#B8A830', '#F0F5F0']
  }
]

const STORAGE_KEY = 'jaap-ledger-palette'

export function getSavedPalette() {
  return localStorage.getItem(STORAGE_KEY) || 'midnight-sanctum'
}

export function savePalette(paletteId) {
  localStorage.setItem(STORAGE_KEY, paletteId)
  applyPalette(paletteId)
}

const BG_IMAGES = {
  'midnight-sanctum': 'bg-midnight-sanctum.png',
  'sacred-saffron':   'bg-sacred-saffron.png',
  'forest-ashram':    'bg-forest-ashram.png',
}

export function applyPalette(paletteId) {
  const base = import.meta.env.BASE_URL
  const bgFile = BG_IMAGES[paletteId] || BG_IMAGES['midnight-sanctum']
  document.documentElement.style.setProperty('--bg-pattern', `url('${base}${bgFile}')`)

  if (paletteId === 'midnight-sanctum') {
    document.documentElement.removeAttribute('data-palette')
  } else {
    document.documentElement.setAttribute('data-palette', paletteId)
  }
}