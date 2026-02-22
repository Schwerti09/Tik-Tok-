import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import TrendRadar from './pages/TrendRadar';
import IdeaLab from './pages/IdeaLab';
import QuickCapture from './pages/QuickCapture';
import ClipForge from './pages/ClipForge';
import SmartScheduler from './pages/SmartScheduler';
import AnalyticsPlus from './pages/AnalyticsPlus';
import CommunityHub from './pages/CommunityHub';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/"               element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/trendradar"     element={<TrendRadar />} />
            <Route path="/idealab"        element={<IdeaLab />} />
            <Route path="/quickcapture"   element={<QuickCapture />} />
            <Route path="/clipforge"      element={<ClipForge />} />
            <Route path="/scheduler"      element={<SmartScheduler />} />
            <Route path="/analytics"      element={<AnalyticsPlus />} />
            <Route path="/community"      element={<CommunityHub />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
