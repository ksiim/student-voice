import React from 'react';
import styles from './Profile.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header';
import Schedule from '../../NewComponents/Schedule/Schedule.tsx'; // Adjust the import path according to your file structure
import { DaySchedule } from '../../NewComponents/Schedule/Schedule.tsx'; // Make sure to import the types

const Profile: React.FC = () => {
  // Sample data for the schedule - replace with your actual data source
  const sampleSchedule: DaySchedule[] = [
    {
      date: '09.10',
      weekDay: 'ЧТ',
      lessons: [
        {
          id: '1',
          startTime: '17:40',
          endTime: '19:10',
          title: 'Профессиональн...',
          isEditable: true,
        },
        {
          id: '2',
          startTime: '19:15',
          endTime: '20:45',
          title: 'Профессиональн...',
          isEditable: true,
        },
      ],
    },
    {
      date: '10.10',
      weekDay: 'ПТ',
      lessons: [
        {
          id: '3',
          startTime: '8:30',
          endTime: '10:00',
          title: 'Операционные с...',
          isEditable: true,
        },
      ],
    },
    {
      date: '10.10',
      weekDay: 'СБ',
      lessons: [
        {
          id: '3',
          startTime: '8:30',
          endTime: '10:00',
          title: 'Операционные с...',
          isEditable: true,
        },
      ],
    },
    {
      date: '10.10',
      weekDay: 'СБ',
      lessons: [
        {
          id: '3',
          startTime: '8:30',
          endTime: '10:00',
          title: 'Операционные с...',
          isEditable: true,
        },
      ],
    },
    {
      date: '10.10',
      weekDay: 'СБ',
      lessons: [
        {
          id: '3',
          startTime: '8:30',
          endTime: '10:00',
          title: 'Операционные с...',
          isEditable: true,
        },
      ],
    },
  ];
  
  // Handlers for schedule actions
  const handleEditLesson = (lessonId: string) => {
    console.log('Edit lesson:', lessonId);
    // Add your edit logic here
  };
  
  const handleViewLesson = (lessonId: string) => {
    console.log('View lesson:', lessonId);
    // Add your view logic here
  };
  
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <div className={styles.content__schedule}>
          <h2 className={styles.content__schedule__title}>Мое расписание</h2>
          <Schedule
            days={sampleSchedule}
            onEditLesson={handleEditLesson}
            onViewLesson={handleViewLesson}
          />
        </div>
        
        <div className={styles.content__list}>
          <h2 className={styles.content__list__title}>Мои пары</h2>
          {/* Add your pairs list content here */}
        </div>
      </div>
    </div>
  );
};

export default Profile;