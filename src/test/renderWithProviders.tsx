import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../contexts/ThemeContext'
import { PlaylistProvider } from '../features/playlists/PlaylistContext'

interface RenderOptions {
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: RenderOptions = {},
) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[route]}>
        <PlaylistProvider>{ui}</PlaylistProvider>
      </MemoryRouter>
    </ThemeProvider>,
  )
}
