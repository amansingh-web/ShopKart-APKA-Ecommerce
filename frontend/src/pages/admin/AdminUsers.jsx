import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import ConfirmModal from '../../components/common/ConfirmModal'
import { FiTrash2, FiShield, FiUser, FiUsers } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const { user: me }              = useAuth()
  const [users,        setUsers]  = useState([])
  const [total,        setTotal]  = useState(0)
  const [loading,      setLoading]= useState(true)
  const [page,         setPage]   = useState(1)
  const [pages,        setPages]  = useState(1)

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [roleTarget,   setRoleTarget]   = useState(null)
  const [actionLoading,setActionLoading]= useState(false)

  const fetchUsers = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/users?page=${p}&limit=10`)
      setUsers(data.users || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
      setPage(p)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async () => {
    if (!roleTarget) return
    setActionLoading(true)
    try {
      await api.put(`/users/${roleTarget.id}`, { role: roleTarget.newRole })
      toast.success(`User role changed to ${roleTarget.newRole}`)
      fetchUsers(page)
    } catch {
      toast.error('Failed to update role')
    } finally {
      setActionLoading(false)
      setRoleTarget(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setActionLoading(true)
    try {
      await api.delete(`/users/${deleteTarget.id}`)
      toast.success('User deleted')
      fetchUsers(page)
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setActionLoading(false)
      setDeleteTarget(null)
    }
  }

  const handleToggleActive = async (id, isActive) => {
    if (id === me._id) { toast.error("You can't deactivate yourself"); return }
    try {
      await api.put(`/users/${id}`, { isActive: !isActive })
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`)
      fetchUsers(page)
    } catch {
      toast.error('Failed to update user')
    }
  }

  return (
    <div className="animate-fade">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:'1.3rem', fontWeight:800 }}>Customers</h1>
        <p style={{ fontSize:'.82rem', color:'var(--gray-400)', marginTop:2 }}>{total} total users</p>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
      ) : users.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, background:'#fff', borderRadius:12 }}>
          <FiUsers size={48} color="var(--gray-300)"/>
          <h3 style={{ marginTop:16 }}>No users found</h3>
        </div>
      ) : (
        <div className="table-wrapper au-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="user-av">{u.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'.875rem' }}>{u.name}</div>
                        {u._id === me._id && <span className="you-badge">You</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize:'.82rem', color:'var(--gray-600)' }}>{u.email}</td>
                  <td>
                    <span className={`role-pill ${u.role === 'admin' ? 'admin':'user'}`}>
                      {u.role === 'admin' ? <FiShield size={11}/> : <FiUser size={11}/>}
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-pill ${u.isActive ? 'active':'inactive'}`}
                      onClick={() => handleToggleActive(u._id, u.isActive)}
                      disabled={u._id === me._id}
                      title={u._id === me._id ? "Can't change your own status" : (u.isActive ? 'Click to deactivate' : 'Click to activate')}
                    >
                      {u.isActive ? '● Active' : '○ Inactive'}
                    </button>
                  </td>
                  <td style={{ fontSize:'.78rem', color:'var(--gray-400)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:5 }}>
                      <button
                        className="act-btn role"
                        title={`Make ${u.role === 'admin' ? 'User':'Admin'}`}
                        disabled={u._id === me._id}
                        onClick={() => {
                          if (u._id === me._id) { toast.error("Can't change your own role"); return }
                          setRoleTarget({ id: u._id, name: u.name, currentRole: u.role, newRole: u.role === 'admin' ? 'user':'admin' })
                        }}>
                        <FiShield size={13}/>
                      </button>
                      <button
                        className="act-btn del"
                        title="Delete user"
                        disabled={u._id === me._id}
                        onClick={() => {
                          if (u._id === me._id) { toast.error("Can't delete yourself"); return }
                          setDeleteTarget({ id: u._id, name: u.name })
                        }}>
                        <FiTrash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:20, flexWrap:'wrap' }}>
          {[...Array(pages)].map((_, i) => (
            <button key={i} className={`page-btn ${page === i+1 ? 'active':''}`}
              onClick={() => fetchUsers(i+1)}>{i+1}</button>
          ))}
        </div>
      )}

      {/* Role change modal */}
      <ConfirmModal
        isOpen={!!roleTarget}
        title="Change User Role?"
        message={`Change "${roleTarget?.name}" from ${roleTarget?.currentRole} to ${roleTarget?.newRole}?`}
        confirmText={`Make ${roleTarget?.newRole}`}
        confirmColor="var(--primary)"
        loading={actionLoading}
        onConfirm={handleRoleChange}
        onCancel={() => setRoleTarget(null)}
      />

      {/* Delete modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete User?"
        message={`Permanently delete "${deleteTarget?.name}"? All their data will be lost.`}
        confirmText="Delete Permanently"
        confirmColor="var(--accent)"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <style>{`
        .au-table { background:#fff;border-radius:12px;box-shadow:var(--shadow-sm); }
        .user-av { width:34px;height:34px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0; }
        .you-badge { padding:2px 6px;background:var(--warning);color:#fff;font-size:.62rem;font-weight:700;border-radius:4px;display:inline-block; }
        .role-pill { display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-size:.72rem;font-weight:700; }
        .role-pill.admin { background:#fce4ec;color:#c2185b; }
        .role-pill.user  { background:var(--primary-light);color:var(--primary); }
        .status-pill { padding:4px 10px;border-radius:20px;font-size:.72rem;font-weight:700;border:none;cursor:pointer;transition:var(--transition); }
        .status-pill.active   { background:#e8f5e9;color:#2e7d32; }
        .status-pill.inactive { background:#ffebee;color:#c62828; }
        .status-pill:disabled { cursor:not-allowed;opacity:.6; }
        .act-btn { width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:var(--transition); }
        .act-btn.role { background:#f3e5f5;color:#6a1b9a; }
        .act-btn.del  { background:#ffebee;color:#c62828; }
        .act-btn:hover:not(:disabled) { opacity:.8;transform:scale(1.08); }
        .act-btn:disabled { opacity:.3;cursor:not-allowed; }
        .page-btn { padding:7px 12px;border:1.5px solid var(--gray-200);border-radius:6px;background:#fff;cursor:pointer;font-size:.82rem;transition:var(--transition); }
        .page-btn:hover { border-color:var(--primary);color:var(--primary); }
        .page-btn.active { background:var(--primary);color:#fff;border-color:var(--primary); }
        @media(max-width:600px) { .au-table table { min-width:520px; } }
      `}</style>
    </div>
  )
}
