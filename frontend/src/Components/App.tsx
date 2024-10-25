import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../Pages/home/HomePage.tsx';
import LoginPage from '../Pages/auth/LoginPage.tsx';
import '../index.css';

function App()  {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;