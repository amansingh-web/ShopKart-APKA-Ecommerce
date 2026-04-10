import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="nf-wrap">
      <div className="nf-box animate-fade">
        <div className="nf-num">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="nf-btns">
          <Link to="/"         className="btn btn-primary btn-lg">🏠 Go Home</Link>
          <Link to="/products" className="btn btn-ghost  btn-lg">🛒 Shop Now</Link>
          <Link to="/contact"  className="btn btn-ghost  btn-lg">📞 Contact</Link>
        </div>
      </div>
      <style>{`
        .nf-wrap{min-height:calc(100vh - 120px);display:flex;align-items:center;justify-content:center;padding:24px 16px}
        .nf-box{text-align:center;padding:40px 20px;max-width:480px;width:100%}
        .nf-num{font-size:8rem;font-weight:900;color:var(--primary);opacity:.12;line-height:1}
        .nf-box h1{font-size:1.6rem;font-weight:800;color:var(--dark);margin-top:-40px;margin-bottom:10px}
        .nf-box p{color:var(--gray-400);margin-bottom:24px}
        .nf-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
        @media(max-width:480px){.nf-num{font-size:5rem}.nf-box h1{font-size:1.3rem}.nf-btns .btn{flex:1;min-width:100px}}
      `}</style>
    </div>
  )
}
