import { useCallback, useMemo } from 'react'
import { SONGS } from '../../data/songs'
import type { Song } from '../../types'
import { SongRow } from '../library/SongRow'
import { usePlayerStore } from '../player/usePlayerStore'
import { useFavoritesStore } from './useFavoritesStore'

export default function FavoritesPage() {
  const ids = useFavoritesStore((state) => state.ids)
  const playQueue = usePlayerStore((state) => state.playQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const currentSongId = usePlayerStore(
    (state) => state.queue[state.currentIndex]?.id,
  )

  const favoriteSongs = useMemo(() => {
    const songsById = new Map(SONGS.map((song) => [song.id, song]))
    return ids
      .map((id) => songsById.get(id))
      .filter((song): song is Song => song !== undefined)
  }, [ids])

  const handlePlay = useCallback(
    (song: Song) => {
      const startIndex = favoriteSongs.findIndex((item) => item.id === song.id)
      playQueue(favoriteSongs, Math.max(0, startIndex))
    },
    [favoriteSongs, playQueue],
  )

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0)
    }
  }

  return (
    <section className="page favorites-page">
      <header className="page-heading page-heading-row">
        <div>
          <p className="eyebrow">Bộ sưu tập</p>
          <h1>Bài hát yêu thích</h1>
          <p className="page-description">
            {favoriteSongs.length} bài hát đã được bạn yêu thích.
          </p>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={handlePlayAll}
          disabled={favoriteSongs.length === 0}
        >
          Phát tất cả
        </button>
      </header>

      {favoriteSongs.length === 0 ? (
        <p className="empty-state">Bạn chưa có bài hát yêu thích.</p>
      ) : (
        <div className="plain-song-list">
          {favoriteSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              onPlay={handlePlay}
              onAddToQueue={addToQueue}
              showPlaylistButton={false}
              isCurrent={currentSongId === song.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
