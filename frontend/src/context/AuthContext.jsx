import { useState, useEffect } from 'react'
import { AuthContext } from './authContext'

const API_URL = import.meta.env.VITE_API_URL || ''

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  // Start as loading only when there is a token to validate
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token'))

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setUser(data)
        else {
          localStorage.removeItem('token')
          setToken(null)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    const accessToken = data.session?.access_token
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
    setUser(data.user)
    return data
  }

  const signup = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data
  }

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {})
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

