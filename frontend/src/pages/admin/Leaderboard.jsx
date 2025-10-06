import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const periods = [
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'quarterly', label: 'This Quarter' },
    { value: 'yearly', label: 'This Year' }
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'reports', label: 'Reports Submitted' },
    { value: 'votes', label: 'Votes Cast' },
    { value: 'comments', label: 'Comments Made' },
    { value: 'resolutions', label: 'Issues Resolved' }
  ]

  useEffect(() => {
    // Simulate loading leaderboard data
    setTimeout(() => {
      setLeaderboardData([
        {
          id: 1,
          name: 'Rajesh Kumar',
          avatar: 'RK',
          points: 1250,
          reports: 15,
          votes: 45,
          comments: 23,
          resolutions: 8,
          rank: 1,
          badge: 'Champion',
          district: 'Central Delhi',
          joinDate: '2023-01-15',
          lastActive: '2024-01-15'
        },
        {
          id: 2,
          name: 'Priya Sharma',
          avatar: 'PS',
          points: 1180,
          reports: 12,
          votes: 38,
          comments: 31,
          resolutions: 6,
          rank: 2,
          badge: 'Advocate',
          district: 'South Delhi',
          joinDate: '2023-03-20',
          lastActive: '2024-01-14'
        },
        {
          id: 3,
          name: 'Amit Singh',
          avatar: 'AS',
          points: 1050,
          reports: 18,
          votes: 42,
          comments: 19,
          resolutions: 5,
          rank: 3,
          badge: 'Activist',
          district: 'East Delhi',
          joinDate: '2023-02-10',
          lastActive: '2024-01-13'
        },
        {
          id: 4,
          name: 'Sunita Patel',
          avatar: 'SP',
          points: 980,
          reports: 10,
          votes: 35,
          comments: 28,
          resolutions: 7,
          rank: 4,
          badge: 'Contributor',
          district: 'West Delhi',
          joinDate: '2023-04-05',
          lastActive: '2024-01-12'
        },
        {
          id: 5,
          name: 'Vikram Mehta',
          avatar: 'VM',
          points: 920,
          reports: 14,
          votes: 29,
          comments: 22,
          resolutions: 4,
          rank: 5,
          badge: 'Supporter',
          district: 'North Delhi',
          joinDate: '2023-05-15',
          lastActive: '2024-01-11'
        },
        {
          id: 6,
          name: 'Anita Gupta',
          avatar: 'AG',
          points: 880,
          reports: 11,
          votes: 33,
          comments: 25,
          resolutions: 3,
          rank: 6,
          badge: 'Supporter',
          district: 'Central Delhi',
          joinDate: '2023-06-20',
          lastActive: '2024-01-10'
        },
        {
          id: 7,
          name: 'Ravi Verma',
          avatar: 'RV',
          points: 820,
          reports: 9,
          votes: 31,
          comments: 20,
          resolutions: 5,
          rank: 7,
          badge: 'Supporter',
          district: 'South Delhi',
          joinDate: '2023-07-10',
          lastActive: '2024-01-09'
        },
        {
          id: 8,
          name: 'Meera Joshi',
          avatar: 'MJ',
          points: 780,
          reports: 13,
          votes: 27,
          comments: 18,
          resolutions: 2,
          rank: 8,
          badge: 'Supporter',
          district: 'East Delhi',
          joinDate: '2023-08-15',
          lastActive: '2024-01-08'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Champion': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 'Advocate': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
      case 'Activist': return 'bg-gradient-to-r from-red-400 to-red-600 text-white'
      case 'Contributor': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
      case 'Supporter': return 'bg-gradient-to-r from-green-400 to-green-600 text-white'
      default: return 'bg-gray-400 text-white'
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
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
          <p className="text-gray-600">Loading leaderboard...</p>
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
            Citizen Leaderboard
          </h1>
          <p className="text-gray-600">Recognizing the most active and engaged community members</p>
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
                <label className="text-sm font-medium text-gray-700">Period:</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
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

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card variant="elevated">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Top Performers</h2>
            <div className="flex justify-center items-end gap-4">
              {/* 2nd Place */}
              {leaderboardData[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-24 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl flex flex-col items-center justify-end pb-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                      {leaderboardData[1].avatar}
                    </div>
                    <div className="text-2xl">🥈</div>
                  </div>
                  <h3 className="font-semibold text-gray-800">{leaderboardData[1].name}</h3>
                  <p className="text-sm text-gray-600">{leaderboardData[1].points} points</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(leaderboardData[1].badge)}`}>
                    {leaderboardData[1].badge}
                  </span>
                </motion.div>
              )}

              {/* 1st Place */}
              {leaderboardData[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="w-28 h-36 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-t-xl flex flex-col items-center justify-end pb-4 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
                      {leaderboardData[0].avatar}
                    </div>
                    <div className="text-3xl">🥇</div>
                  </div>
                  <h3 className="font-semibold text-gray-800">{leaderboardData[0].name}</h3>
                  <p className="text-sm text-gray-600">{leaderboardData[0].points} points</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(leaderboardData[0].badge)}`}>
                    {leaderboardData[0].badge}
                  </span>
                </motion.div>
              )}

              {/* 3rd Place */}
              {leaderboardData[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="w-24 h-28 bg-gradient-to-br from-orange-200 to-orange-300 rounded-t-xl flex flex-col items-center justify-end pb-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                      {leaderboardData[2].avatar}
                    </div>
                    <div className="text-2xl">🥉</div>
                  </div>
                  <h3 className="font-semibold text-gray-800">{leaderboardData[2].name}</h3>
                  <p className="text-sm text-gray-600">{leaderboardData[2].points} points</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(leaderboardData[2].badge)}`}>
                    {leaderboardData[2].badge}
                  </span>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="elevated">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Complete Leaderboard</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Export Data
                </Button>
                <Button variant="primary" size="sm">
                  Generate Report
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">
                          {getRankIcon(user.rank)}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.district}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{user.reports} reports</span>
                        <span>{user.votes} votes</span>
                        <span>{user.comments} comments</span>
                        <span>{user.resolutions} resolved</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{user.points}</div>
                      <div className="text-sm text-gray-600">points</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(user.badge)}`}>
                      {user.badge}
                    </span>
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
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card variant="elevated">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Community Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{leaderboardData.length}</div>
                <div className="text-gray-600">Active Citizens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {leaderboardData.reduce((sum, user) => sum + user.reports, 0)}
                </div>
                <div className="text-gray-600">Total Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {leaderboardData.reduce((sum, user) => sum + user.votes, 0)}
                </div>
                <div className="text-gray-600">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {leaderboardData.reduce((sum, user) => sum + user.resolutions, 0)}
                </div>
                <div className="text-gray-600">Issues Resolved</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Leaderboard
