import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiPackage } from 'react-icons/fi'

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN')

export default function AdminProducts() {
  const [products,    setProducts]    = useState([])
  const [total,       setTotal]       = useState(0)
  const [pages,       setPages]       = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [searchVal,   setSearchVal]   = useState('')
  const [deleteTarget,setDeleteTarget]= useState(null) // { id, name }
  const [deleting,    setDeleting]    = useState(false)
  const [params,      setParams]      = useSearchParams()

  const page = parseInt(params.get('page') || '1')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ page, limit: 12, ...(searchVal && { search: searchVal }) })
      const { data } = await api.get(`/products?${q}`)
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [page, searchVal])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/products/${deleteTarget.id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const p = new URLSearchParams(params)
    p.delete('page')
    setParams(p)
    fetchProducts()
  }

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="ap-header">
        <div>
          <h1>Products</h1>
          <p>{total} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary">
          <FiPlus size={16}/> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="ap-toolbar">
        <form className="ap-search" onSubmit={handleSearch}>
          <FiSearch size={16} color="var(--gray-400)"/>
          <input type="text" placeholder="Search products by name, brand..."
            value={searchVal} onChange={(e) => setSearchVal(e.target.value)}/>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
          <div className="spinner"/>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', background:'#fff', borderRadius:12 }}>
          <FiPackage size={48} color="var(--gray-300)"/>
          <h3 style={{ marginTop:16 }}>No products found</h3>
          <Link to="/admin/products/add" className="btn btn-primary" style={{ marginTop:16 }}>
            <FiPlus size={14}/> Add First Product
          </Link>
        </div>
      ) : (
        <>
          <div className="table-wrapper ap-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width:56 }}>Img</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.images?.[0]?.url || 'https://via.placeholder.com/48'}
                        alt={p.name} className="prod-thumb"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48' }}
                      />
                    </td>
                    <td>
                      <div className="prod-name" title={p.name}>{p.name}</div>
                      <div className="prod-brand">{p.brand}</div>
                    </td>
                    <td><span className="cat-chip">{p.category}</span></td>
                    <td>
                      <div style={{ fontWeight:700 }}>{fmt(p.price)}</div>
                      {p.originalPrice > p.price && (
                        <div style={{ fontSize:'.7rem', color:'var(--gray-400)', textDecoration:'line-through' }}>
                          {fmt(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`stock-chip ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok'}`}>
                        {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? `Low (${p.stock})` : p.stock}
                      </span>
                    </td>
                    <td style={{ fontSize:'.82rem' }}>⭐ {Number(p.rating||0).toFixed(1)} ({p.numReviews||0})</td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        <Link to={`/products/${p._id}`} target="_blank" className="act-btn view" title="View">
                          <FiEye size={13}/>
                        </Link>
                        <Link to={`/admin/products/${p._id}`} className="act-btn edit" title="Edit">
                          <FiEdit2 size={13}/>
                        </Link>
                        <button className="act-btn del" title="Delete"
                          onClick={() => setDeleteTarget({ id: p._id, name: p.name })}>
                          <FiTrash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:20, flexWrap:'wrap' }}>
              <button className="page-btn" disabled={page === 1}
                onClick={() => { const p = new URLSearchParams(params); p.set('page', page-1); setParams(p) }}>
                ← Prev
              </button>
              {[...Array(pages)].map((_, i) => (
                <button key={i} className={`page-btn ${page === i+1 ? 'active':''}`}
                  onClick={() => { const p = new URLSearchParams(params); p.set('page', i+1); setParams(p) }}>
                  {i+1}
                </button>
              ))}
              <button className="page-btn" disabled={page === pages}
                onClick={() => { const p = new URLSearchParams(params); p.set('page', page+1); setParams(p) }}>
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Product?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="var(--accent)"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <style>{`
        .ap-header { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap;gap:10px; }
        .ap-header h1 { font-size:1.3rem;font-weight:800; }
        .ap-header p { font-size:.82rem;color:var(--gray-400);margin-top:2px; }
        .ap-toolbar { background:#fff;border-radius:10px;padding:12px 16px;margin-bottom:16px;box-shadow:var(--shadow-sm); }
        .ap-search { display:flex;align-items:center;gap:10px; }
        .ap-search input { flex:1;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:6px;font-size:.875rem;min-width:0; }
        .ap-search input:focus { border-color:var(--primary); }
        .ap-table { background:#fff;border-radius:12px;box-shadow:var(--shadow-sm); }
        .prod-thumb { width:46px;height:46px;object-fit:contain;border-radius:6px;background:var(--gray-100);padding:3px; }
        .prod-name { font-weight:600;font-size:.85rem;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .prod-brand { font-size:.72rem;color:var(--gray-400);margin-top:2px; }
        .cat-chip { padding:3px 8px;background:var(--primary-light);color:var(--primary);border-radius:6px;font-size:.7rem;font-weight:600;white-space:nowrap; }
        .stock-chip { padding:3px 8px;border-radius:6px;font-size:.72rem;font-weight:700;white-space:nowrap; }
        .stock-chip.ok  { background:#e8f5e9;color:#2e7d32; }
        .stock-chip.low { background:#fff3e0;color:#e65100; }
        .stock-chip.out { background:#ffebee;color:#c62828; }
        .act-btn { width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:var(--transition); }
        .act-btn.view { background:#e3f2fd;color:#1565c0; }
        .act-btn.edit { background:#f3e5f5;color:#6a1b9a; }
        .act-btn.del  { background:#ffebee;color:#c62828; }
        .act-btn:hover { opacity:.8;transform:scale(1.08); }
        .page-btn { padding:7px 12px;border:1.5px solid var(--gray-200);border-radius:6px;background:#fff;cursor:pointer;font-size:.82rem;transition:var(--transition); }
        .page-btn:hover:not(:disabled) { border-color:var(--primary);color:var(--primary); }
        .page-btn.active { background:var(--primary);color:#fff;border-color:var(--primary); }
        .page-btn:disabled { opacity:.4;cursor:not-allowed; }
        @media(max-width:768px) { .prod-name{max-width:140px;} .ap-search input{font-size:.82rem;} }
        @media(max-width:600px) { .ap-header { flex-direction:column; } .ap-header .btn{width:100%;justify-content:center;} }
      `}</style>
    </div>
  )
}
