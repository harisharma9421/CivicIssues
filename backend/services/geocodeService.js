const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)).catch(() => global.fetch && global.fetch(...args))

const LOCATIONIQ_API_KEY = 'pk.05a674ca7a1b5c4caf05567c3cf7be41' // <-- Replace with your key

async function reverseGeocode(lat, lon) {
  if (lat === undefined || lon === undefined) return null

  const url = `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const addr = data?.address || {}
    const districtName = addr.county || addr.city || addr.town || addr.village || null
    const state = addr.state || null
    const country = addr.country || null
    const pincode = addr.postcode || null
    const displayAddress = data.display_name || null
    return { districtName, state, country, pincode, address: displayAddress }
  } catch (error) {
    console.error('Reverse geocode error:', error)
    return null
  }
}

module.exports = { reverseGeocode }



