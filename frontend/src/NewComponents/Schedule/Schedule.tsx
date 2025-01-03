import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Edit, Eye } from 'lucide-react';
import styles from './Schedule.module.scss';

interface ScheduleProps {
  days: DaySchedule[];
  onEditLesson?: (lessonId: string) => void;
  onViewLesson?: (lessonId: string) => void;
  onWeekChange?: (startDate: Date, endDate: Date) => void;
}

export interface Lesson {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  isEditable?: boolean;
}

export interface DaySchedule {
  date: string;
  weekDay: string;
  lessons: Lesson[];
}

const Schedule: React.FC<ScheduleProps> = ({
                                             days,
                                             onEditLesson,
                                             onViewLesson,
                                             onWeekChange,
                                           }) => {
  const [currentWeek, setCurrentWeek] = useState({
    start: new Date(),
    end: new Date()
  });
  
  useEffect(() => {
    // При первой загрузке устанавливаем текущую неделю
    setInitialWeek();
  }, []);
  
  const setInitialWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    
    // Получаем начало недели (понедельник)
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    // Получаем конец недели (воскресенье)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    setCurrentWeek({ start: monday, end: sunday });
    onWeekChange?.(monday, sunday);
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\./g, '.');
  };
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeek.start);
    const newEnd = new Date(currentWeek.end);
    
    if (direction === 'prev') {
      newStart.setDate(newStart.getDate() - 7);
      newEnd.setDate(newEnd.getDate() - 7);
    } else {
      newStart.setDate(newStart.getDate() + 7);
      newEnd.setDate(newEnd.getDate() + 7);
    }
    
    setCurrentWeek({ start: newStart, end: newEnd });
    onWeekChange?.(newStart, newEnd);
  };
  
  // Определяем количество столбцов
  const columns = days.length === 6 ? 3 : days.length;
  
  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.header}>
        <div className={styles.dateRange}>
          <button
            className={styles.navigationButton}
            onClick={() => navigateWeek('prev')}
            aria-label="Previous week"
          >
            <ChevronLeft size={36} />
          </button>
          <div className={styles.dateRangeContainer}>
            <div className={styles.dateBox}>
              {formatDate(currentWeek.start)}
            </div>
            <div className={styles.dateSeparator}>-</div>
            <div className={styles.dateBox}>
              {formatDate(currentWeek.end)}
            </div>
          </div>
          <button
            className={styles.navigationButton}
            onClick={() => navigateWeek('next')}
            aria-label="Next week"
          >
            <ChevronRight size={36} />
          </button>
        </div>
      </div>
      
      <div
        className={styles.daysContainer}
        style={{ '--days-columns': columns } as React.CSSProperties}
      >
        {days.map((day) => (
          <div key={day.date} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <div>{day.weekDay}</div>
              <div>{day.date}</div>
            </div>
            
            <div className={styles.lessonCardList}>
              {day.lessons.map((lesson) => (
                <div key={lesson.id} className={styles.lessonCard}>
                  <div className={styles.lessonTime}>
                    {lesson.startTime}-{lesson.endTime}
                  </div>
                  <div className={styles.lessonTitle}>{lesson.title}</div>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.actionButton}
                      onClick={() => onViewLesson?.(lesson.id)}
                    >
                      <Eye size={16} />
                    </button>
                    {lesson.isEditable && (
                      <button
                        className={styles.actionButton}
                        onClick={() => onEditLesson?.(lesson.id)}
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;