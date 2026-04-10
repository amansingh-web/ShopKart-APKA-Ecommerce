import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const fmt = n => '₹' + Number(n).toLocaleString('en-IN')

export default function Wishlist() {
  const { addToCart }      = useCart()
  const [items,  setItems] = useState([])
  const [loading,setLoad]  = useState(true)

  useEffect(() => {
    api.get('/auth/me').then(({data}) => setItems(data.user.wishlist||[])).catch(()=>setItems([])).finally(()=>setLoad(false))
  }, [])

  const remove = async id => {
    try { const {data}=await api.post(`/auth/wishlist/${id}`); setItems(prev=>prev.filter(p=>p._id!==id)); toast.success(data.message) }
    catch { toast.error('Something went wrong') }
  }

  const moveToCart = p => { addToCart(p); remove(p._id) }

  if (loading) return <div className="page-wrapper" style={{display:'flex',justifyContent:'center',paddingTop:60}}><div className="spinner"/></div>

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <h1 className="wl-h1"><FiHeart size={20} color="var(--accent)"/> My Wishlist ({items.length})</h1>

        {items.length === 0 ? (
          <div className="wl-empty">
            <div className="wl-empty-icon">💝</div>
            <h3>Your wishlist is empty</h3>
            <p>Save products you love and buy them later</p>
            <Link to="/products" className="btn btn-primary">Explore Products</Link>
          </div>
        ) : (
          <div className="wl-grid">
            {items.map(p => (
              <div key={p._id} className="wl-card">
                <Link to={`/products/${p._id}`} className="wl-img">
                  <img src={p.images?.[0]?.url||'https://via.placeholder.com/200'} alt={p.name}
                    onError={e=>e.target.src='https://via.placeholder.com/200'}/>
                  {p.stock===0 && <div className="wl-oos">Out of Stock</div>}
                </Link>
                <div className="wl-body">
                  <Link to={`/products/${p._id}`}><h3 className="wl-name line-clamp-2">{p.name}</h3></Link>
                  <div className="wl-price">
                    <span className="wl-cur">{fmt(p.price)}</span>
                    {p.originalPrice>p.price && <span className="wl-orig">{fmt(p.originalPrice)}</span>}
                  </div>
                  <div className="wl-actions">
                    <button className="btn btn-primary btn-sm wl-add" onClick={()=>moveToCart(p)} disabled={p.stock===0}>
                      <FiShoppingCart size={13}/> <span className="wl-add-txt">Add to Cart</span>
                    </button>
                    <button className="wl-del" onClick={()=>remove(p._id)} title="Remove">
                      <FiTrash2 size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .wl-h1 { font-size:1.3rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px; }
        .wl-empty { text-align:center;background:#fff;border-radius:12px;padding:64px 20px;display:flex;flex-direction:column;align-items:center;gap:10px;box-shadow:var(--shadow-sm); }
        .wl-empty-icon { font-size:4rem; }
        .wl-empty h3 { font-size:1.2rem;font-weight:700; }
        .wl-empty p { color:var(--gray-400); }
        .wl-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px; }
        .wl-card { background:#fff;border-radius:10px;overflow:hidden;box-shadow:var(--shadow-sm);transition:var(--transition);border:1px solid var(--gray-200); }
        .wl-card:hover { box-shadow:var(--shadow-md);transform:translateY(-2px); }
        .wl-img { display:block;padding-top:100%;position:relative;background:var(--gray-100); }
        .wl-img img { position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:10px; }
        .wl-oos { position:absolute;inset:0;background:rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--gray-600);font-size:.82rem; }
        .wl-body { padding:12px;display:flex;flex-direction:column;gap:6px; }
        .wl-name { font-size:.875rem;font-weight:500;color:var(--dark); }
        .wl-name:hover { color:var(--primary); }
        .wl-price { display:flex;align-items:baseline;gap:6px; }
        .wl-cur { font-size:.95rem;font-weight:700; }
        .wl-orig { font-size:.78rem;color:var(--gray-400);text-decoration:line-through; }
        .wl-actions { display:flex;gap:6px;align-items:center; }
        .wl-add { flex:1;justify-content:center; }
        .wl-del { width:32px;height:32px;background:#ffebee;color:var(--accent);border:none;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0; }
        .wl-del:hover { background:#ffcdd2; }
        @media(max-width:600px) { .wl-grid{grid-template-columns:repeat(2,1fr);gap:10px;} .wl-body{padding:10px;} .wl-add-txt{display:none;} }
        @media(max-width:360px) { .wl-grid{gap:6px;} }
      `}</style>
    </div>
  )
}
