import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from './RegistrationForm.module.scss';

interface FormData {
  search: string; // Добавлено поле поиска
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  password: string;
  subjects: string[];
  allowFeedback: boolean;
}

interface Subject {
  id: number;
  name: string;
}

interface RegistrationFormProps {
  onSubmit?: (data: FormData) => void;
  initialSubjects?: Subject[];
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
                                                             onSubmit,
                                                             initialSubjects = []
                                                           }) => {
  const [formData, setFormData] = useState<FormData>({
    search: '', // Инициализация поля поиска
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    password: '',
    subjects: [],
    allowFeedback: false
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
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
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };
  
  const handlePasswordChange = (): void => {
    console.log('Password change requested');
  };
  
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Создание/редактирование пользователя</h2>
      
      {/* Добавленное поле поиска */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          name="search"
          value={formData.search}
          onChange={handleChange}
          placeholder="Поиск..."
          className={styles.searchInput}
        />
        <button type="button" className={styles.searchButton}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7 14.3L11.9 10.5C12.9 9.2 13.4 7.6 13.4 5.9C13.4 2.6 10.7 0 7.4 0C4.1 0 1.4 2.6 1.4 5.9C1.4 9.2 4.1 11.8 7.4 11.8C9.1 11.8 10.7 11.3 12 10.3L15.8 14.1C15.9 14.2 16 14.3 16 14.5C16 14.7 15.9 14.8 15.7 14.9C15.5 15 15.3 15 15.1 14.8L15.7 14.3ZM2.9 5.9C2.9 3.4 4.9 1.4 7.4 1.4C9.9 1.4 11.9 3.4 11.9 5.9C11.9 8.4 9.9 10.4 7.4 10.4C4.9 10.4 2.9 8.4 2.9 5.9Z"
              fill="#666666"
            />
          </svg>
        </button>
      </div>
      
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
        
        {/* Остальные поля формы остаются без изменений */}
        {/* ... */}
        
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
          <label htmlFor="middleName">Отчество</label>
          <input
            id="middleName"
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
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
          <button
            type="button"
            className={styles.changePassword}
            onClick={handlePasswordChange}
          >
            Изменить пароль
          </button>
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="subjects">Предметы</label>
          <select
            id="subjects"
            name="subjects"
            multiple
            value={formData.subjects}
            onChange={handleChange}
            className={styles.select}
          >
            {initialSubjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="allowFeedback"
            checked={formData.allowFeedback}
            onChange={handleChange}
            id="allowFeedback"
          />
          <label htmlFor="allowFeedback">Дать доступ к отзывам</label>
        </div>
        
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;