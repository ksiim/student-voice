import React from 'react';
import styles from './RoleToggle.module.css';

interface RoleToggleProps {
  selectedRole: 'Teacher' | 'Admin';
  onRoleChange: (role: 'Teacher' | 'Admin') => void;
}

const RoleToggle: React.FC<RoleToggleProps> = ({ selectedRole, onRoleChange }) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.roleButton} ${selectedRole === 'Teacher' ? styles.activeButton : ''}`}
        onClick={() => onRoleChange('Teacher')}
        disabled={selectedRole === 'Teacher'} // Отключение кнопки для активной роли
      >
        Преподаватели
      </button>
      <button
        className={`${styles.roleButton} ${selectedRole === 'Admin' ? styles.activeButton : ''}`}
        onClick={() => onRoleChange('Admin')}
        disabled={selectedRole === 'Admin'} // Отключение кнопки для активной роли
      >
        Администраторы
      </button>
    </div>
  );
};

export default RoleToggle;
