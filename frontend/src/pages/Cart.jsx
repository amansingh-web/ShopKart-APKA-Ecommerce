import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi'

const fmt = n => '₹' + Number(n).toLocaleString('en-IN')

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, shippingCost, taxAmount, cartTotal } = useCart()
  const { user }   = useAuth()
  const navigate   = useNavigate()

  if (cartItems.length === 0) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-cart animate-fade">
          <div className="empty-icon"><FiShoppingBag size={56} color="var(--gray-300)"/></div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      </div>
      <style>{`.empty-cart{text-align:center;padding:64px 20px;background:#fff;border-radius:12px;display:flex;flex-direction:column;align-items:center;gap:12px;}.empty-icon{width:96px;height:96px;background:var(--gray-100);border-radius:50%;display:flex;align-items:center;justify-content:center;}.empty-cart h2{font-size:1.4rem;font-weight:700;}.empty-cart p{color:var(--gray-400);}`}</style>
    </div>
  )

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <h1 className="cart-h1">Shopping Cart <span className="cart-count">({cartItems.length} item{cartItems.length>1?'s':''})</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items-col">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <Link to={`/products/${item._id}`} className="ci-img">
                  <img src={item.image} alt={item.name} onError={e=>e.target.src='https://via.placeholder.com/100'}/>
                </Link>
                <div className="ci-body">
                  <Link to={`/products/${item._id}`} className="ci-name">{item.name}</Link>
                  <div className="ci-price">{fmt(item.price)}</div>
                  {item.originalPrice > item.price && (
                    <div className="ci-saving">Save {fmt(item.originalPrice - item.price)}</div>
                  )}
                  <div className="ci-row">
                    <div className="qty-ctrl">
                      <button onClick={() => updateQuantity(item._id, item.quantity-1)}><FiMinus size={12}/></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity+1)} disabled={item.quantity>=item.stock}><FiPlus size={12}/></button>
                    </div>
                    <button className="ci-remove" onClick={() => removeFromCart(item._id)}>
                      <FiTrash2 size={13}/> <span className="ci-remove-txt">Remove</span>
                    </button>
                  </div>
                </div>
                <div className="ci-total">{fmt(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary-col">
            <div className="summary-box">
              <h3>Order Summary</h3>
              <div className="s-row"><span>Price ({cartItems.reduce((a,i)=>a+i.quantity,0)} items)</span><span>{fmt(cartSubtotal)}</span></div>
              <div className="s-row"><span>Delivery</span><span className={shippingCost===0?'s-free':''}>{shippingCost===0?'FREE':fmt(shippingCost)}</span></div>
              <div className="s-row"><span>GST (18%)</span><span>{fmt(taxAmount)}</span></div>
              {shippingCost === 0 && <div className="s-saving">🎉 Free delivery on this order!</div>}
              <div className="s-total"><span>Total Amount</span><span>{fmt(cartTotal)}</span></div>
              <button className="btn btn-primary s-btn"
                onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=/checkout')}>
                Proceed to Checkout <FiArrowRight size={15}/>
              </button>
              <p className="s-secure">🔒 Secure 256-bit SSL Checkout</p>
            </div>
            <div className="s-continue">
              <Link to="/products">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-h1 { font-size:1.3rem;font-weight:700;margin-bottom:16px; }
        .cart-count { font-size:1rem;color:var(--gray-400);font-weight:400; }
        .cart-layout { display:grid;grid-template-columns:1fr 300px;gap:16px;align-items:flex-start; }
        .cart-items-col { display:flex;flex-direction:column;gap:10px; }
        .cart-item { background:#fff;border-radius:10px;padding:14px;display:flex;gap:12px;box-shadow:var(--shadow-sm); }
        .ci-img { width:88px;height:88px;flex-shrink:0;background:var(--gray-100);border-radius:8px;overflow:hidden; }
        .ci-img img { width:100%;height:100%;object-fit:contain;padding:6px; }
        .ci-body { flex:1;min-width:0;display:flex;flex-direction:column;gap:5px; }
        .ci-name { font-size:.875rem;font-weight:500;color:var(--dark);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block; }
        .ci-name:hover { color:var(--primary); }
        .ci-price { font-size:.95rem;font-weight:700; }
        .ci-saving { font-size:.72rem;color:var(--success);font-weight:600; }
        .ci-row { display:flex;align-items:center;gap:10px;margin-top:4px;flex-wrap:wrap; }
        .qty-ctrl { display:flex;align-items:center;border:1.5px solid var(--gray-200);border-radius:7px;overflow:hidden; }
        .qty-ctrl button { width:28px;height:28px;border:none;background:var(--gray-100);cursor:pointer;display:flex;align-items:center;justify-content:center; }
        .qty-ctrl button:disabled { opacity:.4;cursor:not-allowed; }
        .qty-ctrl span { width:32px;text-align:center;font-weight:700;font-size:.85rem; }
        .ci-remove { display:flex;align-items:center;gap:4px;color:var(--accent);background:none;border:none;font-size:.8rem;cursor:pointer;font-weight:600;padding:4px 8px;border-radius:5px; }
        .ci-remove:hover { background:#fff0f0; }
        .ci-total { font-size:.95rem;font-weight:700;flex-shrink:0;align-self:center; }
        .cart-summary-col { position:sticky;top:80px; }
        .summary-box { background:#fff;border-radius:10px;padding:18px;box-shadow:var(--shadow-sm); }
        .summary-box h3 { font-size:.85rem;font-weight:700;text-transform:uppercase;color:var(--gray-400);letter-spacing:.5px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--gray-200); }
        .s-row { display:flex;justify-content:space-between;padding:7px 0;font-size:.875rem; }
        .s-free { color:var(--success);font-weight:600; }
        .s-saving { background:#e8f5e9;color:var(--success);padding:7px 10px;border-radius:6px;font-size:.78rem;font-weight:600;margin:6px 0; }
        .s-total { display:flex;justify-content:space-between;font-size:1rem;font-weight:700;padding:12px 0 0;margin-top:8px;border-top:2px dashed var(--gray-200); }
        .s-btn { width:100%;justify-content:center;margin-top:14px;padding:12px; }
        .s-secure { text-align:center;font-size:.75rem;color:var(--gray-400);margin-top:8px; }
        .s-continue { text-align:center;margin-top:10px;font-size:.85rem; }
        .s-continue a { color:var(--primary);font-weight:600; }
        @media(max-width:900px) { .cart-layout{grid-template-columns:1fr;} .cart-summary-col{position:static;} }
        @media(max-width:600px) {
          .cart-item{padding:10px;gap:10px;}
          .ci-img{width:72px;height:72px;}
          .ci-total{display:none;}
          .ci-remove-txt{display:none;}
        }
        @media(max-width:360px) { .ci-img{width:60px;height:60px;} .ci-name{font-size:.8rem;} }
      `}</style>
    </div>
  )
}
