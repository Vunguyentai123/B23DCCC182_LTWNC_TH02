export interface Playlist {
  id: string
  name: string
  songIds: string[]
}

export type PlaylistAction =
  | { type: 'create'; payload: { id: string; name: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | {
      type: 'addSong'
      payload: { playlistId: string; songId: string }
    }
  | {
      type: 'removeSong'
      payload: { playlistId: string; songId: string }
    }

export function playlistReducer(
  state: Playlist[],
  action: PlaylistAction,
): Playlist[] {
  switch (action.type) {
    case 'create':
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name,
          songIds: [],
        },
      ]

    case 'rename': {
      const { id, name } = action.payload
      return state.map((playlist) =>
        playlist.id === id ? { ...playlist, name } : playlist,
      )
    }

    case 'remove': {
      const { id } = action.payload
      if (!state.some((playlist) => playlist.id === id)) return state
      return state.filter((playlist) => playlist.id !== id)
    }

    case 'addSong': {
      const { playlistId, songId } = action.payload
      if (!state.some((playlist) => playlist.id === playlistId)) return state

      return state.map((playlist) => {
        if (playlist.id !== playlistId) return playlist
        if (playlist.songIds.includes(songId)) return playlist
        return { ...playlist, songIds: [...playlist.songIds, songId] }
      })
    }

    case 'removeSong': {
      const { playlistId, songId } = action.payload
      if (!state.some((playlist) => playlist.id === playlistId)) return state

      return state.map((playlist) => {
        if (playlist.id !== playlistId) return playlist
        if (!playlist.songIds.includes(songId)) return playlist
        return {
          ...playlist,
          songIds: playlist.songIds.filter((id) => id !== songId),
        }
      })
    }

    default:
      return state
  }
}
