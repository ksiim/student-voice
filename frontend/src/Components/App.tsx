import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../Pages/home/HomePage.tsx';
import LoginPage from '../Pages/auth/LoginPage.tsx';
import TeacherProfile from '../Pages/profile/TeacherProfile.tsx'
import '../index.css';
import UserCreation from '../Pages/auth/UserCreation.tsx';
import FeedbackForm from './FeedbackForm.tsx';
import AdminPanel from '../Pages/admin/AdminPanel.tsx';
import CreateLesson from '../Pages/creation/CreateLesson.tsx';

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
      </Routes>
    </Router>
  );
};

export default App;