import { useState } from 'react'
import { FiShield, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const SECTIONS = [
  { title:'1. Information We Collect', content:'We collect: Personal Information (name, email, phone, delivery address), Payment Information (processed securely — we never store full card details), Usage Data (pages visited, products viewed, search queries), and Device Information (browser type, IP address) for security purposes.' },
  { title:'2. How We Use Your Information', content:'We use your information to: process and fulfill orders, communicate about your account and orders, personalize your shopping experience, improve our website and services, send promotional emails (unsubscribe anytime), detect and prevent fraud, and comply with legal obligations.' },
  { title:'3. Information Sharing', content:'We do not sell, trade, or rent your personal information to third parties. We only share with: Delivery Partners (name, address, phone for delivery), Payment Processors (encrypted payment info), and Legal Authorities (when required by law). We do not allow advertisers to access your personal data.' },
  { title:'4. Data Security', content:'All data is encrypted using 256-bit SSL/TLS encryption. Passwords are hashed with bcrypt (salt rounds: 12) — we never store plain text passwords. JWT tokens expire after 7 days. Regular security audits are performed. Access to personal data is restricted to authorized personnel only.' },
  { title:'5. Cookies', content:'ShopKart uses cookies to keep you logged in, remember your cart items, analyze website traffic, and improve performance. You can control cookie settings through your browser. Disabling cookies may affect some features.' },
  { title:'6. Your Rights', content:'You have the right to: Access your personal data, Correct inaccurate information, Delete your account and data, Opt-out of marketing emails, and Request data portability. To exercise these rights, contact us at support@shopkart.com.' },
  { title:"7. Children's Privacy", content:'ShopKart is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.' },
  { title:'8. Changes to This Policy', content:'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. Continued use of ShopKart after changes constitutes acceptance of the updated policy.' },
  { title:'9. Contact Us', content:'Questions about this Privacy Policy? Contact us at: Email: support@shopkart.com | Phone: +91 98765 43210 | Address: Marwadi University, Rajkot, Gujarat — 360003, India.' },
]

function Section({ title, content }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="pp-section">
      <button className="pp-sec-btn" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        {open ? <FiChevronUp size={16}/> : <FiChevronDown size={16}/>}
      </button>
      {open && <div className="pp-sec-body">{content}</div>}
    </div>
  )
}

export default function PrivacyPolicy() {
  return (
    <div className="page-wrapper animate-fade">
      <div className="container">
        <div className="pp-hero">
          <FiShield size={44} color="var(--primary)"/>
          <h1>Privacy Policy</h1>
          <p>Last updated: March 2026</p>
        </div>

        <div className="pp-layout">
          <div className="pp-content">
            <div className="pp-intro">
              At ShopKart, we are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and protect your data.
            </div>
            {SECTIONS.map(s => <Section key={s.title} title={s.title} content={s.content}/>)}
          </div>

          <aside className="pp-sidebar">
            <h3>Quick Links</h3>
            {SECTIONS.map((s,i) => (
              <a key={i} href={`#pp-${i}`} className="pp-link">{s.title}</a>
            ))}
          </aside>
        </div>
      </div>

      <style>{`
        .pp-hero{text-align:center;padding:36px 20px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}
        .pp-hero h1{font-size:1.8rem;font-weight:800}.pp-hero p{font-size:.82rem;color:var(--gray-400)}
        .pp-layout{display:grid;grid-template-columns:1fr 220px;gap:20px;align-items:flex-start}
        .pp-content{display:flex;flex-direction:column;gap:8px}
        .pp-intro{background:var(--primary-light);border-left:4px solid var(--primary);padding:12px 16px;border-radius:0 8px 8px 0;font-size:.875rem;color:var(--primary);line-height:1.7;margin-bottom:8px}
        .pp-section{background:#fff;border-radius:8px;overflow:hidden;box-shadow:var(--shadow-sm)}
        .pp-sec-btn{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 16px;font-size:.9rem;font-weight:600;color:var(--dark);background:none;border:none;cursor:pointer;text-align:left;gap:8px;transition:.15s}
        .pp-sec-btn:hover{background:var(--gray-100)}
        .pp-sec-body{padding:12px 16px;font-size:.875rem;color:var(--gray-600);line-height:1.8;border-top:1px solid var(--gray-200);background:#fafafa}
        .pp-sidebar{background:#fff;border-radius:10px;padding:16px;box-shadow:var(--shadow-sm);position:sticky;top:80px}
        .pp-sidebar h3{font-size:.82rem;font-weight:700;text-transform:uppercase;color:var(--gray-400);letter-spacing:.5px;margin-bottom:10px}
        .pp-link{display:block;font-size:.78rem;color:var(--gray-600);padding:5px 7px;border-radius:5px;transition:.15s}
        .pp-link:hover{background:var(--primary-light);color:var(--primary)}
        @media(max-width:800px){.pp-layout{grid-template-columns:1fr}.pp-sidebar{display:none}.pp-hero h1{font-size:1.4rem}}
      `}</style>
    </div>
  )
}
