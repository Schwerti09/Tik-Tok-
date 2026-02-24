import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useUiStore } from '@/store/uiStore'

// Code-Splitting: Seiten werden lazily geladen
const LandingPage   = lazy(() => import('@/pages/LandingPage'))
const AuthPage      = lazy(() => import('@/pages/AuthPage'))
const Dashboard     = lazy(() => import('@/pages/Dashboard'))
const ClipForge     = lazy(() => import('@/pages/ClipForge'))
const Pricing       = lazy(() => import('@/pages/Pricing'))

// Layout für angemeldete Benutzer
const AppLayout: React.FC = () => {
  const { sidebarOpen } = useUiStore()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${sidebarOpen ? 'ml-56' : 'ml-16'}`}
      >
        <Header />
        <main className="flex-1 pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Haupt-Router der Anwendung
const AppRouter: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="loading-screen">Lade…</div>}>
          <Routes>
            {/* Öffentliche Routen */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Geschützte Routen mit Layout */}
            <Route
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clipforge" element={<ClipForge />} />
              <Route path="/trends"    element={<Dashboard />} />
              <Route path="/ideas"     element={<Dashboard />} />
              <Route path="/schedule"  element={<Dashboard />} />
              <Route path="/analytics" element={<Dashboard />} />
              <Route path="/community" element={<Dashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default AppRouter
