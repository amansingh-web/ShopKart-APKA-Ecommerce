import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Client Pages
import Layout        from './components/common/Layout'
import Home          from './pages/Home'
import Products      from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart          from './pages/Cart'
import Checkout      from './pages/Checkout'
import OrderSuccess  from './pages/OrderSuccess'
import Orders        from './pages/Orders'
import OrderDetail   from './pages/OrderDetail'
import Profile       from './pages/Profile'
import Wishlist      from './pages/Wishlist'
import Login         from './pages/Login'
import Register      from './pages/Register'
import NotFound      from './pages/NotFound'
import HelpCenter    from './pages/HelpCenter'
import ContactUs     from './pages/ContactUs'
import TrackOrder    from './pages/TrackOrder'
import ReturnPolicy  from './pages/ReturnPolicy'
import PrivacyPolicy from './pages/PrivacyPolicy'

// Admin Pages
import AdminLayout    from './components/admin/AdminLayout'
import Dashboard      from './pages/admin/Dashboard'
import AdminProducts  from './pages/admin/AdminProducts'
import AddProduct     from './pages/admin/AddProduct'
import EditProduct    from './pages/admin/EditProduct'
import AdminOrders    from './pages/admin/AdminOrders'
import AdminUsers     from './pages/admin/AdminUsers'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* ── Client ── */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products"           element={<Products />} />
            <Route path="products/:id"       element={<ProductDetail />} />
            <Route path="cart"               element={<Cart />} />
            <Route path="login"              element={<Login />} />
            <Route path="register"           element={<Register />} />
            <Route path="checkout"           element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="order-success/:id"  element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
            <Route path="orders"             element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="orders/:id"         element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
            <Route path="profile"            element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="wishlist"           element={<PrivateRoute><Wishlist /></PrivateRoute>} />
            <Route path="help"               element={<HelpCenter />} />
            <Route path="contact"            element={<ContactUs />} />
            <Route path="track-order"        element={<TrackOrder />} />
            <Route path="returns"            element={<ReturnPolicy />} />
            <Route path="privacy"            element={<PrivacyPolicy />} />
            <Route path="*"                  element={<NotFound />} />
          </Route>

          {/* ── Admin ── */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index               element={<Dashboard />} />
            <Route path="products"     element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id" element={<EditProduct />} />
            <Route path="orders"       element={<AdminOrders />} />
            <Route path="users"        element={<AdminUsers />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
