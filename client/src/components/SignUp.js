import React from 'react'
import { useState } from 'react'
import 'C:/Users/Rani/Desktop/chat-app/myapp/src/components/S-style.css'

const SignUp = (props) => {
    const [text1 , setText1] = useState("");
    const [text2 , setText2] = useState("");
    const [text3 , setText3] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [password2 , setPassword2] = useState("");

    const handlesubmit = (e) =>{
        e.preventDefault();
    }


  return (
    <div>
      <section class="S-BackG">
    <div className="S-box">
        <div className="S-form">
            <h1>Sign-Up</h1>
            <form action="">
                <div className="S-inputBx">
                    <input type="text1" nChange={(e) => setText1(e.target.value)} placeholder="First Name" />
                </div>
                <div className="S-inputBx">
                    <input type="text2" nChange={(e) => setText2(e.target.value)} placeholder="Last Name" />
                </div>
                <div className="S-inputBx">
                    <input type="text3" onChange={(e) => setText3(e.target.value)} placeholder="Enter Your Phone Number" />
                </div>
                <div className="S-inputBx">
                    <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Your Email Addres" />
                </div>
                 <div className="S-inputBx">
                    <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <div className="S-inputBx">
                    <input type="password2" onChange={(e) => setPassword2(e.target.value)} placeholder="Confirm Your Password" />
                </div>
                <div className="S-inputBx">
                    <input type="submit" value="Sign-Up" />
                    <input type="submit" onClick={() => props.onFormSwitch('Login')} value="Already have an account" />
                </div>
                
            </form>
            
        </div>
    </div>
    </section>
    </div>
  )
}

export default SignUp
