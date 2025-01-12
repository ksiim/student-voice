import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AttendanceList.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header.tsx';
import Collapsible from '../../NewComponents/Collapsible/Collapsible.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import FeedbackResults from '../../NewComponents/FeedbackResults/FeedbackResults.tsx';

interface Attendance {
  student_full_name: string;
  study_group: string;
}

interface Review {
  comment: string;
  teaching_quality: number;
  material_clarity: number;
  event_quality: number;
  answer_to_question_1?: string;
  answer_to_question_2?: string;
  answer_to_question_3?: string;
  id: string;
  class_id: string;
}

interface Backform {
  additional_question_1: string;
  additional_question_2: string;
  additional_question_3: string;
}

const AttendanceList: React.FC = () => {
  const { class_id } = useParams();
  const navigate = useNavigate();
  
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Backform | null>(null);
  const [classData, setClassData] = useState<null | Record<string, any>>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        // Запросы к API
        const [attendanceResponse, reviewsResponse, backformResponse, classResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/v1/attendances/${class_id}/`),
          axios.get(`http://localhost:8000/api/v1/reviews/`, { params: { class_id } }),
          axios.get(`http://localhost:8000/api/v1/backforms/by_class_id/${class_id}`),
          axios.get(`http://localhost:8000/api/v1/classes/${class_id}`)
        ]);
        
        if (isMounted) {
          setAttendances(attendanceResponse.data.data);
          setReviews(reviewsResponse.data.data);
          setQuestions({
            additional_question_1: backformResponse.data.additional_question_1,
            additional_question_2: backformResponse.data.additional_question_2,
            additional_question_3: backformResponse.data.additional_question_3,
          });
          setClassData(classResponse.data); // Сохраняем данные класса
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    if (class_id) {
      fetchData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [class_id]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleSave = async () => {
    if (!classData) {
      alert('Данные класса ещё не загружены.');
      return;
    }
    
    const requestBody = {
      start_time: classData.start_time,
      end_time: classData.end_time,
      teacher_id: classData.teacher_id,
      subject_id: classData.subject_id,
      group: classData.study_groups,
    };
    
    console.log(requestBody);
    
    try {
      const response = await axios.post('http://localhost:8000/api/v1/classes/excel', requestBody);
      console.log('Успешно сохранено:', response.data);
      alert('Данные успешно сохранены!');
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Ошибка при сохранении данных.');
    }
  };
  
  // Преобразование данных для голосовавших
  const voters = attendances.map((attendance) => ({
    name: attendance.student_full_name,
    group: attendance.study_group,
  }));
  
  // Преобразование данных для дополнительных вопросов
  const answers = [
    questions?.additional_question_1
      ? { question: questions.additional_question_1, answers: reviews.map((r) => r.answer_to_question_1 || '—') }
      : { question: 'Вопрос 1 отсутствует', answers: ['—'] },
    questions?.additional_question_2
      ? { question: questions.additional_question_2, answers: reviews.map((r) => r.answer_to_question_2 || '—') }
      : { question: 'Вопрос 2 отсутствует', answers: ['—'] },
    questions?.additional_question_3
      ? { question: questions.additional_question_3, answers: reviews.map((r) => r.answer_to_question_3 || '—') }
      : { question: 'Вопрос 3 отсутствует', answers: ['—'] },
  ];
  
  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <Collapsible title={'Список проголосовавших'} defaultOpen={true}>
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
                onClick={handleSave}
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
          <FeedbackResults reviews={reviews} />
        </Collapsible>
        <Button text={'Назад'} type={'button'} color={'#CCCCCC'} onClick={handleBack} />
      </div>
    </div>
  );
};

export default AttendanceList;
