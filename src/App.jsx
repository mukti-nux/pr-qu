import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardGuru from './pages/DashboardGuru';
import DashboardSiswa from './pages/DashboardSiswa';
import Manajemen from './pages/Manajemen';
import NotifikasiWA from './pages/NotifikasiWA';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdmin from './pages/SuperAdmin';

// Route Guards
const ProtectedRoute = ({ children, role }) => {
  const session = JSON.parse(localStorage.getItem('user_session') || 'null');
  if (!session) return <Navigate to="/login" />;
  if (role && session.role !== role) {
    return <Navigate to={session.role === 'guru' ? '/dashboard-guru' : '/dashboard-siswa'} />;
  }
  return children;
};

const SuperAdminRoute = ({ children }) => {
  const session = JSON.parse(localStorage.getItem('superadmin_session') || 'null');
  if (!session) return <Navigate to="/super-admin/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard-guru" 
          element={
            <ProtectedRoute role="guru">
              <DashboardGuru />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-siswa" 
          element={
            <ProtectedRoute role="siswa">
              <DashboardSiswa />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/manajemen" 
          element={
            <ProtectedRoute role="guru">
              <Manajemen />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/notifikasi-wa" 
          element={
            <ProtectedRoute role="guru">
              <NotifikasiWA />
            </ProtectedRoute>
          } 
        />

        {/* SuperAdmin Routes */}
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route 
          path="/super-admin" 
          element={
            <SuperAdminRoute>
              <SuperAdmin />
            </SuperAdminRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
