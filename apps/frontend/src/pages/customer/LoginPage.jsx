import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Email and password are required')
      return
    }

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      // Check resolved user role (the auth context sets the user state)
      // Retrieve from localStorage to read immediately
      const stored = localStorage.getItem('agri_user')
      if (stored) {
        try {
          const userObj = JSON.parse(stored)
          if (userObj.role === 'admin') {
            navigate('/admin/dashboard')
            return
          }
        } catch {}
      }
      navigate('/products')
    }
  }

  return (
    <PageWrapper title="Customer Login">
      <CustomerLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gray-50/50">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiLogIn className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to manage your orders</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-700 font-semibold hover:text-green-900 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default LoginPage
