import React, { useState, useEffect } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    activeUsers: 0
  })
  const [recentReports, setRecentReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalReports: 156,
        pendingReports: 23,
        resolvedReports: 128,
        activeUsers: 89
      })
      setRecentReports([
        {
          id: 1,
          title: 'Broken Street Light',
          category: 'Infrastructure',
          status: 'pending',
          priority: 'high',
          location: 'Central Delhi',
          reportedBy: 'John Doe',
          createdAt: '2024-01-15',
          votes: 12
        },
        {
          id: 2,
          title: 'Garbage Collection Issue',
          category: 'Sanitation',
          status: 'in_progress',
          priority: 'medium',
          location: 'South Delhi',
          reportedBy: 'Jane Smith',
          createdAt: '2024-01-14',
          votes: 8
        },
        {
          id: 3,
          title: 'Water Supply Problem',
          category: 'Utilities',
          status: 'resolved',
          priority: 'high',
          location: 'East Delhi',
          reportedBy: 'Mike Johnson',
          createdAt: '2024-01-13',
          votes: 15
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'resolved': return 'bg-green-100 text-green-800 border border-green-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border border-green-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage civic issues and oversee community engagement for your district</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              key: 'totalReports', 
              label: 'Total Reports', 
              value: stats.totalReports,
              icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              color: 'blue'
            },
            { 
              key: 'pendingReports', 
              label: 'Pending Reports', 
              value: stats.pendingReports,
              icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: 'yellow'
            },
            { 
              key: 'resolvedReports', 
              label: 'Resolved Reports', 
              value: stats.resolvedReports,
              icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: 'green'
            },
            { 
              key: 'activeUsers', 
              label: 'Active Users', 
              value: stats.activeUsers,
              icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              ),
              color: 'purple'
            }
          ].map((stat) => (
            <Card key={stat.key} className="h-full border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center mr-4 border border-${stat.color}-100`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card className="h-full border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Recent Reports</h2>
                  <p className="text-gray-600 text-sm">Latest civic issues reported by citizens</p>
                </div>
                <Button variant="secondary" size="sm">
                  View All Reports
                </Button>
              </div>

              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                            {report.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div><span className="font-medium text-gray-700">Category:</span> {report.category}</div>
                          <div><span className="font-medium text-gray-700">Location:</span> {report.location}</div>
                          <div><span className="font-medium text-gray-700">Reported by:</span> {report.reportedBy}</div>
                          <div><span className="font-medium text-gray-700">Date:</span> {new Date(report.createdAt).toLocaleDateString()}</div>
                          <div><span className="font-medium text-gray-700">Votes:</span> {report.votes}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                        <Button variant="secondary" size="sm">
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="h-full border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Quick Actions</h2>
                <p className="text-gray-600 text-sm">Frequently used tasks</p>
              </div>
              <div className="space-y-3">
                <Button variant="primary" size="lg" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Reports
                </Button>
                
                <Button variant="secondary" size="lg" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </Button>
                
                <Button variant="success" size="lg" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Heatmap View
                </Button>
                
                <Button variant="ghost" size="lg" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard