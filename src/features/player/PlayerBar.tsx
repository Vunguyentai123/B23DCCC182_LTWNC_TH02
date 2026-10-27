import { useEffect, useState } from 'react'
import { usePlayerStore } from './usePlayerStore'
import ProgressBar from './ProgressBar'

export default function PlayerBar() {
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const queue = usePlayerStore((state) => state.queue)
  const currentIndex = usePlayerStore((state) => state.currentIndex)
  const currentSong = usePlayerStore(
    (state) => state.queue[state.currentIndex],
  )
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const next = usePlayerStore((state) => state.next)
  const prev = usePlayerStore((state) => state.prev)
  const playAt = usePlayerStore((state) => state.playAt)
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue)
  const clearQueue = usePlayerStore((state) => state.clearQueue)
  const tick = usePlayerStore((state) => state.tick)

  useEffect(() => {
    if (!isPlaying) return

    const intervalId = window.setInterval(() => {
      tick()
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isPlaying, tick])

  return (
    <aside className="player-bar" aria-label="Thanh phát nhạc">
      <div className="player-song">
        <span className="player-label">Đang phát</span>
        <p className="player-title">
          {currentSong
            ? `Đang phát: ${currentSong.title} – ${currentSong.artist}`
            : 'Chưa phát bài nào'}
        </p>
      </div>

      <ProgressBar />

      <div className="player-controls">
        <button type="button" className="button" onClick={prev}>
          Trước
        </button>
        <button
          type="button"
          className="button button-primary play-button"
          onClick={togglePlay}
        >
          {isPlaying ? 'Tạm dừng' : 'Phát'}
        </button>
        <button type="button" className="button" onClick={next}>
          Sau
        </button>
        <button
          type="button"
          className={`button queue-toggle${isQueueOpen ? ' is-active' : ''}`}
          aria-label="Mở hàng đợi"
          aria-expanded={isQueueOpen}
          aria-controls="player-queue-panel"
          onClick={() => setIsQueueOpen((open) => !open)}
        >
          <span className="queue-toggle-label">Hàng đợi</span>
          <span className="queue-badge">{queue.length}</span>
        </button>
      </div>

      <p className="queue-count">Hàng đợi: {queue.length} bài</p>

      {isQueueOpen && (
        <section
          id="player-queue-panel"
          className="queue-panel"
          aria-label="Danh sách hàng đợi"
        >
          <header className="queue-panel-header">
            <h2>Hàng đợi</h2>
            <button
              type="button"
              className="button button-small"
              onClick={clearQueue}
              disabled={queue.length === 0}
            >
              Xóa tất cả
            </button>
          </header>

          {queue.length === 0 ? (
            <p className="queue-empty">
              Hàng đợi đang trống. Bấm “+ Hàng đợi” ở một bài hát để thêm.
            </p>
          ) : (
            <ol className="queue-list">
              {queue.map((song, index) => (
                <li
                  key={song.id}
                  className={`queue-item${index === currentIndex ? ' is-current' : ''}`}
                >
                  <button
                    type="button"
                    className="queue-item-play"
                    onClick={() => playAt(index)}
                  >
                    <span className="queue-item-title">{song.title}</span>
                    <span className="queue-item-artist">{song.artist}</span>
                  </button>
                  <button
                    type="button"
                    className="icon-button queue-item-remove"
                    aria-label={`Xóa ${song.title} khỏi hàng đợi`}
                    onClick={() => removeFromQueue(song.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </aside>
  )
}
