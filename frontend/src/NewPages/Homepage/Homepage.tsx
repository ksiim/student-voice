import React from 'react';
import styles from './Homepage.module.scss';
import megafonIcon from '/assets/images/megafon.svg';
import markIcon from '/assets/images/mark.svg';
import anonIcon from '/assets/images/anon.svg';
import diagramIcon from '/assets/images/diagram.svg';
import questionIcon from '/assets/images/question.svg';
import moodIcon from '/assets/images/moodboard.svg';
import jigsawIcon from '/assets/images/jigsaw.svg';
import accountIcon from '/assets/images/account.svg';
import booksIcon from '/assets/images/books.svg';
import HomePageForm from '../../NewComponents/HomePageForm/HomePageForm.tsx';
import Header from '../../NewComponents/Header/MainHeader/Header.tsx';


const Homepage:React.FC = () => {
  
  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.hero__text}>
            <h2 className={styles.hero__text__title}>Голос студента: Сделай учебный процесс лучше!</h2>
            <p className={styles.hero__text__paragraph}>Проект, который позволяет студентам выражать свое мнение о занятиях, преподавателях и учебных материалах анонимно. Ваша обратная связь важна для улучшения качества образования.</p>
          </div>
          
          <img className={styles.hero__icon} src={megafonIcon} alt={''}/>
        </div>
        
        <div className={styles.info}>
          <div className={styles.info__section}>
            <h3>Оценка преподавателей и курсов</h3>
            <p>Студенты могут оценивать преподавателей и предметы по разным критериям (качество преподавания, доступность материала, организация занятия).</p>
            <img src={markIcon} alt={''}/>
          </div>
          
          <div className={styles.info__section}>
            <h3>Анонимность и честность</h3>
            <p>Ваши отзывы остаются анонимными, что позволяет выражать честное мнение.</p>
            <img src={anonIcon} alt={''}/>
          </div>
          
          <div className={styles.info__section}>
            <h3>Анонимность и честность</h3>
            <p>Команда ИРИТ-РТФ анализирует собранные отзывы и использует их для улучшения качества образовательного процесса</p>
            <img src={diagramIcon} alt={''}/>
          </div>
        
        </div>
        
        <div className={styles.instruction}>
          <h2 className={styles.instruction__title}>Как это работает?</h2>
          <div className={styles.instruction__content}>
            <img src={questionIcon} alt={''}/>
            <ul>
              <li><b>Шаг 1:</b> Преподаватель показывает QR-код на занятии.</li>
              <li><b>Шаг 2:</b> Студент сканирует код и переходит на форму обратной связи.</li>
              <li><b>Шаг 3:</b> Оценивает занятие и, по желанию, оставляет комментарий.</li>
              <li><b>Шаг 4:</b> Отзывы анализируются командой ИРИТ-РТФ для улучшения качества обучения.</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.advantages}>
          <h2 className={styles.advantages__title}>Преимущества</h2>
          <div className={styles.advantages__content}>
            <div className={styles.advantages__content__item}>
              <h3>Возможность влиять на учебный процесс</h3>
              <img src={moodIcon} alt={''}/>
            </div>
            
            <div className={styles.advantages__content__item}>
              <h3>Участие в создании рейтингов преподавателей и предметов</h3>
              <img src={jigsawIcon} alt={''}/>
            </div>
            
            <div className={styles.advantages__content__item}>
              <h3>Анонимные отзывы без страха негативных последствий.</h3>
              <img src={accountIcon} alt={''}/>
            </div>
            
            <div className={styles.advantages__content__item}>
              <h3>Информированность о качестве курсов и преподавателей</h3>
              <img src={booksIcon} alt={''}/>
            </div>
          </div>
        </div>
        
        <div className={styles.criterion}>
          <h2 className={styles.criterion__title}>Критерии оценивания</h2>
          <div className={styles.criterion__content}>
            <div className={styles.criterion__content__item}>
              <h3>Качество преподавания</h3>
              <p>Компетентность преподавателя.<br/>
                Способность объяснять сложные темы доступным языком.<br/>
                Готовность отвечать на вопросы студентов.
                Эффективность взаимодействия с группой (вовлечение студентов в
                дискуссии, поддержка обратной связи).</p>
              <b>«Насколько преподаватель ясно объясняет материал?»<br/>«Активирует
                ли преподаватель ваш интерес к предмету?»</b>
            </div>
            
            <div className={styles.criterion__content__item}>
              <div className={styles.criterion__content__item__inner}>
                <h3>Доступность материала</h3>
                <p>Насколько логично и структурировано подается материал.
                  Как легко понять учебный материал.
                  Насколько материал соответствует ожиданиям и целям курса.
                  Интересен ли он студентам.</p>
                <b>«Насколько доступен и понятен материал курса?»<br/>«Интересен ли вам изучаемый предмет?»</b>
              </div>
              
              <div className={styles.criterion__content__item__inner}>
                <h3>Текстовый комментарий</h3>
                <b>«Что вам особенно понравилось на занятии?»<br/>«Какие аспекты
                  можно улучшить?»</b>
              </div>
            </div>
            
            <div className={styles.criterion__content__item}>
              <h3>Качество проведения мероприятия</h3>
              <p>Организованность процесса: начало и окончание занятий вовремя.
                Техническое обеспечение: использование микрофонов, камер, проекторов и других технических средств.
                Наличие необходимых учебных материалов.
                Плавность проведения занятия, отсутствие технических или организационных сбоев.</p>
              <b>«Все ли было организовано вовремя и без задержек?»<br/>«Насколько
                хорошо работала техника на занятии?»</b>
            </div>
          </div>
        </div>
        
        <div className={styles.feedback}>
          <h2 className={styles.feedback__title}>Есть вопросы или хотите поделиться мнением?</h2>
          <div className={styles.feedback__content}>
            <div className={styles.feedback__content__text}>
              <h3>Расскажите нам о своём опыте!</h3>
              <p>Мы ценим вашу честность и всегда готовы выслушать. Ваш
                отзыв<br/>
                поможет улучшить качество образовательного процесса и
                сделать<br/> платформу удобнее.<br/>
                Если вам нужна помощь, администрация сайта свяжется с вами<br/>
                как можно скорее.</p>
              <p>**Проект сделан в рамках Проектного практикума командой
                JK.Web<br/> в 2024 году.</p>
            </div>
            
            <div className={styles.form}>
              <HomePageForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
