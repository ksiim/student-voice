import React from 'react';
import styles from './Header.module.scss';
import Logo from '../../Logo/Logo.tsx'
import {useNavigate} from 'react-router-dom';

const Header:React.FC= () => {
  const navigate = useNavigate();
  
  const hahdleProfile = () => {
    navigate('/profile');
  };
  
  const hahdleLoad = () => {
    navigate('/load');
  };
  
  const hahdleChange = () => {
    navigate('/changePassword');
  };
  
  return (
    <div className={styles.wrapper}>
      <Logo/>
      <div className={styles.navigation}>
        <button className={styles.navigation__link} onClick={hahdleProfile}>Мои пары</button>
        <button className={styles.navigation__link} onClick={hahdleLoad}>Выгрузка пар</button>
        <button className={styles.navigation__link} onClick={hahdleChange}>Сменить пароль</button>
      </div>
    </div>
  );
};

export default Header;