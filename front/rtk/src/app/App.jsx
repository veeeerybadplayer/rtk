import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/model/authStore';
import { usePassStore } from '../features/pass-generation/model/passStore';
import { RegisterPage, LoginPage } from '../pages';
import { PassGenerator } from '../features/pass-generation/ui';
import { DecryptedText } from '../shared/ui/components';
import { Navigation } from '../widgets/Navigation';
import './App.css';

// Protected Route компонент
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Главная страница для авторизованных пользователей
const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="dashboard">
      <Navigation />

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <DecryptedText
            text={`Добро пожаловать, ${user?.fio?.split(' ')[0] || 'Пользователь'}!`}
            className="welcome-text"
            speed={40}
            delay={300}
            as="h1"
          />
          <p className="welcome-subtitle">{user?.rank}</p>
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
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Токен лежит в httpOnly cookie, поэтому статус сессии можно узнать
  // только запросом к бэкенду, а не чтением localStorage
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // На любой переход в разлогиненное состояние (ручной logout или протухшая
  // сессия) чистим QR-пропуск — иначе следующий пользователь в той же вкладке
  // увидит и сможет использовать чужой ещё живой пропуск
  useEffect(() => {
    return useAuthStore.subscribe((state, prevState) => {
      if (prevState.isAuthenticated && !state.isAuthenticated) {
        usePassStore.getState().deactivatePass();
      }
    });
  }, []);

  if (!isInitialized) {
    return null;
  }

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