const API_BASE_URL = '/api/superadmin'

export const superAdminApi = {
  // Check if super admin account exists
  checkSuperAdminExists: async () => {
    const response = await fetch(`${API_BASE_URL}/check`)
    return response.json()
  },

  // Create super admin account (one-time only)
  createSuperAdmin: async (data) => {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Super admin login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })
    return response.json()
  },

  requestPasswordOtp: async ({ channel, identifier }) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, identifier })
    })
    return response.json()
  },

  verifyAndResetPassword: async ({ channel, identifier, code, newPassword }) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, identifier, code, newPassword })
    })
    return response.json()
  },

  // Get super admin profile
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  },

  // Update super admin profile
  updateProfile: async (data, token) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Change password
  changePassword: async (data, token) => {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}
