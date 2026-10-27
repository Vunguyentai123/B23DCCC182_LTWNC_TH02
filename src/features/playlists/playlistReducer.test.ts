import { describe, expect, it, vi } from 'vitest'
import {
  playlistReducer,
  type Playlist,
  type PlaylistAction,
} from './playlistReducer'
import { withLogger } from './withLogger'

const playlist: Playlist = {
  id: 'p1',
  name: 'Chạy bộ',
  songIds: ['s1'],
}

describe('playlistReducer', () => {
  it('tạo playlist mới', () => {
    const action: PlaylistAction = {
      type: 'create',
      payload: { id: 'p1', name: 'Chạy bộ' },
    }

    expect(playlistReducer([], action)).toEqual([
      { id: 'p1', name: 'Chạy bộ', songIds: [] },
    ])
  })

  it('thêm bài hát và không thêm trùng', () => {
    const addSong: PlaylistAction = {
      type: 'addSong',
      payload: { playlistId: 'p1', songId: 's2' },
    }

    const once = playlistReducer([playlist], addSong)
    const twice = playlistReducer(once, addSong)

    expect(once[0].songIds).toEqual(['s1', 's2'])
    expect(twice[0].songIds).toEqual(['s1', 's2'])
  })

  it('bỏ bài hát khỏi playlist', () => {
    const action: PlaylistAction = {
      type: 'removeSong',
      payload: { playlistId: 'p1', songId: 's1' },
    }

    expect(playlistReducer([playlist], action)[0].songIds).toEqual([])
  })

  it('giữ nguyên state khi xóa playlist không tồn tại', () => {
    const state = [playlist]
    const result = playlistReducer(state, {
      type: 'remove',
      payload: { id: 'không-tồn-tại' },
    })

    expect(result).toEqual(state)
  })

  it('đổi tên và xóa playlist', () => {
    const renamed = playlistReducer([playlist], {
      type: 'rename',
      payload: { id: 'p1', name: 'Chạy bộ buổi sáng' },
    })
    expect(renamed[0].name).toBe('Chạy bộ buổi sáng')

    expect(
      playlistReducer(renamed, {
        type: 'remove',
        payload: { id: 'p1' },
      }),
    ).toEqual([])
  })

  it('withLogger trả về kết quả reducer và ghi log ở môi trường dev', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const loggedReducer = withLogger(playlistReducer)
    const action: PlaylistAction = {
      type: 'addSong',
      payload: { playlistId: 'p1', songId: 's3' },
    }

    const result = loggedReducer([playlist], action)

    expect(result[0].songIds).toEqual(['s1', 's3'])
    expect(logSpy).toHaveBeenCalledWith(
      'addSong',
      [playlist],
      result,
    )
    logSpy.mockRestore()
  })
})
