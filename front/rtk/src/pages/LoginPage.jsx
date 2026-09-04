import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/ui';
import { AuthLayout } from '../shared/ui/components';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
};

export default LoginPage;
