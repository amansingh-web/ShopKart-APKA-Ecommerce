import { Link } from 'react-router-dom'
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiPhone } from 'react-icons/fi'

const STEPS = [
  { n:1, icon:'📦', title:'Initiate Return',  desc:'My Orders → Select item → Click "Return"' },
  { n:2, icon:'🚚', title:'Pickup Scheduled', desc:'We arrange pickup within 2 business days' },
  { n:3, icon:'🔍', title:'Item Inspected',   desc:'Quality check at our warehouse' },
  { n:4, icon:'💰', title:'Refund Processed', desc:'Refund in 5–7 business days' },
]

const CAN = [
  'Unused products in original packaging',
  'Products with all original tags intact',
  'Electronics with all accessories & manuals',
  'Clothing that has not been worn or washed',
  'Items returned within 7 days of delivery',
]

const CANNOT = [
  'Perishable / consumable goods',
  'Personal care items once opened',
  'Software, digital products & gift cards',
  'Products marked "Non-Returnable" on listing',
  'Items returned after 7 days of delivery',
  'Products damaged due to misuse',
]

const REFUND_TIMELINE = [
  { method:'UPI / Net Banking',   time:'2–3 business days' },
  { method:'Credit / Debit Card', time:'5–7 business days' },
  { method:'Cash on Delivery',    time:'7–10 business days (bank transfer)' },
]

export default function ReturnPolicy() {
  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <div className="rp-hero">
          <FiRefreshCw size={44} color="var(--primary)"/>
          <h1>Returns & Refunds</h1>
          <p>Hassle-free 7-day return policy on all eligible products</p>
        </div>

        {/* How it works */}
        <div className="card card-body rp-steps-box">
          <h2>How Returns Work</h2>
          <div className="rp-steps">
            {STEPS.map(s => (
              <div key={s.n} className="rp-step">
                <div className="rp-step-num">{s.n}</div>
                <div className="rp-step-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Can / Cannot */}
        <div className="rp-grid">
          <div className="card card-body">
            <h2 style={{color:'var(--success)',display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <FiCheckCircle size={18}/> What Can Be Returned
            </h2>
            {CAN.map((item,i) => (
              <div key={i} className="rp-list-item">
                <FiCheckCircle size={14} color="var(--success)" style={{flexShrink:0,marginTop:2}}/>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="card card-body">
            <h2 style={{color:'var(--accent)',display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <FiXCircle size={18}/> What Cannot Be Returned
            </h2>
            {CANNOT.map((item,i) => (
              <div key={i} className="rp-list-item">
                <FiXCircle size={14} color="var(--accent)" style={{flexShrink:0,marginTop:2}}/>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Refund timeline */}
        <div className="card card-body rp-timeline-box">
          <h2>Refund Timeline</h2>
          <div className="rp-timeline">
            {REFUND_TIMELINE.map(r => (
              <div key={r.method} className="rp-trow">
                <span>{r.method}</span>
                <span style={{fontWeight:700,color:'var(--success)'}}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rp-cta">
          <FiPhone size={22} color="var(--primary)"/>
          <div>
            <h3>Need help with a return?</h3>
            <p>Our support team is available 24/7 to assist you</p>
          </div>
          <Link to="/contact" className="btn btn-primary">Contact Support</Link>
        </div>
      </div>

      <style>{`
        .rp-hero{text-align:center;padding:36px 20px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}
        .rp-hero h1{font-size:1.8rem;font-weight:800}.rp-hero p{color:var(--gray-400)}
        .rp-steps-box{margin-bottom:16px}
        .rp-steps-box h2{font-size:1.1rem;font-weight:700;margin-bottom:20px}
        .rp-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .rp-step{text-align:center;padding:12px 8px;position:relative}
        .rp-step-num{position:absolute;top:0;left:50%;transform:translateX(-50%);width:22px;height:22px;background:var(--primary);color:#fff;border-radius:50%;font-size:.72rem;font-weight:700;display:flex;align-items:center;justify-content:center}
        .rp-step-icon{font-size:2rem;margin:20px auto 10px}
        .rp-step h4{font-size:.875rem;font-weight:700;margin-bottom:4px}
        .rp-step p{font-size:.78rem;color:var(--gray-400);line-height:1.5}
        .rp-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        .rp-list-item{display:flex;align-items:flex-start;gap:8px;padding:7px 0;font-size:.875rem;border-bottom:1px solid var(--gray-100)}
        .rp-list-item:last-child{border-bottom:none}
        .rp-timeline-box h2{font-size:1.1rem;font-weight:700;margin-bottom:14px}
        .rp-timeline{display:flex;flex-direction:column;gap:0}
        .rp-trow{display:flex;justify-content:space-between;align-items:center;padding:11px 0;font-size:.875rem;border-bottom:1px solid var(--gray-100)}
        .rp-trow:last-child{border-bottom:none}
        .rp-cta{display:flex;align-items:center;gap:16px;background:var(--primary-light);border-radius:12px;padding:18px 20px;margin-top:14px;flex-wrap:wrap}
        .rp-cta h3{font-size:.95rem;font-weight:700}.rp-cta p{font-size:.82rem;color:var(--gray-600)}
        .rp-cta .btn{margin-left:auto}
        @media(max-width:800px){.rp-steps{grid-template-columns:repeat(2,1fr)}.rp-grid{grid-template-columns:1fr}.rp-cta .btn{margin-left:0;width:100%;justify-content:center}}
        @media(max-width:480px){.rp-steps{grid-template-columns:1fr 1fr}.rp-hero h1{font-size:1.4rem}.rp-trow{flex-direction:column;align-items:flex-start;gap:2px}}
      `}</style>
    </div>
  )
}
