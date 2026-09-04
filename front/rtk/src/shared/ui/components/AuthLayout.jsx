import './AuthLayout.css';

const FEATURES = [
  'Пропуск действует 5 минут и обновляется автоматически',
  'Никаких пластиковых карт и очередей на ресепшене',
  'Данные защищены и доступны только вам',
];

export const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-brand">
        <div className="auth-brand-top">
          <span className="auth-brand-logo">РТК</span>
          <span className="auth-brand-name">Цифровой пропуск</span>
        </div>

        <div className="auth-brand-copy">
          <h1>Вход в здание по QR-коду за пару секунд</h1>
          <p>Сгенерируйте временный пропуск в один клик и покажите его на проходной.</p>
          <ul className="auth-brand-features">
            {FEATURES.map((feature) => (
              <li key={feature}>
                <span className="auth-brand-feature-icon">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-brand-glow" />
      </div>

      <div className="auth-layout-form">
        <div className="auth-layout-form-inner">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
