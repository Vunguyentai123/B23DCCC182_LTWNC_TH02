import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeContext'

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span>{theme}</span>
      <button type="button" onClick={toggleTheme}>
        Đổi giao diện
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('mặc định dùng giao diện sáng và chuyển sang tối', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByText('light')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Đổi giao diện' }))

    expect(screen.getByText('dark')).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('music-theme')).toBe('dark')
  })

  it('báo lỗi khi dùng hook ngoài provider', () => {
    expect(() => render(<ThemeProbe />)).toThrow(
      'useTheme phải được dùng bên trong ThemeProvider.',
    )
  })
})
