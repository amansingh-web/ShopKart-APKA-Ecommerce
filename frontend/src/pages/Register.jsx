import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form,   setForm]   = useState({ name:'', email:'', password:'', confirm:'' })
  const [show,   setShow]   = useState({ p:false, c:false })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2)                      e.name = 'Name must be at least 2 chars'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter valid email'
    if (form.password.length < 6)                         e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm)                   e.confirm = 'Passwords do not match'
    setErrors(e); return !Object.keys(e).length
  }

  const submit = async e => {
    e.preventDefault(); if (!validate()) return
    const r = await register(form.name.trim(), form.email, form.password)
    if (r.success) navigate('/')
  }

  const strength = (() => {
    const p = form.password; if (!p) return 0
    let s = 0
    if (p.length >= 6)           s++
    if (p.length >= 10)          s++
    if (/[A-Z]/.test(p))         s++
    if (/[0-9]/.test(p))         s++
    if (/[^A-Za-z0-9]/.test(p))  s++
    return s
  })()
  const sColors = ['','#f44336','#ff9800','#ffeb3b','#4caf50','#2e7d32']
  const sLabels = ['','Very Weak','Weak','Fair','Strong','Very Strong']

  return (
    <div className="auth-pg">
      <div className="auth-card animate-fade">
        <div className="auth-logo">🛒 Shop<strong>Kart</strong></div>
        <h1>Create Account</h1>
        <p className="auth-sub">Join millions of happy shoppers today!</p>

        <form onSubmit={submit} noValidate>
          {[
            { key:'name',    type:'text',     icon:<FiUser size={15}/>, placeholder:'Full name',       label:'Full Name *', auto:'name' },
            { key:'email',   type:'email',    icon:<FiMail size={15}/>, placeholder:'you@example.com', label:'Email Address *', auto:'email' },
          ].map(f => (
            <div className="form-group" key={f.key}>
              <label className="form-label">{f.label}</label>
              <div className="inp-wrap">
                <span className="inp-icon">{f.icon}</span>
                <input type={f.type} className={`form-input has-icon ${errors[f.key]?'error':''}`}
                  placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({...form, [f.key]:e.target.value})} autoComplete={f.auto}/>
              </div>
              {errors[f.key] && <span className="form-error">{errors[f.key]}</span>}
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="inp-wrap">
              <span className="inp-icon"><FiLock size={15}/></span>
              <input type={show.p?'text':'password'} className={`form-input has-icon has-icon-r ${errors.password?'error':''}`}
                placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({...form, password:e.target.value})} autoComplete="new-password"/>
              <button type="button" className="inp-icon-r" onClick={() => setShow({...show, p:!show.p})}>
                {show.p ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
              </button>
            </div>
            {form.password && (
              <div className="strength-bar">
                <div className="strength-track">
                  {[1,2,3,4,5].map(i => <div key={i} className="strength-seg" style={{background: i<=strength ? sColors[strength] : 'var(--gray-200)'}}/>)}
                </div>
                <span style={{color:sColors[strength],fontSize:'.72rem',fontWeight:600}}>{sLabels[strength]}</span>
              </div>
            )}
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <div className="inp-wrap">
              <span className="inp-icon"><FiLock size={15}/></span>
              <input type={show.c?'text':'password'} className={`form-input has-icon has-icon-r ${errors.confirm?'error':''}`}
                placeholder="Re-enter password" value={form.confirm}
                onChange={e => setForm({...form, confirm:e.target.value})} autoComplete="new-password"/>
              <button type="button" className="inp-icon-r" onClick={() => setShow({...show, c:!show.c})}>
                {show.c ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
              </button>
            </div>
            {form.confirm && !errors.confirm && form.password === form.confirm && (
              <span style={{color:'var(--success)',fontSize:'.78rem',display:'flex',alignItems:'center',gap:4}}>
                <FiCheckCircle size={12}/> Passwords match
              </span>
            )}
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <p className="terms-note">By creating an account, you agree to our <Link to="/privacy">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign In →</Link></p>
      </div>

      <style>{`
        .auth-pg { min-height:calc(100vh - 120px);display:flex;align-items:center;justify-content:center;padding:24px 16px;background:linear-gradient(135deg,#e8f0fe,#f5f5f5); }
        .auth-card { background:#fff;border-radius:16px;padding:36px;width:100%;max-width:440px;box-shadow:var(--shadow-lg); }
        .auth-logo { font-size:1.5rem;font-weight:800;color:var(--primary);margin-bottom:16px; }
        .auth-logo strong { color:var(--accent); }
        .auth-card h1 { font-size:1.5rem;font-weight:800;margin-bottom:4px; }
        .auth-sub { font-size:.875rem;color:var(--gray-400);margin-bottom:24px; }
        form { display:flex;flex-direction:column;gap:14px; }
        .inp-wrap { position:relative;display:flex;align-items:center; }
        .inp-icon { position:absolute;left:11px;color:var(--gray-400);pointer-events:none;display:flex;align-items:center; }
        .inp-icon-r { position:absolute;right:11px;color:var(--gray-400);background:none;border:none;cursor:pointer;display:flex;align-items:center; }
        .form-input.has-icon { padding-left:36px; }
        .form-input.has-icon-r { padding-right:36px; }
        .strength-bar { display:flex;align-items:center;gap:8px;margin-top:5px; }
        .strength-track { display:flex;gap:3px;flex:1; }
        .strength-seg { height:4px;flex:1;border-radius:2px;transition:background .3s; }
        .terms-note { font-size:.78rem;color:var(--gray-400);line-height:1.6; }
        .terms-note a { color:var(--primary); }
        .auth-btn { width:100%;justify-content:center;padding:12px; }
        .auth-switch { text-align:center;font-size:.875rem;color:var(--gray-400);margin-top:16px; }
        .auth-switch a { color:var(--primary);font-weight:600; }
        @media(max-width:480px) { .auth-card{padding:24px 16px;border-radius:12px;} .auth-card h1{font-size:1.3rem;} }
      `}</style>
    </div>
  )
}
