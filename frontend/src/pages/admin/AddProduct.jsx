import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import ProductForm from '../../components/admin/ProductForm'

export default function AddProduct() {
  const navigate     = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/products', data)
      toast.success('Product created successfully!')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link to="/admin/products" style={{ color: 'var(--primary)', fontSize: '.875rem' }}>← Back to Products</Link>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Add New Product</h1>
      </div>
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
