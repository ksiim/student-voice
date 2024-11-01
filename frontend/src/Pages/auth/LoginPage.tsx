import {Logo} from '../../Components/Logo.tsx'
import {LoginForm} from './Components/LoginForm.tsx';

function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
      <div className="w-full max-w-md">
        <Logo />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;