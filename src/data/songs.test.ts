import { describe, expect, it } from 'vitest'
import { GENRES, generateSongs } from './songs'

describe('generateSongs', () => {
  const songs = generateSongs(10000)

  it('tạo đúng số lượng bài hát', () => {
    expect(songs).toHaveLength(10000)
  })

  it('không trùng id', () => {
    expect(new Set(songs.map((song) => song.id)).size).toBe(10000)
  })

  it('thời lượng nằm trong khoảng 150 đến 300 giây', () => {
    expect(
      songs.every((song) => song.duration >= 150 && song.duration <= 300),
    ).toBe(true)
  })

  it('tạo đúng dữ liệu mẫu ở ba bài đầu', () => {
    expect(songs[0]).toMatchObject({
      id: 's1',
      title: 'Mưa tháng Sáu 1',
      artist: 'Lê Minh',
      genre: 'Pop',
      duration: 150,
    })
    expect(songs[1]).toMatchObject({
      id: 's2',
      title: 'Nắng tháng Sáu 1',
      artist: 'Quang Huy',
      genre: 'Indie',
      duration: 187,
    })
    expect(songs[2]).toMatchObject({
      id: 's3',
      title: 'Gió tháng Sáu 1',
      artist: 'Bảo Trâm',
      genre: 'Ballad',
      duration: 224,
    })
  })

  it('có đủ năm thể loại và số lượng phù hợp cho bộ lọc', () => {
    expect(GENRES).toHaveLength(5)
    expect(
      songs.filter((song) =>
        song.title.toLocaleLowerCase('vi').includes('mưa'),
      ),
    ).toHaveLength(1250)
    expect(
      songs.filter(
        (song) =>
          song.title.toLocaleLowerCase('vi').includes('mưa') &&
          song.genre === 'Rock',
      ),
    ).toHaveLength(250)
    expect(
      songs.filter((song) =>
        song.artist.toLocaleLowerCase('vi').includes('thu hà'),
      ),
    ).toHaveLength(1000)
  })
})
