import Button from '../profile/Components/Button.tsx';
import {useNavigate} from 'react-router-dom';


function HomePage() {
  const navigate = useNavigate()
  const handleLogin = () => {
    navigate('/login')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Button text='Перейти в логин' onClick={handleLogin}></Button>
    </div>
  );
};

export default HomePage;