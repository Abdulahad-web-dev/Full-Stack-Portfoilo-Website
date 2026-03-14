import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';

import Background3D from './components/ui/Background3D';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import HomePage from './pages/HomePage';

// Admin Pages
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLoginPage from './pages/admin/LoginPage';
import DashboardLayout from './pages/admin/DashboardLayout';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => { lenis.destroy(); };
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden relative text-[#F0F0FF]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Background3D />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
