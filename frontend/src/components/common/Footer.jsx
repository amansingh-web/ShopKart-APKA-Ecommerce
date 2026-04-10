import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="ft">
      <div className="container">
        <div className="ft-grid">
          <div className="ft-brand">
            <div className="ft-logo">🛒 Shop<strong>Kart</strong></div>
            <p>Your one-stop destination for all shopping needs. Quality products, great prices, fast delivery.</p>
            <div className="ft-contact">
              <a href="mailto:support@shopkart.com"><FiMail size={13}/> support@shopkart.com</a>
              <a href="tel:+919876543210"><FiPhone size={13}/> +91 98765 43210</a>
              <span><FiMapPin size={13}/> Rajkot, Gujarat, India</span>
            </div>
            <div className="ft-social">
              <a href="https://facebook.com"  target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook/></a>
              <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter/></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram/></a>
              <a href="https://youtube.com"   target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FiYoutube/></a>
            </div>
          </div>

          <div className="ft-col">
            <h4>Shop</h4>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Fashion">Fashion</Link>
            <Link to="/products?category=Home%20%26%20Kitchen">Home & Kitchen</Link>
            <Link to="/products?category=Sports%20%26%20Fitness">Sports & Fitness</Link>
            <Link to="/products?category=Beauty">Beauty</Link>
            <Link to="/products?category=Books">Books</Link>
          </div>

          <div className="ft-col">
            <h4>My Account</h4>
            <Link to="/profile">My Profile</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/track-order">Track Order</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Login / Sign Up</Link>
          </div>

          <div className="ft-col">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/returns">Returns & Refunds</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>

        <div className="ft-bottom">
          <p>© {new Date().getFullYear()} ShopKart. All rights reserved. Built with MERN Stack.</p>
          <div className="ft-payments">
            <span>💳 Visa</span><span>💳 Mastercard</span>
            <span>📱 UPI</span><span>🏦 NetBanking</span><span>💰 COD</span>
          </div>
        </div>
      </div>

      <style>{`
        .ft { background:#172337;color:#9e9e9e;margin-top:48px; }
        .ft-grid { display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;padding:48px 0 32px; }
        .ft-logo { font-size:1.5rem;font-weight:800;color:#fff;margin-bottom:10px; }
        .ft-logo strong { color:#ffe082; }
        .ft-brand p { font-size:.85rem;line-height:1.7; }
        .ft-contact { display:flex;flex-direction:column;gap:6px;margin:14px 0; }
        .ft-contact a,.ft-contact span { display:flex;align-items:center;gap:6px;font-size:.8rem;color:#9e9e9e;transition:color .2s; }
        .ft-contact a:hover { color:#fff; }
        .ft-social { display:flex;gap:8px; }
        .ft-social a { width:34px;height:34px;background:rgba(255,255,255,.1);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#9e9e9e;font-size:.95rem;transition:all .2s; }
        .ft-social a:hover { background:var(--primary);color:#fff; }
        .ft-col h4 { font-size:.82rem;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.5px;margin-bottom:14px; }
        .ft-col a { display:block;font-size:.83rem;color:#9e9e9e;padding:4px 0;transition:all .15s; }
        .ft-col a:hover { color:#fff;padding-left:4px; }
        .ft-bottom { border-top:1px solid rgba(255,255,255,.1);padding:18px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:.78rem; }
        .ft-payments { display:flex;gap:10px;flex-wrap:wrap; }
        @media(max-width:900px) { .ft-grid { grid-template-columns:1fr 1fr;gap:28px;padding:36px 0 24px; } }
        @media(max-width:600px) { .ft-grid { grid-template-columns:1fr;gap:24px;padding:28px 0 20px; } .ft-bottom { flex-direction:column;text-align:center; } .ft-payments { justify-content:center; } }
      `}</style>
    </footer>
  )
}
