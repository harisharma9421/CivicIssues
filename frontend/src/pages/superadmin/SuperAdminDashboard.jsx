import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import TextField from '../../components/TextField.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { api, adminModerationApi } from '../../utils/api.js'

const SuperAdminDashboard = () => {
  const [pendingAdmins, setPendingAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalAdmins: 0,
    pendingApprovals: 0,
    activeIssues: 0,
    resolvedIssues: 0
  })
  const [search, setSearch] = useState('')

  const filteredAdmins = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return pendingAdmins
    return pendingAdmins.filter(a => (
      a.name?.toLowerCase().includes(term) ||
      a.email?.toLowerCase().includes(term) ||
      a.districtName?.toLowerCase().includes(term) ||
      a.state?.toLowerCase().includes(term)
    ))
  }, [pendingAdmins, search])

  useEffect(() => {
    let isMounted = true

    const fetchPending = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await api.get('/users', { params: { role: 'admin', approvalStatus: 'pending', limit: 100 } })
        if (!isMounted) return
        if (data?.success) {
          setPendingAdmins(data.users || [])
          setStats(prev => ({
            ...prev,
            pendingApprovals: data.users?.length || 0,
            totalAdmins: (prev.totalAdmins || 0) // optional: keep unchanged here
          }))
        }
      } catch (err) {
        if (!isMounted) return
        setError('Failed to load pending admins')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchPending()
    const interval = setInterval(fetchPending, 10000) // poll every 10s for live updates
    return () => { isMounted = false; clearInterval(interval) }
  }, [])

  const handleApprove = async (admin) => {
    try {
      setError('')
      // Use user-provided district/state if present, otherwise fall back to user's own values
      await adminModerationApi.moderate(admin._id, 'approve', admin.districtName, admin.state)
      setPendingAdmins(prev => prev.filter(a => a._id !== admin._id))
      setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, (prev.pendingApprovals || 1) - 1) }))
    } catch (e) {
      setError('Approval failed')
    }
  }

  const handleReject = async (admin) => {
    try {
      setError('')
      await adminModerationApi.moderate(admin._id, 'reject')
      setPendingAdmins(prev => prev.filter(a => a._id !== admin._id))
      setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, (prev.pendingApprovals || 1) - 1) }))
    } catch (e) {
      setError('Rejection failed')
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage admin accounts and oversee system operations</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="gradient" className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalAdmins}</h3>
              <p className="text-gray-600">Total Admins</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="gradient" className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.pendingApprovals}</h3>
              <p className="text-gray-600">Pending Approvals</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="gradient" className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.activeIssues}</h3>
              <p className="text-gray-600">Active Issues</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="gradient" className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.resolvedIssues}</h3>
              <p className="text-gray-600">Resolved Issues</p>
            </Card>
          </motion.div>
        </div>

        {/* Pending Admin Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="elevated" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pending District Admin Approvals</h2>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingAdmins.length} pending
              </span>
            </div>

            {pendingAdmins.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending admin approvals at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search */}
                <div className="mb-2">
                  <TextField
                    label="Search pending admins"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, district, state"
                  />
                </div>
                {error ? (
                  <div className="text-sm text-red-600">{error}</div>
                ) : null}
                {filteredAdmins.map((admin, index) => (
                  <motion.div
                    key={admin._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-lg">
                              {admin.name?.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{admin.name}</h3>
                            <p className="text-gray-600">{admin.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-semibold text-blue-800">Requested District Assignment</span>
                            </div>
                            <div className="text-blue-700">
                              <strong>District:</strong> {admin.districtName} | <strong>State:</strong> {admin.state}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span> {admin.phoneNumber}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Aadhar:</span> {admin.aadharNumber}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Applied:</span> {new Date(admin.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 ml-6">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(admin)}
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(admin)}
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="elevated">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              >
                View All Admins
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                Generate Reports
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              >
                System Settings
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
