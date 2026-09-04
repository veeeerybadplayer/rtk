import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../features/auth/ui';
import { AuthLayout } from '../shared/ui/components';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    // Бэкенд не логинит пользователя при регистрации — ведём на вход
    navigate('/login');
  };

  return (
    <AuthLayout>
      <RegisterForm onSuccess={handleRegistrationSuccess} />
    </AuthLayout>
  );
};

export default RegisterPage;
