import React from 'react';
import styles from './UserListCard.module.scss';
import editIcon from '../../../public/assets/images/edit.svg';

interface UserListCardProps {

}

const UserListCard:React.FC<UserListCardProps> = () => {
  return (
    <div className={styles.card}>
      <p className={styles.fio}>Кудрявцев Матвей Евгеньевич</p>
      <img src={editIcon} alt={''} onClick={() => {}}/>
    </div>
  );
};

export default UserListCard;