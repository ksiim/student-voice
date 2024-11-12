import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../Pages/home/HomePage.tsx';
import LoginPage from '../Pages/auth/LoginPage.tsx';
import TeacherProfile from '../Pages/profile/TeacherProfile.tsx'
import '../index.css';
import UserCreation from '../Pages/auth/UserCreation.tsx';
import FeedbackForm from '../Pages/feedback/FeedbackForm.tsx';
import AdminPanel from '../Pages/admin/AdminPanel.tsx';
import CreateClass from '../Pages/creation/CreateClass.tsx';
import UploadReports from '../Pages/Reports/UploadReports.tsx';
import ChangePassword from '../Pages/auth/changePassword.tsx';
import CreateForm from '../Pages/creation/CreateForm.tsx';
import StudentList
  from '../Pages/feedback/StudentList.tsx';
import LoadClass from '../Pages/creation/LoadClass.tsx';

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
          classId = '06b0ca06-a22c-41d8-a5fb-a1234e661739'
        />} />
        <Route path='/adminPanel' element={<AdminPanel/>}/>
        <Route path='/createClass' element={<CreateClass />}/>
        <Route path='/reports' element={<UploadReports />}/>
        <Route path='/changePassword' element={
          <ChangePassword/>
        }/>
        <Route path='/createForm' element={
          <CreateForm
            onSubmit={(formData) => {
              console.log('Form submitted:', formData);
              // Добавьте здесь вашу логику обработки формы
            }}
          />
        }/>
        
        <Route path='/list' element={<StudentList classId = '06b0ca06-a22c-41d8-a5fb-a1234e661739'/>} />
        
        <Route path='/load' element={<LoadClass items={[
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