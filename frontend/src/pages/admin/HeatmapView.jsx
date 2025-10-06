import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { issuesApi } from '../../utils/api.js'
import { useAuthStore } from '../../utils/authStore.js'

const HeatmapView = () => {
  const [heatmapData, setHeatmapData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const user = useAuthStore(state => state.user)
  const { t } = useTranslation()

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'sanitation', label: 'Sanitation' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'safety', label: 'Safety' }
  ]

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true)
      try {
        const params = { limit: 500, sortBy: 'createdAt', sortOrder: 'desc' }
        const { data } = await issuesApi.getAll(params)
        const items = (data?.data || data?.issues || []).map((it) => ({
          id: it._id,
          lat: it.location?.lat ?? it.location?.coordinates?.[1],
          lng: it.location?.lng ?? it.location?.coordinates?.[0],
          category: it.category,
          status: it.status,
          title: it.title,
          intensity: it.priority === 'urgent' ? 10 : it.priority === 'high' ? 8 : it.priority === 'medium' ? 6 : 4
        })).filter(p => typeof p.lat === 'number' && typeof p.lng === 'number')
        setHeatmapData(items)
      } catch (_){
      } finally {
        setLoading(false)
      }
    }
    fetchIssues()
  }, [])

  const getIntensityColor = (intensity) => {
    if (intensity >= 8) return 'bg-red-500'
    if (intensity >= 6) return 'bg-orange-500'
    if (intensity >= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'infrastructure': return 'bg-blue-500'
      case 'sanitation': return 'bg-green-500'
      case 'utilities': return 'bg-purple-500'
      case 'transportation': return 'bg-yellow-500'
      case 'safety': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredData = heatmapData.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus
    return categoryMatch && statusMatch
  })

  const adminCenter = useMemo(() => {
    const lat = typeof user?.latitude === 'number' ? user.latitude : (user?.latitude ? Number(user.latitude) : null)
    const lng = typeof user?.longitude === 'number' ? user.longitude : (user?.longitude ? Number(user.longitude) : null)
    if (typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      return { lat, lng }
    }
    return null
  }, [user])

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
          <p className="text-gray-600">Loading heatmap...</p>
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
            {t('heatmap.title')}
          </h1>
          <p className="text-gray-600">{t('heatmap.subtitle')}</p>
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
                <label className="text-sm font-medium text-gray-700">{t('heatmap.category')}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[{ value: 'all', label: t('heatmap.allCategories') }, ...categories.filter(c=>c.value!=='all')].map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">{t('heatmap.status')}</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[{ value: 'all', label: t('heatmap.allStatus') }, ...statuses.filter(s=>s.value!=='all')].map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-auto">
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card variant="elevated" className="p-0 overflow-hidden">
            <GoogleHeatmap points={filteredData} center={adminCenter} />
          </Card>
        </motion.div>

        {/* Issue List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">{t('heatmap.issuesOnMap')} ({filteredData.length})</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Export Data
                </Button>
                <Button variant="primary" size="sm">
                  Generate Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm">{issue.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(issue.category)}`} />
                      <span className="text-gray-600 capitalize">{issue.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">{issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getIntensityColor(issue.intensity)}`} />
                      <span className="text-gray-600">Intensity: {issue.intensity}/10</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card variant="elevated">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Heatmap Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{filteredData.length}</div>
                <div className="text-gray-600">{t('heatmap.totalIssues')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredData.filter(issue => issue.intensity >= 8).length}
                </div>
                <div className="text-gray-600">{t('heatmap.highPriority')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredData.filter(issue => issue.status === 'pending').length}
                </div>
                <div className="text-gray-600">{t('heatmap.pending')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredData.filter(issue => issue.status === 'resolved').length}
                </div>
                <div className="text-gray-600">{t('heatmap.resolved')}</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default HeatmapView

// Google Maps Heatmap Component
function GoogleHeatmap({ points, center }) {
  const mapRef = useRef(null)
  const heatmapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const circlesRef = useRef([])

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!apiKey) return
    const scriptId = 'google-maps-script'

    const loadScript = () => new Promise((resolve) => {
      if (window.google && window.google.maps) return resolve()
      const existing = document.getElementById(scriptId)
      if (existing) {
        existing.addEventListener('load', () => resolve())
        return
      }
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__initGoogleMaps&loading=async&v=weekly`
      script.async = true
      script.defer = true
      window.__initGoogleMaps = () => resolve()
      document.body.appendChild(script)
    })

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return
      if (!(window.google && window.google.maps && typeof window.google.maps.Map === 'function')) {
        console.error('Google Maps API not ready or not activated.')
        return
      }
      const initialCenter = center || { lat: points[0]?.lat || 20.5937, lng: points[0]?.lng || 78.9629 }
      const initialZoom = center ? 12 : (points.length ? 11 : 5)
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        mapTypeId: 'roadmap'
      })
      // We no longer use HeatmapLayer (deprecated). We'll render weighted circles instead.
      heatmapRef.current = { setMap: () => {} }
    }

    loadScript().then(initMap)
  }, [apiKey, points, center])

  useEffect(() => {
    if (!mapInstanceRef.current || !(window.google && window.google.maps)) return
    // If center changes after init, pan/zoom
    if (center) {
      try {
        mapInstanceRef.current.setCenter(center)
        mapInstanceRef.current.setZoom(12)
      } catch (_) {}
    }
    // Clear old circles
    circlesRef.current.forEach(c => c.setMap(null))
    circlesRef.current = []
    const maxIntensity = 10
    const getColor = (i) => i >= 8 ? '#ef4444' : i >= 6 ? '#f97316' : i >= 4 ? '#eab308' : '#22c55e'
    points.forEach(p => {
      const intensity = Math.min(maxIntensity, Math.max(1, p.intensity || 4))
      const radiusMeters = 100 + intensity * 40 // scale radius by intensity
      const circle = new window.google.maps.Circle({
        strokeOpacity: 0,
        fillColor: getColor(intensity),
        fillOpacity: 0.25 + (intensity / (maxIntensity * 2)),
        map: mapInstanceRef.current,
        center: { lat: p.lat, lng: p.lng },
        radius: radiusMeters
      })
      circlesRef.current.push(circle)
    })
  }, [points])

  return (
    <div className="relative h-96">
      {!apiKey && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-red-600 bg-red-50">
          Missing Google Maps API key. Set VITE_GOOGLE_MAPS_API_KEY in your .env.
        </div>
      )}
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  )
}
