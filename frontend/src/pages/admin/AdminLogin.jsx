import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../components/Logo.jsx'
import { useTranslation } from 'react-i18next'
import TextField from '../../components/TextField.jsx'
import PasswordField from '../../components/PasswordField.jsx'
import Button from '../../components/Button.jsx'
import Card from '../../components/Card.jsx'
import { districtAdminApi } from '../../utils/api.js'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
    if (field === 'email') {
      try { localStorage.setItem('lastAdminEmail', e.target.value) } catch (_) {}
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await districtAdminApi.login(formData.email, formData.password)
      if (data?.success) {
        const { login } = await import('../../utils/authStore.js').then(m => m.useAuthStore.getState())
        login(data.token, data.user)
        window.location.href = '/admin/dashboard'
      } else {
        setError(data?.msg || 'Login failed')
      }
    } catch (err) {
      setError(err?.response?.data?.msg || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="elevated">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Logo size="large" />
            </div>
            <h1 className={`text-2xl font-bold mb-2`}>
              {t('auth.districtAdminLogin')}
            </h1>
            <p>
              Access your district admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField 
              label={t('auth.email')} 
              type="email" 
              value={formData.email} 
              onChange={handleChange('email')} 
              placeholder="admin@example.com"
              autoComplete="email"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <PasswordField 
              label={t('auth.password')} 
              value={formData.password} 
              onChange={handleChange('password')} 
              placeholder="Your password"
              autoComplete="current-password"
            />

            {error && (
              <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg p-4 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              size="lg"
              className="w-full"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              }
            >
              {loading ? '...' : t('auth.accessDashboard')}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm">
              <Link
                to={`/admin/forgot-password${formData.email ? `?email=${encodeURIComponent(formData.email)}` : ''}`}
                className="font-medium text-blue-700 hover:text-blue-800"
              >
                Forgot password?
              </Link>
            </p>
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/admin/signup" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                Register here
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Super Admin?{' '}
              <Link to="/superadmin/login" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Use super admin login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminLogin