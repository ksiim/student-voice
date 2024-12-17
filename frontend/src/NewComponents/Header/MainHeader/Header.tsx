import React, { useState, useEffect } from 'react';
import styles from './Header.module.scss';
import Logo from '../../Logo/Logo.tsx';
import { getToken } from '../../../../public/serviceToken.js'; // Подключаем функцию для получения токена

const Header: React.FC = () => {
  // Состояние для отслеживания аутентификации
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Проверка токена при монтировании компонента
  useEffect(() => {
    const token = getToken(); // Проверяем, есть ли токен
    setIsAuthenticated(!!token); // Если токен есть, считаем, что пользователь авторизован
  }, []);
  
  
  return (
    <div className={styles.wrapper}>
      <Logo />
      <div className={styles.navigation}>
        {isAuthenticated ? ( <a href="/profile" className={styles.navigation__link}>
            Профиль
          </a>
        ) : (
          <a href="/login" className={styles.navigation__link}>
            Вход
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;
