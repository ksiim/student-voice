import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ClassList.module.scss';
import MultiSelectDropdown from '../MultiSelectDropdown/MultiSelectDropdown';
import Button from '../Button/Button';
import ClassListDateTimePicker from '../ClassListDateTimePicker/ClassListDateTimePicker.tsx';
import { Clock, CheckCircle, XCircle, Edit, MessageSquare } from 'lucide-react';
import { getToken, setAuthHeader } from '../../../public/serviceToken.js';

interface FilterState {
  subjects: string[];
  selectedSubjects: string[];
  groups: string[];
  selectedGroups: string[];
  statuses: string[];
  selectedStatuses: string[];
}

interface ClassRow {
  subject: string;
  group: string;
  date: string;
  time: string;
  status: 'В ожидании' | 'Проведено' | 'Не проведено';
}

const ClassList: React.FC = () => {
  const [filter, setFilter] = useState<FilterState>({
    subjects: [],
    selectedSubjects: [],
    groups: [],
    selectedGroups: [],
    statuses: ['В ожидании', 'Проведено', 'Не проведено'],
    selectedStatuses: []
  });
  
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (token) {
          setAuthHeader(token);
        }
        
        // Получение текущего профиля
        const userResponse = await axios.get('http://localhost:8000/api/v1/users/me');
        const teacherId = userResponse.data.id;
        
        // Запрос данных о парах преподавателя
        const classesResponse = await axios.get('http://localhost:8000/api/v1/classes/', {
          params: { teacher_id: teacherId },
        });
        
        const rawClasses = classesResponse.data.data;
        
        // Форматируем данные для отображения
        const formattedClasses: ClassRow[] = rawClasses.map((lesson: any) => ({
          subject: lesson.name,
          group: lesson.group || 'Группа неизвестна',
          date: new Date(lesson.start_time).toLocaleDateString('ru-RU'),
          // Убираем секунды из времени
          time: `${new Date(lesson.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - ${new Date(
            lesson.end_time
          ).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`,
          status: 'В ожидании', // Укажите статус по умолчанию или извлеките его из API
        }));
        
        
        setClasses(formattedClasses);
        
        // Установить фильтры на основе уникальных значений
        const uniqueSubjects = Array.from(new Set(formattedClasses.map(c => c.subject)));
        const uniqueGroups = Array.from(new Set(formattedClasses.map(c => c.group)));
        
        setFilter(prev => ({
          ...prev,
          subjects: uniqueSubjects,
          groups: uniqueGroups,
        }));
      } catch (err: any) {
        setError(err.message || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleFilterChange = (
    filterType: 'selectedSubjects' | 'selectedGroups' | 'selectedStatuses',
    selected: string[]
  ) => {
    setFilter(prev => ({
      ...prev,
      [filterType]: selected
    }));
  };
  
  const handleSort = () => {
    console.log('Sorting with filters:', {
      subjects: filter.selectedSubjects,
      groups: filter.selectedGroups,
      statuses: filter.selectedStatuses
    });
  };
  
  // Фильтрация данных
  const filteredClasses = classes.filter(
    c =>
      (filter.selectedSubjects.length === 0 || filter.selectedSubjects.includes(c.subject)) &&
      (filter.selectedGroups.length === 0 || filter.selectedGroups.includes(c.group)) &&
      (filter.selectedStatuses.length === 0 || filter.selectedStatuses.includes(c.status))
  );
  
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  
  return (
    <div className={styles.classListContainer}>
      <div className={styles.filter}>
        <div className={styles.DateTimePicker}>
          <ClassListDateTimePicker />
        </div>
        
        <div className={styles.selectors}>
          <MultiSelectDropdown
            label="Предмет"
            options={filter.subjects}
            selectedOptions={filter.selectedSubjects}
            onOptionSelect={(selected) => handleFilterChange('selectedSubjects', selected)}
            placeholder={'Выбрать'}
          />
          
          <MultiSelectDropdown
            label="Группа"
            options={filter.groups}
            selectedOptions={filter.selectedGroups}
            onOptionSelect={(selected) => handleFilterChange('selectedGroups', selected)}
            placeholder={'Выбрать'}
          />
          
          <MultiSelectDropdown
            label="Статус"
            options={filter.statuses}
            selectedOptions={filter.selectedStatuses}
            onOptionSelect={(selected) => handleFilterChange('selectedStatuses', selected)}
            placeholder={'Выбрать'}
          />
        </div>
        
        <Button text="Сортировать" type="button" onClick={handleSort} />
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.classTable}>
          <thead>
          <tr>
            <th>Название предмета</th>
            <th>Группа</th>
            <th>Дата</th>
            <th>Время</th>
            <th>Статус</th>
            <th>Пара</th>
            <th>Форма</th>
          </tr>
          </thead>
          <tbody>
          {filteredClasses.map((classRow, index) => (
            <tr key={index}>
              <td>{classRow.subject}</td>
              <td>{classRow.group}</td>
              <td>{classRow.date}</td>
              <td>{classRow.time}</td>
              <td>
                {classRow.status === 'В ожидании' && <Clock color="#222222" />}
                {classRow.status === 'Проведено' && <CheckCircle color="#222222" />}
                {classRow.status === 'Не проведено' && <XCircle color="#222222" />}
              </td>
              <td>
                <button className={styles.editButton}>
                  <Edit />
                </button>
              </td>
              <td>
                <button className={styles.feedbackButton}>
                  <MessageSquare />
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      
      <Button text={'Показать ещё'} type={'button'} onClick={() => {}} />
    </div>
  );
};

export default ClassList;
