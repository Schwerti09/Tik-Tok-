import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import TrendRadarPage from './pages/TrendRadarPage'
import IdeaLabPage from './pages/IdeaLabPage'
import QuickCapturePage from './pages/QuickCapturePage'
import ClipForgePage from './pages/ClipForgePage'
import SchedulerPage from './pages/SchedulerPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CommunityPage from './pages/CommunityPage'
import SettingsPage from './pages/SettingsPage'
import AdminPage from './pages/AdminPage'
import Layout from './components/Layout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trends" element={<TrendRadarPage />} />
        <Route path="/ideas" element={<IdeaLabPage />} />
        <Route path="/capture" element={<QuickCapturePage />} />
        <Route path="/clipforge" element={<ClipForgePage />} />
        <Route path="/scheduler" element={<SchedulerPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
