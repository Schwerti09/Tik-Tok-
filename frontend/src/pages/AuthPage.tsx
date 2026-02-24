import React, { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

// Auth-Seite mit Tabs für Login und Registrierung
const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login',
  )
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-screen">Lade…</div>
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">⚡</span>
          <h1 className="text-2xl font-bold text-white mt-2">TikFlow</h1>
          <p className="text-gray-400 text-sm mt-1">Creator Studio</p>
        </div>

        {/* Karte */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-800 p-1 mb-6">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${activeTab === tab
                    ? 'bg-gray-700 text-gray-100 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'}`}
              >
                {tab === 'login' ? 'Anmelden' : 'Registrieren'}
              </button>
            ))}
          </div>

          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
