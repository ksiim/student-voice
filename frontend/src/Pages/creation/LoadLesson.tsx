import styles from './LoadLesson.module.scss';
import React, {useState} from 'react';
import {Logo} from '../../Components/Logo.tsx';
import Button from '../profile/Components/Button.tsx';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoadLessonItem {
  subject: string;
  group: string;
  time: string;
  date: Date;
  place: string;
}

interface LoadLessonProps {
  items: LoadLessonItem[];
}

const LoadLesson: React.FC<LoadLessonProps> = ({items}) => {
  const [visibleItems, setVisibleItems] = useState<number>(10);
  const [lessonItems, setLessonItems] = useState<LoadLessonItem[]>(items);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  
  const navigate = useNavigate();
  
  const handleCreateLesson = () => {
    navigate('/createLesson');
  };
  
  const showMore = () => {
    setVisibleItems(prev => prev + 10);
  };
  
  const handleDelete = (index: number) => {
    setLessonItems(prev => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });
    setDeleteIndex(null);
  };
  
  const showDeletePopup = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      x: rect.x - 100, // смещаем влево от иконки
      y: rect.y + window.scrollY // учитываем скролл страницы
    });
    setDeleteIndex(index);
  };
  
  const closePopup = () => {
    setDeleteIndex(null);
  };
  
  const displayedItems = lessonItems.slice(0, visibleItems);
  const hasMoreItems = visibleItems < lessonItems.length;
  
  // Обработчик клика вне попапа
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteIndex !== null && !(event.target as HTMLElement).closest('.deletePopup')) {
        setDeleteIndex(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [deleteIndex]);
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo/>
        <div className={styles.headerButtons}>
          <Button text="Создать пару вручную" onClick={handleCreateLesson}/>
          <Button text="Назад"/>
        </div>
      </header>
      
      <h1 className={styles.title}>Выгрузка пар/предметов из Modeus</h1>
      
      <div className={styles.loadingControls}>
        <div className={styles.loadingControls__period}>
          <span>Делать выгрузку раз в </span>
          <Button text="2 недели"/>
          <Button text="1 месяц"/>
        </div>
        
        <div className={styles.loadingControls__process}>
          <Button text="Начать"/>
          <p>Выгрузка может занять некоторое время</p>
        </div>
      </div>
      
      <table className={styles.table}>
        <thead>
        <tr>
          <th className={styles.tableHeader}>Название предмета</th>
          <th className={styles.tableHeader}>Группа</th>
          <th className={styles.tableHeader}>Время проведения</th>
          <th className={styles.tableHeader}>Дата проведения</th>
          <th className={styles.tableHeader}>Место проведения</th>
          <th className={styles.tableHeader}></th>
        </tr>
        </thead>
        <tbody>
        {displayedItems.map((item, index) => (
          <tr key={index} className={styles.tableRow}>
            <td className={styles.tableCell}>{item.subject}</td>
            <td className={styles.tableCell}>{item.group}</td>
            <td className={styles.tableCell}>{item.time}</td>
            <td className={styles.tableCell}>{item.date.toISOString().substring(0,10)}</td>
            <td className={styles.tableCell}>{item.place}</td>
            <td className={styles.tableCell}>
              <button
                className="p-2 hover:bg-gray-100 rounded-full relative"
                onClick={(e) => showDeletePopup(index, e)}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      
      {deleteIndex !== null && (
        <div
          className="deletePopup fixed bg-white rounded-lg shadow-lg p-4 z-50"
          style={{
            top: `${popupPosition.y}px`,
            left: `${popupPosition.x}px`,
          }}
        >
          <p className="text-sm mb-3">Вы уверены, что хотите удалить эту пару?</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
              onClick={closePopup}
            >
              Отмена
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDelete(deleteIndex)}
            >
              Удалить
            </button>
          </div>
        </div>
      )}
      
      {hasMoreItems && (
        <div className={styles.showMoreContainer}>
          <Button
            text="Показать ещё"
            onClick={showMore}
            className={styles.showMoreButton}
          />
        </div>
      )}
      
      <div className={styles.confirm}>
        <Button text='Сохранить изменения'/>
      </div>
      
      <div className={styles.confirmChanges}>
      </div>
    </div>
  );
};

export default LoadLesson;