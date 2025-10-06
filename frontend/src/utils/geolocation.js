// Geolocation utility for fetching current location
export const geolocationApi = {
  // Get current position using browser's geolocation API
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location'
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
            default:
              errorMessage = 'An unknown error occurred while retrieving location'
              break
          }
          
          reject(new Error(errorMessage))
        },
        options
      )
    })
  },

  // Check if geolocation is supported
  isSupported: () => {
    return 'geolocation' in navigator
  },

  // Get location with fallback to IP-based location
  getLocationWithFallback: async () => {
    try {
      // Try browser geolocation first
      return await geolocationApi.getCurrentPosition()
    } catch (error) {
      console.warn('Browser geolocation failed, trying IP-based location:', error.message)
      
      try {
        // Fallback to IP-based location service
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        
        if (data.latitude && data.longitude) {
          return {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: null,
            source: 'ip'
          }
        } else {
          throw new Error('IP-based location service failed')
        }
      } catch (fallbackError) {
        throw new Error('Unable to determine location. Please enter coordinates manually.')
      }
    }
  },

  // Format coordinates for display
  formatCoordinates: (latitude, longitude, precision = 6) => {
    return {
      latitude: parseFloat(latitude).toFixed(precision),
      longitude: parseFloat(longitude).toFixed(precision)
    }
  },

  // Validate coordinates
  validateCoordinates: (latitude, longitude) => {
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    
    if (isNaN(lat) || isNaN(lng)) {
      return { valid: false, error: 'Invalid coordinate format' }
    }
    
    if (lat < -90 || lat > 90) {
      return { valid: false, error: 'Latitude must be between -90 and 90' }
    }
    
    if (lng < -180 || lng > 180) {
      return { valid: false, error: 'Longitude must be between -180 and 180' }
    }
    
    return { valid: true }
  }
}
