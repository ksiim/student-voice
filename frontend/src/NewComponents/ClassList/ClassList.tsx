import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ClassList.module.scss';
import MultiSelectDropdown from '../MultiSelectDropdown/MultiSelectDropdown';
import Button from '../Button/Button';
import ClassListDateTimePicker from '../ClassListDateTimePicker/ClassListDateTimePicker.tsx';
import { Clock, CheckCircle, XCircle, Edit, MessageSquare } from 'lucide-react';
import { getToken, setAuthHeader } from '../../../public/serviceToken.js';
import { useNavigate } from 'react-router-dom';

interface FilterState {
  subjects: string[];
  selectedSubjects: string[];
  groups: string[];
  selectedGroups: string[];
  statuses: string[];
  selectedStatuses: string[];
  dateRange: {
    startTime: string;
    startDate: string;
    endTime: string;
    endDate: string;
  };
}

interface ClassRow {
  id: string;
  subject: string;
  group: string;
  date: string;
  time: string;
  status: 'В ожидании' | 'Проведено' | 'Не проведено';
  timestamp: number; // Add this field for sorting
}

const ClassList: React.FC = () => {
  const [filter, setFilter] = useState<FilterState>({
    subjects: [],
    selectedSubjects: [],
    groups: [],
    selectedGroups: [],
    statuses: ['В ожидании', 'Проведено', 'Не проведено'],
    selectedStatuses: [],
    dateRange: {
      startTime: '08:30',
      startDate: '',
      endTime: '20:45',
      endDate: ''
    }
  });
  
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (token) {
          setAuthHeader(token);
        }
        
        const userResponse = await axios.get('http://localhost:8000/api/v1/users/me');
        const teacherId = userResponse.data.id;
        
        const classesResponse = await axios.get('http://localhost:8000/api/v1/classes/', {
          params: { teacher_id: teacherId },
        });
        
        const rawClasses = classesResponse.data.data;
        
        const formattedClasses: ClassRow[] = rawClasses.map((lesson: any) => {
          const startTime = new Date(lesson.start_time);
          return {
            id: lesson.id,
            subject: lesson.name,
            group: lesson.study_groups || 'Группа неизвестна',
            date: startTime.toLocaleDateString('ru-RU'),
            time: `${startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - ${
              new Date(lesson.end_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
            }`,
            status: 'В ожидании',
            timestamp: startTime.getTime() // Store timestamp for sorting
          };
        });
        
        setClasses(formattedClasses);
        setFilteredClasses(formattedClasses);
        
        const uniqueSubjects = Array.from(new Set(formattedClasses.map(c => c.subject)));
        const allGroups = formattedClasses.flatMap(c => c.group.split(', ').map(g => g.trim()));
        const uniqueGroups = Array.from(new Set(allGroups));
        
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
  
  const handleFeedbackForm = (classId: string) => {
    navigate(`/createForm/${classId}`);
  };
  
  const handleFilterChange = (
    filterType: 'selectedSubjects' | 'selectedGroups' | 'selectedStatuses',
    selected: string[]
  ) => {
    setFilter((prev) => ({
      ...prev,
      [filterType]: selected
    }));
  };
  
  const handleDateRangeChange = (range: {
    startTime: string;
    startDate: string;
    endTime: string;
    endDate: string;
  }) => {
    setFilter(prev => ({
      ...prev,
      dateRange: range
    }));
  };
  
  const handleSort = () => {
    const filtered = classes.filter((c) => {
      const classDate = new Date(c.timestamp);
      const startDateTime = filter.dateRange.startDate
        ? new Date(`${filter.dateRange.startDate}T${filter.dateRange.startTime}`)
        : new Date(0);
      const endDateTime = filter.dateRange.endDate
        ? new Date(`${filter.dateRange.endDate}T${filter.dateRange.endTime}`)
        : new Date(8640000000000000); // Max date
      
      const groupsArray = c.group.split(',').map((group) => group.trim());
      
      const matchesDateTime = classDate >= startDateTime && classDate <= endDateTime;
      const matchesSubject = filter.selectedSubjects.length === 0 || filter.selectedSubjects.includes(c.subject);
      const matchesGroup = filter.selectedGroups.length === 0 ||
        filter.selectedGroups.every((selectedGroup) => groupsArray.includes(selectedGroup));
      const matchesStatus = filter.selectedStatuses.length === 0 || filter.selectedStatuses.includes(c.status);
      
      return matchesDateTime && matchesSubject && matchesGroup && matchesStatus;
    });
    
    // Sort by timestamp
    const sorted = [...filtered].sort((a, b) => a.timestamp - b.timestamp);
    setFilteredClasses(sorted);
  };
  
  const visibleClasses = filteredClasses.slice(0, visibleCount);
  
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  
  return (
    <div className={styles.classListContainer}>
      <div className={styles.filter}>
        <div className={styles.DateTimePicker}>
          <ClassListDateTimePicker onRangeChange={handleDateRangeChange} />
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
          {visibleClasses.map((classRow, index) => (
            <tr key={index}>
              <td>{classRow.subject}</td>
              <td>{classRow.group}</td>
              <td>{classRow.date}</td>
              <td>{classRow.time}</td>
              <td>
                {classRow.status === 'В ожидании' && <Clock color="#222222"/>}
                {classRow.status === 'Проведено' && <CheckCircle color="#222222"/>}
                {classRow.status === 'Не проведено' && <XCircle color="#222222"/>}
              </td>
              <td>
                <button className={styles.editButton}>
                  <Edit/>
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleFeedbackForm(classRow.id)}
                  className={styles.feedbackButton}
                >
                  <MessageSquare/>
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      
      {visibleCount < filteredClasses.length && (
        <Button
          text={'Показать ещё'}
          type={'button'}
          onClick={() => setVisibleCount((prev) => prev + 12)}
        />
      )}
    </div>
  );
};

export default ClassList;