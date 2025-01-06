import React from 'react';
import styles from './Header.module.scss';
import Logo from '../../Logo/Logo.tsx'

const Header:React.FC= () => {
  return (
    <div className={styles.wrapper}>
      <Logo/>
      <div className={styles.navigation}>
        <a href={'/users'} className={styles.navigation__link}>Пользователи</a>
        <a href={'/metrics'} className={styles.navigation__link}>Отчёты и метрики</a>
      </div>
    </div>
  );
};

export default Header;