// Mock API для локального тестирования (без backend)
// Используй это для разработки, а потом удали

const MOCK_ENABLED = process.env.REACT_APP_MOCK_API === 'true';

export const mockAuthAPI = {
  register: async (email, password) => {
    // Имитируем задержку сервера
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !password) {
      throw new Error('Email и пароль обязательны');
    }

    // Имитируем успешный ответ в формате бэкенда
    return {
      access_token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
      refresh_token: 'mock_refresh_' + Math.random().toString(36).substr(2, 9),
      user: {
        id: '1',
        email: email,
        fio: 'Тестовый Пользователь',
        rank: 'Сотрудник',
      },
    };
  },

  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !password) {
      throw new Error('Email и пароль обязательны');
    }

    return {
      access_token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
      refresh_token: 'mock_refresh_' + Math.random().toString(36).substr(2, 9),
      user: {
        id: '1',
        email: email,
        fio: 'Тестовый Пользователь',
        rank: 'Сотрудник',
      },
    };
  },
};

export const isMockEnabled = () => MOCK_ENABLED;

export const mockPassAPI = {
  generatePass: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Генерируем случайный QR код (в реальности это будет с бэкенда)
    const qrData = `PASS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: '1',
      qr_code: qrData,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      status: 'active',
    };
  },

  getPassStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      status: 'active',
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  },
};
