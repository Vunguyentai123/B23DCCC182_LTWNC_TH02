import { describe, expect, it } from 'vitest'
import { formatDuration } from './format'

describe('formatDuration', () => {
  it('hiển thị 0 giây là 0:00', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('hiển thị 65 giây là 1:05', () => {
    expect(formatDuration(65)).toBe('1:05')
  })

  it('hiển thị 300 giây là 5:00', () => {
    expect(formatDuration(300)).toBe('5:00')
  })

  it('hiển thị 150 giây là 2:30', () => {
    expect(formatDuration(150)).toBe('2:30')
  })
})
