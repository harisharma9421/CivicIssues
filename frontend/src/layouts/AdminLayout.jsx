import React, { useState, useMemo } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import Button from '../components/Button.jsx'
import { useAuthStore } from '../utils/authStore.js'
import { useTranslation } from 'react-i18next'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuthStore()
  const { t } = useTranslation()
  const currentUser = auth?.user || JSON.parse(localStorage.getItem('user') || 'null')
  const displayName = useMemo(() => currentUser?.name || t('auth.districtAdminLogin'), [currentUser, t])
  const displayEmail = useMemo(() => currentUser?.email || currentUser?.adminEmail || 'admin@example.com', [currentUser])

  const navigation = [
    { name: t('common.adminLayout.dashboard'), href: '/admin/dashboard', icon: '📊' },
    { name: t('common.adminLayout.analytics'), href: '/admin/analytics', icon: '📈' },
    { name: t('common.adminLayout.heatmap'), href: '/admin/heatmap', icon: '🗺️' },
    { name: t('common.adminLayout.reports'), href: '/admin/reports', icon: '📋' },
    { name: t('common.adminLayout.leaderboard'), href: '/admin/leaderboard', icon: '🏆' },
    { name: t('common.adminLayout.monthly'), href: '/admin/monthly-reports', icon: '📅' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 bg-white ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Logo />
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="p-2 rounded-lg transition-colors lg:hidden hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                {displayName?.split(' ').map(n => n[0]).join('').slice(0,2) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-gray-900">{displayName}</div>
                <div className="text-sm truncate text-gray-600">{displayEmail}</div>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              className="w-full"
              onClick={handleLogout}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            >
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b px-6 py-4 bg-white border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg transition-colors lg:hidden hover:bg-gray-100"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {navigation.find(item => item.href === location.pathname)?.name || t('common.adminLayout.portalTitleFallback')}
                </h1>
                <p className="text-sm mt-1 text-gray-600">{t('common.adminLayout.portalSubtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg transition-colors group relative hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <div className="rounded-xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout