import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const navItems = [
  { to: '/dashboard', label: '🏠 Dashboard' },
  { to: '/trends', label: '🔥 Trends' },
  { to: '/ideas', label: '💡 Ideas' },
  { to: '/videos', label: '🎬 Videos' },
  { to: '/schedule', label: '📅 Schedule' },
  { to: '/analytics', label: '📊 Analytics' },
  { to: '/community', label: '👥 Community' },
  { to: '/pricing', label: '💎 Pricing' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">🎵 TikTok Studio</div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="user-email">{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
