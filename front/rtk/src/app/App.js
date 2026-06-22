import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/model/authStore';
import { RegisterPage, LoginPage } from '../pages';
import { PassGenerator } from '../features/pass-generation/ui';
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
      <div className="dashboard-content">
        <h1>Добро пожаловать!</h1>
        <p className="user-info">Вы вошли как: <strong>{user?.fio || user?.email}</strong></p>
        <p className="user-rank">{user?.rank}</p>
        
        <div className="pass-section">
          <PassGenerator />
        </div>

        <button onClick={logout} className="logout-button">
          Выйти
        </button>
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