// ── CSV logic extracted from SettingsPanel.jsx ────────────────────────────────
// These tests verify the pure CSV building/parsing logic as implemented in
// src/components/SettingsPanel.jsx, exercised here without rendering the component.

// ── exportCSV row builder (from SettingsPanel.jsx lines 22-24) ────────────────
function buildCSVRow(entry) {
  return `${entry.date},${entry.count},"${(entry.notes || '').replace(/"/g, '""')}"`
}

// ── handleCSVImport line parser (from SettingsPanel.jsx lines 144-149) ────────
function parseCSVLine(line) {
  if (!line.trim()) return null
  const match = line.match(/^([^,]+),([^,]*),?(.*)$/)
  if (!match) return null
  const date = match[1].trim()
  const count = parseInt(match[2].trim()) || 0
  const notes = match[3].replace(/^"|"$/g, '').trim()
  return { date, count, notes }
}

// ─────────────────────────────────────────────────────────────────────────────

describe('exportCSV — double-quote escaping (BEH-240)', () => {

  it('BEH-240 | escapes double-quote characters in notes field (one " becomes "")', () => {
    const entry = { date: '2026-04-19', count: 108, notes: 'He said "Jai Ram"' }
    const row = buildCSVRow(entry)
    // The notes field should have double-quotes escaped: " → ""
    expect(row).toBe('2026-04-19,108,"He said ""Jai Ram"""')
  })

  it('BEH-240b | notes with no quotes are not modified', () => {
    const entry = { date: '2026-04-19', count: 108, notes: 'Normal notes' }
    const row = buildCSVRow(entry)
    expect(row).toBe('2026-04-19,108,"Normal notes"')
  })

  it('BEH-240c | empty notes produce empty quoted field', () => {
    const entry = { date: '2026-04-19', count: 0, notes: '' }
    const row = buildCSVRow(entry)
    expect(row).toBe('2026-04-19,0,""')
  })

  it('BEH-240d | undefined notes treated as empty string', () => {
    const entry = { date: '2026-04-19', count: 0, notes: undefined }
    const row = buildCSVRow(entry)
    expect(row).toBe('2026-04-19,0,""')
  })

})

describe('handleCSVImport — strips surrounding quotes (BEH-246)', () => {

  it('BEH-246 | strips surrounding double-quotes from notes field value', () => {
    const line = '2026-04-19,108,"Some notes here"'
    const result = parseCSVLine(line)
    expect(result).not.toBeNull()
    expect(result.notes).toBe('Some notes here')
  })

  it('BEH-246b | handles notes field with no quotes', () => {
    const line = '2026-04-19,108,No quotes at all'
    const result = parseCSVLine(line)
    expect(result).not.toBeNull()
    expect(result.notes).toBe('No quotes at all')
  })

  it('BEH-246c | parses date and count correctly alongside notes', () => {
    const line = '2026-04-01,5000,"Morning session"'
    const result = parseCSVLine(line)
    expect(result.date).toBe('2026-04-01')
    expect(result.count).toBe(5000)
    expect(result.notes).toBe('Morning session')
  })

})

describe('handleCSVImport — skips blank lines (BEH-247)', () => {

  it('BEH-247 | returns null for a completely blank line', () => {
    expect(parseCSVLine('')).toBeNull()
  })

  it('BEH-247b | returns null for a line with only whitespace', () => {
    expect(parseCSVLine('   ')).toBeNull()
  })

  it('BEH-247c | returns a valid result for a non-blank line', () => {
    const result = parseCSVLine('2026-04-19,108,"Valid"')
    expect(result).not.toBeNull()
    expect(result.date).toBe('2026-04-19')
  })

})
