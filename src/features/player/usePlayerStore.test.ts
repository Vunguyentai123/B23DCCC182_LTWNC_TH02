import { beforeEach, describe, expect, it } from 'vitest'
import { SONGS } from '../../data/songs'
import { initialPlayerState, usePlayerStore } from './usePlayerStore'

const [s1, s2, s3] = SONGS

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState(initialPlayerState)
  })

  it('playQueue đặt đúng bài hát và vị trí', () => {
    usePlayerStore.getState().playQueue([s1, s2, s3], 1)

    const state = usePlayerStore.getState()
    expect(state.queue).toEqual([s1, s2, s3])
    expect(state.currentIndex).toBe(1)
    expect(state.position).toBe(0)
    expect(state.isPlaying).toBe(true)
  })

  it('tick ở giây cuối tự chuyển sang bài kế tiếp', () => {
    usePlayerStore.setState({
      queue: [s1, s2],
      currentIndex: 0,
      isPlaying: true,
      position: s1.duration - 1,
    })

    usePlayerStore.getState().tick()

    const state = usePlayerStore.getState()
    expect(state.currentIndex).toBe(1)
    expect(state.position).toBe(0)
    expect(state.isPlaying).toBe(true)
  })

  it('next ở bài cuối thì dừng phát', () => {
    usePlayerStore.setState({
      queue: [s1, s2],
      currentIndex: 1,
      isPlaying: true,
      position: 10,
    })

    usePlayerStore.getState().next()

    const state = usePlayerStore.getState()
    expect(state.currentIndex).toBe(1)
    expect(state.isPlaying).toBe(false)
  })

  it('tick tăng vị trí thêm một giây', () => {
    usePlayerStore.getState().playQueue([s1, s2], 0)

    usePlayerStore.getState().tick()

    expect(usePlayerStore.getState().position).toBe(1)
  })

  it('prev chỉ tua về 0 khi đã phát quá 3 giây', () => {
    usePlayerStore.setState({
      queue: [s1, s2],
      currentIndex: 1,
      isPlaying: true,
      position: 4,
    })

    usePlayerStore.getState().prev()

    expect(usePlayerStore.getState().currentIndex).toBe(1)
    expect(usePlayerStore.getState().position).toBe(0)
  })

  it('prev lùi bài khi vị trí chưa quá 3 giây', () => {
    usePlayerStore.setState({
      queue: [s1, s2],
      currentIndex: 1,
      isPlaying: true,
      position: 2,
    })

    usePlayerStore.getState().prev()

    expect(usePlayerStore.getState().currentIndex).toBe(0)
    expect(usePlayerStore.getState().position).toBe(0)
  })

  it('addToQueue bỏ qua bài đã có trong hàng đợi', () => {
    usePlayerStore.setState({
      queue: [s1],
      currentIndex: 0,
      isPlaying: true,
      position: 0,
    })

    usePlayerStore.getState().addToQueue(s1)
    usePlayerStore.getState().addToQueue(s2)

    expect(usePlayerStore.getState().queue.map((song) => song.id)).toEqual([
      's1',
      's2',
    ])
  })

  it('togglePlay không làm gì khi chưa có bài đang phát', () => {
    usePlayerStore.getState().togglePlay()
    expect(usePlayerStore.getState().isPlaying).toBe(false)

    usePlayerStore.getState().playQueue([s1], 0)
    usePlayerStore.getState().togglePlay()
    expect(usePlayerStore.getState().isPlaying).toBe(false)

    usePlayerStore.getState().togglePlay()
    expect(usePlayerStore.getState().isPlaying).toBe(true)
  })

  it('togglePlay khởi động hàng đợi khi chưa chọn bài', () => {
    usePlayerStore.setState({
      queue: [s1],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    })

    usePlayerStore.getState().togglePlay()

    const state = usePlayerStore.getState()
    expect(state.currentIndex).toBe(0)
    expect(state.isPlaying).toBe(true)
  })

  it('playQueue với mảng rỗng đưa store về trạng thái ban đầu', () => {
    usePlayerStore.getState().playQueue([], 0)

    expect(usePlayerStore.getState().currentIndex).toBe(-1)
    expect(usePlayerStore.getState().isPlaying).toBe(false)
    expect(usePlayerStore.getState().queue).toEqual([])
  })

  it('playAt phát đúng bài theo vị trí trong hàng đợi', () => {
    usePlayerStore.setState({
      queue: [s1, s2, s3],
      currentIndex: 0,
      isPlaying: false,
      position: 12,
    })

    usePlayerStore.getState().playAt(2)

    const state = usePlayerStore.getState()
    expect(state.currentIndex).toBe(2)
    expect(state.isPlaying).toBe(true)
    expect(state.position).toBe(0)
  })

  it('removeFromQueue giữ nguyên bài đang phát khi xóa bài phía sau', () => {
    usePlayerStore.setState({
      queue: [s1, s2, s3],
      currentIndex: 1,
      isPlaying: true,
      position: 8,
    })

    usePlayerStore.getState().removeFromQueue(s3.id)

    const state = usePlayerStore.getState()
    expect(state.queue).toEqual([s1, s2])
    expect(state.currentIndex).toBe(1)
    expect(state.position).toBe(8)
  })

  it('removeFromQueue cập nhật vị trí khi xóa bài phía trước', () => {
    usePlayerStore.setState({
      queue: [s1, s2, s3],
      currentIndex: 2,
      isPlaying: true,
      position: 5,
    })

    usePlayerStore.getState().removeFromQueue(s1.id)

    const state = usePlayerStore.getState()
    expect(state.queue).toEqual([s2, s3])
    expect(state.currentIndex).toBe(1)
    expect(state.queue[state.currentIndex]).toEqual(s3)
  })

  it('removeFromQueue chuyển sang bài kế khi xóa bài đang phát', () => {
    usePlayerStore.setState({
      queue: [s1, s2],
      currentIndex: 0,
      isPlaying: true,
      position: 40,
    })

    usePlayerStore.getState().removeFromQueue(s1.id)

    const state = usePlayerStore.getState()
    expect(state.queue).toEqual([s2])
    expect(state.currentIndex).toBe(0)
    expect(state.position).toBe(0)
    expect(state.isPlaying).toBe(true)
  })

  it('removeFromQueue xóa bài cuối cùng thì dừng phát', () => {
    usePlayerStore.setState({
      queue: [s1],
      currentIndex: 0,
      isPlaying: true,
      position: 40,
    })

    usePlayerStore.getState().removeFromQueue(s1.id)

    const state = usePlayerStore.getState()
    expect(state.queue).toEqual([])
    expect(state.currentIndex).toBe(-1)
    expect(state.isPlaying).toBe(false)
    expect(state.position).toBe(0)
  })

  it('clearQueue làm rỗng hàng đợi và dừng phát', () => {
    usePlayerStore.setState({
      queue: [s1, s2],
      currentIndex: 1,
      isPlaying: true,
      position: 20,
    })

    usePlayerStore.getState().clearQueue()

    const state = usePlayerStore.getState()
    expect(state.queue).toEqual([])
    expect(state.currentIndex).toBe(-1)
    expect(state.isPlaying).toBe(false)
    expect(state.position).toBe(0)
  })
})
