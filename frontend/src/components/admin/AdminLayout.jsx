import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiLogOut, FiMenu, FiX, FiExternalLink
} from 'react-icons/fi'

const NAV = [
  { to: '/admin',           icon: <FiGrid size={18} />,        label: 'Dashboard',  end: true },
  { to: '/admin/products',  icon: <FiPackage size={18} />,     label: 'Products' },
  { to: '/admin/orders',    icon: <FiShoppingBag size={18} />, label: 'Orders' },
  { to: '/admin/users',     icon: <FiUsers size={18} />,       label: 'Users' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="logo">
          🛒 Shop<span style={{ color: '#ffe082' }}>Kart</span>
          <button className="sidebar-close" onClick={() => setOpen(false)}><FiX size={18} /></button>
        </div>

        <div style={{ padding: '16px 12px 8px', fontSize: '.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Main Menu
        </div>

        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}>
              {n.icon} {n.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '8px 12px', borderTop: '1px solid #333' }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#ccc', fontSize: '.875rem' }}>
            <FiExternalLink size={16} /> View Store
          </a>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#ff6161', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.875rem' }}>
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-content">
        {/* Top bar */}
        <header className="admin-topbar">
          <button className="menu-toggle" onClick={() => setOpen(true)}><FiMenu size={22} /></button>
          <h1 className="admin-page-title">Admin Panel</h1>
          <div className="admin-user">
            <div className="admin-avatar">{user?.name?.[0]}</div>
            <div>
              <strong>{user?.name}</strong>
              <p>Administrator</p>
            </div>
          </div>
        </header>

        <main style={{ padding: '24px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; }
        .admin-sidebar { width: 240px; background: #1a1f2e; color: #fff; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; overflow-y: auto; z-index: 200; transition: transform .3s; }
        .admin-sidebar .logo { padding: 20px 20px 16px; font-size: 1.2rem; font-weight: 800; color: var(--primary); border-bottom: 1px solid #2d3348; display: flex; justify-content: space-between; align-items: center; }
        .sidebar-close { display: none; background: none; border: none; color: #ccc; cursor: pointer; }
        .admin-sidebar nav { padding: 8px; }
        .admin-sidebar nav a { display: flex; align-items: center; gap: 12px; padding: 11px 14px; font-size: .875rem; color: #9da5b4; transition: all .2s; border-radius: 8px; margin-bottom: 2px; }
        .admin-sidebar nav a:hover { background: rgba(255,255,255,.08); color: #fff; }
        .admin-sidebar nav a.active { background: var(--primary); color: #fff; }
        .admin-content { margin-left: 240px; flex: 1; background: #f0f2f5; min-height: 100vh; }
        .admin-topbar { background: #fff; padding: 0 24px; height: 64px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.08); position: sticky; top: 0; z-index: 100; }
        .menu-toggle { display: none; background: none; border: none; cursor: pointer; color: var(--dark); }
        .admin-page-title { flex: 1; font-size: 1rem; font-weight: 700; color: var(--gray-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .admin-user { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .admin-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .admin-user strong { font-size: .875rem; display: block; }
        .admin-user p { font-size: .72rem; color: var(--gray-400); }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 199; cursor: pointer; }
        @media (max-width: 900px) {
          .admin-sidebar { transform: translateX(-100%); box-shadow: none; }
          .admin-sidebar.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,.3); }
          .admin-content { margin-left: 0 !important; }
          .menu-toggle { display: flex; }
          .sidebar-close { display: flex !important; }
          .sidebar-overlay { display: block; }
          .admin-topbar { padding: 0 14px; }
        }
        @media (max-width: 480px) {
          .admin-user strong,.admin-user p { display: none; }
          .admin-topbar { gap: 10px; }
        }
      `}</style>
    </div>
  )
}
