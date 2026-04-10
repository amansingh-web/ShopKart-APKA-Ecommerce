import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiShoppingCart, FiSearch, FiHeart, FiLogOut, FiPackage, FiSettings, FiMenu, FiX, FiChevronDown, FiShield, FiGrid } from 'react-icons/fi'

const CATS = ['Electronics','Fashion','Home & Kitchen','Books','Sports & Fitness','Beauty']

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount }    = useCart()
  const navigate         = useNavigate()
  const [q, setQ]        = useState('')
  const [menu, setMenu]  = useState(false)
  const [cat,  setCat]   = useState(false)
  const [usr,  setUsr]   = useState(false)
  const catRef = useRef(); const usrRef = useRef()

  useEffect(() => {
    const fn = e => { if (catRef.current && !catRef.current.contains(e.target)) setCat(false) }
    document.addEventListener('mousedown', fn); return () => document.removeEventListener('mousedown', fn)
  }, [])
  useEffect(() => {
    const fn = e => { if (usrRef.current && !usrRef.current.contains(e.target)) setUsr(false) }
    document.addEventListener('mousedown', fn); return () => document.removeEventListener('mousedown', fn)
  }, [])

  const search = e => { e.preventDefault(); if (q.trim()) { navigate(`/products?search=${encodeURIComponent(q.trim())}`); setMenu(false); setQ('') } }

  return (
    <header className="nw">
      {/* Top bar */}
      <div className="nw-top">
        <div className="nw-inner">
          <Link to="/" className="nw-logo">🛒 Shop<strong>Kart</strong></Link>

          <div className="nw-cat" ref={catRef}>
            <button className="nw-cat-btn" onClick={() => { setCat(p=>!p); setUsr(false) }}>
              <FiGrid size={14}/> Categories <FiChevronDown size={13}/>
            </button>
            {cat && (
              <div className="nw-cat-menu">
                {CATS.map(c => (
                  <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="nw-cat-item" onClick={() => setCat(false)}>{c}</Link>
                ))}
              </div>
            )}
          </div>

          <form className="nw-search" onSubmit={search}>
            <input type="text" placeholder="Search products, brands..." value={q} onChange={e => setQ(e.target.value)}/>
            <button type="submit"><FiSearch size={18}/></button>
          </form>

          <div className="nw-right">
            {user ? (
              <div className="nw-usr" ref={usrRef}>
                <button className="nw-usr-btn" onClick={() => { setUsr(p=>!p); setCat(false) }}>
                  <div className="nw-avatar">{user.name[0].toUpperCase()}</div>
                  <span className="nw-uname">{user.name.split(' ')[0]}</span>
                  <FiChevronDown size={13}/>
                </button>
                {usr && (
                  <div className="nw-usr-drop">
                    <div className="nw-usr-head"><b>{user.name}</b><small>{user.email}</small></div>
                    <Link to="/profile"  onClick={() => setUsr(false)}><FiSettings size={14}/> My Profile</Link>
                    <Link to="/orders"   onClick={() => setUsr(false)}><FiPackage  size={14}/> My Orders</Link>
                    <Link to="/wishlist" onClick={() => setUsr(false)}><FiHeart    size={14}/> Wishlist</Link>
                    {user.role === 'admin' && <Link to="/admin" onClick={() => setUsr(false)}><FiShield size={14}/> Admin Panel</Link>}
                    <button onClick={() => { logout(); setUsr(false) }} className="nw-logout"><FiLogOut size={14}/> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nw-auth">
                <Link to="/login"    className="btn btn-outline btn-sm nw-login-btn">Login</Link>
                <Link to="/register" className="btn btn-accent btn-sm">Sign Up</Link>
              </div>
            )}

            <Link to="/wishlist" className="nw-icon" aria-label="Wishlist"><FiHeart size={22}/></Link>
            <Link to="/cart" className="nw-icon nw-cart" aria-label="Cart">
              <FiShoppingCart size={22}/>
              {cartCount > 0 && <span className="nw-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
            </Link>
            <button className="nw-hamburger" onClick={() => setMenu(p=>!p)} aria-label="Menu">
              {menu ? <FiX size={22}/> : <FiMenu size={22}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Category bar */}
      <div className="nw-bar">
        <div className="nw-bar-inner">
          {CATS.map(c => <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="nw-bar-link">{c}</Link>)}
        </div>
      </div>

      {/* Mobile menu */}
      {menu && (
        <div className="nw-mobile">
          <form className="nw-m-search" onSubmit={search}>
            <input type="text" placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)}/>
            <button type="submit"><FiSearch size={16}/></button>
          </form>
          <div className="nw-m-links">
            <div className="nw-m-section">Categories</div>
            {CATS.map(c => <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} onClick={() => setMenu(false)} className="nw-m-link">{c}</Link>)}
            <div className="nw-m-divider"/>
            {user ? (
              <>
                <div className="nw-m-section">Account</div>
                <Link to="/profile"  onClick={() => setMenu(false)} className="nw-m-link"><FiSettings size={14}/> My Profile</Link>
                <Link to="/orders"   onClick={() => setMenu(false)} className="nw-m-link"><FiPackage  size={14}/> My Orders</Link>
                <Link to="/wishlist" onClick={() => setMenu(false)} className="nw-m-link"><FiHeart    size={14}/> Wishlist</Link>
                <Link to="/cart"     onClick={() => setMenu(false)} className="nw-m-link"><FiShoppingCart size={14}/> Cart {cartCount > 0 && `(${cartCount})`}</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMenu(false)} className="nw-m-link"><FiShield size={14}/> Admin Panel</Link>}
                <button onClick={() => { logout(); setMenu(false) }} className="nw-m-logout"><FiLogOut size={14}/> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setMenu(false)} className="nw-m-link">Login</Link>
                <Link to="/register" onClick={() => setMenu(false)} className="nw-m-link nw-m-signup">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .nw { position:sticky;top:0;z-index:1000;box-shadow:0 2px 8px rgba(0,0,0,.15); }
        .nw-top { background:var(--primary); }
        .nw-inner { max-width:1280px;margin:0 auto;padding:0 16px;height:60px;display:flex;align-items:center;gap:12px; }
        .nw-logo { font-size:1.3rem;font-weight:800;color:#fff;white-space:nowrap;display:flex;align-items:center;gap:4px; }
        .nw-logo strong { color:#ffe082; }
        .nw-cat { position:relative;flex-shrink:0; }
        .nw-cat-btn { background:rgba(255,255,255,.18);color:#fff;padding:7px 12px;border-radius:6px;font-size:.82rem;font-weight:600;display:flex;align-items:center;gap:5px;cursor:pointer;border:none;white-space:nowrap; }
        .nw-cat-btn:hover { background:rgba(255,255,255,.28); }
        .nw-cat-menu { position:absolute;top:calc(100%+8px);left:0;background:#fff;border-radius:10px;box-shadow:var(--shadow-lg);min-width:200px;overflow:hidden;z-index:300; }
        .nw-cat-item { display:block;padding:10px 16px;font-size:.875rem;color:var(--dark);transition:.15s; }
        .nw-cat-item:hover { background:var(--primary-light);color:var(--primary); }
        .nw-search { flex:1;display:flex;background:#fff;border-radius:6px;overflow:hidden;max-width:520px;min-width:0; }
        .nw-search input { flex:1;padding:9px 14px;border:none;font-size:.875rem;min-width:0; }
        .nw-search button { background:var(--warning);color:#fff;padding:0 16px;border:none;cursor:pointer;flex-shrink:0; }
        .nw-search button:hover { background:#e65100; }
        .nw-right { display:flex;align-items:center;gap:6px;flex-shrink:0; }
        .nw-icon { color:#fff;padding:6px;display:flex;align-items:center;position:relative;flex-shrink:0; }
        .nw-cart { position:relative; }
        .nw-badge { position:absolute;top:-3px;right:-3px;background:var(--accent);color:#fff;font-size:.6rem;font-weight:700;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center; }
        .nw-avatar { width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.25);color:#fff;font-size:.82rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .nw-usr { position:relative; }
        .nw-usr-btn { background:rgba(255,255,255,.15);border:none;color:#fff;padding:6px 10px;border-radius:6px;display:flex;align-items:center;gap:5px;cursor:pointer;font-size:.82rem; }
        .nw-usr-btn:hover { background:rgba(255,255,255,.25); }
        .nw-uname { max-width:72px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .nw-usr-drop { position:absolute;top:calc(100%+8px);right:0;background:#fff;border-radius:10px;box-shadow:var(--shadow-lg);min-width:200px;overflow:hidden;z-index:300; }
        .nw-usr-head { padding:12px 16px;background:var(--primary-light);border-bottom:1px solid var(--gray-200); }
        .nw-usr-head b { font-size:.9rem;display:block;color:var(--dark); }
        .nw-usr-head small { font-size:.72rem;color:var(--gray-600); }
        .nw-usr-drop a,.nw-logout { display:flex;align-items:center;gap:8px;padding:10px 16px;font-size:.85rem;color:var(--gray-800);width:100%;text-align:left;background:none;border:none;cursor:pointer;transition:.15s; }
        .nw-usr-drop a:hover,.nw-logout:hover { background:var(--gray-100);color:var(--primary); }
        .nw-logout { color:var(--accent)!important;border-top:1px solid var(--gray-200); }
        .nw-auth { display:flex;gap:6px;align-items:center; }
        .nw-login-btn { color:#fff!important;border-color:rgba(255,255,255,.6)!important; }
        .nw-login-btn:hover { background:rgba(255,255,255,.15)!important; }
        .nw-hamburger { display:none;background:none;border:none;color:#fff;padding:4px; }
        .nw-bar { background:#1a5dc7; }
        .nw-bar-inner { max-width:1280px;margin:0 auto;padding:0 16px;display:flex;overflow-x:auto;scrollbar-width:none; }
        .nw-bar-inner::-webkit-scrollbar { display:none; }
        .nw-bar-link { padding:9px 16px;color:rgba(255,255,255,.88);font-size:.8rem;font-weight:500;white-space:nowrap;transition:.15s;flex-shrink:0; }
        .nw-bar-link:hover { color:#fff;background:rgba(255,255,255,.12); }
        .nw-mobile { background:#fff;border-top:2px solid var(--primary);max-height:80vh;overflow-y:auto; }
        .nw-m-search { display:flex;border-bottom:1px solid var(--gray-200); }
        .nw-m-search input { flex:1;padding:12px 16px;border:none;font-size:.9rem; }
        .nw-m-search button { padding:12px 16px;background:var(--primary);color:#fff;border:none;cursor:pointer; }
        .nw-m-links { padding:8px 0; }
        .nw-m-section { padding:6px 16px;font-size:.72rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.5px;margin-top:4px; }
        .nw-m-link { display:flex;align-items:center;gap:8px;padding:11px 16px;font-size:.9rem;color:var(--dark);transition:.15s;border:none;background:none;width:100%;text-align:left;cursor:pointer; }
        .nw-m-link:hover { background:var(--gray-100);color:var(--primary); }
        .nw-m-divider { height:1px;background:var(--gray-200);margin:8px 0; }
        .nw-m-logout { display:flex;align-items:center;gap:8px;padding:11px 16px;font-size:.9rem;color:var(--accent);border:none;background:none;width:100%;cursor:pointer;border-top:1px solid var(--gray-200);margin-top:4px; }
        .nw-m-signup { background:var(--primary);color:#fff!important;margin:8px 16px;border-radius:8px;width:calc(100% - 32px);justify-content:center; }
        @media(max-width:900px) { .nw-cat,.nw-bar { display:none; } .nw-hamburger { display:flex; } .nw-uname { display:none; } }
        @media(max-width:600px) { .nw-search { display:none; } .nw-auth .nw-login-btn { display:none; } }
        @media(max-width:400px) { .nw-logo { font-size:1.1rem; } }
      `}</style>
    </header>
  )
}
