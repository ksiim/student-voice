import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from './RegistrationForm.module.scss';
import {getToken, setAuthHeader} from '../../../../api/serviceToken';

interface FormData {
  search: string;
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  password: string;
  subjects: string[];
  allowFeedback: boolean;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    search: '',
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    password: '',
    subjects: [],
    allowFeedback: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (name === 'subjects') {
      const selectElement = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        subjects: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    if (!formData.password && !formData.password.trim()) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Формируем данные для отправки
      const requestBody = {
        email: formData.email,
        is_active: true,
        is_superuser: false,
        full_name: `${formData.firstName} ${formData.lastName} ${formData.middleName}`,
        password: formData.password,
        role_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Пример ID роли, замените на актуальный
      };
      
      try {
        const token = getToken();
        if (token) {
          setAuthHeader(token);
        }
        
        const response = await fetch('http://localhost:8000/api/v1/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Передаем токен в заголовках
          },
          body: JSON.stringify(requestBody),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('User created:', data);
        } else {
          const errorData = await response.json();
          console.error('Error:', errorData);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
  };
  
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Создание/редактирование пользователя</h2>
      
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Поля формы */}
        <div className={styles.inputGroup}>
          <label htmlFor="lastName">Фамилия</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? styles.errorInput : ''}
          />
          {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="firstName">Имя</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? styles.errorInput : ''}
          />
          {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
        </div>
        {/* Остальные поля формы */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.errorInput : ''}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.errorInput : ''}
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>
        
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
