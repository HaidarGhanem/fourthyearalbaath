import { useState } from 'react';

import React from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Rate from './components/Rate';
import ForgetPassWord from './components/ForgetPassWord';
import ConfirmCode from './components/ConfirmCode';
import Chat from './components/Chat';
import Users from './components/Users';
import chatHome from './components/ChatHome';
import NavBar from './components/NavBar';
import ChatHome from './components/ChatHome';
const App = () => {



  const [CurrentForm , setCurrentForm] = useState("Login");

  const toggleForm = ( formName ) => {
    setCurrentForm(formName);
  }

  return (
    
    <div>
      <ChatHome/>
    </div>
  )
};

export default App
