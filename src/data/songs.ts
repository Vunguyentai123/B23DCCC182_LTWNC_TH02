import type { Genre, Song } from '../types'

export const GENRES: Genre[] = ['Pop', 'Indie', 'Ballad', 'Rock', 'Rap']

const TITLES = [
  'Mưa tháng Sáu',
  'Nắng tháng Sáu',
  'Gió tháng Sáu',
  'Biển bình yên',
  'Phố mùa hạ',
  'Đêm Hà Nội',
  'Hoa trong vườn',
  'Về nhà',
]

const ARTISTS = [
  'Lê Minh',
  'Quang Huy',
  'Bảo Trâm',
  'Thu Hà',
  'Minh Anh',
  'Hoàng Nam',
  'Lan Phương',
  'Đức Thịnh',
  'Mai Chi',
  'Tuấn Kiệt',
]

export function generateSongs(count: number): Song[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `s${index + 1}`,
    title: `${TITLES[index % TITLES.length]} ${Math.floor(index / TITLES.length) + 1}`,
    artist: ARTISTS[index % ARTISTS.length],
    genre: GENRES[index % GENRES.length],
    duration: 150 + ((index * 37) % 151),
  }))
}

export const SONGS = generateSongs(10000)
