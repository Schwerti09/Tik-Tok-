import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/stores/appStore'

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

const registerSchema = Yup.object({
  fullName: Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, signUp, signInWithGoogle, isAuthenticated } = useAuth()
  const { addNotification } = useAppStore()

  if (isAuthenticated) return <Navigate to="/" replace />

  const loginFormik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await signIn(values.email, values.password)
        addNotification({ type: 'success', message: 'Welcome back!' })
      } catch (error) {
        addNotification({
          type: 'error',
          message: error instanceof Error ? error.message : 'Sign in failed',
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  const registerFormik = useFormik({
    initialValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await signUp(values.email, values.password, values.fullName)
        addNotification({
          type: 'success',
          message: 'Account created! Please check your email to verify.',
        })
        setMode('login')
      } catch (error) {
        addNotification({
          type: 'error',
          message: error instanceof Error ? error.message : 'Registration failed',
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  const InputField: React.FC<{
    icon: React.ReactNode
    type: string
    placeholder: string
    name: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    error?: string
    touched?: boolean
    rightElement?: React.ReactNode
  }> = ({ icon, type, placeholder, name, value, onChange, error, touched, rightElement }) => (
    <div>
      <div
        className={`flex items-center gap-3 bg-neutral-900 border rounded-xl px-4 py-3 focus-within:border-pink-500/50 transition-colors ${
          error && touched ? 'border-red-500/50' : 'border-neutral-800'
        }`}
      >
        <span className="text-neutral-500">{icon}</span>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="bg-transparent flex-1 text-white placeholder-neutral-500 outline-none text-sm"
        />
        {rightElement}
      </div>
      {error && touched && (
        <p className="text-red-400 text-xs mt-1.5 ml-1">{error}</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-600/10 via-black to-cyan-600/10 pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-400 mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">CreatorStudio</h1>
          <p className="text-neutral-400 mt-2 text-sm">
            AI-powered content creation for modern creators
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {/* Tabs */}
          <div className="flex bg-neutral-900 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                  mode === tab
                    ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {mode === 'login' ? (
            <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
              <InputField
                icon={<Mail size={16} />}
                type="email"
                name="email"
                placeholder="Email address"
                value={loginFormik.values.email}
                onChange={loginFormik.handleChange}
                error={loginFormik.errors.email}
                touched={loginFormik.touched.email}
              />
              <InputField
                icon={<Lock size={16} />}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={loginFormik.values.password}
                onChange={loginFormik.handleChange}
                error={loginFormik.errors.password}
                touched={loginFormik.touched.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-500 hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loginFormik.isSubmitting}
              >
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={registerFormik.handleSubmit} className="space-y-4">
              <InputField
                icon={<User size={16} />}
                type="text"
                name="fullName"
                placeholder="Full name"
                value={registerFormik.values.fullName}
                onChange={registerFormik.handleChange}
                error={registerFormik.errors.fullName}
                touched={registerFormik.touched.fullName}
              />
              <InputField
                icon={<Mail size={16} />}
                type="email"
                name="email"
                placeholder="Email address"
                value={registerFormik.values.email}
                onChange={registerFormik.handleChange}
                error={registerFormik.errors.email}
                touched={registerFormik.touched.email}
              />
              <InputField
                icon={<Lock size={16} />}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password (min 8 characters)"
                value={registerFormik.values.password}
                onChange={registerFormik.handleChange}
                error={registerFormik.errors.password}
                touched={registerFormik.touched.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-500 hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <InputField
                icon={<Lock size={16} />}
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={registerFormik.values.confirmPassword}
                onChange={registerFormik.handleChange}
                error={registerFormik.errors.confirmPassword}
                touched={registerFormik.touched.confirmPassword}
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={registerFormik.isSubmitting}
              >
                Create Account
              </Button>
            </form>
          )}

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs text-neutral-500 bg-neutral-900 px-3">
              or continue with
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={signInWithGoogle}
            leftIcon={
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
          >
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-neutral-600 text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
