import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, useAuthState } from './hooks/useAuth.js';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TrendRadar from './pages/TrendRadar.jsx';
import IdeaLab from './pages/IdeaLab.jsx';
import QuickCapture from './pages/QuickCapture.jsx';
import ClipForge from './pages/ClipForge.jsx';
import SmartScheduler from './pages/SmartScheduler.jsx';
import AnalyticsPlus from './pages/AnalyticsPlus.jsx';
import CommunityHub from './pages/CommunityHub.jsx';

function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="md:ml-60 pt-16 min-h-screen">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthState();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading TikFlow..." />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

function AppRoutes() {
  const auth = useAuthState();
  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={auth.user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trend-radar" element={<ProtectedRoute><TrendRadar /></ProtectedRoute>} />
          <Route path="/idea-lab" element={<ProtectedRoute><IdeaLab /></ProtectedRoute>} />
          <Route path="/quick-capture" element={<ProtectedRoute><QuickCapture /></ProtectedRoute>} />
          <Route path="/clip-forge" element={<ProtectedRoute><ClipForge /></ProtectedRoute>} />
          <Route path="/smart-scheduler" element={<ProtectedRoute><SmartScheduler /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPlus /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityHub /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default AppRoutes;
