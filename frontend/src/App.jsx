import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner.jsx'

// Layouts - Keep these as regular imports since they're used frequently
import AuthLayout from './layouts/AuthLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import SuperAdminLayout from './layouts/SuperAdminLayout.jsx'

// Lazy-loaded Auth Pages
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminSignup = React.lazy(() => import('./pages/admin/AdminSignup.jsx'))
const SuperAdminLogin = React.lazy(() => import('./pages/superadmin/SuperAdminLogin.jsx'))
const SuperAdminSignup = React.lazy(() => import('./pages/superadmin/SuperAdminSignup.jsx'))
const AdminForgotPassword = React.lazy(() => import('./pages/admin/AdminForgotPassword.jsx'))
const SuperAdminForgotPassword = React.lazy(() => import('./pages/superadmin/SuperAdminForgotPassword.jsx'))

// Lazy-loaded Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AnalyticsDashboard = React.lazy(() => import('./pages/admin/AnalyticsDashboard.jsx'))
const HeatmapView = React.lazy(() => import('./pages/admin/HeatmapView.jsx'))
const Leaderboard = React.lazy(() => import('./pages/admin/Leaderboard.jsx'))
const ReportManagement = React.lazy(() => import('./pages/admin/ReportManagement.jsx'))
const MonthlyReports = React.lazy(() => import('./pages/admin/MonthlyReports.jsx'))

// Lazy-loaded Super Admin Pages
const SuperAdminDashboard = React.lazy(() => import('./pages/superadmin/SuperAdminDashboard.jsx'))
const Approvals = React.lazy(() => import('./pages/superadmin/Approvals.jsx'))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner message="Loading application..." />}>
          <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          
          {/* Authentication Routes */}
          <Route path="/admin/login" element={
            <AuthLayout>
              <Suspense fallback={<LoadingSpinner message="Loading login..." />}>
                <AdminLogin />
              </Suspense>
            </AuthLayout>
          } />
          <Route path="/admin/signup" element={
            <AuthLayout>
              <Suspense fallback={<LoadingSpinner message="Loading signup..." />}>
                <AdminSignup />
              </Suspense>
            </AuthLayout>
          } />
          <Route path="/admin/forgot-password" element={
            <AuthLayout>
              <Suspense fallback={<LoadingSpinner message="Loading password reset..." />}>
                <AdminForgotPassword />
              </Suspense>
            </AuthLayout>
          } />
          <Route path="/superadmin/login" element={
            <AuthLayout>
              <Suspense fallback={<LoadingSpinner message="Loading super admin login..." />}>
                <SuperAdminLogin />
              </Suspense>
            </AuthLayout>
          } />
          <Route path="/superadmin/signup" element={
            <AuthLayout>
              <Suspense fallback={<LoadingSpinner message="Loading super admin signup..." />}>
                <SuperAdminSignup />
              </Suspense>
            </AuthLayout>
          } />
          <Route path="/superadmin/forgot-password" element={
            <AuthLayout>
              <Suspense fallback={<LoadingSpinner message="Loading password reset..." />}>
                <SuperAdminForgotPassword />
              </Suspense>
            </AuthLayout>
          } />
          
          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={
              <Suspense fallback={<LoadingSpinner message="Loading dashboard..." />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="dashboard" element={
              <Suspense fallback={<LoadingSpinner message="Loading dashboard..." />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="analytics" element={
              <Suspense fallback={<LoadingSpinner message="Loading analytics..." />}>
                <AnalyticsDashboard />
              </Suspense>
            } />
            <Route path="heatmap" element={
              <Suspense fallback={<LoadingSpinner message="Loading heatmap..." />}>
                <HeatmapView />
              </Suspense>
            } />
            <Route path="leaderboard" element={
              <Suspense fallback={<LoadingSpinner message="Loading leaderboard..." />}>
                <Leaderboard />
              </Suspense>
            } />
            <Route path="reports" element={
              <Suspense fallback={<LoadingSpinner message="Loading reports..." />}>
                <ReportManagement />
              </Suspense>
            } />
            <Route path="monthly-reports" element={
              <Suspense fallback={<LoadingSpinner message="Loading monthly reports..." />}>
                <MonthlyReports />
              </Suspense>
            } />
          </Route>
          
          {/* Super Admin Portal Routes */}
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={
              <Suspense fallback={<LoadingSpinner message="Loading super admin dashboard..." />}>
                <SuperAdminDashboard />
              </Suspense>
            } />
            <Route path="dashboard" element={
              <Suspense fallback={<LoadingSpinner message="Loading super admin dashboard..." />}>
                <SuperAdminDashboard />
              </Suspense>
            } />
            <Route path="approvals" element={
              <Suspense fallback={<LoadingSpinner message="Loading approvals..." />}>
                <Approvals />
              </Suspense>
            } />
          </Route>
          
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  )
}

export default App