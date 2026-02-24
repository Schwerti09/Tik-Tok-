import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'

// Formular zur Registrierung eines neuen Benutzers
export const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const { signup } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein')
      return
    }
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein')
      return
    }

    setLoading(true)
    try {
      await signup(email, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-3">📬</div>
        <p className="text-gray-200 font-medium">Bestätigungs-E-Mail gesendet!</p>
        <p className="text-gray-400 text-sm mt-1">
          Bitte überprüfe dein Postfach und bestätige deine E-Mail-Adresse.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => navigate('/auth')}
        >
          Zurück zum Login
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-300 mb-1">
          E-Mail
        </label>
        <input
          id="reg-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
            text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2
            focus:ring-brand-500 focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-300 mb-1">
          Passwort
        </label>
        <input
          id="reg-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
            text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2
            focus:ring-brand-500 focus:border-transparent"
          placeholder="Mindestens 8 Zeichen"
        />
      </div>

      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-300 mb-1">
          Passwort bestätigen
        </label>
        <input
          id="reg-confirm"
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
            text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2
            focus:ring-brand-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
        Konto erstellen
      </Button>
    </form>
  )
}
