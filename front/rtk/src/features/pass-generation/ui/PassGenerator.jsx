import { usePassStore } from '../model/passStore';
import { Button } from '../../../shared/ui/components';
import './PassGenerator.css';

export const PassGenerator = () => {
  const { passData, qrCode, isLoading, isPassActive, error, generatePass, deactivatePass } = usePassStore();

  if (isPassActive && qrCode) {
    return (
      <div className="pass-generator">
        <div className="pass-card pass-card--active">
          <div className="pass-header">
            <h2>Цифровой пропуск</h2>
            <span className="pass-status">
              <span className="pass-status-dot" />
              Активен
            </span>
          </div>

          <div className="qr-container">
            <div className="qr-code">
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="QR-код пропуска"
                className="qr-code-image"
              />
            </div>
            <p className="qr-hint">Покажите QR-код на проходной</p>
          </div>

          <div className="pass-info">
            <div className="pass-info-row">
              <span className="pass-info-label">Создан</span>
              <span className="pass-info-value">
                {new Date(passData?.created_at).toLocaleTimeString('ru-RU')}
              </span>
            </div>
            <div className="pass-info-row">
              <span className="pass-info-label">Действителен до</span>
              <span className="pass-info-value">
                {new Date(passData?.expires_at).toLocaleTimeString('ru-RU')}
              </span>
            </div>
          </div>

          <Button onClick={deactivatePass} variant="secondary" fullWidth>
            Отменить пропуск
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pass-generator">
      <div className="pass-card">
        <div className="pass-header">
          <h2>Цифровой пропуск</h2>
        </div>

        <div className="pass-placeholder">
          <div className="pass-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 14H17.5M14 17.5H17.5M14 21H21M21 14V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="pass-placeholder-text">
            Нажмите кнопку ниже, чтобы сгенерировать цифровой пропуск для входа в здание
          </p>
        </div>

        {error && <div className="pass-error">{error}</div>}

        <Button onClick={generatePass} fullWidth disabled={isLoading} className="generate-button">
          {isLoading ? 'Генерация...' : 'Сгенерировать пропуск'}
        </Button>
      </div>
    </div>
  );
};

export default PassGenerator;
