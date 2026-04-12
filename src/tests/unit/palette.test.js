import { PALETTES } from '../../logic/palette'

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
