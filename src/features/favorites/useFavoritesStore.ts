import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FavoritesState {
  ids: string[]
  toggle: (id: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => {
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((favoriteId) => favoriteId !== id)
            : [...state.ids, id],
        }))
      },
    }),
    {
      name: 'music-favorites',
    },
  ),
)
