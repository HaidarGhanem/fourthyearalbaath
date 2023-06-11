import React from 'react'
import "C:/Users/Rani/Desktop/chat-app/myapp/src/components/P-style.css"
import { useState } from 'react';
const ForgetPassWord = (props) => {

    const [text , setText] = useState("");
    const [text2 , setText2] = useState("");
    const [email , setEmail] = useState("");

  return (
    <section class="P-BackG">
    <div className="P-box">
        <div className="P-form">
            <h1>Confirm That is Your Account</h1>
            <form action="">
                <div className="P-inputBx">
                    <input type="text" onChange={(e) => setText(e.target.value)} placeholder="Your Username " />

                    <input type="text2" onChange={(e) => setText2(e.target.value)} placeholder="Your Phone Number " />
                    
                    <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Your Email " />
                </div>
                <div className="P-inputBx">
                    <input type="submit" value="Send" />
                </div>
                <div>
                    <button className="P-inputBx" onClick={() => props.onFormSwitch('Login')} >Go Back</button>
                </div>
            </form>
        </div>
    </div>
    </section>
  )
}

export default ForgetPassWord
