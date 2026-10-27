import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavoritesStore } from '../favorites/useFavoritesStore'
import { initialPlayerState, usePlayerStore } from '../player/usePlayerStore'
import LibraryPage from './LibraryPage'

function typeSearch(value: string) {
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), {
    target: { value },
  })
}

describe('LibraryPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    usePlayerStore.setState(initialPlayerState)
    useFavoritesStore.setState({ ids: [] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('hiển thị 10000 bài nhưng chỉ render một số dòng', () => {
    render(<LibraryPage />)

    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument()
    const renderedRows = document.querySelectorAll('.song-row')
    expect(renderedRows.length).toBeGreaterThan(0)
    expect(renderedRows.length).toBeLessThan(20)
  })

  it('chỉ lọc sau khi ngừng gõ 300ms và kết hợp với thể loại', () => {
    vi.useFakeTimers()
    render(<LibraryPage />)

    typeSearch('mưa')
    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Thể loại'), {
      target: { value: 'Rock' },
    })
    expect(screen.getByText('Tìm thấy 250 bài hát')).toBeInTheDocument()
  })

  it('phát đúng danh sách đang hiển thị sau khi lọc', () => {
    vi.useFakeTimers()
    render(<LibraryPage />)

    typeSearch('mưa')
    act(() => {
      vi.advanceTimersByTime(300)
    })

    const row = screen.getByText('Mưa tháng Sáu 1').closest('.song-row')
    expect(row).not.toBeNull()
    fireEvent.click(
      within(row as HTMLElement).getByRole('button', { name: 'Phát' }),
    )

    const state = usePlayerStore.getState()
    expect(state.queue).toHaveLength(1250)
    expect(state.currentIndex).toBe(0)
    expect(state.isPlaying).toBe(true)
    expect(
      state.queue.every(
        (song) =>
          song.title.toLocaleLowerCase('vi').includes('mưa') ||
          song.artist.toLocaleLowerCase('vi').includes('mưa'),
      ),
    ).toBe(true)
  })

  it('thêm bài hát vào hàng đợi từ danh sách', () => {
    render(<LibraryPage />)

    const row = screen.getByText('Mưa tháng Sáu 1').closest('.song-row')
    expect(row).not.toBeNull()
    fireEvent.click(
      within(row as HTMLElement).getByRole('button', {
        name: '+ Hàng đợi',
      }),
    )

    const state = usePlayerStore.getState()
    expect(state.queue.map((song) => song.id)).toEqual(['s1'])
    expect(state.currentIndex).toBe(-1)
  })
})
