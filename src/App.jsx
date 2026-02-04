import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import AnimatedLayout from './components/Layout/AnimatedLayout.jsx';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeOptimizer from './pages/ResumeOptimizer';
import Templates from './pages/Templates';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AnimatedLayout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/templates" element={<Templates />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/optimize" element={
          <ProtectedRoute>
            <ResumeOptimizer />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatedLayout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;