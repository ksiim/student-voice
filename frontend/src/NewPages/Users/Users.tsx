// Users.tsx
import React, { useState, useEffect } from 'react';
import styles from './Users.module.scss';
import Header from '../../NewComponents/Header/Header_admin/Header.tsx';
import RoleToggle from '../../NewComponents/RoleToggle/RoleToggle.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import leftArrow from '/assets/images/arrow-left.svg';
import rightArrow from '/assets/images/arrow-right.svg';
import { useNavigate } from 'react-router-dom';
import UserListCard from '../../NewComponents/UserListCard/UserListCard.tsx';
import { setAuthHeader, getToken } from '../../../public/serviceToken.js';

const Users: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'Teacher' | 'Admin'>('Teacher');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // Полный список пользователей
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();
  
  const roleIds = {
    Teacher: 'teacher',
    Admin: 'admin',
  };
  
  const USERS_PER_PAGE = 20;
  
  const handleRoleChange = (role: 'Teacher' | 'Admin') => {
    setSelectedRole(role);
    setCurrentPage(1);
    fetchUsers(roleIds[role], 1);
  };
  
  const fetchUsers = async (role_name: string, page: number) => {
    setIsLoading(true);
    setError(null);
    const skip = (page - 1) * USERS_PER_PAGE;
    
    try {
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }
      
      const response = await axios.get('http://localhost:8000/api/v1/users/', {
        headers: { 'Content-Type': 'application/json' },
        params: {
          skip,
          limit: USERS_PER_PAGE,
          role_name,
        },
      });
      
      const { data, count } = response.data;
      setUsers(data || []);
      setAllUsers(data || []); // Сохраняем полный список для поиска
      setTotalUsers(count || 0);
    } catch (error: any) {
      setError('Ошибка загрузки пользователей');
      console.error('Ошибка при получении пользователей:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value.trim() === '') {
      // Если поле поиска очищено, отображаем полный список
      setUsers(allUsers);
    } else {
      // Фильтруем пользователей
      const filtered = allUsers.filter(
        (user) =>
          user.surname.toLowerCase().includes(value) ||
          user.name.toLowerCase().includes(value) ||
          user.patronymic.toLowerCase().includes(value)
      );
      setUsers(filtered);
    }
  };
  
  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    if (newPage < 1 || newPage > Math.ceil(totalUsers / USERS_PER_PAGE)) return;
    setCurrentPage(newPage);
    fetchUsers(roleIds[selectedRole], newPage);
  };
  
  useEffect(() => {
    fetchUsers(roleIds[selectedRole], currentPage);
  }, [selectedRole, currentPage]);
  
  const handleCreation = () => {
    navigate('/createuser');
  };
  
  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.content}>
        <h2 className={styles.content__title}>Пользователи</h2>
        
        <div className={styles.content__form}>
          <RoleToggle onRoleChange={handleRoleChange} selectedRole={selectedRole} />
          <input
            className={styles.search}
            type="search"
            placeholder="Введите ФИО"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className={styles.userList}>
            <img
              className={styles.userList__button}
              src={leftArrow}
              alt=""
              onClick={() => handlePageChange('prev')}
            />
            <div className={styles.userList__content}>
              {isLoading ? (
                <p></p>
              ) : error ? (
                <p className={styles.error}>{error}</p>
              ) : users.length === 0 ? (
                <p>Ничего не найдено</p>
              ) : (
                users.map((user) => (
                  <UserListCard
                    key={user.id}
                    id={user.id} // Передаем id в UserListCard
                    name={user.name}
                    surname={user.surname}
                    patronymic={user.patronymic}
                    onEdit={() => navigate(`/updateuser/${user.id}`)} // Добавляем навигацию
                  />
                ))
              )}
            </div>
            <img
              className={styles.userList__button}
              src={rightArrow}
              alt=""
              onClick={() => handlePageChange('next')}
            />
          </div>
          <Button type="button" color="#1E4391" text="Добавить пользователя" onClick={handleCreation} />
        </div>
      </div>
    </div>
  );
};

export default Users;
