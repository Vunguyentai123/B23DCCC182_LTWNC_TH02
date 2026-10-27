import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SONGS } from '../../data/songs'
import { initialPlayerState, usePlayerStore } from './usePlayerStore'
import PlayerBar from './PlayerBar'

const [s1, s2] = SONGS

describe('PlayerBar', () => {
  beforeEach(() => {
    usePlayerStore.setState(initialPlayerState)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('hiển thị trạng thái chưa phát bài nào', () => {
    render(<PlayerBar />)

    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument()
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument()
    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument()
  })

  it('cập nhật thời gian mỗi giây, tạm dừng và chạy tiếp', () => {
    vi.useFakeTimers()
    render(<PlayerBar />)

    act(() => {
      usePlayerStore.getState().playQueue([s1, s2], 0)
    })

    expect(
      screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh'),
    ).toBeInTheDocument()
    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByText('0:05 / 2:30')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }))
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByText('0:05 / 2:30')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Phát' }))
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('0:06 / 2:30')).toBeInTheDocument()
  })

  it('chuyển sang bài sau và đưa thời gian về 0:00', () => {
    render(<PlayerBar />)

    act(() => {
      usePlayerStore.getState().playQueue([s1, s2], 0)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sau' }))

    expect(
      screen.getByText('Đang phát: Nắng tháng Sáu 1 – Quang Huy'),
    ).toBeInTheDocument()
    expect(screen.getByText('0:00 / 3:07')).toBeInTheDocument()
  })

  it('hiển thị thanh tiến trình theo phần trăm', () => {
    render(<PlayerBar />)

    act(() => {
      usePlayerStore.getState().playQueue([s1], 0)
      usePlayerStore.setState({ position: 75 })
    })

    const progress = screen.getByRole('progressbar', {
      name: 'Tiến trình bài hát',
    })
    expect(progress).toHaveAttribute('aria-valuenow', '75')
    expect(progress).toHaveAttribute('aria-valuemax', String(s1.duration))
    expect(document.querySelector('.progress-fill')).toHaveStyle({
      width: '50%',
    })
  })

  it('mở bảng hàng đợi và liệt kê các bài đã thêm', () => {
    render(<PlayerBar />)

    act(() => {
      usePlayerStore.getState().addToQueue(s1)
      usePlayerStore.getState().addToQueue(s2)
    })

    const toggle = screen.getByRole('button', { name: 'Mở hàng đợi' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)

    const panel = screen.getByRole('region', {
      name: 'Danh sách hàng đợi',
    })
    expect(within(panel).getByText('Mưa tháng Sáu 1')).toBeInTheDocument()
    expect(within(panel).getByText('Nắng tháng Sáu 1')).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('bấm một bài trong hàng đợi để phát bài đó', () => {
    render(<PlayerBar />)

    act(() => {
      usePlayerStore.getState().playQueue([s1, s2], 0)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Mở hàng đợi' }))

    const panel = screen.getByRole('region', {
      name: 'Danh sách hàng đợi',
    })
    fireEvent.click(
      within(panel).getByRole('button', { name: /^Nắng tháng Sáu 1/ }),
    )

    const state = usePlayerStore.getState()
    expect(state.currentIndex).toBe(1)
    expect(state.isPlaying).toBe(true)
    expect(state.position).toBe(0)
  })

  it('xóa một bài và xóa toàn bộ hàng đợi từ bảng hàng đợi', () => {
    render(<PlayerBar />)

    act(() => {
      usePlayerStore.getState().addToQueue(s1)
      usePlayerStore.getState().addToQueue(s2)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Mở hàng đợi' }))

    const panel = screen.getByRole('region', {
      name: 'Danh sách hàng đợi',
    })
    fireEvent.click(
      within(panel).getByRole('button', {
        name: 'Xóa Mưa tháng Sáu 1 khỏi hàng đợi',
      }),
    )

    expect(usePlayerStore.getState().queue).toEqual([s2])

    fireEvent.click(screen.getByRole('button', { name: 'Xóa tất cả' }))

    expect(usePlayerStore.getState().queue).toEqual([])
    expect(
      within(panel).getByText(
        'Hàng đợi đang trống. Bấm “+ Hàng đợi” ở một bài hát để thêm.',
      ),
    ).toBeInTheDocument()
  })

  it('bật phát ngẫu nhiên và chuyển chế độ lặp lại', () => {
    render(<PlayerBar />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Bật phát ngẫu nhiên' }),
    )
    expect(usePlayerStore.getState().isShuffle).toBe(true)
    expect(
      screen.getByRole('button', { name: 'Tắt phát ngẫu nhiên' }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Bật lặp lại' }))
    expect(usePlayerStore.getState().repeatMode).toBe('all')

    fireEvent.click(
      screen.getByRole('button', { name: 'Lặp lại tất cả' }),
    )
    expect(usePlayerStore.getState().repeatMode).toBe('one')

    fireEvent.click(
      screen.getByRole('button', { name: 'Lặp lại một bài' }),
    )
    expect(usePlayerStore.getState().repeatMode).toBe('off')
  })

  it('phím Space phát/tạm dừng và bỏ qua khi đang gõ trong ô nhập', () => {
    render(<PlayerBar />)

    act(() => {
      usePlayerStore.getState().playQueue([s1], 0)
    })
    expect(usePlayerStore.getState().isPlaying).toBe(true)

    fireEvent.keyDown(window, { code: 'Space', key: ' ' })
    expect(usePlayerStore.getState().isPlaying).toBe(false)

    fireEvent.keyDown(window, { code: 'Space', key: ' ' })
    expect(usePlayerStore.getState().isPlaying).toBe(true)

    const input = document.createElement('input')
    document.body.append(input)
    fireEvent.keyDown(input, { code: 'Space', key: ' ' })
    expect(usePlayerStore.getState().isPlaying).toBe(true)
    input.remove()
  })

  it('gỡ bỏ listener phím Space khi unmount', () => {
    const { unmount } = render(<PlayerBar />)

    act(() => {
      usePlayerStore.getState().playQueue([s1], 0)
    })
    unmount()

    fireEvent.keyDown(window, { code: 'Space', key: ' ' })
    expect(usePlayerStore.getState().isPlaying).toBe(true)
  })
})
