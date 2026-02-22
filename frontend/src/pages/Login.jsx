import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Login() {
  const { login, signup, loading, error } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (mode === 'login') {
      const result = await login(email, password);
      if (!result.success) setMessage(result.error);
    } else {
      const result = await signup(email, password, fullName);
      if (result.success) {
        setMessage('Account created! Check your email to confirm.');
        setMode('login');
      } else {
        setMessage(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">TF</span>
            </div>
            <span className="text-3xl font-bold text-white">TikFlow</span>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-muted text-sm mb-6">
            {mode === 'login'
              ? 'Sign in to your TikFlow account'
              : 'Start your content creation journey'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Jane Creator"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {(error || message) && (
              <p className={`text-sm px-3 py-2 rounded-lg ${message && !error ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {message || error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? <LoadingSpinner size="sm" /> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          © 2024 TikFlow. Built for content creators.
        </p>
      </div>
    </div>
  );
}
