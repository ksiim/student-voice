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
    end: new Date(),
  });
  
  useEffect(() => {
    console.log("Schedule props:", days); // Логирование данных в компоненте
    
    // Устанавливаем начальную неделю при загрузке
    setInitialWeek();
  }, []);
  
  const setInitialWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    setCurrentWeek({ start: monday, end: sunday });
    onWeekChange?.(monday, sunday);
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
    
    newStart.setHours(0, 0, 0, 0);
    newEnd.setHours(23, 59, 59, 999);
    
    setCurrentWeek({ start: newStart, end: newEnd });
    onWeekChange?.(newStart, newEnd);
  };
  
  const formatDate = (date: Date): string => {
    return date
      .toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\./g, '.');
  };
  
  const formatTime = (time: string): string => {
    return time.slice(0, 5); // Оставляем только часы и минуты
  };
  
  // Фильтруем дни, которые входят в текущую неделю
  const filteredDays = days.filter((day) => {
    const [dayNum, month, year] = day.date.split('.').map(Number);
    const dayDate = new Date(year, month - 1, dayNum); // создаем дату в формате YYYY-MM-DD
    return dayDate >= currentWeek.start && dayDate <= currentWeek.end;
  });
  
  // Сортировка пар внутри дня по времени
  const sortedLessons = (lessons: Lesson[]) => {
    return lessons.sort((a, b) => {
      const [aStartHour, aStartMinute] = a.startTime.split(':').map(Number);
      const [bStartHour, bStartMinute] = b.startTime.split(':').map(Number);
      
      const aTotalMinutes = aStartHour * 60 + aStartMinute;
      const bTotalMinutes = bStartHour * 60 + bStartMinute;
      
      return aTotalMinutes - bTotalMinutes;
    });
  };
  
  // Определяем количество столбцов
  const columns = filteredDays.length === 6 ? 3 : filteredDays.length;
  
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
            <div className={styles.dateBox}>{formatDate(currentWeek.start)}</div>
            <div className={styles.dateSeparator}>-</div>
            <div className={styles.dateBox}>{formatDate(currentWeek.end)}</div>
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
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` } as React.CSSProperties}
      >
        {filteredDays.map((day) => (
          <div key={day.date} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <div>{day.weekDay}</div>
              <div>{day.date}</div>
            </div>
            
            <div className={styles.lessonCardList}>
              {sortedLessons(day.lessons).map((lesson) => (
                <div key={lesson.id} className={styles.lessonCard}>
                  <div className={styles.lessonTime}>
                    {formatTime(lesson.startTime)}-{formatTime(lesson.endTime)}
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

