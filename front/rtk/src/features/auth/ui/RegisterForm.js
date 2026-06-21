import React, { useState } from 'react';
import { Button, Input, FormContainer } from '../../../shared/ui/components';
import { useAuthStore } from '../model/authStore';
import { authAPI } from '../api/authAPI';
import { STORAGE_KEYS } from '../../../shared/constants';
import './RegisterForm.css';

export const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
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
    // Clear error for this field when user starts typing
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
      console.log('Отправка регистрации для:', formData.email);
      const response = await authAPI.register(formData.email, formData.password);
      console.log('Ответ сервера:', response);

      // Save token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      // Update store
      setUser(response.user);
      setAuthenticated(true);

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
      });

      console.log('Регистрация успешна!');
      // Callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      console.error('Ответ ошибки:', error.response);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message ||
        'Ошибка при регистрации. Проверьте подключение к серверу.';
      
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer
      title="Регистрация"
      subtitle="Создайте аккаунт для входа в здание"
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

        <Input
          label="Подтверждение пароля"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
          className="register-button"
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>

        <div className="form-footer">
          <p className="form-footer-text">
            Уже есть аккаунт?{' '}
            <a href="/login" className="form-footer-link">
              Войти
            </a>
          </p>
        </div>
      </form>
    </FormContainer>
  );
};

export default RegisterForm;
