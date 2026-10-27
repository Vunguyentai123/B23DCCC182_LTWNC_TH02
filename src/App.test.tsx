import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import {
  initialPlayerState,
  usePlayerStore,
} from './features/player/usePlayerStore'

function renderApp() {
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    usePlayerStore.setState(initialPlayerState)
  })

  it('hiển thị thư viện và thanh phát nhạc ở trang chủ', () => {
    renderApp()

    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument()
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Thư viện' })).toHaveClass('active')
  })

  it('điều hướng tới trang yêu thích được tải lazy', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('link', { name: 'Yêu thích' }))

    expect(
      await screen.findByText('Bạn chưa có bài hát yêu thích.'),
    ).toBeInTheDocument()
  })

  it('điều hướng tới trang playlist được tải lazy', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('link', { name: 'Playlist' }))

    expect(
      await screen.findByRole('heading', { name: 'Playlist của bạn' }),
    ).toBeInTheDocument()
  })

  it('đổi giao diện sáng tối từ thanh menu', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Giao diện tối' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(
      screen.getByRole('button', { name: 'Giao diện sáng' }),
    ).toBeInTheDocument()
  })

  it('tạo playlist, thêm bài từ thư viện và xem tổng thời lượng', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('link', { name: 'Playlist' }))
    await user.type(
      await screen.findByLabelText('Tên playlist'),
      'Chạy bộ',
    )
    await user.click(screen.getByRole('button', { name: 'Tạo' }))

    await user.click(screen.getByRole('link', { name: 'Thư viện' }))

    const firstRow = screen.getByText('Mưa tháng Sáu 1').closest('.song-row')
    const secondRow = screen.getByText('Nắng tháng Sáu 1').closest('.song-row')
    expect(firstRow).not.toBeNull()
    expect(secondRow).not.toBeNull()

    await user.click(
      within(firstRow as HTMLElement).getByRole('button', {
        name: '+ Playlist',
      }),
    )
    await user.click(
      within(secondRow as HTMLElement).getByRole('button', {
        name: '+ Playlist',
      }),
    )
    await user.click(
      within(firstRow as HTMLElement).getByRole('button', {
        name: '+ Playlist',
      }),
    )

    await user.click(screen.getByRole('link', { name: 'Playlist' }))
    await user.click(
      await screen.findByRole('link', { name: 'Xem chi tiết' }),
    )

    expect(
      await screen.findByRole('heading', { name: 'Chạy bộ' }),
    ).toBeInTheDocument()
    expect(screen.getByText('2 bài hát')).toBeInTheDocument()
    expect(
      screen.getByText('Tổng thời lượng: 5 phút 37 giây'),
    ).toBeInTheDocument()
  })
})
