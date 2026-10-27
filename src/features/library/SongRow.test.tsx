import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SONGS } from '../../data/songs'
import { useFavoritesStore } from '../favorites/useFavoritesStore'
import { SongRow } from './SongRow'

const song = SONGS[0]

function renderSongRow() {
  const onPlay = vi.fn()
  const onAddToQueue = vi.fn()

  render(
    <SongRow
      song={song}
      index={0}
      onPlay={onPlay}
      onAddToQueue={onAddToQueue}
    />,
  )

  return { onPlay, onAddToQueue }
}

describe('SongRow', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useFavoritesStore.setState({ ids: [] })
  })

  it('hiển thị tên bài hát và thời lượng 2:30', () => {
    renderSongRow()

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument()
    expect(screen.getByText('2:30')).toBeInTheDocument()
    expect(screen.getByText('Lê Minh')).toBeInTheDocument()
    expect(screen.getByText('Pop')).toBeInTheDocument()
  })

  it('gọi callback Phát với đúng bài hát', async () => {
    const user = userEvent.setup()
    const { onPlay } = renderSongRow()

    await user.click(screen.getByRole('button', { name: 'Phát' }))

    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(onPlay).toHaveBeenCalledWith(song)
  })

  it('gọi callback thêm vào hàng đợi', async () => {
    const user = userEvent.setup()
    const { onAddToQueue } = renderSongRow()

    await user.click(screen.getByRole('button', { name: '+ Hàng đợi' }))

    expect(onAddToQueue).toHaveBeenCalledWith(song)
  })

  it('đổi trạng thái yêu thích và aria-label của nút tim', async () => {
    const user = userEvent.setup()
    renderSongRow()

    const row = screen.getByText('Mưa tháng Sáu 1').closest('.song-row')
    expect(row).not.toBeNull()
    const favoriteButton = within(row as HTMLElement).getByRole('button', {
      name: 'Thêm vào yêu thích',
    })

    await user.click(favoriteButton)

    expect(
      screen.getByRole('button', { name: 'Bỏ yêu thích' }),
    ).toBeInTheDocument()
    expect(useFavoritesStore.getState().ids).toEqual([song.id])
  })
})
