// HelpCenter.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiChevronDown } from 'react-icons/fi'

const TOPICS = [
  { icon:'📦', title:'Orders & Tracking', color:'#e3f2fd', items:[
    { q:'How do I track my order?', a:'Go to My Orders → Click on order → See the real-time tracking timeline.' },
    { q:'Can I change my order?', a:'Orders can only be modified in "Processing" status. Contact support immediately.' },
    { q:'How do I cancel my order?', a:'My Orders → Click order → Click "Cancel Order". Only available for Processing/Confirmed orders.' },
    { q:'Why is my order delayed?', a:'Check your order tracking page. Delays can occur due to high demand or logistics issues.' },
  ]},
  { icon:'💳', title:'Payments & Billing', color:'#e8f5e9', items:[
    { q:'What payment methods are accepted?', a:'COD, UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking.' },
    { q:'Is my payment secure?', a:'Yes! All transactions use 256-bit SSL encryption. We never store card details.' },
    { q:'I was charged but order not placed?', a:'Refund will be processed in 5–7 business days. Contact us if delayed.' },
  ]},
  { icon:'🔄', title:'Returns & Refunds', color:'#fff3e0', items:[
    { q:'What is the return policy?', a:'7-day hassle-free returns on all eligible products in original packaging.' },
    { q:'How do I initiate a return?', a:'My Orders → Select order → Click "Return Item". Pickup in 2 business days.' },
    { q:'When will I get my refund?', a:'5–7 business days after item inspection. Goes back to original payment method.' },
  ]},
  { icon:'👤', title:'Account', color:'#f3e5f5', items:[
    { q:'How do I create an account?', a:'Click Sign Up → Enter name, email, password → Account created instantly!' },
    { q:'How do I reset my password?', a:'Go to Profile → Security tab → Change Password.' },
    { q:'How to add delivery address?', a:'Profile → Addresses tab → Add Address → Fill details → Save.' },
  ]},
  { icon:'🚚', title:'Shipping', color:'#e8eaf6', items:[
    { q:'What are delivery charges?', a:'FREE delivery on orders above ₹500. Flat ₹40 for orders below ₹500.' },
    { q:'How long does delivery take?', a:'Standard: 3–5 business days. Express: 1–2 business days in select cities.' },
    { q:'Do you deliver across India?', a:'Yes! We deliver to all major cities and most pin codes across India.' },
  ]},
]

