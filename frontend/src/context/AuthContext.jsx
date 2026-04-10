import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  // ✅ SAFE USER LOAD (ERROR FIX)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      return null
    }
  })

  const [loading, setLoading] = useState(false)

  // Sync user profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) fetchMe()
  }, [])

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch {
      logout()
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      return { success: true, role: data.user.role }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      toast.success('Account created successfully!')
      return { success: true }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updated) => {
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchMe, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)