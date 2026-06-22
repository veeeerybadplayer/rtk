import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/model/authStore';
import { RegisterPage, LoginPage } from '../pages';
import { PassGenerator } from '../features/pass-generation/ui';
import { DecryptedText } from '../shared/ui/components';
import './App.css';

// Protected Route компонент
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Главная страница для авторизованных пользователей
const DashboardPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-brand">
          <span className="dashboard-logo">РТК</span>
          <DecryptedText 
            text="Цифровой пропуск" 
            className="dashboard-title"
            speed={30}
            delay={500}
          />
        </div>
        <button onClick={logout} className="dashboard-logout">
          Выйти
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <DecryptedText 
            text={`Добро пожаловать, ${user?.fio?.split(' ')[0] || 'Пользователь'}!`}
            className="welcome-text"
            speed={40}
            delay={800}
            as="h1"
          />
          <p className="welcome-subtitle">
            {user?.rank}
          </p>
        </div>

        <div className="dashboard-main">
          <PassGenerator />
        </div>
      </div>
    </div>
  );
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
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        {/* Редирект на логин или дашборд в зависимости от авторизации */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;