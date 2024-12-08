import React, {useState} from 'react';
import styles from './Users.module.scss'
import Header from '../../NewComponents/Header/Header_admin/Header.tsx';
import RoleToggle from '../../NewComponents/RoleToggle/RoleToggle.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import searchIcon from '../../../public/assets/images/search-normal.svg';
import leftArrow from '../../../public/assets/images/arrow-left.svg';
import rightArrow from '../../../public/assets/images/arrow-right.svg';
import {useNavigate} from 'react-router-dom';
import UserListCard from '../../NewComponents/UserListCard/UserListCard.tsx';

const Users:React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'Teacher' | 'Admin'> ('Teacher');
  const navigate = useNavigate();
  
  const handleRoleChange = (role: 'Teacher' | 'Admin') => {
    setSelectedRole(role);
  };
  
  const handleCreation = () => {
    navigate('/createuser')
  };
  
  
  
  return (
    <div className={styles.wrapper}>
      <Header/>
      
      <div className={styles.content}>
        <h2 className={styles.content__title}>Пользователи</h2>
        
        <div className={styles.content__form}>
          <RoleToggle onRoleChange={(handleRoleChange)} selectedRole={selectedRole}/>
          <input className={styles.search} type={'search'} placeholder={'Введите ФИО'}/>
          <div className={styles.userList}>
            <img className={styles.userList__button} src={leftArrow} alt={''} onClick={() => {}}/>
            <div className={styles.userList__content}>
            
            </div>
            <img className={styles.userList__button} src={rightArrow} alt={''} onClick={() => {}}/>
          </div>
          <Button type={'button'} color={'#1E4391'} text={'Добавить пользователя'} onClick={handleCreation}/>
        </div>
      </div>
    </div>
  );
};

export default Users;