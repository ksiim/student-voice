import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './StudentList.module.scss';
import { Logo } from '../../Components/Logo';
import Button from '../profile/Components/Button';
import { useNavigate } from 'react-router-dom';
import { getToken, setAuthHeader } from '../../../api/serviceToken';

interface User {
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string;
  id: string;
}

interface ApiResponse {
  data: User[];
  count: number;
}

const StudentList: React.FC = () => {
  const [items, setItems] = useState<User[]>([]);
  const [visibleItems, setVisibleItems] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = getToken();
    
    if (token) {
      setAuthHeader(token);
    }
    
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>('http://localhost:8000/api/v1/users/');
        console.log('Ответ от API:', response.data);
        
        if (response.data?.data) {
          setItems(response.data.data);
        } else {
          setItems([]);
        }
        
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке списка студентов');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
  
  const handleReports = () => {
    navigate('/reports');
  };
  
  const handlePasswordChange = () => {
    navigate('/changePassword');
  };
  
  const showMore = () => {
    setVisibleItems(prev => prev + 10);
  };
  
  const displayedItems = items.slice(0, visibleItems);
  const hasMoreItems = visibleItems < items.length;
  
  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
        <div className={styles.headerButtons}>
          <Button text="Настроить выгрузку" onClick={handleReports} />
          <Button text="Изменить пароль" onClick={handlePasswordChange} />
        </div>
      </header>
      
      <table className={styles.table}>
        <thead>
        <tr>
          <th className={styles.tableHeader__Quantity} colSpan={2}>
            Проголосовало ({items.length}) чел.
          </th>
        </tr>
        <tr>
          <th className={styles.tableHeader}>Email</th>
          <th className={styles.tableHeader}>ФИО</th>
        </tr>
        </thead>
        <tbody>
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => (
            <tr key={item.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{item.email}</td>
              <td className={styles.tableCell}>{item.full_name}</td>
            </tr>
          ))
        ) : (
          <tr className={styles.tableRow}>
            <td colSpan={2} className={styles.tableCell}>Нет данных для отображения</td>
          </tr>
        )}
        </tbody>
      </table>
      
      {hasMoreItems && (
        <div className={styles.showMoreContainer}>
          <Button
            text="Показать ещё"
            onClick={showMore}
            className={styles.showMoreButton}
          />
        </div>
      )}
      
      <table className={styles.table}>
        <thead>
        <tr>
          <th className={styles.tableHeader}>Критерий</th>
          <th className={styles.tableHeader}>Распределение оценок</th>
        </tr>
        </thead>
        <tbody>
        <tr className={styles.tableRow}>
          <td className={styles.tableCell}>Качество преподавания</td>
          <td className={styles.tableCell}>1 - 20%, 2 - 0%, 3 - 40%, 4 - 40%, 5 - 0%</td>
        </tr>
        <tr className={styles.tableRow}>
          <td className={styles.tableCell}>Качество оборудования</td>
          <td className={styles.tableCell}>1 - 20%, 2 - 0%, 3 - 40%, 4 - 40%, 5 - 0%</td>
        </tr>
        <tr className={styles.tableRow}>
          <td className={styles.tableCell}>Интересная подача</td>
          <td className={styles.tableCell}>1 - 20%, 2 - 0%, 3 - 40%, 4 - 40%, 5 - 0%</td>
        </tr>
        </tbody>
      </table>
      
      <div className={styles.criteria}>
        <span>1. Задания были хорошо подобраны, они помогли закрепить пройденный материал. Курс держит внимание, и я с удовольствием посещаю занятия.</span>
        <span>2. Лекции структурированы, материал подается последовательно. Преподаватель очень отзывчив, всегда готов ответить на вопросы.</span>
        <span>3. Материал скучный, трудно понять, как его можно применить в реальной жизни. Лекции однообразные, хотелось бы больше интерактива.</span>
      </div>
    </div>
  );
};

export default StudentList;