import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import TrendsPage from './pages/TrendsPage'
import IdeasPage from './pages/IdeasPage'
import RecordingsPage from './pages/RecordingsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CommunityPage from './pages/CommunityPage'
import SchedulerPage from './pages/SchedulerPage'
import PricingPage from './pages/PricingPage'
import './App.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading…</div>
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout><DashboardPage /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/trends"
        element={
          <PrivateRoute>
            <Layout><TrendsPage /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/ideas"
        element={
          <PrivateRoute>
            <Layout><IdeasPage /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/recordings"
        element={
          <PrivateRoute>
            <Layout><RecordingsPage /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Layout><AnalyticsPage /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <PrivateRoute>
            <Layout><SchedulerPage /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/community"
        element={
          <PrivateRoute>
            <Layout><CommunityPage /></Layout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

