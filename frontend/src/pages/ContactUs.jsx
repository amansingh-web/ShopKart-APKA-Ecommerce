import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiMessageSquare, FiClock } from 'react-icons/fi'
import toast from 'react-hot-toast'

const INFO = [
  { icon:<FiMail size={20}/>, title:'Email Us', value:'support@shopkart.com', sub:'Reply within 24 hours', color:'#e3f2fd', ic:'#1565c0' },
  { icon:<FiPhone size={20}/>, title:'Call Us', value:'+91 98765 43210', sub:'Mon–Sat 9am–6pm', color:'#e8f5e9', ic:'#2e7d32' },
  { icon:<FiMapPin size={20}/>, title:'Visit Us', value:'Marwadi University, Rajkot, Gujarat', sub:'India — 360003', color:'#fff3e0', ic:'#e65100' },
  { icon:<FiClock size={20}/>, title:'24/7 Support', value:'Always Available', sub:'Live chat & email', color:'#f3e5f5', ic:'#7b1fa2' },
]

const FAQ = [
  { q:'How do I track my order?', a:'Go to My Orders page and click on any order to see real-time tracking status.' },
  { q:'What is the return policy?', a:'We offer 7-day hassle-free returns on all eligible products in original packaging.' },
  { q:'How long does delivery take?', a:'Standard 3–5 business days. Express 1–2 days in select cities.' },
  { q:'Can I cancel my order?', a:'Yes, cancel orders in Processing or Confirmed status from My Orders page.' },
  { q:'Is my payment secure?', a:'Yes! All transactions use 256-bit SSL encryption. We never store card details.' },
]

export default function ContactUs() {
  const [form,   setForm]   = useState({ name:'', email:'', subject:'', message:'' })
  const [errors, setErrors] = useState({})
  const [done,   setDone]   = useState(false)
  const [loading,setLoading]= useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())                               e.name    = 'Name required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email  = 'Valid email required'
    if (!form.subject)                                   e.subject = 'Select a topic'
    if (form.message.trim().length < 10)                 e.message = 'Write at least 10 characters'
    setErrors(e); return !Object.keys(e).length
  }

  const submit = e => {
    e.preventDefault(); if (!validate()) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true); toast.success('Message sent!') }, 1400)
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <div className="cu-hero">
          <h1>📞 Contact Us</h1>
          <p>Our support team is available 24/7 to help you</p>
        </div>

        <div className="cu-info-grid">
          {INFO.map(i => (
            <div key={i.title} className="cu-info-card">
              <div className="cu-info-icon" style={{background:i.color,color:i.ic}}>{i.icon}</div>
              <h3>{i.title}</h3>
              <p className="cu-val">{i.value}</p>
              <p className="cu-sub">{i.sub}</p>
            </div>
          ))}
        </div>

        <div className="cu-main-grid">
          {/* Form */}
          <div className="card card-body">
            <h2 className="cu-form-title"><FiMessageSquare size={18}/> Send a Message</h2>

            {done ? (
              <div className="cu-success animate-scale">
                <FiCheckCircle size={48} color="var(--success)"/>
                <h3>Message Sent!</h3>
                <p>We'll reply to <strong>{form.email}</strong> within 24 hours.</p>
                <button className="btn btn-primary btn-sm" onClick={()=>{setDone(false);setForm({name:'',email:'',subject:'',message:''})}}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="cu-form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input className={`form-input ${errors.name?'error':''}`} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className={`form-input ${errors.email?'error':''}`} placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Topic *</label>
                  <select className={`form-input ${errors.subject?'error':''}`} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                    <option value="">Select a topic</option>
                    {['Order Issue','Payment Problem','Return / Refund','Product Query','Account Issue','Other'].map(o=><option key={o}>{o}</option>)}
                  </select>
                  {errors.subject && <span className="form-error">{errors.subject}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className={`form-input ${errors.message?'error':''}`} rows={5} placeholder="Describe your issue in detail..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary" style={{justifyContent:'center'}} disabled={loading}>
                  <FiSend size={15}/> {loading?'Sending...':'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="card card-body">
            <h2 className="cu-form-title">Frequently Asked Questions</h2>
            {FAQ.map((f,i) => <FaqItem key={i} q={f.q} a={f.a}/>)}
          </div>
        </div>
      </div>

      <style>{`
        .cu-hero{text-align:center;padding:36px 20px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}
        .cu-hero h1{font-size:1.8rem;font-weight:800}.cu-hero p{color:var(--gray-400)}
        .cu-info-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
        .cu-info-card{background:#fff;border-radius:10px;padding:16px;text-align:center;box-shadow:var(--shadow-sm);transition:var(--transition)}
        .cu-info-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md)}
        .cu-info-icon{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px}
        .cu-info-card h3{font-size:.875rem;font-weight:700;margin-bottom:4px}
        .cu-val{font-size:.82rem;color:var(--dark);font-weight:600}.cu-sub{font-size:.72rem;color:var(--gray-400);margin-top:2px}
        .cu-main-grid{display:grid;grid-template-columns:1fr 380px;gap:16px}
        .cu-form-title{font-size:1rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:6px;padding-bottom:10px;border-bottom:1px solid var(--gray-200)}
        .cu-form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .cu-success{text-align:center;padding:32px 16px;display:flex;flex-direction:column;align-items:center;gap:10px}
        .cu-success h3{font-size:1.2rem;font-weight:700;color:var(--success)}.cu-success p{font-size:.875rem;color:var(--gray-600)}
        .faq-item{border:1px solid var(--gray-200);border-radius:7px;overflow:hidden;margin-bottom:7px}
        .faq-q{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;font-weight:600;font-size:.85rem;cursor:pointer;background:none;border:none;width:100%;text-align:left;transition:.15s;gap:8px}
        .faq-q:hover{background:var(--gray-100)}.faq-a{padding:10px 14px;font-size:.82rem;color:var(--gray-600);line-height:1.7;background:#fafafa;border-top:1px solid var(--gray-200)}
        @media(max-width:1000px){.cu-main-grid{grid-template-columns:1fr}.cu-info-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.cu-info-grid{grid-template-columns:repeat(2,1fr)}.cu-form-row{grid-template-columns:1fr}.cu-hero h1{font-size:1.4rem}}
        @media(max-width:400px){.cu-info-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={()=>setOpen(!open)}>{q}<span style={{transform:open?'rotate(180deg)':'none',transition:'.2s',flexShrink:0}}>▾</span></button>
      {open && <div className="faq-a">{a}</div>}
    </div>
  )
}
