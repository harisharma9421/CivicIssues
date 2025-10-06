import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo.jsx'
import TextField from '../../components/TextField.jsx'
import PasswordField from '../../components/PasswordField.jsx'
import Button from '../../components/Button.jsx'
import Card from '../../components/Card.jsx'
import { authApi, districtsApi } from '../../utils/api.js'
import { geolocationApi } from '../../utils/geolocation.js'

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    aadharNumber: '',
    districtName: '',
    state: '',
    latitude: '',
    longitude: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [geoInfo, setGeoInfo] = useState({ country: '', pincode: '', address: '' })
  const navigate = useNavigate()

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const fetchCurrentLocation = async () => {
    setLocationLoading(true)
    setError('')
    try {
      const location = await geolocationApi.getCurrentPosition()
      setFormData(prev => ({
        ...prev,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString()
      }))

      const { data } = await districtsApi.resolveByCoordinates(location.latitude, location.longitude)
      if (data?.success) {
        const d = data.data
        setFormData(prev => ({
          ...prev,
          districtName: d?.districtName || prev.districtName,
          state: d?.state || prev.state
        }))
        setGeoInfo({ country: d?.country || '', pincode: d?.pincode || '', address: d?.address || '' })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLocationLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { 
        ...formData, 
        language: 'English', 
        role: 'admin',
        country: geoInfo.country,
        pincode: geoInfo.pincode,
        address: geoInfo.address
      }
      const { data } = await authApi.signup(payload)
      if (data?.success) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 3000)
      } else {
        setError(data?.msg || 'Signup failed')
      }
    } catch (err) {
      setError(err?.response?.data?.msg || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your admin account is pending approval by the super admin. You'll be redirected to login shortly.
          </p>
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="bg-white border border-gray-200 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Logo size="large" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              District Admin Registration
            </h1>
            <p className="text-gray-600">
              Register as a district administrator and await super admin approval
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField 
                label="Full Name" 
                value={formData.name} 
                onChange={handleChange('name')} 
                placeholder="Enter your full name"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <TextField 
                label="Username" 
                value={formData.username} 
                onChange={handleChange('username')} 
                placeholder="unique_user"
                pattern="^[a-zA-Z0-9._-]{4,20}$"
                title="4-20 chars; letters, numbers, dot, underscore and hyphen only"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />

              <TextField 
                label="Email Address" 
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

              <div className="md:col-span-2">
                <PasswordField 
                  label="Password" 
                  value={formData.password} 
                  onChange={handleChange('password')} 
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
              </div>

              <TextField 
                label="Phone Number" 
                value={formData.phoneNumber} 
                onChange={handleChange('phoneNumber')} 
                placeholder="9876543210"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />

              <TextField 
                label="Aadhar Number" 
                value={formData.aadharNumber} 
                onChange={handleChange('aadharNumber')} 
                placeholder="12-digit Aadhar number"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                }
              />

              <TextField 
                label="District Name" 
                value={formData.districtName} 
                onChange={handleChange('districtName')} 
                placeholder="e.g., Central Delhi"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />

              <TextField 
                label="State" 
                value={formData.state} 
                onChange={handleChange('state')} 
                placeholder="e.g., Delhi"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              {/* Location Section */}
              <div className="md:col-span-2">
                <Card className="p-6 border border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Location Information</h3>
                      <p className="text-sm text-gray-600">Required for district assignment</p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      loading={locationLoading}
                      onClick={fetchCurrentLocation}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      }
                    >
                      {locationLoading ? 'Fetching...' : 'Fetch Current Location'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField 
                      label="Latitude" 
                      type="number"
                      step="any"
                      value={formData.latitude} 
                      onChange={handleChange('latitude')} 
                      placeholder="e.g., 28.6139"
                    />
                    <TextField 
                      label="Longitude" 
                      type="number"
                      step="any"
                      value={formData.longitude} 
                      onChange={handleChange('longitude')} 
                      placeholder="e.g., 77.2090"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <TextField 
                      label="Country" 
                      value={geoInfo.country} 
                      onChange={(e) => setGeoInfo(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="e.g., India"
                    />
                    <TextField 
                      label="Pincode" 
                      value={geoInfo.pincode} 
                      onChange={(e) => setGeoInfo(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="e.g., 411001"
                    />
                    <TextField 
                      label="Resolved Address" 
                      value={geoInfo.address} 
                      onChange={(e) => setGeoInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Full address"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Click "Fetch Current Location" to automatically detect your coordinates, or enter them manually.
                  </p>
                </Card>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium text-sm">{error}</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/admin/login" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                Sign in here
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Super Admin?{' '}
              <Link to="/superadmin/signup" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Create super admin account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminSignup