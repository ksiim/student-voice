import React, { useState } from 'react';
import styles from './AdditionalCriteriaList.module.scss';
import { Logo } from '../../Components/Logo.tsx';
import Button from '../profile/Components/Button.tsx';

interface AdditionalCriteriaItem {
  group: string;
  name: string;
}

interface AdditionalCriteriaListProps {
  items: AdditionalCriteriaItem[];
}

const AdditionalCriteriaList: React.FC<AdditionalCriteriaListProps> = ({ items}) => {
  const [visibleItems, setVisibleItems] = useState<number>(10);
  
  const showMore = () => {
    setVisibleItems(prev => prev + 10);
  };
  
  const displayedItems = items.slice(0, visibleItems);
  const hasMoreItems = visibleItems < items.length;
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo/>
        <div className={styles.headerButtons}>
          <Button text="Настроить выгрузку"/>
          <Button text="Изменить пароль"/>
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
          <th className={styles.tableHeader}>Группа</th>
          <th className={styles.tableHeader}>ФИО</th>
        </tr>
        </thead>
        <tbody>
        {displayedItems.map((item, index) => (
          <tr key={index} className={styles.tableRow}>
            <td className={styles.tableCell}>{item.group}</td>
            <td className={styles.tableCell}>{item.name}</td>
          </tr>
        ))}
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
          <td className={styles.tableCell}>1 - 20%, 2 - 0%, 3 - 40%, 4 - 40%, 5
            - 0%
          </td>
        </tr>
        <tr className={styles.tableRow}>
          <td className={styles.tableCell}>Качество оборудования</td>
          <td className={styles.tableCell}>1 - 20%, 2 - 0%, 3 - 40%, 4 - 40%, 5
            - 0%
          </td>
        </tr>
        <tr className={styles.tableRow}>
          <td className={styles.tableCell}>Интересная подача</td>
          <td className={styles.tableCell}>1 - 20%, 2 - 0%, 3 - 40%, 4 - 40%, 5
            - 0%
          </td>
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

export default AdditionalCriteriaList;