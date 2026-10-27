import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { SONGS } from '../../data/songs'
import { initialPlayerState, usePlayerStore } from '../player/usePlayerStore'
import { useFavoritesStore } from './useFavoritesStore'
import FavoritesPage from './FavoritesPage'

describe('FavoritesPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    usePlayerStore.setState(initialPlayerState)
    useFavoritesStore.setState({ ids: [] })
  })

  it('hiển thị thông báo khi chưa có bài hát yêu thích', () => {
    render(<FavoritesPage />)

    expect(
      screen.getByText('Bạn chưa có bài hát yêu thích.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Phát tất cả' }),
    ).toBeDisabled()
  })

  it('liệt kê bài hát yêu thích và phát tất cả', () => {
    useFavoritesStore.setState({ ids: ['s1', 's3'] })
    render(<FavoritesPage />)

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument()
    expect(screen.getByText('Gió tháng Sáu 1')).toBeInTheDocument()
    expect(screen.getByText('2 bài hát đã được bạn yêu thích.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }))

    const state = usePlayerStore.getState()
    expect(state.queue).toEqual([SONGS[0], SONGS[2]])
    expect(state.currentIndex).toBe(0)
    expect(state.isPlaying).toBe(true)
  })

  it('bỏ yêu thích thì bài hát biến mất khỏi trang', () => {
    useFavoritesStore.setState({ ids: ['s1'] })
    render(<FavoritesPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Bỏ yêu thích' }))

    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument()
    expect(
      screen.getByText('Bạn chưa có bài hát yêu thích.'),
    ).toBeInTheDocument()
  })
})
