import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/model/authStore';
import './Navigation.css';

export const Navigation = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated) {
    return (
      <nav className="auth-navigation authenticated">
        <div className="nav-brand">
          <span className="nav-logo">РТК</span>
          <span className="nav-title">Цифровой пропуск</span>
        </div>
        <div className="nav-links">
          <span className="nav-user">
            {user?.fio || user?.email}
          </span>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'nav-link--active' : ''}`}
          >
            Дашборд
          </Link>
          <button onClick={handleLogout} className="nav-logout">
            Выйти
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="auth-navigation">
      <div className="nav-brand">
        <span className="nav-logo">РТК</span>
        <span className="nav-title">Цифровой пропуск</span>
      </div>
      <div className="nav-links">
        <Link 
          to="/login" 
          className={`nav-link ${isActive('/login') ? 'nav-link--active' : ''}`}
        >
          Вход
        </Link>
        <Link 
          to="/register" 
          className={`nav-link ${isActive('/register') ? 'nav-link--active' : ''}`}
        >
          Регистрация
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;