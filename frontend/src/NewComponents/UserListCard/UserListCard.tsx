import React from 'react';
import styles from './UserListCard.module.scss';
import editIcon from '/assets/images/edit.svg';

interface UserListCardProps {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  onEdit: () => void; // Обработчик для кнопки редактирования
}

const UserListCard: React.FC<UserListCardProps> = ({name, surname, patronymic, onEdit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <p className={styles.fio}>
          {surname} {name} {patronymic}
        </p>
      </div>
      <img
        className={styles.editIcon}
        src={editIcon}
        alt="Редактировать"
        onClick={onEdit}
      />
    </div>
  );
};

export default UserListCard;
