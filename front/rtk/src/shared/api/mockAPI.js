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

    // Имитируем успешный ответ
    return {
      token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
      user: {
        id: '1',
        email: email,
        createdAt: new Date().toISOString(),
      },
    };
  },

  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !password) {
      throw new Error('Email и пароль обязательны');
    }

    return {
      token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
      user: {
        id: '1',
        email: email,
        createdAt: new Date().toISOString(),
      },
    };
  },
};

export const isMockEnabled = () => MOCK_ENABLED;
