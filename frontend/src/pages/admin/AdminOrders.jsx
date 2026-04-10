import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { FiEdit2, FiEye, FiShoppingBag } from 'react-icons/fi'

const fmt = n => '₹' + Number(n).toLocaleString('en-IN')

const STATUS_OPTS = ['Processing','Confirmed','Shipped','Out for Delivery','Delivered','Cancelled','Returned']
const STATUS_STYLE = {
  Processing:         { bg:'#fff3e0', color:'#e65100' },
  Confirmed:          { bg:'#e3f2fd', color:'#0277bd' },
  Shipped:            { bg:'#e8eaf6', color:'#3949ab' },
  'Out for Delivery': { bg:'#f3e5f5', color:'#7b1fa2' },
  Delivered:          { bg:'#e8f5e9', color:'#2e7d32' },
  Cancelled:          { bg:'#ffebee', color:'#c62828' },
  Returned:           { bg:'#fbe9e7', color:'#bf360c' },
}

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([])
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState(1)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [params,  setParams]  = useSearchParams()

  const page   = parseInt(params.get('page')||'1')
  const filter = params.get('status')||''

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ page, limit:10, ...(filter && { status:filter }) })
      const {data} = await api.get(`/orders/admin/all?${q}`)
      setOrders(data.orders||[])
      setTotal(data.total||0)
      setPages(data.pages||1)
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }, [page, filter])

  useEffect(() => { fetch() }, [fetch])

  const updateStatus = async (id, status) => {
    try { await api.put(`/orders/admin/${id}/status`, {status}); toast.success('Status updated'); setEditing(null); fetch() }
    catch { toast.error('Failed to update') }
  }

  const setFilter = s => { const p=new URLSearchParams(params); if(s) p.set('status',s); else p.delete('status'); p.delete('page'); setParams(p) }

  return (
    <div className="animate-fade">
      <div className="ao-header">
        <h1>Orders <span className="ao-count">{total}</span></h1>
      </div>

      {/* Filter pills */}
      <div className="ao-filters">
        <button className={`ao-pill ${!filter?'active':''}`} onClick={()=>setFilter('')}>All</button>
        {STATUS_OPTS.map(s=>(
          <button key={s} className={`ao-pill ${filter===s?'active':''}`} onClick={()=>setFilter(s)}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="spinner"/></div>
      ) : orders.length===0 ? (
        <div style={{textAlign:'center',padding:60,background:'#fff',borderRadius:12}}>
          <FiShoppingBag size={48} color="var(--gray-300)"/>
          <h3 style={{marginTop:12}}>No orders found</h3>
        </div>
      ) : (
        <div className="table-wrapper ao-table">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const s = STATUS_STYLE[o.orderStatus]||STATUS_STYLE.Processing
                return (
                  <tr key={o._id}>
                    <td><span style={{fontWeight:700,color:'var(--primary)'}}>#{o.orderNumber}</span></td>
                    <td>
                      <div style={{fontWeight:600,fontSize:'.85rem'}}>{o.user?.name||'N/A'}</div>
                      <div style={{fontSize:'.72rem',color:'var(--gray-400)'}}>{o.user?.email}</div>
                    </td>
                    <td style={{fontSize:'.82rem'}}>{o.orderItems.length} item(s)</td>
                    <td style={{fontWeight:700}}>{fmt(o.totalPrice)}</td>
                    <td>
                      <div style={{fontSize:'.82rem'}}>{o.paymentMethod}</div>
                      <div style={{fontSize:'.72rem',color:o.paymentStatus==='Paid'?'var(--success)':'var(--warning)'}}>{o.paymentStatus}</div>
                    </td>
                    <td>
                      {editing===o._id ? (
                        <select className="form-input" style={{padding:'5px 8px',fontSize:'.78rem',minWidth:140}}
                          defaultValue={o.orderStatus}
                          onChange={e=>updateStatus(o._id,e.target.value)}
                          onBlur={()=>setEditing(null)} autoFocus>
                          {STATUS_OPTS.map(st=><option key={st}>{st}</option>)}
                        </select>
                      ) : (
                        <span className="ao-status" style={{background:s.bg,color:s.color}}>{o.orderStatus}</span>
                      )}
                    </td>
                    <td style={{fontSize:'.78rem',color:'var(--gray-400)',whiteSpace:'nowrap'}}>
                      {new Date(o.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <div style={{display:'flex',gap:5}}>
                        <Link to={`/orders/${o._id}`} target="_blank" className="act-btn view"><FiEye size={13}/></Link>
                        <button className="act-btn edit" onClick={()=>setEditing(o._id)}><FiEdit2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages>1 && (
        <div style={{display:'flex',justifyContent:'center',gap:5,marginTop:16,flexWrap:'wrap'}}>
          <button className="pg-btn" disabled={page===1} onClick={()=>{const p=new URLSearchParams(params);p.set('page',page-1);setParams(p)}}>← Prev</button>
          {[...Array(pages)].map((_,i)=>(
            <button key={i} className={`pg-btn ${page===i+1?'active':''}`}
              onClick={()=>{const p=new URLSearchParams(params);p.set('page',i+1);setParams(p)}}>{i+1}</button>
          ))}
          <button className="pg-btn" disabled={page===pages} onClick={()=>{const p=new URLSearchParams(params);p.set('page',page+1);setParams(p)}}>Next →</button>
        </div>
      )}

      <style>{`
        .ao-header { display:flex;align-items:center;gap:10px;margin-bottom:14px; }
        .ao-header h1 { font-size:1.3rem;font-weight:800;display:flex;align-items:center;gap:8px; }
        .ao-count { background:var(--primary);color:#fff;font-size:.75rem;font-weight:700;padding:2px 8px;border-radius:20px; }
        .ao-filters { display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px; }
        .ao-pill { padding:5px 12px;border-radius:20px;border:1.5px solid var(--gray-200);background:#fff;font-size:.78rem;font-weight:600;cursor:pointer;transition:.15s;color:var(--gray-800);white-space:nowrap; }
        .ao-pill:hover { border-color:var(--primary);color:var(--primary); }
        .ao-pill.active { background:var(--primary);color:#fff;border-color:var(--primary); }
        .ao-table { background:#fff;border-radius:12px;box-shadow:var(--shadow-sm); }
        .ao-status { padding:3px 8px;border-radius:20px;font-size:.72rem;font-weight:700;white-space:nowrap; }
        .act-btn { width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:.15s;flex-shrink:0; }
        .act-btn.view { background:#e3f2fd;color:#1565c0; }
        .act-btn.edit { background:#f3e5f5;color:#6a1b9a; }
        .act-btn:hover { opacity:.8; }
        .pg-btn { padding:7px 11px;border:1.5px solid var(--gray-200);border-radius:6px;background:#fff;cursor:pointer;font-size:.82rem;transition:.15s; }
        .pg-btn:hover:not(:disabled) { border-color:var(--primary);color:var(--primary); }
        .pg-btn.active { background:var(--primary);color:#fff;border-color:var(--primary); }
        .pg-btn:disabled { opacity:.4;cursor:not-allowed; }
        @media(max-width:600px) { .ao-filters{gap:4px;} .ao-pill{font-size:.72rem;padding:4px 8px;} }
      `}</style>
    </div>
  )
}
