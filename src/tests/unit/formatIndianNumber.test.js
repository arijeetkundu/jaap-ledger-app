import { describe, it, expect } from 'vitest'
import { formatIndianNumber } from '../../logic/formatIndianNumber'

describe('formatIndianNumber', () => {

  it('should format zero correctly', () => {
    expect(formatIndianNumber(0)).toBe('0')
  })

  it('should format numbers below 1000 without commas', () => {
    expect(formatIndianNumber(999)).toBe('999')
  })

  it('should format thousands correctly', () => {
    expect(formatIndianNumber(65308)).toBe('65,308')
  })

  it('should format lakhs correctly', () => {
    expect(formatIndianNumber(5515238)).toBe('55,15,238')
  })

  it('should format crores correctly', () => {
    expect(formatIndianNumber(10000000)).toBe('1,00,00,000')
  })

  it('should format large crore numbers correctly', () => {
    expect(formatIndianNumber(55152389)).toBe('5,51,52,389')
  })

  it('should handle negative numbers', () => {
    expect(formatIndianNumber(-65308)).toBe('-65,308')
  })

})