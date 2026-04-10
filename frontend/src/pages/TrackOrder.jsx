import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { FiSearch, FiTruck, FiPackage, FiMapPin, FiClock } from 'react-icons/fi'

const fmt  = n => '₹' + Number(n).toLocaleString('en-IN')
const STEPS = ['Processing','Confirmed','Shipped','Out for Delivery','Delivered']

export default function TrackOrder() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [num,    setNum]    = useState('')
  const [order,  setOrder]  = useState(null)
  const [loading,setLoading]= useState(false)
  const [error,  setError]  = useState('')

  const search = async e => {
    e.preventDefault(); if (!num.trim()) return
    if (!user) { navigate('/login'); return }
    setLoading(true); setError(''); setOrder(null)
    try {
      const {data} = await api.get('/orders/my')
      const found = data.orders.find(o => o.orderNumber?.toLowerCase()===num.trim().toLowerCase() || o._id===num.trim())
      if (found) setOrder(found)
      else setError('No order found with this number. Please check and try again.')
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const step = order ? STEPS.indexOf(order.orderStatus) : -1

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <div className="to-hero">
          <FiTruck size={44} color="var(--primary)"/>
          <h1>Track Your Order</h1>
          <p>Enter your order number to get real-time delivery updates</p>
        </div>

        <div className="card card-body to-search-box">
          <form onSubmit={search}>
            <label className="form-label" style={{fontSize:'.95rem',fontWeight:600}}>Order Number</label>
            <p style={{fontSize:'.82rem',color:'var(--gray-400)',marginBottom:10}}>Find it in My Orders. Format: <strong>SK12345678</strong></p>
            <div className="to-inp-row">
              <input className="form-input" placeholder="e.g. SK12345678" value={num} onChange={e=>setNum(e.target.value)} style={{flex:1}}/>
              <button type="submit" className="btn btn-primary" disabled={loading}><FiSearch size={16}/> {loading?'Searching...':'Track'}</button>
            </div>
          </form>
          {!user && <div style={{marginTop:12,padding:10,background:'var(--primary-light)',borderRadius:7,fontSize:'.82rem',color:'var(--primary)'}}>💡 <Link to="/login" style={{fontWeight:700}}>Login</Link> to track your orders easily.</div>}
        </div>

        {error && <div style={{background:'#ffebee',border:'1px solid #ffcdd2',borderRadius:8,padding:14,marginTop:16,color:'var(--accent)',fontSize:'.875rem'}}>❌ {error}</div>}

        {order && (
          <div className="card card-body to-result animate-fade">
            <div className="to-res-head">
              <div><h2>#{order.orderNumber}</h2><p>{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p></div>
              <span className="to-status">{order.orderStatus}</span>
            </div>

            {order.orderStatus!=='Cancelled' && (
              <div className="to-track-bar">
                {STEPS.map((s,i)=>(
                  <div key={s} className={`to-step ${i<=step?'done':''} ${i===step?'current':''}`}>
                    <div className="to-dot">{i<step?'✓':i===step?<FiClock size={14}/>:<span className="to-empty"/>}</div>
                    <span>{s}</span>
                    {i<STEPS.length-1 && <div className={`to-line ${i<step?'filled':''}`}/>}
                  </div>
                ))}
              </div>
            )}

            <div className="to-items">
              {order.orderItems.map(item=>(
                <div key={item._id} className="to-item">
                  <img src={item.image} alt={item.name} onError={e=>e.target.src='https://via.placeholder.com/56'}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontWeight:600,fontSize:'.875rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</p>
                    <p style={{fontSize:'.78rem',color:'var(--gray-400)',marginTop:2}}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{fontWeight:700,flexShrink:0}}>{fmt(item.price*item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="to-addr">
              <FiMapPin size={15} color="var(--primary)" style={{flexShrink:0}}/>
              <div style={{fontSize:'.82rem'}}>
                <strong>Delivering to:</strong> {order.shippingAddress.name}, {order.shippingAddress.phone}
                <p style={{color:'var(--gray-600)'}}>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              </div>
            </div>

            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:4}}>
              <Link to={`/orders/${order._id}`} className="btn btn-primary btn-sm">View Full Details</Link>
              <Link to="/orders" className="btn btn-ghost btn-sm">All Orders</Link>
            </div>
          </div>
        )}

        {user && !order && !error && (
          <div style={{textAlign:'center',background:'#fff',borderRadius:12,padding:48,marginTop:16,boxShadow:'var(--shadow-sm)'}}>
            <FiPackage size={36} color="var(--gray-300)"/>
            <h3 style={{marginTop:12,marginBottom:6}}>View All Your Orders</h3>
            <p style={{color:'var(--gray-400)',fontSize:'.875rem',marginBottom:16}}>Easily track all orders from your orders page</p>
            <Link to="/orders" className="btn btn-primary">Go to My Orders</Link>
          </div>
        )}
      </div>

      <style>{`
        .to-hero{text-align:center;padding:36px 20px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}
        .to-hero h1{font-size:1.8rem;font-weight:800}.to-hero p{color:var(--gray-400)}
        .to-search-box{max-width:600px;margin:0 auto 16px}
        .to-inp-row{display:flex;gap:10px;flex-wrap:wrap}
        .to-result{display:flex;flex-direction:column;gap:14px;margin-top:16px}
        .to-res-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px}
        .to-res-head h2{font-size:1.1rem;font-weight:700}.to-res-head p{font-size:.78rem;color:var(--gray-400)}
        .to-status{padding:5px 12px;background:#e3f2fd;color:var(--primary);border-radius:20px;font-size:.82rem;font-weight:700}
        .to-track-bar{display:flex;align-items:flex-start;overflow-x:auto;padding:4px 0 8px;scrollbar-width:none;gap:0}
        .to-track-bar::-webkit-scrollbar{display:none}
        .to-step{display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;min-width:68px;position:relative}
        .to-dot{width:36px;height:36px;border-radius:50%;background:var(--gray-200);display:flex;align-items:center;justify-content:center;color:var(--gray-400);font-weight:700;font-size:.82rem;z-index:1;flex-shrink:0}
        .to-step.done .to-dot{background:var(--success);color:#fff}
        .to-step.current .to-dot{background:var(--primary);color:#fff;box-shadow:0 0 0 4px rgba(40,116,240,.15)}
        .to-empty{width:8px;height:8px;border-radius:50%;background:var(--gray-400)}
        .to-step span{font-size:.65rem;text-align:center;color:var(--gray-400);line-height:1.3;padding:0 3px}
        .to-step.done span,.to-step.current span{color:var(--dark);font-weight:600}
        .to-line{position:absolute;top:18px;left:calc(50% + 18px);width:calc(100% - 36px);height:3px;background:var(--gray-200)}
        .to-line.filled{background:var(--success)}
        .to-items{display:flex;flex-direction:column;gap:0;border:1px solid var(--gray-200);border-radius:8px;overflow:hidden}
        .to-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--gray-100)}
        .to-item:last-child{border-bottom:none}
        .to-item img{width:52px;height:52px;object-fit:contain;border-radius:6px;background:var(--gray-100);padding:3px;flex-shrink:0}
        .to-addr{display:flex;gap:8px;align-items:flex-start;background:var(--gray-100);border-radius:7px;padding:12px}
        @media(max-width:600px){.to-hero h1{font-size:1.4rem}.to-inp-row .btn{width:100%}.to-inp-row input{width:100%}}
        @media(max-width:400px){.to-step span{display:none}.to-dot{width:30px;height:30px}.to-line{top:15px;left:calc(50% + 15px);width:calc(100% - 30px)}}
      `}</style>
    </div>
  )
}
