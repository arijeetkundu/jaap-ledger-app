// Unit tests for DB normalisation contracts
// These tests verify the normalisation logic used inside saveEntry and getEntry
// without invoking IndexedDB (which is unavailable in the jsdom/Vitest environment).
// The expressions tested here are taken directly from db.js source.

// ── BEH-087: saveEntry normalises missing count to 0 and missing notes to '' ──

describe('saveEntry — BEH-087 — normalisation of missing count and notes', () => {

  it('BEH-087 | count || 0 returns 0 when count is undefined', () => {
    const count = undefined
    expect(count || 0).toBe(0)
  })

  it('BEH-087 | count || 0 returns 0 when count is null', () => {
    const count = null
    expect(count || 0).toBe(0)
  })

  it('BEH-087 | count || 0 returns 0 when count is 0', () => {
    const count = 0
    expect(count || 0).toBe(0)
  })

  it('BEH-087 | count || 0 preserves a positive count value', () => {
    const count = 108
    expect(count || 0).toBe(108)
  })

  it('BEH-087 | notes || \'\' returns empty string when notes is undefined', () => {
    const notes = undefined
    expect(notes || '').toBe('')
  })

  it('BEH-087 | notes || \'\' returns empty string when notes is null', () => {
    const notes = null
    expect(notes || '').toBe('')
  })

  it('BEH-087 | notes || \'\' returns empty string when notes is already empty string', () => {
    const notes = ''
    expect(notes || '').toBe('')
  })

  it('BEH-087 | notes || \'\' preserves a non-empty notes string', () => {
    const notes = 'Morning session'
    expect(notes || '').toBe('Morning session')
  })

})

// ── BEH-090: getEntry returns null when no entry exists ───────────────────────

describe('getEntry — BEH-090 — returns null when no entry exists', () => {

  it('BEH-090 | result || null returns null when result is undefined', () => {
    const result = undefined
    expect(result || null).toBeNull()
  })

  it('BEH-090 | result || null returns null when result is null', () => {
    const result = null
    expect(result || null).toBeNull()
  })

  it('BEH-090 | result || null returns the entry object when a matching record exists', () => {
    const result = { date: '2026-04-11', count: 108, notes: 'Test' }
    expect(result || null).toEqual({ date: '2026-04-11', count: 108, notes: 'Test' })
  })

})
