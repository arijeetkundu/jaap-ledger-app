export function formatIndianNumber(number) {
  if (number === 0) return '0'

  const isNegative = number < 0
  const absNumber = Math.abs(number)
  const str = absNumber.toString()

  let result = ''

  if (str.length <= 3) {
    result = str
  } else {
    // Last 3 digits first
    result = str.slice(-3)
    const remaining = str.slice(0, -3)

    // Then groups of 2 from right to left
    for (let i = remaining.length; i > 0; i -= 2) {
      const start = Math.max(0, i - 2)
      result = remaining.slice(start, i) + ',' + result
    }
  }

  return isNegative ? '-' + result : result
}