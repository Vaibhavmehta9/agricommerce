import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginAdmin, registerUser, getMe } from '../api/authAPI'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('agri_token') || null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // On mount, restore session if token exists
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('agri_token')
      if (storedToken) {
        try {
          const response = await getMe()
          setUser(response.data.data || response.data.user || response.data)
          setToken(storedToken)
          setIsAuthenticated(true)
        } catch (error) {
          // Token invalid/expired
          localStorage.removeItem('agri_token')
          localStorage.removeItem('agri_user')
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setIsLoading(false)
    }
    restoreSession()
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const response = await loginAdmin({ email, password })
      const { token: newToken, user: userData, data } = response.data
      const resolvedToken = newToken || data?.token
      const resolvedUser = userData || data?.user || data

      localStorage.setItem('agri_token', resolvedToken)
      localStorage.setItem('agri_user', JSON.stringify(resolvedUser))

      setToken(resolvedToken)
      setUser(resolvedUser)
      setIsAuthenticated(true)
      toast.success('Welcome back!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(message)
      return { success: false, error: message }
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      const response = await registerUser({ name, email, password })
      const { token: newToken, user: userData, data } = response.data
      const resolvedToken = newToken || data?.token
      const resolvedUser = userData || data?.user || data

      localStorage.setItem('agri_token', resolvedToken)
      localStorage.setItem('agri_user', JSON.stringify(resolvedUser))

      setToken(resolvedToken)
      setUser(resolvedUser)
      setIsAuthenticated(true)
      toast.success('Welcome to AgriCommerce!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(() => {
    const isAdmin = user?.role === 'admin'
    localStorage.removeItem('agri_token')
    localStorage.removeItem('agri_user')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
    window.location.href = isAdmin ? '/admin/login' : '/'
  }, [user])

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
