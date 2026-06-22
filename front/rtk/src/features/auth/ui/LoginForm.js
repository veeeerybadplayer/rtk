import React, { useState } from 'react';
import { Button, Input, FormContainer } from '../../../shared/ui/components';
import { useAuthStore } from '../model/authStore';
import { authAPI } from '../api/authAPI';
import { STORAGE_KEYS } from '../../../shared/constants';
import './RegisterForm.css';

export const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Отправка входа для:', formData.email);
      const response = await authAPI.login(formData.email, formData.password);
      console.log('Ответ сервера:', response);

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      setUser(response.user);
      setAuthenticated(true);

      setFormData({
        email: '',
        password: '',
      });

      console.log('Вход успешен!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      console.error('Ответ ошибки:', error.response);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message ||
        'Ошибка при входе. Проверьте подключение к серверу.';
      
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer
      title="Вход"
      subtitle="Войдите в свой аккаунт"
    >
      <form onSubmit={handleSubmit} className="register-form">
        {errors.submit && (
          <div className="form-error-message">
            {errors.submit}
          </div>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          disabled={isLoading}
        />

        <Input
          label="Пароль"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
          className="register-button"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>

        <div className="form-footer">
          <p className="form-footer-text">
            Нет аккаунта?{' '}
            <a href="/register" className="form-footer-link">
              Зарегистрироваться
            </a>
          </p>
        </div>
      </form>
    </FormContainer>
  );
};

export default LoginForm;