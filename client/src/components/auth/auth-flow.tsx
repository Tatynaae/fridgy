import { useState } from 'react';

import LoginScreen from './login-screen';
import RegisterScreen from './register-screen';

export default function AuthFlow() {
  const [mode, setMode] = useState<'login' | 'register'>('register');

  return mode === 'register' ? (
    <RegisterScreen onSwitch={() => setMode('login')} />
  ) : (
    <LoginScreen onSwitch={() => setMode('register')} />
  );
}