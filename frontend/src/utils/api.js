import axios from 'axios'

// Use relative base URL in dev to leverage Vite proxy and avoid CORS
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (payload) => api.post('/auth/signup', payload),
  requestPasswordOtp: ({ channel, identifier }) => api.post('/auth/forgot-password/request-otp', { channel: 'email', identifier }),
  verifyAndResetPassword: ({ channel, identifier, code, newPassword }) =>
    api.post('/auth/forgot-password/verify', { channel: 'email', identifier, code, newPassword }),
}

export const adminModerationApi = {
  moderate: (userId, action, districtName, state) => api.put(`/users/${userId}/moderate`, { action, districtName, state })
}

export const districtsApi = {
  resolveByCoordinates: (lat, lng) => api.get('/districts/resolve/by-coordinates', { params: { lat, lng } })
}

export const approvalsApi = {
  list: (status = 'pending', page = 1, limit = 20) => api.get('/superadmin/district-applications', { params: { status, page, limit } }),
  decide: (id, action, reason) => api.put(`/superadmin/district-applications/${id}/decision`, { action, reason })
}

export const districtAdminApi = {
  login: (email, password) => api.post('/districts/admin/login', { email, password })
}

export const issuesApi = {
  getAll: (params = {}) => api.get('/issues', { params })
}


