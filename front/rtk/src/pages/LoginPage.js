import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/ui';
import { Navigation } from '../widgets/Navigation';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Редирект на dashboard после успешного входа
    navigate('/dashboard');
  };

  return (
    <div className="page-container">
      <Navigation />
      <div className="page-content">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
