import React, { useEffect, useState } from 'react';
import styles from './AttendanceList.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header.tsx';
import Collapsible from '../../NewComponents/Collapsible/Collapsible.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import FeedbackResults from '../../NewComponents/FeedbackResults/FeedbackResults.tsx';
import { useNavigate } from 'react-router-dom';

interface Voter {
  group: string;
  name: string;
}

interface Answer {
  question: string;
  answers: string[];
}

const AttendanceList: React.FC = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState<Voter[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      const votersData = [
        { group: 'AT-01', name: 'Артемов Филипп Владиславович' },
        { group: 'AT-01', name: 'Белова Каролина Данииловна' },
        { group: 'AT-02', name: 'Григорьев Иван Сергеевич' },
        { group: 'AT-02', name: 'Евгеньевна Мария Васильевна' },
        // Add more voters as needed
      ];
      
      const answersData = [
        {
          question: 'Устраивает ли вас баланс между теорией и практикой?',
          answers: [
            'Слишком много теории, и не всегда хватает времени на практическое применение знаний. Хотелось бы больше задач и практических работ в группе.',
            'Баланс хороший, но иногда темы практики не совпадают с теоретической частью.',
            'Нормально.'
          ],
        },
        {
          question: 'Как я могу улучшить коммуникацию?',
          answers: [
            'Все ок.',
            'Иногда не хватает времени для обсуждения всего на паре.',
            'Взаимодействие отличное, но хотелось бы больше примеров или объяснений, когда кто-то задает вопросы, чтобы остальные тоже лучше поняли.'
          ],
        },
        {
          question: 'Что самое интересное было на паре?',
          answers: [
            'Обсуждение реальных примеров.',
            'Мне очень понравилось, как преподаватель объяснял сложную тему через аналогии.',
            'Работа в командах сказалась очень интересно! Не только погрузился в задачу, но и услышал разные подходы к ее решению.'
          ],
        },
      ];
      
      setVoters(votersData);
      setAnswers(answersData);
    };
    
    fetchData();
  }, []);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <Collapsible title={'Список проголосовавших'}>
          <div className={styles.list}>
            <h2 className={styles.list__count}>Проголосовало {voters.length} человека</h2>
            <div className={styles.list__items}>
              <ul>
                {voters.map((voter, index) => (
                  <li key={index} className={styles.groupAndName}>
                    <span className={styles.group}>{voter.group}</span>
                    <span className={styles.name}>{voter.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Кнопки */}
            <div className={styles.list__buttons}>
              <Button
                text={'Сохранить'}
                type={'button'}
                onClick={() => {}}
                color={'#1E4391'}
              />
              <Button
                text={'Печать'}
                type={'button'}
                onClick={() => {}}
                color={'#1E4391'}
              />
            </div>
          </div>
        </Collapsible>
        <Collapsible title={'Ответы на дополнительные вопросы'}>
          <div className={styles.answers}>
            {answers.map((answer, index) => (
              <div key={index} className={styles.answerColumn}>
                <h3 className={styles.answerColumn__question}>{answer.question}</h3>
                <ul className={styles.answerColumn__list}>
                  {answer.answers.map((ans, ansIndex) => (
                    <li key={ansIndex} className={styles.answerColumn__item}>
                      {ans}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Collapsible>
        <Collapsible title={'Отзывы'}>
          <FeedbackResults />
        </Collapsible>
        <Button text={'Назад'} type={'button'} color={'#CCCCCC'} onClick={handleBack} />
      </div>
    </div>
  );
};

export default AttendanceList;
