import React from 'react';
import { usePassStore } from '../model/passStore';
import { Button, Lanyard3D } from '../../../shared/ui/components';
import './PassGenerator.css';

export const PassGenerator = () => {
  const { passData, qrCode, isLoading, isPassActive, error, generatePass, deactivatePass } = usePassStore();

  const handleGeneratePass = () => {
    generatePass();
  };

  const handleDeactivatePass = () => {
    deactivatePass();
  };

  if (isPassActive && qrCode) {
    return (
      <div className="pass-generator">
        <div className="pass-card">
          <div className="pass-header">
            <h2>Цифровой пропуск</h2>
            <span className="pass-status active">Активен</span>
          </div>
          
          <div className="qr-container">
            <Lanyard3D 
              qrData={qrCode}
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
            />
            <p className="qr-hint">Покажите QR-код на проходной</p>
          </div>

          <div className="pass-info">
            <p><strong>Создан:</strong> {new Date(passData?.created_at).toLocaleTimeString('ru-RU')}</p>
            <p><strong>Действителен до:</strong> {new Date(passData?.expires_at).toLocaleTimeString('ru-RU')}</p>
          </div>

          <Button 
            onClick={handleDeactivatePass}
            variant="secondary"
            fullWidth
          >
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
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="pass-placeholder-text">
            Нажмите кнопку ниже, чтобы сгенерировать цифровой пропуск для входа в здание
          </p>
        </div>

        {error && (
          <div className="pass-error">
            {error}
          </div>
        )}

        <Button 
          onClick={handleGeneratePass}
          fullWidth
          disabled={isLoading}
          className="generate-button"
        >
          {isLoading ? 'Генерация...' : 'Сгенерировать пропуск'}
        </Button>
      </div>
    </div>
  );
};

export default PassGenerator;