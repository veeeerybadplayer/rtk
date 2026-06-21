import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../features/auth/ui';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    // Редирект на dashboard или главную
    navigate('/dashboard');
  };

  return (
    <RegisterForm onSuccess={handleRegistrationSuccess} />
  );
};

export default RegisterPage;
