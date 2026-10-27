import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { usePlaylistDispatch, usePlaylists } from './PlaylistContext'

function createPlaylistId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `playlist-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function PlaylistsPage() {
  const playlists = usePlaylists()
  const dispatch = usePlaylistDispatch()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Tên playlist không được để trống')
      return
    }

    const duplicate = playlists.some(
      (playlist) =>
        playlist.name.toLocaleLowerCase('vi') ===
        trimmedName.toLocaleLowerCase('vi'),
    )
    if (duplicate) {
      setError('Tên playlist đã tồn tại')
      return
    }

    dispatch({
      type: 'create',
      payload: { id: createPlaylistId(), name: trimmedName },
    })
    setName('')
    setError('')
  }

  const handleRemove = (id: string) => {
    dispatch({ type: 'remove', payload: { id } })
  }

  return (
    <section className="page playlists-page">
      <header className="page-heading">
        <p className="eyebrow">Bộ sưu tập</p>
        <h1>Playlist của bạn</h1>
        <p className="page-description">
          Nhóm những bài hát yêu thích thành các danh sách riêng.
        </p>
      </header>

      <form className="playlist-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="playlist-name">Tên playlist</label>
          <input
            id="playlist-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError('')
            }}
            placeholder="Ví dụ: Chạy bộ"
          />
        </div>
        <button type="submit" className="button button-primary">
          Tạo
        </button>
      </form>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {playlists.length === 0 ? (
        <p className="empty-state">Chưa có playlist nào.</p>
      ) : (
        <div className="playlist-grid">
          {playlists.map((playlist) => (
            <article className="playlist-card" key={playlist.id}>
              <div>
                <h2>{playlist.name}</h2>
                <p>{playlist.songIds.length} bài</p>
              </div>
              <div className="playlist-card-actions">
                <Link
                  className="button button-small"
                  to={`/playlists/${playlist.id}`}
                >
                  Xem chi tiết
                </Link>
                <button
                  type="button"
                  className="button button-danger button-small"
                  onClick={() => handleRemove(playlist.id)}
                >
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
