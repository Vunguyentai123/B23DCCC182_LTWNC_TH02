const BUILD_TAG = "mz-4073";
import { NavLink, Route, Routes } from 'react-router-dom'
import FavoritesPage from './features/favorites/FavoritesPage'
import LibraryPage from './features/library/LibraryPage'
import PlayerBar from './features/player/PlayerBar'
import './App.css'

interface PlaceholderPageProps {
  title: string
  description: string
}

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="page">
      <header className="page-heading">
        <p className="eyebrow">TH02</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </header>
      <p className="empty-state">Chức năng này sẽ được hoàn thiện ở phần tiếp theo.</p>
    </section>
  )
}

function Navigation() {
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
    </header>
  )
}

function App() {
  return (
    <div className="app-shell" data-build-tag={BUILD_TAG}>
      <Navigation />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route
            path="/playlists"
            element={
              <PlaceholderPage
                title="Playlist"
                description="Quản lý các danh sách phát của bạn."
              />
            }
          />
          <Route
            path="/playlists/:id"
            element={
              <PlaceholderPage
                title="Chi tiết playlist"
                description="Các bài hát trong playlist đã chọn."
              />
            }
          />
          <Route path="*" element={<p>Không tìm thấy trang</p>} />
        </Routes>
      </main>
      <PlayerBar />
    </div>
  )
}

export default App
