import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { FiMapPin, FiCreditCard, FiCheckCircle, FiChevronLeft, FiPlus } from 'react-icons/fi'

const fmt = n => '₹' + Number(n).toLocaleString('en-IN')

const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal']

const PAY_OPTS = [
  { v:'COD',        icon:'💰', label:'Cash on Delivery',  desc:'Pay when your order arrives' },
  { v:'UPI',        icon:'📱', label:'UPI',                desc:'PhonePe, GPay, Paytm, BHIM' },
  { v:'Card',       icon:'💳', label:'Credit/Debit Card',  desc:'Visa, Mastercard, RuPay' },
  { v:'NetBanking', icon:'🏦', label:'Net Banking',        desc:'All major banks supported' },
]

export default function Checkout() {
  const { cartItems, cartSubtotal, shippingCost, taxAmount, cartTotal, clearCart } = useCart()
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const [step,      setStep]      = useState(1)
  const [loading,   setLoading]   = useState(false)
  const [savedAddrs,setSavedAddrs]= useState([])
  const [useExisting,setUseExist] = useState(null) // index of saved addr

  const [addr, setAddr] = useState({ name:user?.name||'', phone:'', street:'', city:'', state:'Gujarat', pincode:'' })
  const [errors,  setErrors]  = useState({})
  const [payment, setPayment] = useState('COD')

  // Load saved addresses
  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      const addrs = data.user.addresses || []
      setSavedAddrs(addrs)
      // Auto-select default address
      const def = addrs.find(a => a.isDefault)
      if (def) {
        setUseExist(addrs.indexOf(def))
        setAddr({ name:def.name, phone:def.phone, street:def.street, city:def.city, state:def.state, pincode:def.pincode })
      }
    }).catch(() => {})
  }, [])

  const selectSavedAddr = (index) => {
    const a = savedAddrs[index]
    setUseExist(index)
    setAddr({ name:a.name, phone:a.phone, street:a.street, city:a.city, state:a.state, pincode:a.pincode })
    setErrors({})
  }

  const validateAddr = () => {
    const e = {}
    if (!addr.name.trim())                   e.name    = 'Name required'
    if (!addr.phone.match(/^[6-9]\d{9}$/))   e.phone   = 'Valid 10-digit mobile number'
    if (!addr.street.trim())                  e.street  = 'Street address required'
    if (!addr.city.trim())                    e.city    = 'City required'
    if (!addr.pincode.match(/^\d{6}$/))       e.pincode = 'Valid 6-digit pincode'
    setErrors(e)
    return !Object.keys(e).length
  }

  const placeOrder = async () => {
    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems.map(i => ({ product:i._id, name:i.name, image:i.image, price:i.price, quantity:i.quantity })),
        shippingAddress: addr,
        paymentMethod:   payment,
        itemsPrice:      cartSubtotal,
        shippingPrice:   shippingCost,
        taxPrice:        taxAmount,
        totalPrice:      cartTotal,
      })
      clearCart()
      navigate(`/order-success/${data.order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order placement failed. Please try again.')
    } finally { setLoading(false) }
  }

  if (!cartItems.length) { navigate('/cart'); return null }

  const STEPS = ['Delivery Address', 'Payment', 'Review & Place']

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <h1 className="co-h1">Checkout</h1>

        {/* Step indicator */}
        <div className="co-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`co-step ${step === i+1 ? 'active' : ''} ${step > i+1 ? 'done' : ''}`}>
              <div className="co-step-num">{step > i+1 ? '✓' : i+1}</div>
              <span className="co-step-label">{s}</span>
            </div>
          ))}
        </div>

        <div className="co-layout">
          <div className="co-main">

            {/* ── Step 1: Address ── */}
            {step === 1 && (
              <div className="card card-body animate-fade">
                <h3 className="co-sec-title"><FiMapPin size={16}/> Delivery Address</h3>

                {/* Saved addresses */}
                {savedAddrs.length > 0 && (
                  <div className="saved-addrs">
                    <p className="saved-addrs-label">Your saved addresses:</p>
                    <div className="saved-addrs-list">
                      {savedAddrs.map((a, i) => (
                        <label key={i} className={`saved-addr-opt ${useExisting === i ? 'selected' : ''}`}>
                          <input type="radio" name="savedAddr" checked={useExisting === i} onChange={() => selectSavedAddr(i)} style={{ flexShrink:0 }}/>
                          <div>
                            {a.isDefault && <span className="saved-default">Default</span>}
                            <strong>{a.name}</strong>
                            <p>{a.phone}</p>
                            <p>{a.street}, {a.city}, {a.state} — {a.pincode}</p>
                          </div>
                        </label>
                      ))}
                      <label className={`saved-addr-opt ${useExisting === null ? 'selected' : ''}`}>
                        <input type="radio" name="savedAddr" checked={useExisting === null}
                          onChange={() => { setUseExist(null); setAddr({ name:user?.name||'', phone:'', street:'', city:'', state:'Gujarat', pincode:'' }) }}
                          style={{ flexShrink:0 }}/>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <FiPlus size={14}/> <strong>Use a new address</strong>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Address form - show if no saved or using new */}
                {(savedAddrs.length === 0 || useExisting === null) && (
                  <div className="co-form-grid">
                    {[
                      { k:'name',   l:'Full Name *',     p:'Recipient name',      half:true },
                      { k:'phone',  l:'Phone Number *',  p:'10-digit mobile',     half:true },
                      { k:'street', l:'Street Address *',p:'House no, building, street, area', full:true },
                      { k:'city',   l:'City *',          p:'City',                half:true },
                      { k:'pincode',l:'Pincode *',       p:'6-digit pincode',     half:true },
                    ].map(f => (
                      <div key={f.k} className={`form-group ${f.full ? 'co-full' : ''}`}>
                        <label className="form-label">{f.l}</label>
                        <input className={`form-input ${errors[f.k] ? 'error' : ''}`}
                          placeholder={f.p} value={addr[f.k]}
                          maxLength={f.k === 'pincode' ? 6 : undefined}
                          onChange={e => setAddr({ ...addr, [f.k]: e.target.value })}/>
                        {errors[f.k] && <span className="form-error">{errors[f.k]}</span>}
                      </div>
                    ))}
                    <div className="form-group co-full">
                      <label className="form-label">State</label>
                      <select className="form-input" value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value })}>
                        {STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <button className="btn btn-primary co-btn"
                  onClick={() => { if (validateAddr()) setStep(2) }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <div className="card card-body animate-fade">
                <h3 className="co-sec-title"><FiCreditCard size={16}/> Payment Method</h3>
                <div className="pay-opts">
                  {PAY_OPTS.map(opt => (
                    <label key={opt.v} className={`pay-opt ${payment === opt.v ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={opt.v} checked={payment === opt.v}
                        onChange={() => setPayment(opt.v)}/>
                      <div className="pay-opt-body">
                        <strong>{opt.icon} {opt.label}</strong>
                        <p>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="co-action-btns">
                  <button className="btn btn-ghost" onClick={() => setStep(1)}><FiChevronLeft size={15}/> Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div className="card card-body animate-fade">
                <h3 className="co-sec-title"><FiCheckCircle size={16}/> Review Your Order</h3>

                <div className="review-blocks">
                  <div className="review-block">
                    <h4>📦 Delivering To</h4>
                    <p><strong>{addr.name}</strong> • {addr.phone}</p>
                    <p>{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                  </div>
                  <div className="review-block">
                    <h4>💳 Payment</h4>
                    <p>{PAY_OPTS.find(o => o.v === payment)?.icon} <strong>{PAY_OPTS.find(o => o.v === payment)?.label}</strong></p>
                    <p style={{ fontSize:'.78rem', color:'var(--gray-400)' }}>{PAY_OPTS.find(o => o.v === payment)?.desc}</p>
                  </div>
                </div>

                <div className="review-items">
                  {cartItems.map(i => (
                    <div key={i._id} className="review-item">
                      <img src={i.image} alt={i.name} onError={e => e.target.src='https://via.placeholder.com/48'}/>
                      <span className="ri-name">{i.name}</span>
                      <span className="ri-qty">×{i.quantity}</span>
                      <span className="ri-price">{fmt(i.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="co-action-btns">
                  <button className="btn btn-ghost" onClick={() => setStep(2)}><FiChevronLeft size={15}/> Back</button>
                  <button className="btn btn-accent co-place-btn" onClick={placeOrder} disabled={loading}>
                    {loading ? '⏳ Placing...' : `✅ Place Order · ${fmt(cartTotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="co-summary">
            <div className="card card-body">
              <h4 className="co-sum-h">Order Summary</h4>
              <div className="co-sum-items">
                {cartItems.map(i => (
                  <div key={i._id} className="co-sum-row small">
                    <span className="co-sum-name">{i.name} ×{i.quantity}</span>
                    <span>{fmt(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="co-sum-divider"/>
              <div className="co-sum-row"><span>Subtotal</span><span>{fmt(cartSubtotal)}</span></div>
              <div className="co-sum-row">
                <span>Shipping</span>
                <span style={{ color: shippingCost === 0 ? 'var(--success)' : 'inherit', fontWeight: shippingCost===0?700:'normal' }}>
                  {shippingCost === 0 ? '🎉 FREE' : fmt(shippingCost)}
                </span>
              </div>
              <div className="co-sum-row"><span>GST (18%)</span><span>{fmt(taxAmount)}</span></div>
              <div className="co-sum-total"><span>Total</span><strong>{fmt(cartTotal)}</strong></div>
              {shippingCost === 0 && <p style={{ fontSize:'.72rem', color:'var(--success)', marginTop:6 }}>✓ Free delivery applied</p>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .co-h1 { font-size:1.3rem;font-weight:700;margin-bottom:14px; }
        .co-steps { display:flex;background:#fff;border-radius:10px;padding:14px 20px;margin-bottom:14px;box-shadow:var(--shadow-sm);overflow-x:auto;gap:0; }
        .co-step { display:flex;align-items:center;gap:7px;flex:1;font-size:.82rem;color:var(--gray-400);min-width:90px; }
        .co-step-num { width:26px;height:26px;border-radius:50%;background:var(--gray-200);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;flex-shrink:0;transition:.2s; }
        .co-step.active .co-step-num { background:var(--primary);color:#fff; }
        .co-step.active .co-step-label { color:var(--primary);font-weight:600; }
        .co-step.done .co-step-num { background:var(--success);color:#fff; }
        .co-layout { display:grid;grid-template-columns:1fr 280px;gap:14px;align-items:flex-start; }
        .co-sec-title { font-size:.95rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:6px;padding-bottom:10px;border-bottom:1px solid var(--gray-200); }
        .saved-addrs { margin-bottom:16px; }
        .saved-addrs-label { font-size:.82rem;font-weight:600;color:var(--gray-600);margin-bottom:8px; }
        .saved-addrs-list { display:flex;flex-direction:column;gap:7px; }
        .saved-addr-opt { display:flex;align-items:flex-start;gap:10px;padding:12px;border:1.5px solid var(--gray-200);border-radius:8px;cursor:pointer;transition:.15s; }
        .saved-addr-opt.selected { border-color:var(--primary);background:var(--primary-light); }
        .saved-addr-opt strong { font-size:.875rem;display:block; }
        .saved-addr-opt p { font-size:.78rem;color:var(--gray-600);line-height:1.6; }
        .saved-default { display:inline-block;padding:1px 6px;background:#e8f5e9;color:var(--success);font-size:.65rem;font-weight:700;border-radius:3px;margin-bottom:3px; }
        .co-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px; }
        .co-full { grid-column:span 2; }
        .co-btn { width:100%;justify-content:center; }
        .co-action-btns { display:flex;gap:10px;margin-top:16px;flex-wrap:wrap; }
        .co-action-btns .btn { flex:1;justify-content:center;min-width:110px; }
        .co-place-btn { flex:2; }
        .pay-opts { display:flex;flex-direction:column;gap:8px; }
        .pay-opt { display:flex;align-items:center;gap:12px;padding:12px 14px;border:1.5px solid var(--gray-200);border-radius:8px;cursor:pointer;transition:.15s; }
        .pay-opt.selected { border-color:var(--primary);background:var(--primary-light); }
        .pay-opt-body strong { display:block;font-size:.875rem; }
        .pay-opt-body p { font-size:.75rem;color:var(--gray-400);margin-top:2px; }
        .review-blocks { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px; }
        .review-block { background:var(--gray-100);border-radius:8px;padding:12px; }
        .review-block h4 { font-size:.78rem;font-weight:700;color:var(--gray-600);text-transform:uppercase;letter-spacing:.3px;margin-bottom:6px; }
        .review-block p { font-size:.82rem;color:var(--dark);line-height:1.6; }
        .review-items { display:flex;flex-direction:column;gap:0;border:1px solid var(--gray-200);border-radius:8px;overflow:hidden; }
        .review-item { display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid var(--gray-100); }
        .review-item:last-child { border-bottom:none; }
        .review-item img { width:44px;height:44px;object-fit:contain;border-radius:6px;background:var(--gray-100);padding:3px;flex-shrink:0; }
        .ri-name { flex:1;font-size:.82rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .ri-qty { font-size:.78rem;color:var(--gray-400);flex-shrink:0; }
        .ri-price { font-weight:700;font-size:.85rem;flex-shrink:0; }
        .co-sum-h { font-size:.82rem;font-weight:700;text-transform:uppercase;color:var(--gray-400);letter-spacing:.5px;margin-bottom:12px; }
        .co-sum-items { margin-bottom:8px; }
        .co-sum-row { display:flex;justify-content:space-between;padding:6px 0;font-size:.875rem; }
        .co-sum-row.small { font-size:.78rem;color:var(--gray-600);border-bottom:1px solid var(--gray-100); }
        .co-sum-name { flex:1;padding-right:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .co-sum-divider { height:1px;background:var(--gray-200);margin:8px 0; }
        .co-sum-total { display:flex;justify-content:space-between;font-size:1rem;font-weight:700;padding-top:10px;margin-top:6px;border-top:2px dashed var(--gray-200); }
        @media(max-width:900px) { .co-layout{grid-template-columns:1fr;} .co-summary{order:-1;} }
        @media(max-width:600px) {
          .co-steps{padding:10px;gap:0;} .co-step{min-width:70px;font-size:.75rem;}
          .co-step-num{width:22px;height:22px;font-size:.68rem;}
          .co-form-grid{grid-template-columns:1fr;} .co-full{grid-column:span 1;}
          .review-blocks{grid-template-columns:1fr;}
        }
        @media(max-width:400px) {
          .co-step-label{display:none;}
          .co-steps{justify-content:space-around;gap:8px;}
          .co-action-btns{flex-direction:column;}
        }
      `}</style>
    </div>
  )
}
