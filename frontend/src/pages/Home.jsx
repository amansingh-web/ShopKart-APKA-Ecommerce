import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/common/ProductCard'
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const BANNERS = [
  {
    bg: 'linear-gradient(135deg,#1a237e 0%,#1565c0 100%)',
    tag: '🔥 Limited Time Offer',
    title: 'New Arrivals in Electronics',
    sub: 'Upto 40% OFF on Smartphones & Laptops',
    btn: 'Shop Electronics',
    link: '/products?category=Electronics',
    img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&q=80',
  },
  {
    bg: 'linear-gradient(135deg,#880e4f 0%,#c2185b 100%)',
    tag: '👗 Fashion Week Sale',
    title: 'Trendy Styles For Everyone',
    sub: 'Upto 60% OFF on top brands',
    btn: 'Shop Fashion',
    link: '/products?category=Fashion',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&q=80',
  },
  {
    bg: 'linear-gradient(135deg,#1b5e20 0%,#2e7d32 100%)',
    tag: '🏠 Home Makeover',
    title: 'Home & Kitchen Deals',
    sub: 'Premium appliances starting ₹999',
    btn: 'Shop Home',
    link: '/products?category=Home%20%26%20Kitchen',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80',
  },
]

const CATEGORIES = [
  { name:'Electronics',      icon:'📱', bg:'#e3f2fd', link:'/products?category=Electronics' },
  { name:'Fashion',          icon:'👗', bg:'#fce4ec', link:'/products?category=Fashion' },
  { name:'Home & Kitchen',   icon:'🏠', bg:'#e8f5e9', link:'/products?category=Home%20%26%20Kitchen' },
  { name:'Books',            icon:'📚', bg:'#fff8e1', link:'/products?category=Books' },
  { name:'Sports & Fitness', icon:'⚽', bg:'#f3e5f5', link:'/products?category=Sports%20%26%20Fitness' },
  { name:'Beauty',           icon:'💄', bg:'#e0f2f1', link:'/products?category=Beauty' },
]

const FEATURES = [
  { icon:<FiTruck size={26}/>,      title:'Free Shipping',  sub:'On orders above ₹500',        link:'/help',     color:'#e3f2fd', ic:'#1565c0' },
  { icon:<FiShield size={26}/>,     title:'Secure Payment', sub:'100% secure transactions',     link:'/privacy',  color:'#e8f5e9', ic:'#2e7d32' },
  { icon:<FiRefreshCw size={26}/>,  title:'Easy Returns',   sub:'7-day hassle-free returns',    link:'/returns',  color:'#fff3e0', ic:'#e65100' },
  { icon:<FiHeadphones size={26}/>, title:'24/7 Support',   sub:'Dedicated customer support',   link:'/contact',  color:'#f3e5f5', ic:'#7b1fa2' },
]

