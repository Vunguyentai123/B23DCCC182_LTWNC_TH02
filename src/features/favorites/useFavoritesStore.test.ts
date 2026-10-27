import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoritesStore } from './useFavoritesStore'

describe('useFavoritesStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useFavoritesStore.setState({ ids: [] })
  })

  it('toggle thêm rồi bỏ bài hát khỏi danh sách yêu thích', () => {
    useFavoritesStore.getState().toggle('s1')
    expect(useFavoritesStore.getState().ids).toEqual(['s1'])

    useFavoritesStore.getState().toggle('s1')
    expect(useFavoritesStore.getState().ids).toEqual([])
  })

  it('lưu danh sách yêu thích vào localStorage với khóa music-favorites', () => {
    useFavoritesStore.getState().toggle('s1')
    useFavoritesStore.getState().toggle('s3')

    const stored = window.localStorage.getItem('music-favorites')
    expect(stored).not.toBeNull()
    expect(stored).toContain('"s1"')
    expect(stored).toContain('"s3"')
  })
})
