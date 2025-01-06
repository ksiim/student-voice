import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Profile.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header';
import Schedule from '../../NewComponents/Schedule/Schedule.tsx'; // Adjust the import path according to your file structure
import { DaySchedule } from '../../NewComponents/Schedule/Schedule.tsx';
import ClassList from '../../NewComponents/ClassList/ClassList.tsx';
import { setAuthHeader, getToken } from '../../../public/serviceToken.js';

const Profile: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Логика работы с токеном
        const token = getToken();
        if (token) {
          setAuthHeader(token);
        }
        
        // Запрос для получения текущего пользователя
        const userResponse = await axios.get('http://localhost:8000/api/v1/users/me', {
          headers: { 'Content-Type': 'application/json' },
        });
        
        const teacherId = userResponse.data.id;
        
        // Запрос для получения списка пар
        const classesResponse = await axios.get('http://localhost:8000/api/v1/classes/', {
          headers: { 'Content-Type': 'application/json' },
          params: {
            skip: 0,
            limit: 100,
            teacher_id: teacherId,
          },
        });
        
        // Преобразование данных в формат DaySchedule[]
        const formattedSchedule: DaySchedule[] = classesResponse.data.data.map((lesson: any) => ({
          date: new Date(lesson.start_time).toLocaleDateString('ru-RU'), // Форматирование даты
          weekDay: new Date(lesson.start_time).toLocaleDateString('ru-RU', { weekday: 'long' }), // День недели
          lessons: [
            {
              id: lesson.id,
              startTime: new Date(lesson.start_time).toLocaleTimeString('ru-RU'),
              endTime: new Date(lesson.end_time).toLocaleTimeString('ru-RU'),
              title: lesson.name,
              isEditable: false, // Можно добавить дополнительную логику для редактируемости
            },
          ],
        }));
        
        
        setSchedule(formattedSchedule);
      } catch (err: any) {
        setError(err.message || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleEditLesson = (lessonId: string) => {
    console.log('Edit lesson:', lessonId);
    // Логика редактирования занятия
  };
  
  const handleViewLesson = (lessonId: string) => {
    console.log('View lesson:', lessonId);
    // Логика просмотра занятия
  };
  
  const handleWeekChange = (startDate: Date, endDate: Date) => {
    console.log(`Неделя изменена: с ${startDate} по ${endDate}`);
    // Логика изменения недели, если потребуется
  };
  
  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }
  
  return (
    <div className={styles.wrapper}>
      <Header/>
      <div className={styles.content}>
        <div className={styles.content__schedule}>
          <h2 className={styles.content__schedule__title}>Мое расписание</h2>
          <Schedule
            days={schedule}
            onEditLesson={handleEditLesson}
            onViewLesson={handleViewLesson}
          />
        </div>
        
        <div className={styles.content__list}>
          <h2 className={styles.content__list__title}>Мои пары</h2>
          <ClassList/>
        </div>
      </div>
    </div>
  );
};

export default Profile;
