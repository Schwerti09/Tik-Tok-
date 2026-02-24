import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const navItems = [
  { to: '/dashboard', label: '🏠 Dashboard' },
  { to: '/trends', label: '📈 Trends' },
  { to: '/ideas', label: '💡 Ideas' },
  { to: '/recordings', label: '🎬 Recordings' },
  { to: '/analytics', label: '📊 Analytics' },
  { to: '/community', label: '👥 Community' },
  { to: '/pricing', label: '💳 Pricing' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🎵</span>
          <span className="brand-name">Creator Studio</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'nav-item' + (isActive ? ' nav-item--active' : '')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-user">{user?.email}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  )
}
