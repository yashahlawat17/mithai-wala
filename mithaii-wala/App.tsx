import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Shop } from './pages/Shop';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/Admin';

// Simple wrapper for admin checks
const AdminGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasAccess, isAdmin } = useAuth();
  
  if (!hasAccess) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login isRegister />} />
          <Route 
            path="/admin" 
            element={
              <AdminGate>
                <AdminDashboard />
              </AdminGate>
            } 
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;