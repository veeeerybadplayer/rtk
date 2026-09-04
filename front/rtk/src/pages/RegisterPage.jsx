import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../features/auth/ui';
import { AuthLayout } from '../shared/ui/components';

export const RegisterPage = () => {
  const navigate = useNavigate();

  // Бэкенд не логинит пользователя при регистрации — ведём на вход
  // и передаём email, чтобы человеку не пришлось вводить его заново
  const handleRegistrationSuccess = (email) => {
    navigate('/login', { state: { justRegistered: true, email } });
  };

  return (
    <AuthLayout>
      <RegisterForm onSuccess={handleRegistrationSuccess} />
    </AuthLayout>
  );
};

export default RegisterPage;
