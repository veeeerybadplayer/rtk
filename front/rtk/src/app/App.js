import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/model/authStore';
import { RegisterPage } from '../pages';
import './App.css';

// Protected Route компонент
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/register" />;
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Check if token exists in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isAuthenticated) {
      useAuthStore.getState().setAuthenticated(true);
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected routes will be added here */}
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
}

export default App;
