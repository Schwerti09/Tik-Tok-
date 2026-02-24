const API_URL = import.meta.env.VITE_API_URL || ''

export function apiClient(token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const request = async (path, options = {}) => {
    const res = await fetch(`${API_URL}${path}`, { headers, ...options })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  }

  return {
    get: (path) => request(path),
    post: (path, body) =>
      request(path, { method: 'POST', body: JSON.stringify(body) }),
    put: (path, body) =>
      request(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: 'DELETE' }),
  }
}
