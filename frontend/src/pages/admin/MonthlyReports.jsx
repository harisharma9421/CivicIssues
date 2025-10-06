import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'

const MonthlyReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    // Simulate loading monthly reports
    setTimeout(() => {
      setReports([
        {
          id: 1,
          month: '2024-01',
          title: 'January 2024 Civic Report',
          totalIssues: 156,
          resolvedIssues: 128,
          pendingIssues: 23,
          rejectedIssues: 5,
          avgResolutionTime: '4.2 days',
          topCategory: 'Infrastructure',
          topDistrict: 'Central Delhi',
          citizenEngagement: 89,
          generatedAt: '2024-02-01',
          status: 'completed'
        },
        {
          id: 2,
          month: '2023-12',
          title: 'December 2023 Civic Report',
          totalIssues: 142,
          resolvedIssues: 118,
          pendingIssues: 19,
          rejectedIssues: 5,
          avgResolutionTime: '3.8 days',
          topCategory: 'Sanitation',
          topDistrict: 'South Delhi',
          citizenEngagement: 76,
          generatedAt: '2024-01-01',
          status: 'completed'
        },
        {
          id: 3,
          month: '2023-11',
          title: 'November 2023 Civic Report',
          totalIssues: 134,
          resolvedIssues: 112,
          pendingIssues: 17,
          rejectedIssues: 5,
          avgResolutionTime: '4.1 days',
          topCategory: 'Utilities',
          topDistrict: 'East Delhi',
          citizenEngagement: 82,
          generatedAt: '2023-12-01',
          status: 'completed'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleGenerateReport = async () => {
    setGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      const newReport = {
        id: reports.length + 1,
        month: selectedMonth,
        title: `${new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Civic Report`,
        totalIssues: Math.floor(Math.random() * 100) + 100,
        resolvedIssues: Math.floor(Math.random() * 80) + 80,
        pendingIssues: Math.floor(Math.random() * 20) + 10,
        rejectedIssues: Math.floor(Math.random() * 5) + 2,
        avgResolutionTime: `${(Math.random() * 2 + 3).toFixed(1)} days`,
        topCategory: ['Infrastructure', 'Sanitation', 'Utilities', 'Transportation', 'Safety'][Math.floor(Math.random() * 5)],
        topDistrict: ['Central Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North Delhi'][Math.floor(Math.random() * 5)],
        citizenEngagement: Math.floor(Math.random() * 30) + 70,
        generatedAt: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
      setReports(prev => [newReport, ...prev])
      setGenerating(false)
    }, 2000)
  }

  const handleDownloadReport = (reportId) => {
    console.log('Downloading report:', reportId)
    // Simulate PDF download
  }

  const handleEmailReport = (reportId) => {
    console.log('Emailing report:', reportId)
    // Simulate email sending
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Loading monthly reports...</p>
        </motion.div>
      </div>
    )
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
            Monthly Reports
          </h1>
          <p className="text-gray-600">Generate and manage comprehensive monthly civic reports</p>
        </motion.div>

        {/* Generate New Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Generate New Report</h2>
                <p className="text-gray-600">Create a comprehensive monthly report with analytics and insights</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Month:</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <Button
                  variant="primary"
                  loading={generating}
                  onClick={handleGenerateReport}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  {generating ? 'Generating...' : 'Generate Report'}
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
              <h2 className="text-xl font-bold text-gray-800">Monthly Reports ({reports.length})</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>

            <div className="space-y-6">
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
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">{report.title}</h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {report.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          Generated: {new Date(report.generatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">{report.totalIssues}</div>
                          <div className="text-sm text-gray-600">Total Issues</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{report.resolvedIssues}</div>
                          <div className="text-sm text-gray-600">Resolved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{report.pendingIssues}</div>
                          <div className="text-sm text-gray-600">Pending</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{report.rejectedIssues}</div>
                          <div className="text-sm text-gray-600">Rejected</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Avg. Resolution Time:</span> {report.avgResolutionTime}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Top Category:</span> {report.topCategory}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Top District:</span> {report.topDistrict}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Citizen Engagement:</span> {report.citizenEngagement}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        }
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEmailReport(report.id)}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        }
                      >
                        Email Report
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Report Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card variant="elevated">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Report Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{reports.length}</div>
                <div className="text-gray-600">Total Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {reports.reduce((sum, report) => sum + report.totalIssues, 0)}
                </div>
                <div className="text-gray-600">Total Issues Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reports.reduce((sum, report) => sum + report.resolvedIssues, 0)}
                </div>
                <div className="text-gray-600">Total Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {reports.length > 0 ? (reports.reduce((sum, report) => sum + report.citizenEngagement, 0) / reports.length).toFixed(1) : 0}%
                </div>
                <div className="text-gray-600">Avg. Engagement</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default MonthlyReports
