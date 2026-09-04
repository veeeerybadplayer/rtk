import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/ui';
import { AuthLayout } from '../shared/ui/components';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { justRegistered, email } = location.state || {};

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <LoginForm
        onSuccess={handleLoginSuccess}
        initialEmail={email}
        successMessage={
          justRegistered ? 'Аккаунт создан. Войдите, используя email и пароль, указанные при регистрации.' : null
        }
      />
    </AuthLayout>
  );
};

export default LoginPage;
