import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN')

export default function ProductCard({ product }) {
  const { addToCart }  = useCart()
  const { user }       = useAuth()

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to add to wishlist'); return }
    try {
      const { data } = await api.post(`/auth/wishlist/${product._id}`)
      toast.success(data.message)
    } catch { toast.error('Something went wrong') }
  }

  const discount = product.discount || (product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0)

  return (
    <div className="pcard">
      <Link to={`/products/${product._id}`} className="pcard-img-wrap">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image' }}
        />
        {discount > 0 && <span className="pcard-badge">{discount}% OFF</span>}
        <button className="pcard-wishlist" onClick={handleWishlist} aria-label="Add to wishlist">
          <FiHeart size={16} />
        </button>
        {product.stock === 0 && <div className="pcard-oos">Out of Stock</div>}
      </Link>

      <div className="pcard-body">
        <p className="pcard-brand">{product.brand}</p>
        <Link to={`/products/${product._id}`}>
          <h3 className="pcard-name line-clamp-2">{product.name}</h3>
        </Link>

        <div className="pcard-rating">
          <span className="rating-pill">
            {product.rating?.toFixed(1)} <FiStar size={11} fill="currentColor" />
          </span>
          <span className="pcard-reviews">({product.numReviews?.toLocaleString()})</span>
        </div>

        <div className="pcard-pricing">
          <span className="pcard-price">{fmt(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="pcard-original">{fmt(product.originalPrice)}</span>
          )}
          {discount > 0 && <span className="pcard-discount">{discount}% off</span>}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="pcard-stock-warn">Only {product.stock} left!</p>
        )}

        <button
          className="pcard-btn"
          onClick={(e) => { e.preventDefault(); addToCart(product) }}
          disabled={product.stock === 0}
        >
          <FiShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      <style>{`
        .pcard { background: #fff; border-radius: 8px; overflow: hidden; transition: all .2s; border: 1px solid var(--gray-200); display: flex; flex-direction: column; }
        .pcard:hover { box-shadow: 0 4px 20px rgba(0,0,0,.12); transform: translateY(-2px); }
        .pcard-img-wrap { position: relative; padding-top: 100%; overflow: hidden; display: block; background: var(--gray-100); }
        .pcard-img-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 12px; transition: transform .3s; }
        .pcard:hover .pcard-img-wrap img { transform: scale(1.05); }
        .pcard-badge { position: absolute; top: 8px; left: 8px; background: var(--accent); color: #fff; font-size: .68rem; font-weight: 700; padding: 3px 7px; border-radius: 4px; }
        .pcard-wishlist { position: absolute; top: 8px; right: 8px; background: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: var(--shadow-sm); opacity: 0; transition: all .2s; color: var(--gray-600); }
        .pcard:hover .pcard-wishlist { opacity: 1; }
        .pcard-wishlist:hover { color: var(--accent); transform: scale(1.1); }
        @media (hover: none) { .pcard-wishlist { opacity: 1; } }
        .pcard-oos { position: absolute; inset: 0; background: rgba(255,255,255,.7); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--gray-600); font-size: .85rem; }
        .pcard-body { padding: 12px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .pcard-brand { font-size: .72rem; color: var(--gray-400); text-transform: uppercase; font-weight: 600; letter-spacing: .5px; }
        .pcard-name { font-size: .875rem; color: var(--dark); font-weight: 500; line-height: 1.4; }
        .pcard-rating { display: flex; align-items: center; gap: 6px; }
        .rating-pill { display: inline-flex; align-items: center; gap: 3px; background: var(--success); color: #fff; font-size: .72rem; font-weight: 700; padding: 2px 7px; border-radius: 12px; }
        .pcard-reviews { font-size: .72rem; color: var(--gray-400); }
        .pcard-pricing { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
        .pcard-price { font-size: 1rem; font-weight: 700; color: var(--dark); }
        .pcard-original { font-size: .8rem; color: var(--gray-400); text-decoration: line-through; }
        .pcard-discount { font-size: .78rem; font-weight: 600; color: var(--success); }
        .pcard-stock-warn { font-size: .72rem; color: var(--accent); font-weight: 600; }
        .pcard-btn { margin-top: auto; width: 100%; padding: 8px; background: var(--primary); color: #fff; border: none; border-radius: 6px; font-size: .8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: var(--transition); }
        .pcard-btn:hover:not(:disabled) { background: var(--primary-dark); }
        .pcard-btn:disabled { background: var(--gray-300); cursor: not-allowed; color: var(--gray-500); }
        @media (max-width: 480px) {
          .pcard-body { padding: 8px; gap: 4px; }
          .pcard-name { font-size: .8rem; }
          .pcard-price { font-size: .9rem; }
          .pcard-brand { font-size: .65rem; }
          .pcard-original { display: none; }
          .pcard-reviews { display: none; }
          .pcard-btn { font-size: .75rem; padding: 7px 4px; }
          .pcard-img-wrap img { padding: 8px; }
        }
        @media (max-width: 360px) {
          .pcard-discount { display: none; }
          .pcard-body { padding: 6px; }
        }
      `}</style>
    </div>
  )
}
