import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import ProductForm from '../../components/admin/ProductForm'

export default function EditProduct() {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const [product,  setProduct]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => { toast.error('Product not found'); navigate('/admin/products') })
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await api.put(`/products/${id}`, data)
      toast.success('Product updated successfully!')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link to="/admin/products" style={{ color: 'var(--primary)', fontSize: '.875rem' }}>← Back to Products</Link>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Edit Product</h1>
      </div>
      {product && <ProductForm initial={product} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
