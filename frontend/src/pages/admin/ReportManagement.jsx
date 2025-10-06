import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

const ReportManagement = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    dateRange: 'all'
  })
  const [selectedReports, setSelectedReports] = useState([])

  useEffect(() => {
    // Simulate loading reports
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: 'Broken Street Light on Main Road',
          description: 'Street light has been broken for 3 days, causing safety concerns for pedestrians',
          category: 'Infrastructure',
          status: 'pending',
          priority: 'high',
          location: 'Central Delhi',
          reportedBy: 'John Doe',
          createdAt: '2024-01-15',
          votes: 12,
          comments: 5,
          assignedTo: null,
          estimatedResolution: null
        },
        {
          id: 2,
          title: 'Garbage Collection Issue',
          description: 'Garbage is not being collected regularly in Sector 15',
          category: 'Sanitation',
          status: 'in_progress',
          priority: 'medium',
          location: 'South Delhi',
          reportedBy: 'Jane Smith',
          createdAt: '2024-01-14',
          votes: 8,
          comments: 3,
          assignedTo: 'Sanitation Department',
          estimatedResolution: '2024-01-20'
        },
        {
          id: 3,
          title: 'Water Supply Problem',
          description: 'No water supply for 2 days in the area',
          category: 'Utilities',
          status: 'resolved',
          priority: 'high',
          location: 'East Delhi',
          reportedBy: 'Mike Johnson',
          createdAt: '2024-01-13',
          votes: 15,
          comments: 8,
          assignedTo: 'Water Department',
          estimatedResolution: '2024-01-16'
        },
        {
          id: 4,
          title: 'Pothole on Highway',
          description: 'Large pothole causing traffic issues and vehicle damage',
          category: 'Transportation',
          status: 'pending',
          priority: 'high',
          location: 'West Delhi',
          reportedBy: 'Sarah Wilson',
          createdAt: '2024-01-12',
          votes: 20,
          comments: 12,
          assignedTo: null,
          estimatedResolution: null
        },
        {
          id: 5,
          title: 'Street Vendor Encroachment',
          description: 'Vendors blocking pedestrian walkway',
          category: 'Safety',
          status: 'in_progress',
          priority: 'medium',
          location: 'North Delhi',
          reportedBy: 'David Brown',
          createdAt: '2024-01-11',
          votes: 6,
          comments: 2,
          assignedTo: 'Traffic Police',
          estimatedResolution: '2024-01-18'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for:`, selectedReports)
    setSelectedReports([])
  }

  const handleAssignReport = (reportId) => {
    console.log('Assigning report:', reportId)
  }

  const handleStatusChange = (reportId, newStatus) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    ))
  }

  if (loading) {
    return <LoadingSpinner message="Loading reports..." />
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Report Management
          </h1>
          <p className="text-gray-600">Manage and track all civic issue reports</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="elevated">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Priority:</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="ml-auto flex gap-2">
                {selectedReports.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleBulkAction('assign')}>
                      Assign Selected
                    </Button>
                    <Button variant="success" size="sm" onClick={() => handleBulkAction('approve')}>
                      Approve Selected
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleBulkAction('reject')}>
                      Reject Selected
                    </Button>
                  </div>
                )}
                <Button variant="primary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Reports ({reports.length})</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Export
                </Button>
                <Button variant="primary" size="sm">
                  Generate Report
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReports(prev => [...prev, report.id])
                            } else {
                              setSelectedReports(prev => prev.filter(id => id !== report.id))
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{report.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Category:</span> {report.category}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location:</span> {report.location}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Reported by:</span> {report.reportedBy}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Date:</span> {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Votes:</span> {report.votes}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Comments:</span> {report.comments}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Assigned to:</span> {report.assignedTo || 'Unassigned'}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Est. Resolution:</span> {report.estimatedResolution || 'Not set'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <Button variant="primary" size="sm" onClick={() => handleAssignReport(report.id)}>
                        Assign
                      </Button>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => handleStatusChange(report.id, 'resolved')}
                          disabled={report.status === 'resolved'}
                        >
                          ✓
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleStatusChange(report.id, 'rejected')}
                          disabled={report.status === 'rejected'}
                        >
                          ✗
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ReportManagement
