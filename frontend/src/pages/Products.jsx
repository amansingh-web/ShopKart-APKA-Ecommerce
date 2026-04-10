import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/common/ProductCard'
import { FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const CATEGORIES = ['Electronics','Fashion','Home & Kitchen','Books','Sports & Fitness','Beauty']
const SORT_OPTIONS = [
  { value:'newest',     label:'Newest First' },
  { value:'price-low',  label:'Price: Low to High' },
  { value:'price-high', label:'Price: High to Low' },
  { value:'rating',     label:'Top Rated' },
  { value:'popular',    label:'Most Popular' },
]
const RATINGS = [4, 3, 2, 1]
const PRICE_RANGES = [
  { label:'Under ₹500',         min:0,     max:500 },
  { label:'₹500 – ₹2,000',      min:500,   max:2000 },
  { label:'₹2,000 – ₹10,000',   min:2000,  max:10000 },
  { label:'₹10,000 – ₹50,000',  min:10000, max:50000 },
  { label:'Above ₹50,000',       min:50000, max:999999 },
]

export default function Products() {
  const [params, setParams]     = useSearchParams()
  const [products, setProducts] = useState([])
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState(1)
  const [loading,  setLoading]  = useState(true)
  const [sidebar,  setSidebar]  = useState(false)

  const category = params.get('category') || ''
  const search   = params.get('search')   || ''
  const sort     = params.get('sort')     || 'newest'
  const page     = parseInt(params.get('page') || '1')
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const rating   = params.get('rating')   || ''
  const inStock  = params.get('inStock')  || ''

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({
        page, limit:12, sort,
        ...(category && { category }),
        ...(search   && { search }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(rating   && { rating }),
        ...(inStock  && { inStock }),
      })
      const { data } = await api.get(`/products?${q}`)
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, category, search, minPrice, maxPrice, rating, inStock])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Close sidebar on desktop resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setSidebar(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const set = (key, val) => {
    const p = new URLSearchParams(params)
    if (key !== 'page') p.delete('page')   // reset to page 1 on filter change
    if (val !== '' && val !== null && val !== undefined) p.set(key, val)
    else p.delete(key)
    setParams(p)
  }

  const setPage = (num) => {
    const p = new URLSearchParams(params)
    p.set('page', num)
    setParams(p)
  }

  const setPrice = (min, max) => {
    const p = new URLSearchParams(params)
    const isActive = minPrice == min && maxPrice == max
    if (isActive) { p.delete('minPrice'); p.delete('maxPrice') }
    else { p.set('minPrice', min); p.set('maxPrice', max) }
    p.delete('page')
    setParams(p)
  }

  const clearAll = () => setParams({})

  const hasFilters = category || search || minPrice || maxPrice || rating || inStock

  const activeCount = [category, search, minPrice, rating, inStock].filter(Boolean).length

  const FilterPanel = () => (
    <div className="filter-panel">
      <div className="filter-head">
        <h3>Filters {activeCount > 0 && <span className="filter-count">{activeCount}</span>}</h3>
        {hasFilters && <button className="clear-btn" onClick={clearAll}>Clear All</button>}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        {CATEGORIES.map((c) => (
          <label key={c} className="filter-opt">
            <input type="radio" name="category" checked={category === c}
              onChange={() => set('category', category === c ? '' : c)}/>
            <span>{c}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        {PRICE_RANGES.map((r) => (
          <label key={r.label} className="filter-opt">
            <input type="radio" name="price"
              checked={minPrice == r.min && maxPrice == r.max}
              onChange={() => setPrice(r.min, r.max)}/>
            <span>{r.label}</span>
          </label>
        ))}
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Min Rating">
        {RATINGS.map((r) => (
          <label key={r} className="filter-opt">
            <input type="radio" name="rating" checked={rating == r}
              onChange={() => set('rating', rating == r ? '' : r)}/>
            <span>{'⭐'.repeat(r)} & above</span>
          </label>
        ))}
      </FilterSection>

      {/* In stock */}
      <FilterSection title="Availability" last>
        <label className="filter-opt">
          <input type="checkbox" checked={inStock === 'true'}
            onChange={(e) => set('inStock', e.target.checked ? 'true' : '')}/>
          <span>In Stock Only</span>
        </label>
      </FilterSection>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> /
          <span>{category || (search ? `"${search}"` : 'All Products')}</span>
        </div>

        {/* Toolbar */}
        <div className="products-toolbar">
          <div className="tb-left">
            <button className="filter-toggle" onClick={() => setSidebar(!sidebar)}>
              <FiFilter size={15}/>
              Filters
              {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
            </button>
            <span className="result-count">
              {loading ? '...' : `${total.toLocaleString()} products`}
              {category && <span className="rc-tag">{category}</span>}
              {search   && <span className="rc-tag">"{search}"</span>}
            </span>
          </div>
          <div className="tb-right">
            <label style={{ fontSize:'.82rem', color:'var(--gray-600)' }}>Sort:</label>
            <select value={sort} onChange={(e) => set('sort', e.target.value)} className="sort-select">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="filter-chips">
            {category  && <Chip label={category}                    onRemove={() => set('category','')} />}
            {search    && <Chip label={`"${search}"`}               onRemove={() => set('search','')} />}
            {rating    && <Chip label={`⭐ ${rating}+ stars`}        onRemove={() => set('rating','')} />}
            {minPrice  && <Chip label={`₹${Number(minPrice).toLocaleString()}–₹${Number(maxPrice).toLocaleString()}`}
                               onRemove={() => { set('minPrice',''); set('maxPrice','') }} />}
            {inStock   && <Chip label="In Stock"                    onRemove={() => set('inStock','')} />}
          </div>
        )}

        <div className="products-body">

          {/* Desktop sidebar */}
          <div className="desktop-sidebar">
            <FilterPanel/>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebar && (
            <div className="mobile-filter-overlay" onClick={() => setSidebar(false)}>
              <div className="mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 16px 0' }}>
                  <h3 style={{ fontWeight:700 }}>Filters</h3>
                  <button onClick={() => setSidebar(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.4rem', color:'var(--gray-600)' }}>×</button>
                </div>
                <div style={{ flex:1, overflowY:'auto', padding:'0 16px 16px' }}>
                  <FilterPanel/>
                </div>
                <div style={{ padding:16, borderTop:'1px solid var(--gray-200)' }}>
                  <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
                    onClick={() => setSidebar(false)}>
                    Show {total} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main products */}
          <div className="products-main">
            {loading ? (
              <div className="skeleton-grid">
                {[...Array(12)].map((_, i) => <div key={i} className="skeleton-card"/>)}
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <div style={{ fontSize:'3rem' }}>🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
                <button className="btn btn-primary" onClick={clearAll}>Clear All Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => <ProductCard key={p._id} product={p}/>)}
              </div>
            )}

            {/* Pagination */}
            {!loading && pages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="pg-btn">
                  ← Prev
                </button>
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    className={`pg-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="pg-btn">
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .breadcrumb { font-size:.8rem;color:var(--gray-400);padding:10px 0;display:flex;align-items:center;gap:6px;flex-wrap:wrap; }
        .breadcrumb a { color:var(--primary); }
        .breadcrumb span { color:var(--dark); }

        .products-toolbar { display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:10px;padding:10px 14px;margin-bottom:12px;box-shadow:var(--shadow-sm);flex-wrap:wrap;gap:8px; }
        .tb-left { display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
        .filter-toggle { display:flex;align-items:center;gap:6px;padding:7px 14px;background:var(--primary-light);color:var(--primary);border:none;border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer;position:relative; }
        .filter-badge { background:var(--primary);color:#fff;font-size:.65rem;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center; }
        .result-count { font-size:.82rem;color:var(--gray-600);display:flex;align-items:center;gap:6px;flex-wrap:wrap; }
        .rc-tag { background:var(--primary-light);color:var(--primary);padding:2px 8px;border-radius:10px;font-size:.75rem;font-weight:600; }
        .tb-right { display:flex;align-items:center;gap:8px; }
        .sort-select { padding:7px 10px;border:1.5px solid var(--gray-200);border-radius:6px;font-size:.85rem;color:var(--dark);background:#fff;cursor:pointer; }

        /* Filter chips */
        .filter-chips { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px; }
        .chip { display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:var(--primary-light);color:var(--primary);border-radius:20px;font-size:.78rem;font-weight:600;border:none;cursor:pointer; }
        .chip:hover { background:var(--primary);color:#fff; }
        .chip-x { font-size:.9rem;line-height:1; }

        /* Layout */
        .products-body { display:flex;gap:16px;align-items:flex-start; }
        .desktop-sidebar { width:240px;flex-shrink:0;position:sticky;top:80px; }
        .products-main { flex:1;min-width:0; }

        /* Filter panel */
        .filter-panel { background:#fff;border-radius:10px;box-shadow:var(--shadow-sm);overflow:visible;width:100%; }
        .filter-head { display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--gray-200); }
        .filter-head h3 { font-size:.95rem;font-weight:700;display:flex;align-items:center;gap:8px; }
        .filter-count { background:var(--primary);color:#fff;font-size:.68rem;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center; }
        .clear-btn { font-size:.78rem;color:var(--primary);background:none;border:none;cursor:pointer;font-weight:600; }
        .filter-section { padding:10px 14px;border-bottom:1px solid var(--gray-100); }
        .filter-section-title { display:flex;align-items:center;justify-content:space-between;font-size:.8rem;font-weight:700;color:var(--gray-800);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;cursor:pointer;border:none;background:none;width:100%;padding:0;text-align:left; }
        .filter-opt { display:flex;align-items:center;gap:8px;padding:6px 0;font-size:.85rem;color:var(--dark);cursor:pointer;width:100%; }
        .filter-opt input { accent-color:var(--primary);cursor:pointer;flex-shrink:0;width:16px;height:16px;min-width:16px; }
        .filter-opt span { flex:1;overflow:visible;white-space:normal;word-break:break-word;line-height:1.4; }

        /* Mobile filter drawer */
        .mobile-filter-overlay { display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;animation:fadeIn .2s ease; }
        .mobile-filter-drawer { position:absolute;left:0;top:0;bottom:0;width:min(320px,90vw);background:#fff;display:flex;flex-direction:column;box-shadow:var(--shadow-lg);animation:slideIn .3s ease; }

        /* Skeletons */
        .skeleton-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px; }
        .skeleton-card { background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px;height:300px; }
        @keyframes shimmer{to{background-position:-200% 0;}}

        /* Empty */
        .no-products { text-align:center;padding:60px 20px;background:#fff;border-radius:10px; }
        .no-products h3 { font-size:1.2rem;margin:12px 0 6px; }
        .no-products p { color:var(--gray-400);margin-bottom:20px; }

        /* Pagination */
        .pagination { display:flex;justify-content:center;gap:5px;margin-top:24px;flex-wrap:wrap; }
        .pg-btn { padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:6px;background:#fff;cursor:pointer;font-size:.82rem;transition:var(--transition); }
        .pg-btn:hover:not(:disabled) { border-color:var(--primary);color:var(--primary); }
        .pg-btn.active { background:var(--primary);color:#fff;border-color:var(--primary); }
        .pg-btn:disabled { opacity:.4;cursor:not-allowed; }

        /* Responsive */
        @media(max-width:768px) {
          .desktop-sidebar { display:none; }
          .mobile-filter-overlay { display:block; }
          .products-body { gap:0; }
        }
        @media(max-width:480px) {
          .products-toolbar { padding:8px 10px; }
          .result-count { font-size:.78rem; }
          .sort-select { font-size:.78rem;padding:6px 8px; }
          .filter-toggle { padding:6px 10px;font-size:.8rem; }
        }
      `}</style>
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <button className="chip" onClick={onRemove}>
      {label} <span className="chip-x">×</span>
    </button>
  )
}

function FilterSection({ title, children, last }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="filter-section" style={last ? { borderBottom:'none' } : {}}>
      <button className="filter-section-title" onClick={() => setOpen(!open)}>
        <span style={{ flex:1, textAlign:'left' }}>{title}</span>
        {open ? <FiChevronUp size={13}/> : <FiChevronDown size={13}/>}
      </button>
      {open && <div style={{ width:'100%' }}>{children}</div>}
    </div>
  )
}
