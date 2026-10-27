import type { Reducer } from 'react'
import type { Playlist, PlaylistAction } from './playlistReducer'

export function withLogger(
  reducer: Reducer<Playlist[], PlaylistAction>,
): Reducer<Playlist[], PlaylistAction> {
  return (state, action) => {
    const nextState = reducer(state, action)

    if (import.meta.env.DEV) {
      console.log(action.type, state, nextState)
    }

    return nextState
  }
}
