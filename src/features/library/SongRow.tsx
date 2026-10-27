import {
  memo,
  useCallback,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import type { Song } from '../../types'
import { formatDuration } from '../../utils/format'
import { useFavoritesStore } from '../favorites/useFavoritesStore'

export interface SongRowProps {
  song: Song
  index: number
  style?: CSSProperties
  onPlay: (song: Song) => void
  onAddToQueue: (song: Song) => void
  onAddToPlaylist?: (song: Song) => void
  showPlaylistButton?: boolean
  isCurrent?: boolean
}

export const SongRow = memo(function SongRow({
  song,
  index,
  style,
  onPlay,
  onAddToQueue,
  onAddToPlaylist,
  showPlaylistButton = true,
  isCurrent = false,
}: SongRowProps) {
  const isFavorite = useFavoritesStore((state) => state.ids.includes(song.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggle)

  const handlePlay = useCallback(() => {
    onPlay(song)
  }, [onPlay, song])

  const handleAddToQueue = useCallback(() => {
    onAddToQueue(song)
  }, [onAddToQueue, song])

  const handleAddToPlaylist = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onAddToPlaylist?.(song)
    },
    [onAddToPlaylist, song],
  )

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(song.id)
  }, [song.id, toggleFavorite])

  return (
    <div
      className={`song-row${isCurrent ? ' is-current' : ''}`}
      style={style}
    >
      <span className="song-index">{index + 1}</span>
      <span className="song-title" title={song.title}>
        {song.title}
      </span>
      <span className="song-artist" title={song.artist}>
        {song.artist}
      </span>
      <span className="song-genre">{song.genre}</span>
      <span className="song-duration">{formatDuration(song.duration)}</span>
      <span className="song-actions">
        <button
          type="button"
          className="button button-primary button-small"
          onClick={handlePlay}
        >
          Phát
        </button>
        <button
          type="button"
          className={`icon-button favorite-button${isFavorite ? ' is-active' : ''}`}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={isFavorite}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        <button
          type="button"
          className="button button-small"
          onClick={handleAddToQueue}
        >
          + Hàng đợi
        </button>
        {showPlaylistButton ? (
          <button
            type="button"
            className="button button-small"
            onClick={handleAddToPlaylist}
            disabled={!onAddToPlaylist}
          >
            + Playlist
          </button>
        ) : null}
      </span>
    </div>
  )
})

export default SongRow
