const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getInitData() {
  if (window.Telegram?.WebApp?.initData) {
    return window.Telegram.WebApp.initData
  }
  // Fallback for local dev
  return 'dev_mode'
}

async function request(method, path, body = null, isFormData = false) {
  const headers = {
    'x-telegram-init-data': getInitData()
  }

  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : null
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const api = {
  // Profiles
  searchProfiles: (q) => request('GET', `/api/profiles/search?q=${encodeURIComponent(q)}`),
  getProfile: (id) => request('GET', `/api/profiles/${id}`),
  createProfile: (body) => request('POST', '/api/profiles', body),

  // Reviews
  createReview: (formData) => request('POST', '/api/reviews', formData, true)
}
