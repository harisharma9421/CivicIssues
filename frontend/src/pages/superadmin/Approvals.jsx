import React, { useEffect, useState } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import TextField from '../../components/TextField.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { approvalsApi } from '../../utils/api.js'

const Approvals = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applications, setApplications] = useState([])
  const [reason, setReason] = useState('')

  const fetchPending = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await approvalsApi.list('pending', 1, 100)
      if (data?.success) setApplications(data.data)
    } catch (err) {
      setError('Failed to load pending applications',err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPending() }, [])

  const approve = async (appId) => {
    try {
      await approvalsApi.decide(appId, 'approve', reason)
      setReason('')
      await fetchPending()
    } catch (e) {
      setError('Approval failed',e)
    }
  }

  const reject = async (appId) => {
    try {
      await approvalsApi.decide(appId, 'reject', reason)
      setReason('')
      await fetchPending()
    } catch (e) {
      setError('Rejection failed',e)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading pending approvals..." className="bg-gray-50" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Approvals</h1>
              <p className="text-gray-600">Review and approve pending district admin applications</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {applications.length} Pending
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        <Card className="bg-white border border-gray-200 rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pending Applications</h2>
              <div className="flex items-center gap-3">
                <TextField 
                  label="Reason (optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for decision"
                  className="bg-gray-50 border-gray-200 focus:border-blue-500"
                />
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={fetchPending}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending applications at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 font-semibold text-sm">
                              {app?.adminProfile?.name?.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{app?.adminProfile?.name}</h3>
                            <p className="text-gray-600 mb-3">{app?.adminProfile?.email}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Aadhar:</span>
                                <p className="text-gray-600 mt-1">{app?.adminProfile?.aadharNumber || 'Not provided'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Phone:</span>
                                <p className="text-gray-600 mt-1">{app?.adminProfile?.phoneNumber || 'Not provided'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Requested District:</span>
                                <p className="text-gray-600 mt-1">{app?.name || 'Not specified'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">State:</span>
                                <p className="text-gray-600 mt-1">{app?.state || 'Not specified'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Pincode:</span>
                                <p className="text-gray-600 mt-1">{app?.pincode || '—'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Applied:</span>
                                <p className="text-gray-600 mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mt-2 truncate">{app?.address}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-6 flex-shrink-0">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => approve(app._id)}
                          className="bg-green-600 hover:bg-green-700 border-0 text-white px-4 py-2"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => reject(app._id)}
                          className="bg-red-600 hover:bg-red-700 border-0 text-white px-4 py-2"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Approvals