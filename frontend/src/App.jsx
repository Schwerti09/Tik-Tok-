import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TrendsPage from './pages/TrendsPage';
import IdeasPage from './pages/IdeasPage';
import VideosPage from './pages/VideosPage';
import SchedulePage from './pages/SchedulePage';
import AnalyticsPage from './pages/AnalyticsPage';
import CommunityPage from './pages/CommunityPage';
import PricingPage from './pages/PricingPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="trends" element={<TrendsPage />} />
        <Route path="ideas" element={<IdeasPage />} />
        <Route path="videos" element={<VideosPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="pricing" element={<PricingPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
