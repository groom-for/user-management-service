import { useState } from 'react';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import './App.css';

function App() {
  const [mode, setMode] = useState('login');

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return <SignupForm onSwitchToLogin={() => setMode('login')} />;
      case 'forgot':
        return <ForgotPasswordForm onSwitchToLogin={() => setMode('login')} />;
      case 'login':
      default:
        return (
          <LoginForm
            onSwitchToSignup={() => setMode('signup')}
            onSwitchToForgot={() => setMode('forgot')}
          />
        );
    }
  };

  return <div className="app-shell">{renderForm()}</div>;
}

export default App;
