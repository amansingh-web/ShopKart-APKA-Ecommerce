import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { FiUser, FiMapPin, FiLock, FiPlus, FiTrash2, FiSave, FiEdit3, FiShield } from 'react-icons/fi'

const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Jammu & Kashmir']

const TABS = [
  { id:'profile',   label:'Profile',   icon:<FiUser size={15}/> },
  { id:'addresses', label:'Addresses', icon:<FiMapPin size={15}/> },
  { id:'security',  label:'Security',  icon:<FiLock size={15}/> },
]

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [tab,     setTab]     = useState('profile')
  const [profile, setProfile] = useState({ name: user?.name||'', phone: user?.phone||'' })
  const [saving,  setSaving]  = useState(false)

  // Addresses - load fresh from API
  const [addrs,   setAddrs]   = useState([])
  const [loadingA,setLoadingA]= useState(true)
  const [showForm,setShowForm]= useState(false)
  const [newAddr, setNewAddr] = useState({ name:'', phone:'', street:'', city:'', state:'Gujarat', pincode:'', isDefault:false })
  const [addrErr, setAddrErr] = useState({})

  // Password
  const [pass,    setPass]    = useState({ current:'', newPass:'', confirm:'' })
  const [pErr,    setPErr]    = useState({})
  const [pSaving, setPSaving] = useState(false)

  // Load addresses fresh from API
  useEffect(() => {
    if (tab === 'addresses') {
      setLoadingA(true)
      api.get('/auth/me')
        .then(({ data }) => setAddrs(data.user.addresses || []))
        .catch(() => toast.error('Failed to load addresses'))
        .finally(() => setLoadingA(false))
    }
  }, [tab])

  // Sync profile form with user changes
  useEffect(() => {
    setProfile({ name: user?.name||'', phone: user?.phone||'' })
  }, [user])

  const saveProfile = async () => {
    if (!profile.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const { data } = await api.put('/auth/profile', profile)
      updateUser(data.user)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally { setSaving(false) }
  }

  const validateAddr = () => {
    const e = {}
    if (!newAddr.name.trim())                 e.name    = 'Name required'
    if (!newAddr.phone.match(/^[6-9]\d{9}$/)) e.phone   = 'Valid 10-digit phone'
    if (!newAddr.street.trim())               e.street  = 'Address required'
    if (!newAddr.city.trim())                 e.city    = 'City required'
    if (!newAddr.pincode.match(/^\d{6}$/))    e.pincode = 'Valid 6-digit pincode'
    setAddrErr(e)
    return !Object.keys(e).length
  }

  const addAddress = async () => {
    if (!validateAddr()) return
    try {
      const { data } = await api.post('/auth/address', newAddr)
      setAddrs(data.addresses)
      setShowForm(false)
      setNewAddr({ name:'', phone:'', street:'', city:'', state:'Gujarat', pincode:'', isDefault:false })
      setAddrErr({})
      toast.success('Address added successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address')
    }
  }

  const deleteAddr = async id => {
    try {
      const { data } = await api.delete(`/auth/address/${id}`)
      setAddrs(data.addresses)
      toast.success('Address removed')
    } catch { toast.error('Failed to remove address') }
  }

  const validatePass = () => {
    const e = {}
    if (!pass.current)                 e.current = 'Enter current password'
    if (pass.newPass.length < 6)       e.newPass = 'Minimum 6 characters'
    if (pass.newPass !== pass.confirm) e.confirm = 'Passwords do not match'
    setPErr(e)
    return !Object.keys(e).length
  }

  const changePass = async () => {
    if (!validatePass()) return
    setPSaving(true)
    try {
      await api.put('/auth/change-password', { currentPassword: pass.current, newPassword: pass.newPass })
      toast.success('Password changed successfully!')
      setPass({ current:'', newPass:'', confirm:'' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally { setPSaving(false) }
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <div className="pf-layout">

          {/* Sidebar */}
          <aside className="pf-sidebar">
            <div className="pf-user-card">
              <div className="pf-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div className="pf-user-info">
                <strong>{user?.name}</strong>
                <p>{user?.email}</p>
                <span className={`pf-role-badge ${user?.role === 'admin' ? 'admin' : ''}`}>
                  {user?.role === 'admin' ? <FiShield size={10}/> : <FiUser size={10}/>} {user?.role}
                </span>
              </div>
            </div>
            <nav className="pf-nav">
              {TABS.map(t => (
                <button key={t.id} className={`pf-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="pf-main">

            {/* ── Profile Tab ── */}
            {tab === 'profile' && (
              <div className="card card-body animate-fade">
                <h2 className="pf-section-title"><FiEdit3 size={16}/> Personal Information</h2>
                <div className="pf-form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={profile.name}
                      onChange={e => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Your full name"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" value={user?.email} disabled style={{ opacity:.6 }}/>
                    <span style={{ fontSize:'.72rem', color:'var(--gray-400)' }}>Email cannot be changed</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account Role</label>
                    <input className="form-input" value={user?.role} disabled style={{ opacity:.6, textTransform:'capitalize' }}/>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
                  <FiSave size={14}/> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* ── Addresses Tab ── */}
            {tab === 'addresses' && (
              <div className="card card-body animate-fade">
                <div className="pf-section-head">
                  <h2 className="pf-section-title"><FiMapPin size={16}/> My Addresses</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setAddrErr({}) }}>
                    <FiPlus size={14}/> Add Address
                  </button>
                </div>

                {loadingA ? (
                  <div style={{ display:'flex', justifyContent:'center', padding:32 }}>
                    <div className="spinner"/>
                  </div>
                ) : addrs.length === 0 && !showForm ? (
                  <div className="pf-empty">
                    <FiMapPin size={36} color="var(--gray-300)"/>
                    <p>No saved addresses yet</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
                      <FiPlus size={13}/> Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="addrs-list">
                    {addrs.map(a => (
                      <div key={a._id} className="addr-card">
                        <div className="addr-body">
                          {a.isDefault && <span className="addr-default-badge">✓ Default</span>}
                          <strong>{a.name}</strong>
                          <p>{a.phone}</p>
                          <p>{a.street}, {a.city}, {a.state} — {a.pincode}</p>
                        </div>
                        <button className="addr-del-btn" onClick={() => deleteAddr(a._id)} title="Remove address">
                          <FiTrash2 size={14}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Form */}
                {showForm && (
                  <div className="addr-form animate-fade">
                    <h4>Add New Address</h4>
                    <div className="pf-form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input className={`form-input ${addrErr.name ? 'error' : ''}`} placeholder="Recipient name"
                          value={newAddr.name} onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}/>
                        {addrErr.name && <span className="form-error">{addrErr.name}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input className={`form-input ${addrErr.phone ? 'error' : ''}`} placeholder="10-digit mobile"
                          value={newAddr.phone} onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}/>
                        {addrErr.phone && <span className="form-error">{addrErr.phone}</span>}
                      </div>
                      <div className="form-group pf-full">
                        <label className="form-label">Street Address *</label>
                        <input className={`form-input ${addrErr.street ? 'error' : ''}`} placeholder="House no, building, street, area"
                          value={newAddr.street} onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}/>
                        {addrErr.street && <span className="form-error">{addrErr.street}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input className={`form-input ${addrErr.city ? 'error' : ''}`} placeholder="City"
                          value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}/>
                        {addrErr.city && <span className="form-error">{addrErr.city}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input className={`form-input ${addrErr.pincode ? 'error' : ''}`} placeholder="6-digit pincode" maxLength={6}
                          value={newAddr.pincode} onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })}/>
                        {addrErr.pincode && <span className="form-error">{addrErr.pincode}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <select className="form-input" value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}>
                          {STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="form-group pf-full">
                        <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'.875rem', fontWeight:500 }}>
                          <input type="checkbox" style={{ width:'auto' }} checked={newAddr.isDefault}
                            onChange={e => setNewAddr({ ...newAddr, isDefault: e.target.checked })}/>
                          Set as default address
                        </label>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <button className="btn btn-ghost" onClick={() => { setShowForm(false); setAddrErr({}) }}>Cancel</button>
                      <button className="btn btn-primary" onClick={addAddress}>Save Address</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Security Tab ── */}
            {tab === 'security' && (
              <div className="card card-body animate-fade">
                <h2 className="pf-section-title"><FiLock size={16}/> Change Password</h2>
                <div className="pf-pass-form">
                  {[
                    { k:'current', l:'Current Password', p:'Your current password' },
                    { k:'newPass', l:'New Password',      p:'Minimum 6 characters' },
                    { k:'confirm', l:'Confirm Password',  p:'Re-enter new password' },
                  ].map(f => (
                    <div key={f.k} className="form-group">
                      <label className="form-label">{f.l}</label>
                      <input type="password" className={`form-input ${pErr[f.k] ? 'error' : ''}`}
                        placeholder={f.p} value={pass[f.k]}
                        onChange={e => setPass({ ...pass, [f.k]: e.target.value })}/>
                      {pErr[f.k] && <span className="form-error">{pErr[f.k]}</span>}
                    </div>
                  ))}
                  <button className="btn btn-primary" onClick={changePass} disabled={pSaving}>
                    <FiLock size={14}/> {pSaving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>

                {/* Account info */}
                <div className="pf-account-info">
                  <h3>Account Information</h3>
                  <div className="pf-info-row"><span>Member since</span><strong>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month:'long', year:'numeric' }) : 'N/A'}</strong></div>
                  <div className="pf-info-row"><span>Account role</span><strong style={{ textTransform:'capitalize' }}>{user?.role}</strong></div>
                  <div className="pf-info-row"><span>Email</span><strong>{user?.email}</strong></div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .pf-layout { display:grid;grid-template-columns:240px 1fr;gap:16px;align-items:flex-start; }
        .pf-sidebar { background:#fff;border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm);position:sticky;top:80px; }
        .pf-user-card { display:flex;gap:10px;align-items:center;padding:16px;background:var(--primary); }
        .pf-avatar { width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.25);color:#fff;font-size:1.1rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .pf-user-info strong { display:block;font-size:.875rem;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:150px; }
        .pf-user-info p { font-size:.7rem;color:rgba(255,255,255,.75);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:150px; }
        .pf-role-badge { display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:8px;font-size:.65rem;font-weight:700;background:rgba(255,255,255,.2);color:#fff;margin-top:3px;text-transform:capitalize; }
        .pf-role-badge.admin { background:var(--warning);color:var(--dark); }
        .pf-nav { padding:6px;display:flex;flex-direction:column;gap:2px; }
        .pf-tab { display:flex;align-items:center;gap:8px;padding:10px 12px;border:none;background:none;border-radius:8px;font-size:.875rem;color:var(--gray-800);cursor:pointer;width:100%;text-align:left;transition:.15s; }
        .pf-tab:hover { background:var(--gray-100); }
        .pf-tab.active { background:var(--primary-light);color:var(--primary);font-weight:600; }
        .pf-section-title { font-size:1rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:6px;padding-bottom:10px;border-bottom:1px solid var(--gray-200); }
        .pf-section-head { display:flex;justify-content:space-between;align-items:center;margin-bottom:14px; }
        .pf-section-head .pf-section-title { margin-bottom:0;border-bottom:none;padding-bottom:0; }
        .pf-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px; }
        .pf-full { grid-column:span 2; }
        .pf-empty { text-align:center;padding:40px 20px;color:var(--gray-400);display:flex;flex-direction:column;align-items:center;gap:10px; }
        .addrs-list { display:flex;flex-direction:column;gap:10px;margin-bottom:12px; }
        .addr-card { display:flex;justify-content:space-between;align-items:flex-start;padding:12px 14px;border:1.5px solid var(--gray-200);border-radius:10px;transition:.15s; }
        .addr-card:hover { border-color:var(--primary); }
        .addr-body strong { font-size:.875rem;display:block;margin-bottom:2px; }
        .addr-body p { font-size:.8rem;color:var(--gray-600);line-height:1.6; }
        .addr-default-badge { display:inline-block;padding:2px 7px;background:#e8f5e9;color:var(--success);font-size:.68rem;font-weight:700;border-radius:4px;margin-bottom:4px; }
        .addr-del-btn { background:#ffebee;color:var(--accent);border:none;border-radius:6px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:.15s; }
        .addr-del-btn:hover { background:#ffcdd2; }
        .addr-form { background:var(--gray-100);border-radius:10px;padding:16px;margin-top:8px;border:1px dashed var(--gray-300); }
        .addr-form h4 { font-size:.95rem;font-weight:700;margin-bottom:12px; }
        .pf-pass-form { display:flex;flex-direction:column;gap:14px;max-width:400px;margin-bottom:24px; }
        .pf-account-info { background:var(--gray-100);border-radius:10px;padding:16px; }
        .pf-account-info h3 { font-size:.85rem;font-weight:700;color:var(--gray-600);text-transform:uppercase;letter-spacing:.4px;margin-bottom:12px; }
        .pf-info-row { display:flex;justify-content:space-between;padding:8px 0;font-size:.875rem;border-bottom:1px solid var(--gray-200); }
        .pf-info-row:last-child { border-bottom:none; }
        .pf-info-row span { color:var(--gray-600); }
        @media(max-width:800px) {
          .pf-layout { grid-template-columns:1fr; }
          .pf-sidebar { position:static; }
          .pf-nav { flex-direction:row;flex-wrap:wrap;padding:8px;gap:4px; }
          .pf-tab { flex:1;min-width:80px;justify-content:center;white-space:nowrap; }
        }
        @media(max-width:600px) {
          .pf-form-grid { grid-template-columns:1fr; }
          .pf-full { grid-column:span 1; }
          .pf-user-info strong,.pf-user-info p { max-width:120px; }
        }
        @media(max-width:400px) {
          .pf-tab { font-size:.78rem;padding:8px; }
          .pf-info-row { flex-direction:column;gap:2px; }
        }
      `}</style>
    </div>
  )
}
