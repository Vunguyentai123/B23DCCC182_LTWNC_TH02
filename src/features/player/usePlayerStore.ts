import { create } from 'zustand'
import type { Song } from '../../types'

export interface PlayerState {
  queue: Song[]
  currentIndex: number
  isPlaying: boolean
  position: number
  playQueue: (songs: Song[], startIndex: number) => void
  playAt: (index: number) => void
  togglePlay: () => void
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
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
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

  togglePlay: () => {
    const { currentIndex, queue } = get()
    if (queue.length === 0) return

    if (currentIndex < 0 || currentIndex >= queue.length) {
      set({ currentIndex: 0, isPlaying: true, position: 0 })
      return
    }

    set((state) => ({ isPlaying: !state.isPlaying }))
  },

  next: () => {
    const { queue, currentIndex } = get()
    if (queue.length === 0 || currentIndex < 0) return

    if (currentIndex >= queue.length - 1) {
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
    const { currentIndex, position, queue } = get()
    if (queue.length === 0 || currentIndex < 0) return

    if (position > 3 || currentIndex === 0) {
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

  playAt: (index) => {
    const { queue } = get()
    if (index < 0 || index >= queue.length) return
    set({ currentIndex: index, isPlaying: true, position: 0 })
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
    const { queue, currentIndex, position, isPlaying } = get()
    if (!isPlaying || currentIndex < 0 || currentIndex >= queue.length) return

    const currentSong = queue[currentIndex]
    if (position + 1 >= currentSong.duration) {
      get().next()
      return
    }

    set({ position: position + 1 })
  },
}))
