import { PALETTES, getSavedPalette, savePalette, applyPalette } from '../../logic/palette'

// ── BEH-076: PALETTES array structure ────────────────────────────────────────

describe('PALETTES — BEH-076', () => {

  it('BEH-076 | has exactly 3 palettes', () => {
    expect(PALETTES).toHaveLength(3)
  })

  it('BEH-076 | each palette has id, name, description, and preview fields', () => {
    for (const palette of PALETTES) {
      expect(typeof palette.id).toBe('string')
      expect(typeof palette.name).toBe('string')
      expect(typeof palette.description).toBe('string')
      expect(Array.isArray(palette.preview)).toBe(true)
      expect(palette.preview).toHaveLength(3)
      for (const color of palette.preview) {
        expect(typeof color).toBe('string')
      }
    }
  })

  it('BEH-076 | has the three expected palette ids', () => {
    const ids = PALETTES.map(p => p.id)
    expect(ids).toContain('midnight-sanctum')
    expect(ids).toContain('sacred-saffron')
    expect(ids).toContain('forest-ashram')
  })

})

// ── getSavedPalette — BEH-365, BEH-366 ───────────────────────────────────────

describe('getSavedPalette', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('BEH-365 | returns "midnight-sanctum" when localStorage is empty', () => {
    expect(getSavedPalette()).toBe('midnight-sanctum')
  })

  it('BEH-366 | returns the stored palette ID from localStorage', () => {
    localStorage.setItem('jaap-ledger-palette', 'sacred-saffron')
    expect(getSavedPalette()).toBe('sacred-saffron')
  })

})

// ── savePalette — BEH-367 ─────────────────────────────────────────────────────

describe('savePalette — BEH-367', () => {

  beforeEach(() => localStorage.clear())
  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-palette')
    document.documentElement.style.removeProperty('--bg-pattern')
  })

  it('BEH-367 | stores palette ID in localStorage AND applies the palette (data-palette attribute set)', () => {
    savePalette('forest-ashram')

    // savePalette stores the ID in localStorage
    expect(localStorage.getItem('jaap-ledger-palette')).toBe('forest-ashram')
    // savePalette calls applyPalette internally — verified via side-effect on documentElement
    expect(document.documentElement.getAttribute('data-palette')).toBe('forest-ashram')
  })

})

// ── applyPalette — BEH-368, BEH-369, BEH-370 ─────────────────────────────────

describe('applyPalette', () => {

  afterEach(() => {
    document.documentElement.removeAttribute('data-palette')
    document.documentElement.style.removeProperty('--bg-pattern')
  })

  it('BEH-368 | sets data-palette attribute on document.documentElement', () => {
    applyPalette('sacred-saffron')
    expect(document.documentElement.getAttribute('data-palette')).toBe('sacred-saffron')
  })

  it('BEH-369 | sets --bg-pattern CSS custom property', () => {
    applyPalette('sacred-saffron')
    const value = document.documentElement.style.getPropertyValue('--bg-pattern')
    expect(value).toMatch(/bg-sacred-saffron\.png/)
  })

  it('BEH-370 | removes data-palette attribute for the default palette "midnight-sanctum"', () => {
    // First set a non-default palette, then switch to default
    applyPalette('sacred-saffron')
    expect(document.documentElement.getAttribute('data-palette')).toBe('sacred-saffron')

    applyPalette('midnight-sanctum')
    expect(document.documentElement.hasAttribute('data-palette')).toBe(false)
  })

})
