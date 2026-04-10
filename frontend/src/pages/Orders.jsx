import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi'

const fmt = n => '₹' + Number(n).toLocaleString('en-IN')

const STATUS_STYLE = {
  Processing:         { bg:'#fff3e0', color:'#e65100' },
  Confirmed:          { bg:'#e3f2fd', color:'#0277bd' },
  Shipped:            { bg:'#e8eaf6', color:'#3949ab' },
  'Out for Delivery': { bg:'#f3e5f5', color:'#7b1fa2' },
  Delivered:          { bg:'#e8f5e9', color:'#2e7d32' },
  Cancelled:          { bg:'#ffebee', color:'#c62828' },
  Returned:           { bg:'#fbe9e7', color:'#bf360c' },
}

export default function Orders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my').then(({data}) => setOrders(data.orders||[])).catch(()=>setOrders([])).finally(()=>setLoading(false))
  }, [])

  if (loading) return <div className="page-wrapper" style={{display:'flex',justifyContent:'center',paddingTop:60}}><div className="spinner"/></div>

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <h1 className="ord-h1"><FiPackage size={20}/> My Orders</h1>

        {orders.length === 0 ? (
          <div className="ord-empty">
            <FiShoppingBag size={52} color="var(--gray-300)"/>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="ord-list">
            {orders.map(order => {
              const s = STATUS_STYLE[order.orderStatus] || STATUS_STYLE.Processing
              return (
                <Link to={`/orders/${order._id}`} key={order._id} className="ord-card">
                  <div className="oc-head">
                    <div className="oc-info">
                      <span className="oc-num">#{order.orderNumber}</span>
                      <span className="oc-date">{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </div>
                    <span className="oc-status" style={{background:s.bg,color:s.color}}>{order.orderStatus}</span>
                  </div>
                  <div className="oc-items">
                    {order.orderItems.slice(0,3).map(item => (
                      <div key={item._id} className="oc-item">
                        <img src={item.image} alt={item.name} onError={e=>e.target.src='https://via.placeholder.com/44'}/>
                        <span className="oc-item-name">{item.name}</span>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && <span className="oc-more">+{order.orderItems.length-3} more</span>}
                  </div>
                  <div className="oc-foot">
                    <span className="oc-total">{fmt(order.totalPrice)}</span>
                    <span className="oc-view">View Details <FiChevronRight size={14}/></span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .ord-h1 { font-size:1.3rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px; }
        .ord-empty { text-align:center;padding:64px 20px;background:#fff;border-radius:12px;display:flex;flex-direction:column;align-items:center;gap:10px; }
        .ord-empty h3 { font-size:1.2rem;font-weight:700; }
        .ord-empty p { color:var(--gray-400);font-size:.875rem; }
        .ord-list { display:flex;flex-direction:column;gap:10px; }
        .ord-card { background:#fff;border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;box-shadow:var(--shadow-sm);border:1.5px solid var(--gray-200);color:var(--dark);transition:var(--transition); }
        .ord-card:hover { box-shadow:var(--shadow-md);border-color:var(--primary); }
        .oc-head { display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px; }
        .oc-num { font-weight:700;font-size:.95rem; }
        .oc-date { font-size:.78rem;color:var(--gray-400);margin-left:8px; }
        .oc-status { padding:3px 10px;border-radius:20px;font-size:.75rem;font-weight:700;white-space:nowrap; }
        .oc-items { display:flex;gap:8px;align-items:center;flex-wrap:wrap; }
        .oc-item { display:flex;align-items:center;gap:6px;max-width:180px; }
        .oc-item img { width:40px;height:40px;object-fit:contain;border-radius:6px;background:var(--gray-100);flex-shrink:0; }
        .oc-item-name { font-size:.78rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .oc-more { font-size:.75rem;color:var(--gray-400);white-space:nowrap; }
        .oc-foot { display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid var(--gray-100); }
        .oc-total { font-weight:700;font-size:.95rem; }
        .oc-view { display:flex;align-items:center;gap:3px;font-size:.82rem;color:var(--primary);font-weight:600; }
        @media(max-width:480px) {
          .ord-card{padding:12px;}
          .oc-item{max-width:130px;}
          .oc-num{font-size:.875rem;}
        }
        @media(max-width:360px) {
          .oc-item-name{display:none;}
          .oc-item{max-width:unset;}
        }
      `}</style>
    </div>
  )
}
