import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import styles from './RegistrationForm.module.scss';
import { getToken, setAuthHeader } from '../../../../api/serviceToken';

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

interface Role {
  id: string;
  name: string;
}

interface RegistrationFormProps{
  role: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({role = 'teacher'}) => {
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
  const [roleId, setRoleId] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  
  // Получаем role_id при монтировании компонента
  useEffect(() => {
    const fetchRoleId = async () => {
      try {
        const token = getToken();
        if (token) {
          setAuthHeader(token);
        }
        
        const response = await fetch(`http://localhost:8000/api/v1/roles/name/${role}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const roleData: Role = await response.json();
          setRoleId(roleData.id);
          setRoleError(null);
        } else {
          const errorData = await response.json();
          setRoleError('Не удалось получить роль учителя');
          console.error('Error fetching role:', errorData);
        }
      } catch (error) {
        setRoleError('Ошибка при получении роли');
        console.error('Role fetch failed:', error);
      }
    };
    
    fetchRoleId()
  }, []);
  
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
    
    // Проверяем наличие roleId перед отправкой
    if (!roleId) {
      setRoleError('Роль еще не загружена. Подождите немного и попробуйте снова.');
      return;
    }
    
    if (validateForm()) {
      const requestBody = {
        email: formData.email,
        is_active: true,
        is_superuser: false,
        full_name: `${formData.firstName} ${formData.lastName} ${formData.middleName}`,
        password: formData.password,
        role_id: '454e0847-1fbd-4105-b15c-d7c326549de2',
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
            'Authorization': `Bearer ${token}`,
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
      
      {roleError && (
        <div className={styles.errorText}>
          {roleError}
        </div>
      )}
      
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!roleId}
        >
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;