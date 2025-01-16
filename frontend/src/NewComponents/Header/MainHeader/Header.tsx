import React, { useState, useEffect } from 'react';
import styles from './Header.module.scss';
import Logo from '../../Logo/Logo.tsx';
import { getToken } from '../../../../public/serviceToken.js'; // Подключаем функцию для получения токена
import axios from 'axios';

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null); // Для хранения названия роли
  
  // Проверка токена и получение роли при монтировании компонента
  useEffect(() => {
    const token = getToken(); // Проверяем, есть ли токен
    setIsAuthenticated(!!token); // Если токен есть, считаем, что пользователь авторизован
    
    if (token) {
      // Получаем роль пользователя
      axios
        .get('http://localhost:8000/api/v1/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const roleId = response.data.role_id; // Получаем ID роли
          if (roleId) {
            // Запрашиваем название роли по ID
            return axios.get(`http://localhost:8000/api/v1/roles/${roleId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            throw new Error('Роль пользователя не определена');
          }
        })
        .then((roleResponse) => {
          setUserRole(roleResponse.data.name); // Сохраняем название роли
        })
        .catch((error) => {
          console.error('Ошибка при получении роли пользователя:', error);
          setUserRole(null);
        });
    }
  }, []);
  
  const renderNavigationLink = () => {
    if (!isAuthenticated) {
      return (
        <a href="/login" className={styles.navigation__link}>
          Вход
        </a>
      );
    }
    
    if (userRole === 'admin') {
      return (
        <a href="/users" className={styles.navigation__link}>
          Управление пользователями
        </a>
      );
    }
    
    if (userRole === 'teacher') {
      return (
        <a href="/profile" className={styles.navigation__link}>
          Профиль
        </a>
      );
    }
    
    return null; // В случае отсутствия роли ничего не показываем
  };
  
  return (
    <div className={styles.wrapper}>
      <Logo />
      <div className={styles.navigation}>{renderNavigationLink()}</div>
    </div>
  );
};

export default Header;
