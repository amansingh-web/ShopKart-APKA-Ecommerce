import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [p] = useSearchParams()
  const redirect = p.get('redirect') || '/'
  const [form,   setForm]   = useState({ email: '', password: '' })
  const [show,   setShow]   = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    setErrors(e); return !Object.keys(e).length
  }

  const submit = async e => {
    e.preventDefault(); if (!validate()) return
    const r = await login(form.email, form.password)
    if (r.success) navigate(r.role === 'admin' ? '/admin' : redirect)
  }

  const demo = async role => {
    const c = role === 'admin' ? { email:'admin@shopkart.com', password:'admin123' } : { email:'john@shopkart.com', password:'user1234' }
    const r = await login(c.email, c.password)
    if (r.success) navigate(r.role === 'admin' ? '/admin' : '/')
  }

  return (
    <div className="auth-pg">
      <div className="auth-card animate-fade">
        <div className="auth-logo">🛒 Shop<strong>Kart</strong></div>
        <h1>Welcome Back!</h1>
        <p className="auth-sub">Sign in to continue shopping</p>

        <form onSubmit={submit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="inp-wrap">
              <FiMail className="inp-icon" size={15}/>
              <input type="email" className={`form-input has-icon ${errors.email?'error':''}`}
                placeholder="you@example.com" value={form.email}
                onChange={e => setForm({...form, email:e.target.value})} autoComplete="email"/>
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="inp-wrap">
              <FiLock className="inp-icon" size={15}/>
              <input type={show?'text':'password'} className={`form-input has-icon has-icon-r ${errors.password?'error':''}`}
                placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({...form, password:e.target.value})} autoComplete="current-password"/>
              <button type="button" className="inp-icon-r" onClick={() => setShow(!show)}>
                {show ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>OR TRY DEMO</span></div>

        <div className="demo-row">
          <button className="btn btn-ghost demo-btn" onClick={() => demo('user')} disabled={loading}>
            👤 User Demo
          </button>
          <button className="btn btn-ghost demo-btn" onClick={() => demo('admin')} disabled={loading}>
            🛡️ Admin Demo
          </button>
        </div>

        <p className="auth-switch">New here? <Link to="/register">Create account →</Link></p>
      </div>

      <style>{`
        .auth-pg { min-height:calc(100vh - 120px);display:flex;align-items:center;justify-content:center;padding:24px 16px;background:linear-gradient(135deg,#e8f0fe,#f5f5f5); }
        .auth-card { background:#fff;border-radius:16px;padding:36px;width:100%;max-width:420px;box-shadow:var(--shadow-lg); }
        .auth-logo { font-size:1.5rem;font-weight:800;color:var(--primary);margin-bottom:16px; }
        .auth-logo strong { color:var(--accent); }
        .auth-card h1 { font-size:1.5rem;font-weight:800;margin-bottom:4px; }
        .auth-sub { font-size:.875rem;color:var(--gray-400);margin-bottom:24px; }
        form { display:flex;flex-direction:column;gap:14px; }
        .inp-wrap { position:relative;display:flex;align-items:center; }
        .inp-icon { position:absolute;left:11px;color:var(--gray-400);pointer-events:none;flex-shrink:0; }
        .inp-icon-r { position:absolute;right:11px;color:var(--gray-400);background:none;border:none;cursor:pointer;display:flex;align-items:center; }
        .form-input.has-icon { padding-left:36px; }
        .form-input.has-icon-r { padding-right:36px; }
        .auth-btn { width:100%;justify-content:center;padding:12px; }
        .auth-divider { display:flex;align-items:center;gap:10px;margin:16px 0;color:var(--gray-400);font-size:.72rem; }
        .auth-divider::before,.auth-divider::after { content:'';flex:1;height:1px;background:var(--gray-200); }
        .demo-row { display:flex;gap:8px; }
        .demo-btn { flex:1;justify-content:center;font-size:.82rem; }
        .auth-switch { text-align:center;font-size:.875rem;color:var(--gray-400);margin-top:16px; }
        .auth-switch a { color:var(--primary);font-weight:600; }
        @media(max-width:480px) { .auth-card{padding:24px 16px;border-radius:12px;} .auth-card h1{font-size:1.3rem;} }
        @media(max-width:360px) { .demo-row{flex-direction:column;} }
      `}</style>
    </div>
  )
}
