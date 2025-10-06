import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    issuesByCategory: [],
    issuesByStatus: [],
    monthlyTrends: [],
    topDistricts: [],
    userEngagement: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        issuesByCategory: [
          { category: 'Infrastructure', count: 45, percentage: 35 },
          { category: 'Sanitation', count: 32, percentage: 25 },
          { category: 'Utilities', count: 28, percentage: 22 },
          { category: 'Transportation', count: 15, percentage: 12 },
          { category: 'Safety', count: 8, percentage: 6 }
        ],
        issuesByStatus: [
          { status: 'Resolved', count: 78, color: '#10B981' },
          { status: 'In Progress', count: 32, color: '#3B82F6' },
          { status: 'Pending', count: 18, color: '#F59E0B' },
          { status: 'Rejected', count: 5, color: '#EF4444' }
        ],
        monthlyTrends: [
          { month: 'Jan', reported: 45, resolved: 38 },
          { month: 'Feb', reported: 52, resolved: 41 },
          { month: 'Mar', reported: 48, resolved: 44 },
          { month: 'Apr', reported: 61, resolved: 52 },
          { month: 'May', reported: 55, resolved: 48 },
          { month: 'Jun', reported: 67, resolved: 58 }
        ],
        topDistricts: [
          { district: 'Central Delhi', issues: 45, resolved: 38 },
          { district: 'South Delhi', issues: 38, resolved: 32 },
          { district: 'East Delhi', issues: 32, resolved: 28 },
          { district: 'West Delhi', issues: 28, resolved: 24 },
          { district: 'North Delhi', issues: 22, resolved: 18 }
        ],
        userEngagement: [
          { metric: 'Total Users', value: 1247, change: '+12%' },
          { metric: 'Active Users', value: 892, change: '+8%' },
          { metric: 'Reports Submitted', value: 156, change: '+15%' },
          { metric: 'Votes Cast', value: 2341, change: '+22%' },
          { metric: 'Comments Made', value: 567, change: '+18%' }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-green-600'
      case 'In Progress': return 'text-blue-600'
      case 'Pending': return 'text-yellow-600'
      case 'Rejected': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">Comprehensive insights into civic engagement and issue resolution</p>
            </div>
            <div className="flex gap-2">
              {['7d', '30d', '90d', '1y'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* User Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {analyticsData.userEngagement.map((metric, index) => (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card variant="gradient" className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value.toLocaleString()}</h3>
                <p className="text-gray-600 mb-2">{metric.metric}</p>
                <span className="text-sm font-medium text-green-600">{metric.change}</span>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Issues by Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Issues by Category</h2>
              <div className="space-y-4">
                {analyticsData.issuesByCategory.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">{item.category}</span>
                        <span className="text-sm text-gray-600">{item.count} issues</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Issues by Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Issues by Status</h2>
              <div className="space-y-4">
                {analyticsData.issuesByStatus.map((item, index) => (
                  <motion.div
                    key={item.status}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-gray-800">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-800">{item.count}</span>
                      <span className="text-sm text-gray-600">issues</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card variant="elevated">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Trends</h2>
            <div className="grid grid-cols-6 gap-4">
              {analyticsData.monthlyTrends.map((trend, index) => (
                <motion.div
                  key={trend.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-2">
                    <div className="text-sm font-medium text-gray-600">{trend.month}</div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Reported</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-indigo-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(trend.reported / 70) * 100}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-800 mt-1">{trend.reported}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Resolved</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(trend.resolved / 70) * 100}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-800 mt-1">{trend.resolved}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Districts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="elevated">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Districts by Activity</h2>
            <div className="space-y-4">
              {analyticsData.topDistricts.map((district, index) => (
                <motion.div
                  key={district.district}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{district.district}</h3>
                      <p className="text-sm text-gray-600">{district.issues} total issues</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{district.resolved}</div>
                    <div className="text-sm text-gray-600">resolved</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Export Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Export Analytics</h2>
                <p className="text-gray-600">Generate detailed reports and export data for further analysis</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  Export PDF
                </Button>
                <Button
                  variant="secondary"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  Export Excel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
