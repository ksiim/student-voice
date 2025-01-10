import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '../NewPages/Homepage/Homepage.tsx';
import TeacherProfile from '../NewPages/Profile/Profile.tsx'
import '../index.css';
import CreateUser from '../NewPages/CreateUser/CreateUser.tsx';
import FeedbackForm from '../NewPages/FeedbackForm/FeedbackForm.tsx';
import AdminPanel from '../Pages/admin/AdminPanel.tsx';
import CreateClass from '../NewPages/CreateClass/CreateClass.tsx';
import UploadReports from '../Pages/Reports/UploadReports.tsx';
import ChangePassword from '../NewPages/ChangePassword/ChangePassword.tsx';
import StudentList
  from '../NewPages/AttendanceList/AttendanceList.tsx';
import LoadClass from '../NewPages/LoadClass/LoadClass.tsx';
import LoginPage from '../NewPages/LoginPage/LoginPage.tsx';
import Users from '../NewPages/Users/Users.tsx';
import UpdateUser from '../NewPages/UpdateUser/UpdateUser.tsx';
import Metrics from '../NewPages/Metrics/Metrics.tsx';
import CreateFeedbackForm
  from '../NewPages/CreateFeedbackForm/CreateFeedbackForm.tsx';


function App()  {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/updateuser/:id" element={<UpdateUser />} />
        <Route path="/feedback/:class_id" element={<FeedbackForm />} />
        <Route path='/users' element={<Users/>}/>
        <Route path='/adminPanel' element={<AdminPanel/>}/>
        <Route path='/createClass' element={<CreateClass />}/>
        <Route path='/reports' element={<UploadReports />}/>
        <Route path='/changePassword' element={<ChangePassword/>}/>
        <Route path="/createForm/:id" element={<CreateFeedbackForm />} />
        <Route path='/list/:class_id' element={<StudentList/>} />
        <Route path='/metrics' element={<Metrics/>} />
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