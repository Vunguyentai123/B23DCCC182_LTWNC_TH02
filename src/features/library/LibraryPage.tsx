import {
  memo,
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { SONGS } from '../../data/songs'
import { useDebounce } from '../../hooks/useDebounce'
import type { Genre, Song } from '../../types'
import { usePlayerStore } from '../player/usePlayerStore'
import { SongRow } from './SongRow'

type GenreFilter = 'all' | Genre
type SortMode = 'default' | 'name' | 'duration'

const GENRE_OPTIONS: Genre[] = ['Pop', 'Ballad', 'Rock', 'Indie', 'Rap']

interface SongListData {
  songs: Song[]
  onPlay: (song: Song) => void
  onAddToQueue: (song: Song) => void
  currentSongId: string | undefined
}

function SongListRow({
  index,
  style,
  data,
}: ListChildComponentProps<SongListData>) {
  const song = data.songs[index]
  if (!song) return null

  return (
    <SongRow
      song={song}
      index={index}
      style={style}
      onPlay={data.onPlay}
      onAddToQueue={data.onAddToQueue}
      isCurrent={data.currentSongId === song.id}
    />
  )
}

interface SongListProps {
  songs: Song[]
  onPlay: (song: Song) => void
  onAddToQueue: (song: Song) => void
  currentSongId: string | undefined
}

const SongList = memo(function SongList({
  songs,
  onPlay,
  onAddToQueue,
  currentSongId,
}: SongListProps) {
  const itemData = useMemo<SongListData>(
    () => ({ songs, onPlay, onAddToQueue, currentSongId }),
    [currentSongId, onAddToQueue, onPlay, songs],
  )

  const getItemKey = useCallback(
    (index: number) => songs[index].id,
    [songs],
  )

  return (
    <div className="song-list">
      <FixedSizeList<SongListData>
        height={560}
        itemCount={songs.length}
        itemSize={56}
        width="100%"
        itemData={itemData}
        itemKey={getItemKey}
      >
        {SongListRow}
      </FixedSizeList>
    </div>
  )
})

export default function LibraryPage() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState<GenreFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const debouncedQuery = useDebounce(query, 300)

  const playQueue = usePlayerStore((state) => state.playQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const currentSongId = usePlayerStore(
    (state) => state.queue[state.currentIndex]?.id,
  )

  const handleQueryShift = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value as GenreFilter)
  }

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortMode(event.target.value as SortMode)
  }

  const visibleSongs = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase('vi')
    const filtered = SONGS.filter((song) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        song.title.toLocaleLowerCase('vi').includes(normalizedQuery) ||
        song.artist.toLocaleLowerCase('vi').includes(normalizedQuery)
      const matchesGenre = genre === 'all' || song.genre === genre
      return matchesQuery && matchesGenre
    })

    if (sortMode === 'name') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'vi'))
    }

    if (sortMode === 'duration') {
      return [...filtered].sort((a, b) => a.duration - b.duration)
    }

    return filtered
  }, [debouncedQuery, genre, sortMode])

  const handlePlay = useCallback(
    (song: Song) => {
      const startIndex = visibleSongs.findIndex((item) => item.id === song.id)
      playQueue(visibleSongs, Math.max(0, startIndex))
    },
    [playQueue, visibleSongs],
  )

  return (
    <section className="page library-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Thư viện</p>
          <h1>Nghe nhạc mỗi ngày</h1>
          <p className="page-description">
            10.000 bài hát được tải mượt mà với danh sách ảo hóa.
          </p>
        </div>
      </header>

      <div className="filter-panel">
        <div className="field field-search">
          <label htmlFor="song-search">Tìm kiếm</label>
          <input
            id="song-search"
            type="search"
            value={query}
            onChange={handleQueryShift}
            placeholder="Tên bài hát hoặc ca sĩ..."
          />
        </div>

        <div className="field">
          <label htmlFor="genre-filter">Thể loại</label>
          <select id="genre-filter" value={genre} onChange={handleGenreChange}>
            <option value="all">Tất cả</option>
            {GENRE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="sort-mode">Sắp xếp</label>
          <select id="sort-mode" value={sortMode} onChange={handleSortChange}>
            <option value="default">Mặc định</option>
            <option value="name">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </div>
      </div>

      <div className="library-meta">
        <p className="result-count" aria-live="polite">
          Tìm thấy {visibleSongs.length} bài hát
        </p>
      </div>

      <div className="song-columns" aria-hidden="true">
        <span>#</span>
        <span>Bài hát</span>
        <span>Ca sĩ</span>
        <span>Thể loại</span>
        <span>Thời lượng</span>
        <span>Thao tác</span>
      </div>

      {visibleSongs.length === 0 ? (
        <p className="empty-state">Không tìm thấy bài hát nào</p>
      ) : (
        <SongList
          songs={visibleSongs}
          onPlay={handlePlay}
          onAddToQueue={addToQueue}
          currentSongId={currentSongId}
        />
      )}
    </section>
  )
}
