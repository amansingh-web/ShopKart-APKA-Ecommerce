import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi'

const fmt = n => '₹' + Number(n).toLocaleString('en-IN')

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => { api.get(`/orders/${id}`).then(({data}) => setOrder(data.order)).catch(()=>{}) }, [id])

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="os-box animate-scale">
          <div className="os-icon"><FiCheckCircle size={52} color="var(--success)"/></div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with ShopKart! 🎉</p>

          {order && (
            <div className="os-details">
              <div className="os-row"><span>Order Number</span><strong>#{order.orderNumber}</strong></div>
              <div className="os-row"><span>Total Amount</span><strong>{fmt(order.totalPrice)}</strong></div>
              <div className="os-row"><span>Payment</span><strong>{order.paymentMethod}</strong></div>
              <div className="os-row"><span>Status</span><span className="os-status">{order.orderStatus}</span></div>
            </div>
          )}

          <div className="os-btns">
            <Link to={`/orders/${id}`} className="btn btn-primary">
              <FiPackage size={15}/> View Order Details
            </Link>
            <Link to="/products" className="btn btn-ghost">
              Continue Shopping <FiArrowRight size={15}/>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .os-box { text-align:center;background:#fff;border-radius:16px;padding:48px 32px;max-width:480px;margin:0 auto;box-shadow:var(--shadow-lg);display:flex;flex-direction:column;align-items:center;gap:12px; }
        .os-icon { width:88px;height:88px;background:#e8f5e9;border-radius:50%;display:flex;align-items:center;justify-content:center; }
        .os-box h1 { font-size:1.4rem;font-weight:800;color:var(--success); }
        .os-box>p { color:var(--gray-600);font-size:.9rem; }
        .os-details { width:100%;background:var(--gray-100);border-radius:10px;padding:16px;text-align:left;display:flex;flex-direction:column;gap:0; }
        .os-row { display:flex;justify-content:space-between;align-items:center;padding:7px 0;font-size:.875rem;border-bottom:1px solid var(--gray-200); }
        .os-row:last-child{border-bottom:none;}
        .os-row span:first-child{color:var(--gray-600);}
        .os-status { background:#e8f5e9;color:var(--success);padding:2px 10px;border-radius:20px;font-size:.75rem;font-weight:700; }
        .os-btns { display:flex;gap:10px;flex-wrap:wrap;justify-content:center;width:100%; }
        .os-btns .btn { flex:1;min-width:140px;justify-content:center; }
        @media(max-width:480px) { .os-box{padding:32px 16px;} .os-box h1{font-size:1.2rem;} .os-btns{flex-direction:column;} }
      `}</style>
    </div>
  )
}
