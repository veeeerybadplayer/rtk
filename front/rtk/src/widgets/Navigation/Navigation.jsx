import { useAuthStore } from '../../features/auth/model/authStore';
import './Navigation.css';

export const Navigation = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="app-header">
      <div className="app-header-brand">
        <span className="app-header-logo">РТК</span>
        <span className="app-header-title">Цифровой пропуск</span>
      </div>

      <div className="app-header-actions">
        <div className="app-header-user">
          <span className="app-header-user-avatar">
            {(user?.fio || user?.email || '?').charAt(0).toUpperCase()}
          </span>
          <div className="app-header-user-info">
            <span className="app-header-user-name">{user?.fio || user?.email}</span>
            {user?.rank && <span className="app-header-user-rank">{user.rank}</span>}
          </div>
        </div>
        <button onClick={logout} className="app-header-logout">
          Выйти
        </button>
      </div>
    </header>
  );
};

export default Navigation;
