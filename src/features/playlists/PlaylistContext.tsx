/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from 'react'
import {
  playlistReducer,
  type Playlist,
  type PlaylistAction,
} from './playlistReducer'
import { withLogger } from './withLogger'

const STORAGE_KEY = 'music-playlists'

export const PlaylistStateContext = createContext<Playlist[] | null>(null)
export const PlaylistDispatchContext =
  createContext<Dispatch<PlaylistAction> | null>(null)

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isPlaylist(value: unknown): value is Playlist {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    isStringArray(candidate.songIds)
  )
}

function readStoredPlaylists(): Playlist[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isPlaylist)
  } catch {
    return []
  }
}

export function PlaylistProvider({ children }: PropsWithChildren) {
  const [playlists, dispatch] = useReducer(
    withLogger(playlistReducer),
    [],
    readStoredPlaylists,
  )

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
  }, [playlists])

  return (
    <PlaylistStateContext.Provider value={playlists}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  )
}

export function usePlaylists(): Playlist[] {
  const playlists = useContext(PlaylistStateContext)
  if (playlists === null) {
    throw new Error('usePlaylists phải được dùng bên trong PlaylistProvider.')
  }
  return playlists
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const dispatch = useContext(PlaylistDispatchContext)
  if (dispatch === null) {
    throw new Error(
      'usePlaylistDispatch phải được dùng bên trong PlaylistProvider.',
    )
  }
  return dispatch
}
