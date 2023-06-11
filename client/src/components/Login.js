import React from 'react'
import 'C:/Users/Rani/Desktop/chat-app/myapp/src/components/style.css';
import SignUp from './SignUp';
import { useState , useReducer , useEffect } from 'react';


const Login = (props) => {

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const handlesubmit = (e) =>{
        e.preventDefault();
    }

  return (
    <section class="BackG">
    <div className="box">
        <div className="form">
            <h2>Login</h2>
            <form action="">
                 <div className="inputBx">
                    <input type="password" onChange={(e) => setEmail(e.target.value)} placeholder="Your Password" id="email" name="email"/>
                </div>
                <div className="inputBx">
                    <input type="email" onChange={(e) => setPassword(e.target.value)} placeholder="Your Email" id="password" name="password"/>
                </div>
                <div className="inputBx">
                    <input type="submit" value="Login" />
                </div>
            </form>
            <div className="a">
            <p>Forget <button className="btn" onClick={() => props.onFormSwitch('ForgetPassWord')} >Password</button></p>
            <p>New <button className="btn" onClick={() => props.onFormSwitch('SignUp')} >Account</button></p>
            </div>
        </div>
      
    </div>
    </section>
  )
}

export default Login
