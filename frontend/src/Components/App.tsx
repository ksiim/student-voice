import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../Pages/home/HomePage.tsx';
import LoginPage from '../Pages/auth/LoginPage.tsx';
import TeacherProfile from '../Pages/profile/TeacherProfile.tsx'
import '../index.css';
import UserCreation from '../Pages/auth/UserCreation.tsx';
import FeedbackForm from '../Pages/feedback/FeedbackForm.tsx';
import AdminPanel from '../Pages/admin/AdminPanel.tsx';
import CreateLesson from '../Pages/creation/CreateLesson.tsx';
import UploadReports from '../Pages/Reports/UploadReports.tsx';
import ChangePassword from '../Pages/auth/changePassword.tsx';
import CreateForm from '../Pages/creation/CreateForm.tsx';
import AdditionalCriteriaList
  from '../Pages/feedback/AdditionalCriteriaList.tsx';
import LoadLesson from '../Pages/creation/LoadLesson.tsx';

function App()  {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/createUser" element={<UserCreation />} />
        <Route path="/feedback" element={<FeedbackForm
          teacherName="Иванова И.И."
          groupId="АТ-02"
          date="21.09.2024"
        />} />
        <Route path='/adminPanel' element={<AdminPanel/>}/>
        <Route path='/createLesson' element={<CreateLesson />}/>
        <Route path='/reports' element={<UploadReports />}/>
        <Route path='/changePassword' element={
          <ChangePassword
            onSubmit={(oldPassword, newPassword) => {
              // Здесь добавьте логику обработки смены пароля
              console.log('Changing password:', { oldPassword, newPassword });
            }}
            userEmail="user@example.com" // Опционально
          />
        }/>
        <Route path='/createForm' element={
          <CreateForm
            onSubmit={(formData) => {
              console.log('Form submitted:', formData);
              // Добавьте здесь вашу логику обработки формы
            }}
          />
        }/>
        
        <Route path='/list' element={<AdditionalCriteriaList items={[
          { group: 'АТ-01', name: 'Иванов Иван Иванович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-02', name: 'Петров Петр Петрович'},
          { group: 'АТ-25', name: 'Сидоров Сидор Сидорович' }
        ]} />} />
        
        <Route path='/load' element={<LoadLesson items={[
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
          { subject: 'Арх эвм', group: 'АТ-01', time: '12:30-13:30', date: new Date(2024,10,30), place: 'Ирит-РТФ'},
        ]} />} />
      </Routes>
    </Router>
  );
};

export default App;