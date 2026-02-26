import { useState } from 'react'
import BottomNavigation from './components/BottomNavigation'
import AuthGate from './components/AuthGate'
import Home from './pages/Home'
import Chats from './pages/Chats'
import Create from './pages/Create'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import { isLoggedIn, logout } from './services/api'
import './index.css'

/* ═══════════════════════════════════════════
   DESKTOP SIDEBAR NAVIGATION
   ═══════════════════════════════════════════ */
function DesktopSidebar({ current, onChange, onLogout, collapsed, onToggle }) {

  const navItems = [
    {
      id: 'home', label: 'Басты бет',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" />
        </svg>
      )
    },
    {
      id: 'explore', label: 'Іздеу',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={a ? 2.4 : 1.8} strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      id: 'create', label: 'Жариялау',
      icon: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    },
    {
      id: 'chats', label: 'Хабарламалар',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      )
    },
    {
      id: 'profile', label: 'Профиль',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
  ]

  return (
    <aside className={`desktop-sidebar${collapsed ? ' sidebar-collapsed' : ''}`}>

      {/* ── Logo + collapse btn ── */}
      <div className="sidebar-logo">
        {!collapsed && <span className="sidebar-logo-text">TUSA</span>}
        {collapsed && <span className="sidebar-logo-text">T</span>}
        {!collapsed && (
          <button className="sidebar-collapse-btn" onClick={onToggle} title="Жинау">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}
        {collapsed && (
          <button
            className="sidebar-collapse-btn"
            onClick={onToggle}
            title="Ашу"
            style={{ position: 'absolute', right: -14, top: 16, zIndex: 10, background: '#fff', border: '2px solid #000' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Nav items ── */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const isActive = current === item.id
          const isCreate = item.id === 'create'
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`sidebar-nav-item${isActive ? ' active' : ''}${isCreate ? ' create' : ''}`}
              title={collapsed ? item.label : ''}
              onPointerDown={e => {
                if (!isCreate) {
                  e.currentTarget.style.transform = 'scale(0.96)'
                }
              }}
              onPointerUp={e => { e.currentTarget.style.transform = '' }}
              onPointerLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <span className="sidebar-nav-icon">{item.icon(isActive)}</span>
              {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        {/* TUSA version badge */}
        {!collapsed && (
          <div style={{
            padding: '8px 20px',
            fontFamily: "'Space Mono',monospace",
            fontSize: 8,
            color: '#ccc',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            TUSA · v2.0 · KZ
          </div>
        )}
        <button
          className="sidebar-nav-item"
          onClick={onLogout}
          title={collapsed ? 'Шығу' : ''}
          style={{ color: '#999' }}
          onPointerDown={e => { e.currentTarget.style.background = '#f5f5f5' }}
          onPointerUp={e => { e.currentTarget.style.background = '' }}
          onPointerLeave={e => { e.currentTarget.style.background = '' }}
        >
          <span className="sidebar-nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          {!collapsed && <span className="sidebar-nav-label" style={{ color: '#999' }}>Шығу</span>}
        </button>
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('home')
  const [authed, setAuthed] = useState(isLoggedIn())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleAuthSuccess = () => {
    setAuthed(true)
    setPage('home')
  }

  const handleLogout = () => {
    logout()
    setAuthed(false)
  }

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home onLogout={handleLogout} />
      case 'chats': return <Chats />
      case 'create': return <Create />
      case 'explore': return <Explore />
      case 'profile': return <Profile onLogout={handleLogout} />
      default: return <Home />
    }
  }

  if (!authed) {
    return <AuthGate onSuccess={handleAuthSuccess} />
  }

  return (
    <div className="app-root">

      {/* ══════════════════════════════
          DESKTOP LAYOUT (≥ 1024px)
          ══════════════════════════════ */}
      <div className="app-desktop-layout">
        <DesktopSidebar
          current={page}
          onChange={setPage}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />
        <main
          className="app-desktop-main"
          style={{ marginLeft: sidebarCollapsed ? 'var(--sidebar-w-col)' : 'var(--sidebar-w)' }}
        >
          <div className="app-desktop-content">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* ══════════════════════════════
          MOBILE LAYOUT (< 1024px)
          ══════════════════════════════ */}
      <div className="app-mobile-layout">
        <div className="page-content">
          {renderPage()}
        </div>
        <BottomNavigation current={page} onChange={setPage} />
      </div>

    </div>
  )
}
