import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/common/ProductCard'
import toast from 'react-hot-toast'
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiChevronRight, FiMinus, FiPlus } from 'react-icons/fi'

const fmt = n => '₹' + Number(n).toLocaleString('en-IN')

function Stars({ rating=0, size=14 }) {
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:1}}>
      {[1,2,3,4,5].map(s=>(
        <FiStar key={s} size={size} fill={s<=Math.round(rating)?'#ff9f00':'none'} stroke={s<=Math.round(rating)?'#ff9f00':'#ccc'}/>
      ))}
    </span>
  )
}

function getSpecEntries(spec) {
  if (!spec) return []
  if (spec instanceof Map) return [...spec.entries()]
  if (typeof spec==='object') return Object.entries(spec).filter(([k])=>k&&k!=='$__')
  return []
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user }      = useAuth()
  const navigate      = useNavigate()
  const [product,    setProd]     = useState(null)
  const [related,    setRelated]  = useState([])
  const [loading,    setLoading]  = useState(true)
  const [imgIdx,     setImgIdx]   = useState(0)
  const [qty,        setQty]      = useState(1)
  const [tab,        setTab]      = useState('desc')
  const [review,     setReview]   = useState({ rating:5, comment:'' })
  const [submitting, setSubmit]   = useState(false)

  useEffect(() => {
    setLoading(true); setImgIdx(0); setQty(1); setTab('desc')
    Promise.all([api.get(`/products/${id}`), api.get(`/products/${id}/related`)])
      .then(([p,r]) => { setProd(p.data.product); setRelated(r.data.products||[]) })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const addReview = async e => {
    e.preventDefault()
    if (!user) { toast.error('Please login first'); return }
    if (!review.comment.trim()) { toast.error('Write a comment'); return }
    setSubmit(true)
    try {
      await api.post(`/products/${id}/reviews`, review)
      toast.success('Review submitted!')
      const {data} = await api.get(`/products/${id}`)
      setProd(data.product)
      setReview({ rating:5, comment:'' })
    } catch(err) { toast.error(err.response?.data?.message||'Failed') }
    finally { setSubmit(false) }
  }

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:80}}><div className="spinner"/></div>
  if (!product) return null

  const imgs = product.images?.length ? product.images : [{url:'https://via.placeholder.com/500?text=No+Image'}]
  const specs = getSpecEntries(product.specifications)
  const discount = product.discount || 0

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">

        {/* Breadcrumb */}
        <div className="pd-bc">
          <Link to="/">Home</Link><FiChevronRight size={11}/><Link to="/products">Products</Link>
          <FiChevronRight size={11}/><Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
          <FiChevronRight size={11}/><span>{product.name}</span>
        </div>

        {/* Main layout */}
        <div className="pd-layout">
          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-thumbs">
              {imgs.map((img,i) => (
                <button key={i} className={`pd-thumb ${i===imgIdx?'active':''}`} onClick={()=>setImgIdx(i)}>
                  <img src={img.url} alt={`view ${i+1}`} onError={e=>e.target.src='https://via.placeholder.com/64'}/>
                </button>
              ))}
            </div>
            <div className="pd-main-img">
              <img src={imgs[imgIdx]?.url} alt={product.name} onError={e=>e.target.src='https://via.placeholder.com/500'}/>
              {discount>0 && <span className="pd-badge">{discount}% OFF</span>}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <p className="pd-brand">{product.brand}</p>
            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-rating-row">
              <div className="pd-rating-chip"><Stars rating={product.rating}/> {Number(product.rating||0).toFixed(1)}</div>
              <span className="pd-rev-count">{(product.numReviews||0).toLocaleString()} ratings</span>
              {product.sold>0 && <span className="pd-sold">{product.sold.toLocaleString()} sold</span>}
            </div>

            <div className="pd-price-box">
              <div className="pd-price">{fmt(product.price)}</div>
              {product.originalPrice>product.price && (
                <div className="pd-price-row">
                  <span className="pd-orig">MRP {fmt(product.originalPrice)}</span>
                  <span className="pd-save">Save {fmt(product.originalPrice-product.price)} ({discount}%)</span>
                </div>
              )}
              <p className="pd-tax">Inclusive of all taxes</p>
            </div>

            <div className={`pd-stock-badge ${product.stock>0?'in':'out'}`}>
              {product.stock>0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock'}
            </div>

            {product.shortDesc && <p className="pd-short">{product.shortDesc}</p>}

            {product.stock>0 && (
              <div className="pd-qty-row">
                <span>Qty:</span>
                <div className="pd-qty">
                  <button onClick={()=>setQty(Math.max(1,qty-1))}><FiMinus size={13}/></button>
                  <span>{qty}</span>
                  <button onClick={()=>setQty(Math.min(product.stock,qty+1))}><FiPlus size={13}/></button>
                </div>
                {product.stock<=5 && <span className="pd-low-stock">Only {product.stock} left!</span>}
              </div>
            )}

            <div className="pd-btns">
              <button className="btn btn-primary btn-lg pd-cart-btn" onClick={()=>addToCart(product,qty)} disabled={product.stock===0}>
                <FiShoppingCart size={17}/> Add to Cart
              </button>
              <button className="btn btn-accent btn-lg pd-cart-btn" onClick={()=>{addToCart(product,qty);navigate('/cart')}} disabled={product.stock===0}>
                ⚡ Buy Now
              </button>
            </div>

            <div className="pd-sec-btns">
              <button className="btn btn-ghost btn-sm" onClick={async()=>{
                if(!user){toast.error('Please login');return}
                const{data}=await api.post(`/auth/wishlist/${product._id}`).catch(()=>{toast.error('Error');return{data:{message:''}}})
                toast.success(data.message)
              }}><FiHeart size={13}/> Wishlist</button>
              <button className="btn btn-ghost btn-sm" onClick={()=>{navigator.clipboard.writeText(window.location.href);toast.success('Link copied!')}}><FiShare2 size={13}/> Share</button>
            </div>

            <div className="pd-delivery">
              <div className="pd-del-item"><FiTruck size={16}/><div><strong>Free Delivery</strong><p>Orders above ₹500</p></div></div>
              <div className="pd-del-item"><FiShield size={16}/><div><strong>1 Year Warranty</strong><p>Manufacturer warranty</p></div></div>
              <div className="pd-del-item"><FiRefreshCw size={16}/><div><strong>7-Day Returns</strong><p>Easy return policy</p></div></div>
            </div>

            {specs.length>0 && (
              <div className="pd-specs">
                <h4>Specifications</h4>
                <table className="pd-specs-table"><tbody>
                  {specs.map(([k,v])=><tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                </tbody></table>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs-box">
          <div className="pd-tab-nav">
            <button className={`pd-tab-btn ${tab==='desc'?'active':''}`} onClick={()=>setTab('desc')}>Description</button>
            <button className={`pd-tab-btn ${tab==='reviews'?'active':''}`} onClick={()=>setTab('reviews')}>Reviews ({product.numReviews||0})</button>
          </div>

          {tab==='desc' && (
            <div className="pd-tab-content animate-fade">
              <p style={{whiteSpace:'pre-line',lineHeight:1.8,fontSize:'.9rem'}}>{product.description}</p>
              {product.tags?.length>0 && (
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:14}}>
                  {product.tags.map(t=><Link key={t} to={`/products?search=${encodeURIComponent(t)}`} className="pd-tag">#{t}</Link>)}
                </div>
              )}
            </div>
          )}

          {tab==='reviews' && (
            <div className="pd-tab-content animate-fade">
              <div className="pd-rating-summary">
                <div className="pd-big-rating">
                  <span className="pd-rating-num">{Number(product.rating||0).toFixed(1)}</span>
                  <Stars rating={product.rating} size={20}/>
                  <p>{(product.numReviews||0).toLocaleString()} reviews</p>
                </div>
              </div>

              {user ? (
                <form className="pd-review-form" onSubmit={addReview}>
                  <h4>Write a Review</h4>
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <div style={{display:'flex',gap:4}}>
                      {[1,2,3,4,5].map(s=>(
                        <button type="button" key={s} onClick={()=>setReview({...review,rating:s})}
                          style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.6rem',opacity:s<=review.rating?1:.3,transition:'opacity .15s'}}>⭐</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea className="form-input" rows={4} placeholder="Share your experience..."
                      value={review.comment} onChange={e=>setReview({...review,comment:e.target.value})} required/>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Submitting...':'Submit Review'}</button>
                </form>
              ) : (
                <div style={{background:'var(--gray-100)',borderRadius:8,padding:14,textAlign:'center',marginBottom:16}}>
                  <Link to="/login" className="btn btn-primary btn-sm">Login to write a review</Link>
                </div>
              )}

              <div className="pd-reviews-list">
                {product.reviews?.length>0 ? product.reviews.map(r=>(
                  <div key={r._id} className="pd-review">
                    <div className="pd-review-head">
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div className="pd-rev-av">{r.name?.[0]?.toUpperCase()||'U'}</div>
                        <div><strong style={{fontSize:'.875rem'}}>{r.name}</strong><div><Stars rating={r.rating} size={12}/></div></div>
                      </div>
                      <span style={{fontSize:'.72rem',color:'var(--gray-400)'}}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p style={{fontSize:'.875rem',color:'var(--gray-600)',marginTop:8}}>{r.comment}</p>
                  </div>
                )) : <p style={{color:'var(--gray-400)',textAlign:'center',padding:'24px 0'}}>No reviews yet. Be the first!</p>}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length>0 && (
          <section className="section">
            <div className="section-header"><h2>Related Products</h2></div>
            <div className="products-grid">{related.map(p=><ProductCard key={p._id} product={p}/>)}</div>
          </section>
        )}
      </div>

      <style>{`
        .pd-bc { display:flex;align-items:center;gap:5px;font-size:.78rem;color:var(--gray-400);padding:12px 0;flex-wrap:wrap; }
        .pd-bc a{color:var(--primary);} .pd-bc span{color:var(--dark);}
        .pd-layout { display:grid;grid-template-columns:1fr 1fr;gap:28px;background:#fff;border-radius:12px;padding:20px;box-shadow:var(--shadow-sm); }
        .pd-gallery { display:flex;gap:10px; }
        .pd-thumbs { display:flex;flex-direction:column;gap:7px; }
        .pd-thumb { width:58px;height:58px;border:2px solid var(--gray-200);border-radius:7px;overflow:hidden;cursor:pointer;background:var(--gray-100);flex-shrink:0;padding:0; }
        .pd-thumb.active { border-color:var(--primary); }
        .pd-thumb img { width:100%;height:100%;object-fit:contain;padding:3px; }
        .pd-main-img { flex:1;position:relative;background:var(--gray-100);border-radius:10px;overflow:hidden;aspect-ratio:1; }
        .pd-main-img img { width:100%;height:100%;object-fit:contain;padding:14px; }
        .pd-badge { position:absolute;top:10px;left:10px;background:var(--accent);color:#fff;font-size:.72rem;font-weight:700;padding:3px 8px;border-radius:4px; }
        .pd-info { display:flex;flex-direction:column;gap:12px; }
        .pd-brand { font-size:.75rem;color:var(--primary);font-weight:700;text-transform:uppercase;letter-spacing:.5px; }
        .pd-title { font-size:1.35rem;font-weight:700;line-height:1.3; }
        .pd-rating-row { display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
        .pd-rating-chip { display:flex;align-items:center;gap:5px;background:var(--success);color:#fff;padding:3px 9px;border-radius:6px;font-size:.82rem;font-weight:700; }
        .pd-rev-count,.pd-sold { font-size:.78rem;color:var(--gray-400); }
        .pd-sold::before { content:'•';margin-right:6px; }
        .pd-price-box { background:var(--gray-100);border-radius:8px;padding:14px; }
        .pd-price { font-size:1.8rem;font-weight:800; }
        .pd-price-row { display:flex;align-items:center;gap:8px;margin-top:3px;flex-wrap:wrap; }
        .pd-orig { font-size:.85rem;color:var(--gray-400);text-decoration:line-through; }
        .pd-save { font-size:.82rem;color:var(--success);font-weight:600; }
        .pd-tax { font-size:.72rem;color:var(--gray-400);margin-top:3px; }
        .pd-stock-badge { padding:5px 10px;border-radius:6px;font-size:.82rem;font-weight:600;width:fit-content; }
        .pd-stock-badge.in { background:#e8f5e9;color:var(--success); }
        .pd-stock-badge.out { background:#fff3e0;color:var(--warning); }
        .pd-short { font-size:.875rem;color:var(--gray-600);line-height:1.7; }
        .pd-qty-row { display:flex;align-items:center;gap:12px;flex-wrap:wrap; }
        .pd-qty-row>span { font-size:.875rem;font-weight:600; }
        .pd-qty { display:flex;align-items:center;border:1.5px solid var(--gray-200);border-radius:7px;overflow:hidden; }
        .pd-qty button { width:34px;height:34px;border:none;background:var(--gray-100);cursor:pointer;display:flex;align-items:center;justify-content:center; }
        .pd-qty span { width:44px;text-align:center;font-weight:700; }
        .pd-low-stock { font-size:.78rem;color:var(--accent);font-weight:600; }
        .pd-btns { display:flex;gap:10px;flex-wrap:wrap; }
        .pd-cart-btn { flex:1;min-width:120px;justify-content:center; }
        .pd-sec-btns { display:flex;gap:8px;flex-wrap:wrap; }
        .pd-delivery { display:flex;flex-direction:column;gap:8px;padding:12px;background:var(--gray-100);border-radius:8px; }
        .pd-del-item { display:flex;align-items:flex-start;gap:10px;color:var(--gray-600); }
        .pd-del-item strong { font-size:.82rem;color:var(--dark);display:block; }
        .pd-del-item p { font-size:.72rem;color:var(--gray-400); }
        .pd-specs { background:var(--gray-100);border-radius:8px;padding:12px; }
        .pd-specs h4 { font-size:.85rem;font-weight:700;margin-bottom:8px; }
        .pd-specs-table { width:100%;font-size:.8rem;border-collapse:collapse; }
        .pd-specs-table td { padding:4px 6px;border-bottom:1px solid var(--gray-200); }
        .pd-specs-table td:first-child { color:var(--gray-600);font-weight:600;width:40%; }
        .pd-specs-table tr:last-child td { border-bottom:none; }
        .pd-tabs-box { background:#fff;border-radius:12px;padding:20px;margin-top:14px;box-shadow:var(--shadow-sm); }
        .pd-tab-nav { display:flex;border-bottom:2px solid var(--gray-200);margin-bottom:20px; }
        .pd-tab-btn { padding:9px 20px;border:none;background:none;font-size:.9rem;font-weight:600;color:var(--gray-400);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:.15s;white-space:nowrap; }
        .pd-tab-btn.active { color:var(--primary);border-bottom-color:var(--primary); }
        .pd-tab-content { animation:fadeIn .25s ease; }
        .pd-rating-summary { margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--gray-200); }
        .pd-big-rating { display:inline-flex;flex-direction:column;align-items:center;gap:4px; }
        .pd-rating-num { font-size:2.5rem;font-weight:800; }
        .pd-big-rating p { font-size:.78rem;color:var(--gray-400); }
        .pd-review-form { background:var(--gray-100);border-radius:10px;padding:16px;margin-bottom:20px;display:flex;flex-direction:column;gap:12px; }
        .pd-review-form h4 { font-size:.95rem;font-weight:700; }
        .pd-reviews-list { display:flex;flex-direction:column;gap:12px; }
        .pd-review { padding:14px;border:1px solid var(--gray-200);border-radius:8px; }
        .pd-review-head { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px; }
        .pd-rev-av { width:38px;height:38px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.875rem;flex-shrink:0; }
        .pd-tag { padding:3px 10px;background:var(--primary-light);color:var(--primary);border-radius:20px;font-size:.75rem;font-weight:600; }
        .pd-tag:hover { background:var(--primary);color:#fff; }
        @media(max-width:900px) { .pd-layout{grid-template-columns:1fr;} .pd-gallery{flex-direction:column-reverse;} .pd-thumbs{flex-direction:row;} .pd-main-img{max-height:320px;} }
        @media(max-width:600px) { .pd-title{font-size:1.1rem;} .pd-price{font-size:1.5rem;} .pd-tab-btn{padding:8px 12px;font-size:.82rem;} }
        @media(max-width:400px) { .pd-btns{flex-direction:column;} .pd-cart-btn{min-width:unset;} .pd-thumb{width:48px;height:48px;} }
      `}</style>
    </div>
  )
}
