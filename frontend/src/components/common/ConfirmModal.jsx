import { useEffect } from 'react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmColor = 'var(--accent)', loading = false }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onCancel])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box animate-scale" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Close"><FiX size={20} /></button>
        <div className="modal-icon">
          <FiAlertTriangle size={32} color={confirmColor} />
        </div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
          <button
            className="btn"
            style={{ background: confirmColor, color: '#fff' }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn .2s ease; }
        .modal-box { background:#fff;border-radius:16px;padding:28px 24px;max-width:400px;width:100%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.3); }
        .modal-close { position:absolute;top:12px;right:12px;background:var(--gray-100);border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--gray-600); }
        .modal-close:hover { background:var(--gray-200); }
        .modal-icon { width:64px;height:64px;border-radius:50%;background:#fff8e1;display:flex;align-items:center;justify-content:center;margin:0 auto 16px; }
        .modal-title { font-size:1.1rem;font-weight:700;text-align:center;margin-bottom:8px;color:var(--dark); }
        .modal-message { font-size:.875rem;color:var(--gray-600);text-align:center;line-height:1.6;margin-bottom:24px; }
        .modal-actions { display:flex;gap:10px;justify-content:center; }
        .modal-actions .btn { flex:1;justify-content:center; }
        @media(max-width:480px) { .modal-box{padding:20px 16px;} .modal-actions{flex-direction:column-reverse;} }
      `}</style>
    </div>
  )
}
