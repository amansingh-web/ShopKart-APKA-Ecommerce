import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() =>
    JSON.parse(localStorage.getItem('cart') || '[]')
  )

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === product._id)
      if (existing) {
        const newQty = existing.quantity + quantity
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} items in stock`)
          return prev
        }
        toast.success('Cart updated!')
        return prev.map((i) => i._id === product._id ? { ...i, quantity: newQty } : i)
      }
      toast.success('Added to cart!')
      return [...prev, {
        _id: product._id, name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.images?.[0]?.url || '',
        stock: product.stock, quantity,
      }]
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i._id !== id))
    toast.success('Removed from cart')
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id)
    setCartItems((prev) =>
      prev.map((i) => i._id === id ? { ...i, quantity } : i)
    )
  }

  const clearCart = () => setCartItems([])

  const cartCount    = cartItems.reduce((a, i) => a + i.quantity, 0)
  const cartSubtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0)
  const shippingCost = cartSubtotal >= 500 ? 0 : 40
  const taxAmount    = Math.round(cartSubtotal * 0.18)
  const cartTotal    = cartSubtotal + shippingCost + taxAmount

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartSubtotal,
      shippingCost, taxAmount, cartTotal,
      addToCart, removeFromCart, updateQuantity, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
