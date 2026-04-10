import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/common/ConfirmModal'
import { FiPackage, FiTruck, FiXCircle, FiClock, FiMapPin, FiChevronLeft } from 'react-icons/fi'

const fmt  = n => '₹' + Number(n).toLocaleString('en-IN')
const fmtD = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })

const STEPS = ['Processing','Confirmed','Shipped','Out for Delivery','Delivered']
const SC    = { Processing:{bg:'#fff3e0',color:'#e65100'}, Confirmed:{bg:'#e3f2fd',color:'#0277bd'}, Shipped:{bg:'#e8eaf6',color:'#3949ab'}, 'Out for Delivery':{bg:'#f3e5f5',color:'#7b1fa2'}, Delivered:{bg:'#e8f5e9',color:'#2e7d32'}, Cancelled:{bg:'#ffebee',color:'#c62828'}, Returned:{bg:'#fbe9e7',color:'#bf360c'} }

export default function OrderDetail() {
  const { id }  = useParams()
  const [order,     setOrder]     = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [canceling, setCanceling] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    api.get(`/orders/${id}`).then(({data}) => setOrder(data.order)).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    setCanceling(true)
    try { const {data} = await api.put(`/orders/${id}/cancel`, {reason:'Cancelled by customer'}); setOrder(data.order); toast.success('Order cancelled') }
    catch(err) { toast.error(err.response?.data?.message||'Cannot cancel') }
    finally { setCanceling(false); setShowModal(false) }
  }

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:80}}><div className="spinner"/></div>
  if (!order)  return <div className="page-wrapper"><div className="container" style={{textAlign:'center',padding:60}}><p>Order not found.</p><Link to="/orders" className="btn btn-primary" style={{marginTop:16}}>Back to Orders</Link></div></div>

  const sc         = SC[order.orderStatus] || SC.Processing
  const cancelled  = order.orderStatus === 'Cancelled'
  const currStep   = STEPS.indexOf(order.orderStatus)
  const canCancel  = ['Processing','Confirmed'].includes(order.orderStatus)

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">

        {/* Header */}
        <div className="od-hd">
          <div>
            <Link to="/orders" className="od-back"><FiChevronLeft size={15}/> Back to Orders</Link>
            <h1 className="od-title">Order #{order.orderNumber}</h1>
            <p className="od-date">Placed on {fmtD(order.createdAt)}</p>
          </div>
          <div className="od-hd-right">
            <span className="od-badge" style={{background:sc.bg,color:sc.color}}>{order.orderStatus}</span>
            {canCancel && (
              <button className="btn btn-sm" style={{color:'var(--accent)',border:'1.5px solid var(--accent)',background:'#fff'}} onClick={()=>setShowModal(true)}>
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="od-layout">
          <div className="od-main">

            {/* Tracking */}
            {!cancelled && (
              <div className="card card-body">
                <h3 className="od-sh"><FiTruck size={15}/> Order Tracking</h3>
                <div className="od-track">
                  {STEPS.map((s,i) => (
                    <div key={s} className={`odt-step ${i<=currStep?'done':''} ${i===currStep?'curr':''}`}>
                      <div className="odt-dot">{i<currStep?'✓':i===currStep?<FiClock size={14}/>:<span style={{width:8,height:8,borderRadius:'50%',background:'var(--gray-400)',display:'block'}}/>}</div>
                      <span className="odt-label">{s}</span>
                      {i<STEPS.length-1 && <div className={`odt-line ${i<currStep?'filled':''}`}/>}
                    </div>
                  ))}
                </div>
                {order.statusHistory?.length > 0 && (
                  <div className="od-history">
                    <h4>History</h4>
                    {[...order.statusHistory].reverse().map((h,i) => (
                      <div key={i} className="odh-item">
                        <div className="odh-dot"/>
                        <div><strong>{h.status}</strong><p>{h.note}</p><span>{fmtD(h.timestamp)}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cancelled */}
            {cancelled && (
              <div className="od-cancelled">
                <FiXCircle size={26} color="var(--accent)"/>
                <div><h3>Order Cancelled</h3><p>{order.cancelReason||'Cancelled.'}</p>{order.cancelledAt&&<span>{fmtD(order.cancelledAt)}</span>}</div>
              </div>
            )}

            {/* Items */}
            <div className="card card-body">
              <h3 className="od-sh"><FiPackage size={15}/> Items ({order.orderItems.length})</h3>
              {order.orderItems.map(item => (
                <div key={item._id} className="od-item">
                  <Link to={`/products/${item.product}`} className="od-item-img">
                    <img src={item.image} alt={item.name} onError={e=>e.target.src='https://via.placeholder.com/68'}/>
                  </Link>
                  <div className="od-item-info">
                    <Link to={`/products/${item.product}`} className="od-item-name">{item.name}</Link>
                    <p className="od-item-meta">Qty: {item.quantity} × {fmt(item.price)}</p>
                  </div>
                  <div className="od-item-total">{fmt(item.price*item.quantity)}</div>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="card card-body">
              <h3 className="od-sh"><FiMapPin size={15}/> Delivery Address</h3>
              <div className="od-addr">
                <strong>{order.shippingAddress.name}</strong>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="od-sidebar">
            <div className="card card-body">
              <h3 className="od-sh">Payment</h3>
              <div className="od-pay-row"><span>Method</span><strong>{order.paymentMethod}</strong></div>
              <div className="od-pay-row">
                <span>Status</span>
                <span className={`od-pay-pill ${order.paymentStatus==='Paid'?'paid':''}`}>{order.paymentStatus}</span>
              </div>
              <hr style={{margin:'12px 0',borderColor:'var(--gray-200)'}}/>
              <h3 className="od-sh">Summary</h3>
              <div className="od-pay-row"><span>Items</span><span>{fmt(order.itemsPrice)}</span></div>
              <div className="od-pay-row"><span>Shipping</span><span style={{color:order.shippingPrice===0?'var(--success)':'inherit'}}>{order.shippingPrice===0?'FREE':fmt(order.shippingPrice)}</span></div>
              <div className="od-pay-row"><span>GST</span><span>{fmt(order.taxPrice)}</span></div>
              <div className="od-pay-total"><span>Total</span><strong>{fmt(order.totalPrice)}</strong></div>
            </div>
            <Link to="/products" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:10}}>Continue Shopping</Link>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={showModal} title="Cancel Order?" message={`Cancel order #${order.orderNumber}? This cannot be undone.`} confirmText="Yes, Cancel" confirmColor="var(--accent)" loading={canceling} onConfirm={handleCancel} onCancel={()=>setShowModal(false)}/>

      <style>{`
        .od-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;gap:10px}
        .od-back{display:inline-flex;align-items:center;gap:3px;font-size:.8rem;color:var(--primary);margin-bottom:5px}
        .od-title{font-size:1.2rem;font-weight:700}.od-date{font-size:.78rem;color:var(--gray-400);margin-top:2px}
        .od-hd-right{display:flex;flex-direction:column;align-items:flex-end;gap:7px}
        .od-badge{padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:700;white-space:nowrap}
        .od-layout{display:grid;grid-template-columns:1fr 260px;gap:14px;align-items:flex-start}
        .od-main{display:flex;flex-direction:column;gap:12px}
        .od-sidebar{position:sticky;top:80px}
        .od-sh{font-size:.9rem;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px;padding-bottom:8px;border-bottom:1px solid var(--gray-200)}
        .od-track{display:flex;align-items:flex-start;overflow-x:auto;padding:4px 0 8px;scrollbar-width:none;gap:0}
        .od-track::-webkit-scrollbar{display:none}
        .odt-step{display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;min-width:68px;position:relative}
        .odt-dot{width:34px;height:34px;border-radius:50%;background:var(--gray-200);display:flex;align-items:center;justify-content:center;color:var(--gray-400);font-weight:700;font-size:.8rem;z-index:1;flex-shrink:0}
        .odt-step.done .odt-dot{background:var(--success);color:#fff}
        .odt-step.curr .odt-dot{background:var(--primary);color:#fff;box-shadow:0 0 0 4px rgba(40,116,240,.15)}
        .odt-label{font-size:.65rem;text-align:center;color:var(--gray-400);line-height:1.3;padding:0 3px}
        .odt-step.done .odt-label,.odt-step.curr .odt-label{color:var(--dark);font-weight:600}
        .odt-line{position:absolute;top:17px;left:calc(50% + 17px);width:calc(100% - 34px);height:3px;background:var(--gray-200)}
        .odt-line.filled{background:var(--success)}
        .od-history{border-top:1px solid var(--gray-200);margin-top:14px;padding-top:12px}
        .od-history h4{font-size:.75rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px}
        .odh-item{display:flex;gap:10px;padding:5px 0 5px 14px;border-left:2px solid var(--gray-200);margin-left:6px;position:relative}
        .odh-dot{width:9px;height:9px;border-radius:50%;background:var(--primary);position:absolute;left:-5.5px;top:10px;flex-shrink:0}
        .odh-item strong{font-size:.82rem;display:block}
        .odh-item p{font-size:.75rem;color:var(--gray-600);margin:1px 0}
        .odh-item span{font-size:.68rem;color:var(--gray-400)}
        .od-cancelled{background:#fff5f5;border:1.5px solid #ffcdd2;border-radius:10px;padding:16px;display:flex;gap:12px;align-items:flex-start}
        .od-cancelled h3{color:var(--accent);font-size:.9rem;margin-bottom:3px}
        .od-cancelled p{font-size:.82rem;color:var(--gray-600)}
        .od-cancelled span{font-size:.72rem;color:var(--gray-400)}
        .od-item{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--gray-100)}
        .od-item:last-child{border-bottom:none}
        .od-item-img img{width:64px;height:64px;object-fit:contain;border-radius:7px;background:var(--gray-100);padding:4px;flex-shrink:0}
        .od-item-info{flex:1;min-width:0}
        .od-item-name{font-size:.875rem;font-weight:500;color:var(--dark);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .od-item-name:hover{color:var(--primary)}
        .od-item-meta{font-size:.75rem;color:var(--gray-400);margin-top:3px}
        .od-item-total{font-weight:700;font-size:.9rem;flex-shrink:0;white-space:nowrap}
        .od-addr{background:var(--gray-100);border-radius:7px;padding:12px;font-size:.875rem;line-height:1.8}
        .od-addr strong{font-size:.9rem}
        .od-pay-row{display:flex;justify-content:space-between;padding:6px 0;font-size:.875rem}
        .od-pay-pill{padding:2px 8px;border-radius:20px;font-size:.72rem;font-weight:700;background:#fff3e0;color:var(--warning)}
        .od-pay-pill.paid{background:#e8f5e9;color:var(--success)}
        .od-pay-total{display:flex;justify-content:space-between;font-size:1rem;font-weight:700;padding-top:10px;margin-top:6px;border-top:2px dashed var(--gray-200)}
        @media(max-width:900px){.od-layout{grid-template-columns:1fr}.od-sidebar{position:static}}
        @media(max-width:600px){.od-title{font-size:1rem}.od-hd-right{align-items:flex-start}.od-item-img img{width:52px;height:52px}.od-item-total{font-size:.82rem}}
        @media(max-width:400px){.odt-label{display:none}.odt-dot{width:28px;height:28px}.odt-line{top:14px;left:calc(50% + 14px);width:calc(100% - 28px)}}
      `}</style>
    </div>
  )
}
