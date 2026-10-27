import { formatDuration } from '../../utils/format'
import { usePlayerStore } from './usePlayerStore'

export default function ProgressBar() {
  const position = usePlayerStore((state) => state.position)
  const duration = usePlayerStore(
    (state) => state.queue[state.currentIndex]?.duration ?? 0,
  )
  const percent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0

  return (
    <div className="progress-block">
      <span className="time-display">
        {formatDuration(position)} / {formatDuration(duration)}
      </span>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Tiến trình bài hát"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={position}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
