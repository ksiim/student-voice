import React from 'react';
import styles from './Header.module.scss';
import Logo from '../../Logo/Logo.tsx'

const Header:React.FC= () => {
  return (
    <div className={styles.wrapper}>
      <Logo/>
      <div className={styles.navigation}>
        <a className={styles.navigation__link}>Мои пары</a>
        <a className={styles.navigation__link}>Выгрузка пар</a>
        <a className={styles.navigation__link}>Сменить пароль</a>
      </div>
    </div>
  );
};

export default Header;