export default function Home() {
  const [featured,   setFeatured]   = useState([])
  const [bannerIdx,  setBannerIdx]  = useState(0)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    api.get('/products/featured')
      .then(({ data }) => setFeatured(data.products || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(p => (p + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const b = BANNERS[bannerIdx]

  const prevBanner = () => setBannerIdx(p => (p - 1 + BANNERS.length) % BANNERS.length)
  const nextBanner = () => setBannerIdx(p => (p + 1) % BANNERS.length)

  return (
    <div className="home animate-fade">

      {/* ── Hero Banner ── */}
      <section className="hero" style={{ background: b.bg }}>
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-tag">{b.tag}</span>
            <h1>{b.title}</h1>
            <p>{b.sub}</p>
            <div className="hero-btns">
              <Link to={b.link} className="btn btn-accent btn-lg">{b.btn} →</Link>
              <Link to="/products" className="btn hero-ghost-btn btn-lg">Browse All</Link>
            </div>
          </div>
          <div className="hero-img">
            <img src={b.img} alt={b.title} loading="eager"/>
          </div>
        </div>

        {/* Controls */}
        <button className="banner-arrow left" onClick={prevBanner} aria-label="Previous">
          <FiChevronLeft size={20}/>
        </button>
        <button className="banner-arrow right" onClick={nextBanner} aria-label="Next">
          <FiChevronRight size={20}/>
        </button>
        <div className="banner-dots">
          {BANNERS.map((_, i) => (
            <button key={i} className={`dot ${i === bannerIdx ? 'active':''}`}
              onClick={() => setBannerIdx(i)} aria-label={`Banner ${i+1}`}/>
          ))}
        </div>
      </section>

      {/* ── Features bar ── */}
      <section className="features-bar">
        <div className="container features-grid">
          {FEATURES.map((f) => (
            <Link to={f.link} key={f.title} className="feature-item">
              <div className="feat-icon" style={{ background:f.color, color:f.ic }}>{f.icon}</div>
              <div>
                <strong>{f.title}</strong>
                <p>{f.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>🛍️ Shop by Category</h2>
            <Link to="/products" className="view-all-link">View All <FiArrowRight size={13}/></Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((c) => (
              <Link to={c.link} key={c.name} className="cat-tile" style={{ background:c.bg }}>
                <span className="cat-emoji">{c.icon}</span>
                <span className="cat-label">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2>🔥 Featured Products</h2>
            <Link to="/products?sort=popular" className="view-all-link">View All <FiArrowRight size={13}/></Link>
          </div>
          {loading ? (
            <div className="featured-skeleton">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card"/>)}
            </div>
          ) : featured.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'var(--gray-400)' }}>
              No featured products yet.
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-inner">
            <div className="promo-text">
              <span className="promo-tag">🎁 New User Offer</span>
              <h2>Get 20% Off Your First Order!</h2>
              <p>Sign up now and use code <strong>NEWUSER20</strong> at checkout</p>
              <Link to="/register" className="btn btn-accent btn-lg" style={{ marginTop:16 }}>
                Create Free Account →
              </Link>
            </div>
            <div className="promo-visual">🎊</div>
          </div>
        </div>
      </section>

      {/* ── Why ShopKart ── */}
      <section className="section">
        <div className="container">
          <div className="section-header"><h2>✨ Why Choose ShopKart?</h2></div>
          <div className="why-grid">
            {[
              { icon:'🏆', title:'Top Quality Brands',     desc:'Only genuine products from verified sellers and top global brands.' },
              { icon:'⚡', title:'Lightning Fast Delivery', desc:'Express delivery in 1–2 business days to major cities across India.' },
              { icon:'💳', title:'Secure Payments',         desc:'Multiple payment options with end-to-end encryption for safety.' },
              { icon:'🔄', title:'Easy Returns',            desc:'Hassle-free 7-day returns on all eligible products, no questions asked.' },
            ].map((w) => (
              <div key={w.title} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* Hero */
        .hero { position:relative;min-height:380px;display:flex;flex-direction:column;justify-content:center;overflow:hidden; }
        .hero-inner { display:flex;align-items:center;justify-content:space-between;gap:32px;padding-top:40px;padding-bottom:56px; }
        .hero-text { flex:1;color:#fff;z-index:1; }
        .hero-tag { display:inline-block;background:rgba(255,255,255,.2);color:#fff;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600;margin-bottom:12px; }
        .hero-text h1 { font-size:2.2rem;font-weight:800;line-height:1.2;margin-bottom:10px; }
        .hero-text p { font-size:1rem;opacity:.9;margin-bottom:24px; }
        .hero-btns { display:flex;gap:12px;flex-wrap:wrap; }
        .hero-ghost-btn { background:rgba(255,255,255,.15);color:#fff;border:1.5px solid rgba(255,255,255,.4); }
        .hero-ghost-btn:hover { background:rgba(255,255,255,.25); }
        .hero-img { flex:1;max-width:380px;z-index:1; }
        .hero-img img { border-radius:16px;width:100%;object-fit:cover;max-height:280px;box-shadow:0 16px 40px rgba(0,0,0,.25); }
        .banner-arrow { position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;background:rgba(255,255,255,.2);border:none;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2;transition:var(--transition); }
        .banner-arrow:hover { background:rgba(255,255,255,.35); }
        .banner-arrow.left { left:12px; }
        .banner-arrow.right { right:12px; }
        .banner-dots { position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:2; }
        .dot { width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.4);border:none;cursor:pointer;transition:all .3s; }
        .dot.active { background:#fff;width:20px;border-radius:4px; }

        /* Features */
        .features-bar { background:#fff;border-bottom:1px solid var(--gray-200); }
        .features-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:0; }
        .feature-item { display:flex;align-items:center;gap:12px;padding:18px 16px;border-right:1px solid var(--gray-200);color:var(--dark);transition:var(--transition); }
        .feature-item:last-child { border-right:none; }
        .feature-item:hover { background:var(--gray-100); }
        .feat-icon { width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .feature-item strong { font-size:.875rem;display:block;font-weight:600; }
        .feature-item p { font-size:.75rem;color:var(--gray-400);margin-top:2px; }

        /* Categories */
        .categories-grid { display:grid;grid-template-columns:repeat(6,1fr);gap:12px; }
        .cat-tile { display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px 8px;border-radius:12px;transition:all .2s;text-align:center; }
        .cat-tile:hover { transform:translateY(-4px);box-shadow:var(--shadow-md); }
        .cat-emoji { font-size:2rem; }
        .cat-label { font-size:.8rem;font-weight:600;color:var(--gray-800); }

        /* View all */
        .view-all-link { display:inline-flex;align-items:center;gap:4px;font-size:.85rem;color:var(--primary);font-weight:600; }
        .view-all-link:hover { text-decoration:underline; }

        /* Featured */
        .featured-section { background:#fff;padding-top:24px;padding-bottom:32px; }
        .featured-skeleton { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px; }
        .skeleton-card { background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;height:320px; }
        @keyframes shimmer { to{background-position:-200% 0;} }

        /* Promo */
        .promo-section { background:linear-gradient(135deg,#ff6f00 0%,#ff8f00 100%);padding:40px 0; }
        .promo-inner { display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap; }
        .promo-tag { display:inline-block;background:rgba(255,255,255,.25);color:#fff;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600;margin-bottom:10px; }
        .promo-text h2 { font-size:1.8rem;font-weight:800;color:#fff;line-height:1.2; }
        .promo-text p { color:rgba(255,255,255,.9);margin-top:6px; }
        .promo-visual { font-size:5rem;line-height:1; }

        /* Why */
        .why-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:16px; }
        .why-card { background:#fff;border-radius:12px;padding:24px 16px;text-align:center;box-shadow:var(--shadow-sm);transition:var(--transition); }
        .why-card:hover { transform:translateY(-4px);box-shadow:var(--shadow-md); }
        .why-icon { font-size:2.2rem;margin-bottom:12px; }
        .why-card h3 { font-size:.95rem;font-weight:700;margin-bottom:6px; }
        .why-card p { font-size:.8rem;color:var(--gray-400);line-height:1.6; }

        /* Responsive */
        @media(max-width:1024px) {
          .categories-grid { grid-template-columns:repeat(3,1fr); }
          .why-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:900px) {
          .hero-inner { padding-top:32px;padding-bottom:48px; }
          .hero-text h1 { font-size:1.8rem; }
          .hero-img { max-width:280px; }
          .features-grid { grid-template-columns:repeat(2,1fr); }
          .feature-item:nth-child(2) { border-right:none; }
          .feature-item:nth-child(3) { border-top:1px solid var(--gray-200); }
          .feature-item:nth-child(4) { border-top:1px solid var(--gray-200);border-right:none; }
        }
        @media(max-width:700px) {
          .hero-img { display:none; }
          .hero-text h1 { font-size:1.6rem; }
          .hero-text p { font-size:.9rem; }
          .hero-inner { padding-top:28px;padding-bottom:48px; }
          .categories-grid { grid-template-columns:repeat(3,1fr);gap:8px; }
          .cat-tile { padding:14px 6px; }
          .cat-emoji { font-size:1.6rem; }
          .cat-label { font-size:.72rem; }
          .promo-visual { display:none; }
          .promo-text h2 { font-size:1.3rem; }
        }
        @media(max-width:480px) {
          .hero-text h1 { font-size:1.3rem; }
          .hero-tag { font-size:.72rem; }
          .hero-btns { gap:8px; }
          .hero-btns .btn-lg { padding:10px 16px;font-size:.85rem; }
          .features-grid { grid-template-columns:1fr 1fr; }
          .feature-item { padding:12px 10px;gap:8px; }
          .feat-icon { width:38px;height:38px; }
          .feature-item strong { font-size:.8rem; }
          .feature-item p { display:none; }
          .categories-grid { grid-template-columns:repeat(3,1fr);gap:6px; }
          .why-grid { grid-template-columns:1fr 1fr; }
          .why-card { padding:16px 12px; }
          .why-icon { font-size:1.6rem; }
          .banner-arrow { width:28px;height:28px; }
        }
        @media(max-width:360px) {
          .categories-grid { grid-template-columns:repeat(2,1fr); }
          .features-grid { grid-template-columns:1fr; }
          .feature-item { border-right:none !important;border-top:1px solid var(--gray-200) !important; }
          .feature-item:first-child { border-top:none !important; }
        }
      `}</style>
    </div>
  )
}
