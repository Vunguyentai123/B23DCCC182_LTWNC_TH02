import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Song } from '../../types'

export type RepeatMode = 'off' | 'all' | 'one'

export interface PlayerState {
  queue: Song[]
  currentIndex: number
  isPlaying: boolean
  position: number
  isShuffle: boolean
  repeatMode: RepeatMode
  playQueue: (songs: Song[], startIndex: number) => void
  playAt: (index: number) => void
  togglePlay: () => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  next: () => void
  prev: () => void
  addToQueue: (song: Song) => void
  removeFromQueue: (id: string) => void
  clearQueue: () => void
  tick: () => void
}

export const initialPlayerState = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
  isShuffle: false,
  repeatMode: 'off' as RepeatMode,
}

function pickShuffledIndex(length: number, currentIndex: number): number {
  const randomIndex = Math.floor(Math.random() * (length - 1))
  return randomIndex >= currentIndex ? randomIndex + 1 : randomIndex
}

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set, get) => ({
      ...initialPlayerState,

      playQueue: (songs, startIndex) => {
        if (songs.length === 0) {
          set({ queue: [], currentIndex: -1, isPlaying: false, position: 0 })
          return
        }

        const safeIndex = Math.min(Math.max(startIndex, 0), songs.length - 1)
        set({
          queue: songs,
          currentIndex: safeIndex,
          isPlaying: true,
          position: 0,
        })
      },

      playAt: (index) => {
        const { queue } = get()
        if (index < 0 || index >= queue.length) return
        set({ currentIndex: index, isPlaying: true, position: 0 })
      },

      togglePlay: () => {
        const { currentIndex, queue } = get()
        if (queue.length === 0) return

        if (currentIndex < 0 || currentIndex >= queue.length) {
          set({ currentIndex: 0, isPlaying: true, position: 0 })
          return
        }

        set((state) => ({ isPlaying: !state.isPlaying }))
      },

      toggleShuffle: () => {
        set((state) => ({ isShuffle: !state.isShuffle }))
      },

      cycleRepeat: () => {
        set((state) => ({
          repeatMode:
            state.repeatMode === 'off'
              ? 'all'
              : state.repeatMode === 'all'
                ? 'one'
                : 'off',
        }))
      },

      next: () => {
        const { queue, currentIndex, isShuffle, repeatMode } = get()
        if (queue.length === 0 || currentIndex < 0) return

        if (repeatMode === 'one') {
          set({ isPlaying: true, position: 0 })
          return
        }

        if (isShuffle && queue.length > 1) {
          set({
            currentIndex: pickShuffledIndex(queue.length, currentIndex),
            isPlaying: true,
            position: 0,
          })
          return
        }

        if (currentIndex >= queue.length - 1) {
          if (repeatMode === 'all') {
            set({ currentIndex: 0, isPlaying: true, position: 0 })
            return
          }

          const currentSong = queue[currentIndex]
          set({
            isPlaying: false,
            position: currentSong ? currentSong.duration : 0,
          })
          return
        }

        set({
          currentIndex: currentIndex + 1,
          isPlaying: true,
          position: 0,
        })
      },

      prev: () => {
        const { currentIndex, position, queue, isShuffle, repeatMode } = get()
        if (queue.length === 0 || currentIndex < 0) return

        if (position > 3) {
          set({ position: 0 })
          return
        }

        if (isShuffle && queue.length > 1) {
          set({
            currentIndex: pickShuffledIndex(queue.length, currentIndex),
            position: 0,
            isPlaying: true,
          })
          return
        }

        if (currentIndex === 0) {
          if (repeatMode === 'all') {
            set({
              currentIndex: queue.length - 1,
              position: 0,
              isPlaying: true,
            })
            return
          }

          set({ position: 0 })
          return
        }

        set({
          currentIndex: currentIndex - 1,
          position: 0,
          isPlaying: true,
        })
      },

      addToQueue: (song) => {
        const { queue } = get()
        if (queue.some((item) => item.id === song.id)) return
        set({ queue: [...queue, song] })
      },

      removeFromQueue: (id) => {
        const { queue, currentIndex } = get()
        const removedIndex = queue.findIndex((song) => song.id === id)
        if (removedIndex === -1) return

        const nextQueue = queue.filter((song) => song.id !== id)

        if (nextQueue.length === 0) {
          set({ queue: [], currentIndex: -1, isPlaying: false, position: 0 })
          return
        }

        if (removedIndex < currentIndex) {
          set({ queue: nextQueue, currentIndex: currentIndex - 1 })
          return
        }

        if (removedIndex === currentIndex) {
          set({
            queue: nextQueue,
            currentIndex: Math.min(currentIndex, nextQueue.length - 1),
            position: 0,
          })
          return
        }

        set({ queue: nextQueue })
      },

      clearQueue: () => {
        set({ queue: [], currentIndex: -1, isPlaying: false, position: 0 })
      },

      tick: () => {
        const { queue, currentIndex, position, isPlaying, repeatMode } = get()
        if (!isPlaying || currentIndex < 0 || currentIndex >= queue.length) return

        const currentSong = queue[currentIndex]
        if (position + 1 >= currentSong.duration) {
          if (repeatMode === 'one') {
            set({ position: 0 })
            return
          }

          get().next()
          return
        }

        set({ position: position + 1 })
      },
    }),
    { name: 'Player Store', enabled: import.meta.env.DEV },
  ),
)
