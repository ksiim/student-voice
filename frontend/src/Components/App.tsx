import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../Pages/home/HomePage.tsx';
import LoginPage from '../Pages/auth/LoginPage.tsx';
import TeacherProfile from '../Pages/profile/TeacherProfile.tsx'
import '../index.css';

function App()  {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<TeacherProfile />} />
      </Routes>
    </Router>
  );
};

export default App;