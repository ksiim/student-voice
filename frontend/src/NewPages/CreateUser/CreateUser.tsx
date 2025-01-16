import React, { useState, useEffect } from 'react';
import styles from './CreateUser.module.scss';
import Header from './../../NewComponents/Header/Header_admin/Header.tsx';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import { setAuthHeader, getToken } from '../../../public/serviceToken.js';
import { useNavigate } from 'react-router-dom';

const CreateUser: React.FC = () => {
  const [roles, setRoles] = useState<{ admin: string; teacher: string } | null>(null);
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [role, setRole] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const adminRoleResponse = await axios.get('http://localhost:8000/api/v1/roles/name/admin');
        const teacherRoleResponse = await axios.get('http://localhost:8000/api/v1/roles/name/teacher');
        
        setRoles({
          admin: adminRoleResponse.data.id,
          teacher: teacherRoleResponse.data.id,
        });
        
        // Устанавливаем роль по умолчанию (teacher)
        setRole(teacherRoleResponse.data.id);
      } catch (error) {
        console.error('Ошибка при получении ролей:', error);
      }
    };
    
    fetchRoles();
  }, []);
  
  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
  };
  
  const resetForm = () => {
    setSurname('');
    setName('');
    setPatronymic('');
    setEmail('');
    setPassword('');
    setRole(roles?.teacher || ''); // Сбрасываем роль к "Преподавателю"
    setIsChecked(true);
    setEmailError(null);
    setPasswordError(null);
  };
  
  const handleGeneratePassword = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/generate_password/');
      setPassword(response.data['password']);
    } catch (error) {
      console.error('Ошибка при генерации пароля:', error);
    }
  };
  
  const sendPasswordEmail = async (userEmail: string, userPassword: string) => {
    try {
      const params = new URLSearchParams();
      params.append('email', userEmail);
      params.append('password', userPassword);
      params.append('title', 'Доступ к системе');
      
      await axios.get('http://localhost:8000/api/v1/users/send_new_password_on_mail', { params });
    } catch (error) {
      console.error('Ошибка при отправке пароля на почту:', error);
    }
  };
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setEmailError(null);
    setPasswordError(null);
    
    if (!email) {
      setEmailError('Введите email');
      return;
    }
    
    if (!password) {
      setPasswordError('Введите пароль');
      return;
    }
    
    try {
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }
      
      const userData = {
        email,
        is_active: true,
        is_superuser: false,
        name,
        surname,
        patronymic,
        password,
        role_id: role,
      };
      
      await axios.post('http://localhost:8000/api/v1/users', userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      alert('Пользователь успешно создан');
      await sendPasswordEmail(email, password);
      resetForm();
    } catch (error: any) {
      console.error('Ошибка при создании пользователя:', error);
      if (error.response) {
        alert('Ошибка: ' + (error.response.data.detail || 'Не удалось создать пользователя'));
      } else {
        alert('Ошибка подключения: ' + error.message);
      }
    }
  };
  
  if (!roles) {
    return <div>Загрузка данных ролей...</div>;
  }
  
  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.content}>
        <h2 className={styles.content__title}>Создание пользователя</h2>
        <form onSubmit={handleSubmit} className={styles.content__form}>
          <fieldset className={styles.buttonGroup}>
            <div className={styles.buttonGroup__radioButton}>
              <input
                type="radio"
                id="teacher"
                name="role"
                value={roles.teacher}
                checked={role === roles.teacher}
                onChange={handleRoleChange}
              />
              <label htmlFor="teacher">Преподаватель</label>
            </div>
            
            <div className={styles.buttonGroup__radioButton}>
              <input
                type="radio"
                id="admin"
                name="role"
                value={roles.admin}
                checked={role === roles.admin}
                onChange={handleRoleChange}
              />
              <label htmlFor="admin">Администратор</label>
            </div>
          </fieldset>
          
          <div className={styles.inputGrid}>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Фамилия"
                type="text"
                onChange={(e) => setSurname(e.target.value)}
                error=""
                value={surname}
                placeholder={''}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Имя"
                type="text"
                onChange={(e) => setName(e.target.value)}
                error=""
                value={name}
                placeholder={''}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Отчество"
                type="text"
                onChange={(e) => setPatronymic(e.target.value)}
                error=""
                value={patronymic}
                placeholder={''}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                value={email}
                placeholder={'IvanovIvan@urfu.me'}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Пароль"
                type="generatedPassword"
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                value={password}
                onGeneratePassword={handleGeneratePassword}
                placeholder={''}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <label className={styles.formControl}>
                Доступ к отзывам
                <input
                  type="checkbox"
                  name="checkbox-checked"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </label>
            </div>
          </div>
          <div className={styles.controls}>
            <Button type="button" text="Назад" color="#CCCCCC" onClick={() => navigate(-1)} />
            <Button type="submit" text="Создать" color="#1E4391" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
