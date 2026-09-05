// Mock API для локального тестирования (без backend)
// Повторяет реальный контракт бэкенда: /login и /get_info возвращают
// пользователя в JSON, а сама сессия держится на (эмулированной) cookie,
// поэтому здесь она хранится в переменной модуля, а не в localStorage.
import QRCode from 'qrcode';

const MOCK_ENABLED = import.meta.env.VITE_MOCK_API === 'true';

let mockLoggedInUser = null;

export const mockAuthAPI = {
  register: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email || !password) {
      throw new Error('Email и пароль обязательны');
    }

    // Реальный бэкенд не логинит пользователя при регистрации
    return { message: 'Пользователь успешно зарегистрирован' };
  },

  login: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email || !password) {
      throw new Error('Email и пароль обязательны');
    }

    mockLoggedInUser = {
      id: '1',
      email,
      fio: 'Тестовый Пользователь',
      rank: 'Сотрудник',
    };

    return { message: 'Успешный вход', user: mockLoggedInUser };
  },

  logout: async () => {
    mockLoggedInUser = null;
  },

  getCurrentUser: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockLoggedInUser) {
      const error = new Error('Не авторизован');
      error.response = { status: 401, data: { detail: 'Не авторизован' } };
      throw error;
    }

    return mockLoggedInUser;
  },
};

export const isMockEnabled = () => MOCK_ENABLED;

export const mockPassAPI = {
  generatePass: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const token = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    // Настоящий backend генерирует QR на сервере (qrcode + Pillow) и отдаёт
    // base64 PNG. В моке рисуем такой же настоящий QR прямо в браузере,
    // чтобы контракт (и то, что видит пользователь) совпадал с боевым.
    const dataUrl = await QRCode.toDataURL(token, { margin: 1, width: 320 });
    const qr_code = dataUrl.replace(/^data:image\/png;base64,/, '');

    return {
      token,
      qr_code,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
  },

  cancelPass: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, message: 'Пропуск отменён' };
  },
};
