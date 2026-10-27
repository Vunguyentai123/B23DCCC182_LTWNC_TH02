import { fireEvent, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { initialPlayerState, usePlayerStore } from '../player/usePlayerStore'
import PlaylistDetailPage from './PlaylistDetailPage'

function renderDetail(route = '/playlists/p1') {
  renderWithProviders(
    <Routes>
      <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
      <Route path="/playlists" element={<p>Danh sách playlist</p>} />
    </Routes>,
    { route },
  )
}

describe('PlaylistDetailPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    usePlayerStore.setState(initialPlayerState)
    window.localStorage.setItem(
      'music-playlists',
      JSON.stringify([
        { id: 'p1', name: 'Chạy bộ', songIds: ['s1', 's2'] },
      ]),
    )
  })

  it('hiển thị bài hát và tổng thời lượng của playlist', () => {
    renderDetail()

    expect(screen.getByRole('heading', { name: 'Chạy bộ' })).toBeInTheDocument()
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument()
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument()
    expect(
      screen.getByText('Tổng thời lượng: 5 phút 37 giây'),
    ).toBeInTheDocument()
  })

  it('phát tất cả bài hát trong playlist', () => {
    renderDetail()

    fireEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }))

    const state = usePlayerStore.getState()
    expect(state.queue).toHaveLength(2)
    expect(state.queue[0].id).toBe('s1')
    expect(state.isPlaying).toBe(true)
  })

  it('bỏ bài hát khỏi playlist và cập nhật tổng thời lượng', () => {
    renderDetail()

    fireEvent.click(screen.getAllByRole('button', { name: 'Bỏ' })[0])

    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument()
    expect(
      screen.getByText('Tổng thời lượng: 3 phút 7 giây'),
    ).toBeInTheDocument()
  })

  it('báo không tìm thấy playlist', () => {
    renderDetail('/playlists/khong-co')

    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument()
  })
})
