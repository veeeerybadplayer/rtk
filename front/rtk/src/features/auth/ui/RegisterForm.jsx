import React, { useState } from 'react';
import { Button, Input, FormContainer } from '../../../shared/ui/components';
import { authAPI } from '../api/authAPI';
import './RegisterForm.css';

export const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fio: '',
    rank: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fio) {
      newErrors.fio = 'ФИО обязательно';
    }

    if (!formData.rank) {
      newErrors.rank = 'Должность обязательна';
    }

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
      // Бэкенд только создаёт учётку и не логинит пользователя — сессия
      // (cookie) появится после отдельного входа на /login
      await authAPI.register(formData);

      const registeredEmail = formData.email;

      setFormData({
        fio: '',
        rank: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      if (onSuccess) {
        onSuccess(registeredEmail);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || 
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
          label="ФИО"
          name="fio"
          type="text"
          placeholder="Иванов Иван Иванович"
          value={formData.fio}
          onChange={handleChange}
          error={errors.fio}
          required
          disabled={isLoading}
        />

        <Input
          label="Должность"
          name="rank"
          type="text"
          placeholder="Сотрудник"
          value={formData.rank}
          onChange={handleChange}
          error={errors.rank}
          required
          disabled={isLoading}
        />

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