import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '../utils/authStore.js'
import logoUrl from '../assets/CivicVoice Logo.png'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  const { i18n, t } = useTranslation()

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`

  const isSuper = user?.role === 'superAdmin'
  const base = isSuper ? '/superadmin' : '/admin'

  return (
    <header className="sticky top-0 z-30 w-full border-b transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo and Brand */}
        <Link to={base + '/login'} className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="CivicConnect"
            className="h-10 w-10 rounded-md"
          />
          <span className="text-lg font-bold tracking-tight">
            CivicConnect {isAuthenticated && (isSuper ? 'Super Admin' : 'Admin')}
          </span>
        </Link>

        {/* Navigation Links - Center */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass}>
            {t('common.nav.home')}
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            {t('common.nav.about')}
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            {t('common.nav.services')}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            {t('common.nav.contact')}
          </NavLink>
          {isAuthenticated && isSuper && (
            <NavLink to="/superadmin/approvals" className={navLinkClass}>
              {t('common.nav.approvals')}
            </NavLink>
          )}
        </nav>

        {/* Auth Section - Right Side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <select
            className="px-2 py-1 border rounded-md text-sm transition-colors"
            value={
              i18n.language.startsWith('hi')
                ? 'hi'
                : i18n.language.startsWith('mr')
                ? 'mr'
                : 'en'
            }
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>

          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm border-r pr-3 border-gray-300">
                {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                {t('common.logout')}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={
                  location.pathname.includes('superadmin')
                    ? '/superadmin/login'
                    : '/admin/login'
                }
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors border text-indigo-700 hover:bg-indigo-50 border-indigo-700"
              >
                {t('common.signIn')}
              </Link>
              <Link
                to={
                  location.pathname.includes('superadmin')
                    ? '/superadmin/signup'
                    : '/admin/signup'
                }
                className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors bg-indigo-600 hover:bg-indigo-700"
              >
                {t('common.signUp')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
