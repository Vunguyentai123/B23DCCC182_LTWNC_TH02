import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SONGS } from '../../data/songs'
import type { Song } from '../../types'
import { formatDuration } from '../../utils/format'
import { usePlayerStore } from '../player/usePlayerStore'
import { usePlaylistDispatch, usePlaylists } from './PlaylistContext'

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const playlists = usePlaylists()
  const dispatch = usePlaylistDispatch()
  const playQueue = usePlayerStore((state) => state.playQueue)

  const playlist = playlists.find((item) => item.id === id)

  const songs = useMemo(() => {
    if (!playlist) return []
    const songsById = new Map(SONGS.map((song) => [song.id, song]))
    return playlist.songIds
      .map((songId) => songsById.get(songId))
      .filter((song): song is Song => song !== undefined)
  }, [playlist])

  const totalSeconds = songs.reduce((total, song) => total + song.duration, 0)

  if (!playlist) {
    return (
      <section className="page">
        <p className="empty-state">Không tìm thấy playlist</p>
        <Link className="text-link" to="/playlists">
          Quay lại danh sách playlist
        </Link>
      </section>
    )
  }

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playQueue(songs, 0)
    }
  }

  return (
    <section className="page playlist-detail-page">
      <Link className="text-link" to="/playlists">
        ← Tất cả playlist
      </Link>

      <header className="page-heading page-heading-row">
        <div>
          <p className="eyebrow">Playlist</p>
          <h1>{playlist.name}</h1>
          <p className="page-description">{songs.length} bài hát</p>
          <p className="total-duration">
            Tổng thời lượng: {Math.floor(totalSeconds / 60)} phút{' '}
            {totalSeconds % 60} giây
          </p>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={handlePlayAll}
          disabled={songs.length === 0}
        >
          Phát tất cả
        </button>
      </header>

      {songs.length === 0 ? (
        <p className="empty-state">Playlist chưa có bài hát nào.</p>
      ) : (
        <div className="plain-song-list">
          {songs.map((song, index) => (
            <article className="detail-song" key={song.id}>
              <span className="song-index">{index + 1}</span>
              <div className="detail-song-info">
                <strong>{song.title}</strong>
                <span>
                  {song.artist} · {song.genre}
                </span>
              </div>
              <span className="song-duration">
                {formatDuration(song.duration)}
              </span>
              <button
                type="button"
                className="button button-danger button-small"
                onClick={() => {
                  dispatch({
                    type: 'removeSong',
                    payload: { playlistId: playlist.id, songId: song.id },
                  })
                }}
              >
                Bỏ
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
