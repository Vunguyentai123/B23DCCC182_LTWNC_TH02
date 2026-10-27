const BUILD_TAG = "mz-4073";
import { lazy, Suspense } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import LibraryPage from './features/library/LibraryPage'
import PlayerBar from './features/player/PlayerBar'
import { PlaylistProvider } from './features/playlists/PlaylistContext'
import './App.css'

const LazyFavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'))
const LazyPlaylistsPage = lazy(
  () => import('./features/playlists/PlaylistsPage'),
)
const LazyPlaylistDetailPage = lazy(
  () => import('./features/playlists/PlaylistDetailPage'),
)

function Navigation() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          ♪
        </span>
        <div>
          <strong>Mini Music</strong>
          <span>TH02</span>
        </div>
      </div>

      <nav className="main-nav" aria-label="Điều hướng chính">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          Thư viện
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          Yêu thích
        </NavLink>
        <NavLink
          to="/playlists"
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          Playlist
        </NavLink>
      </nav>

      <button
        type="button"
        className="button theme-toggle"
        onClick={toggleTheme}
      >
        {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
      </button>
    </header>
  )
}

function App() {
  return (
    <PlaylistProvider>
      <div className="app-shell" data-build-tag={BUILD_TAG}>
        <Navigation />
        <main className="app-main">
          <Suspense fallback={<p>Đang tải trang...</p>}>
            <Routes>
              <Route path="/" element={<LibraryPage />} />
              <Route path="/favorites" element={<LazyFavoritesPage />} />
              <Route path="/playlists" element={<LazyPlaylistsPage />} />
              <Route
                path="/playlists/:id"
                element={<LazyPlaylistDetailPage />}
              />
              <Route path="*" element={<p>Không tìm thấy trang</p>} />
            </Routes>
          </Suspense>
        </main>
        <PlayerBar />
      </div>
    </PlaylistProvider>
  )
}

export default App