export function HelpCenter() {
  const [active, setActive] = useState(0)
  const [search, setSearch] = useState('')
  const [openIdx, setOpenIdx] = useState(null)

  const searchResults = search.trim()
    ? TOPICS.flatMap(t => t.items.filter(i => i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase())).map(i => ({...i, topic:t.title})))
    : []

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <div className="hc-hero">
          <h1>🛟 Help Center</h1>
          <p>Find answers to all your questions about ShopKart</p>
          <div className="hc-search-box">
            <FiSearch size={17} color="var(--gray-400)"/>
            <input type="text" placeholder="Search for help..." value={search} onChange={e=>{setSearch(e.target.value);setOpenIdx(null)}}/>
            {search && <button onClick={()=>setSearch('')} style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.2rem',color:'var(--gray-400)'}}>×</button>}
          </div>
        </div>

        {search ? (
          <div className="card card-body">
            <h3 style={{marginBottom:14,fontSize:'.9rem',color:'var(--gray-400)'}}>{searchResults.length} result(s) for "{search}"</h3>
            {searchResults.length===0 ? (
              <div style={{textAlign:'center',padding:32,color:'var(--gray-400)'}}>
                No results found. <Link to="/contact" style={{color:'var(--primary)'}}>Contact Support →</Link>
              </div>
            ) : searchResults.map((r,i) => (
              <div key={i} style={{padding:'12px 0',borderBottom:'1px solid var(--gray-100)'}}>
                <span style={{fontSize:'.7rem',background:'var(--primary-light)',color:'var(--primary)',padding:'2px 8px',borderRadius:10,fontWeight:600}}>{r.topic}</span>
                <p style={{fontWeight:600,fontSize:'.9rem',margin:'6px 0 4px'}}>{r.q}</p>
                <p style={{fontSize:'.85rem',color:'var(--gray-600)'}}>{r.a}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="hc-layout">
            <div className="hc-sidebar">
              {TOPICS.map((t,i) => (
                <button key={i} className={`hc-tab ${active===i?'active':''}`} onClick={()=>{setActive(i);setOpenIdx(null)}}>
                  <span className="hc-tab-icon" style={{background:t.color}}>{t.icon}</span>
                  <span>{t.title}</span>
                </button>
              ))}
            </div>
            <div className="hc-main">
              <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:16}}>{TOPICS[active].title}</h2>
              {TOPICS[active].items.map((item,i) => (
                <div key={i} className="hc-item" onClick={()=>setOpenIdx(openIdx===i?null:i)}>
                  <div className="hc-q"><span>{item.q}</span><span style={{transform:openIdx===i?'rotate(180deg)':'none',transition:'.2s'}}><FiChevronDown size={16}/></span></div>
                  {openIdx===i && <div className="hc-a">{item.a}</div>}
                </div>
              ))}
              <div className="hc-cta">
                <p>Still need help?</p>
                <Link to="/contact" className="btn btn-primary btn-sm">Contact Support →</Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .hc-hero{text-align:center;padding:40px 20px 28px;display:flex;flex-direction:column;align-items:center;gap:10px}
        .hc-hero h1{font-size:1.8rem;font-weight:800}.hc-hero p{color:var(--gray-400)}
        .hc-search-box{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--gray-200);border-radius:50px;padding:10px 18px;width:100%;max-width:500px;box-shadow:var(--shadow-sm)}
        .hc-search-box:focus-within{border-color:var(--primary)}.hc-search-box input{flex:1;border:none;font-size:.9rem;outline:none}
        .hc-layout{display:grid;grid-template-columns:240px 1fr;gap:16px}
        .hc-sidebar{background:#fff;border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm);height:fit-content;position:sticky;top:80px}
        .hc-tab{display:flex;align-items:center;gap:10px;padding:12px 14px;border:none;background:none;width:100%;cursor:pointer;font-size:.875rem;color:var(--gray-800);transition:.15s;border-bottom:1px solid var(--gray-100);text-align:left}
        .hc-tab:hover{background:var(--gray-100)}.hc-tab.active{background:var(--primary-light);color:var(--primary);font-weight:600}
        .hc-tab-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
        .hc-main{background:#fff;border-radius:12px;padding:20px;box-shadow:var(--shadow-sm)}
        .hc-item{border:1px solid var(--gray-200);border-radius:8px;overflow:hidden;margin-bottom:8px;cursor:pointer;transition:border-color .15s}
        .hc-item:hover{border-color:var(--primary)}.hc-q{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;font-weight:600;font-size:.875rem;gap:8px}
        .hc-a{padding:10px 14px;background:#fafafa;font-size:.85rem;color:var(--gray-600);line-height:1.7;border-top:1px solid var(--gray-200)}
        .hc-cta{margin-top:20px;padding:16px;background:var(--primary-light);border-radius:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .hc-cta p{font-weight:600;color:var(--primary)}
        @media(max-width:800px){.hc-layout{grid-template-columns:1fr}.hc-sidebar{position:static;display:grid;grid-template-columns:repeat(2,1fr)}.hc-tab{border-bottom:none;border:1px solid var(--gray-200);margin:2px;border-radius:6px}}
        @media(max-width:500px){.hc-sidebar{grid-template-columns:1fr}.hc-hero h1{font-size:1.4rem}}
      `}</style>
    </div>
  )
}
export default HelpCenter
