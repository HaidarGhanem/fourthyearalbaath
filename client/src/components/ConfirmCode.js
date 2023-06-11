import React from 'react'
import VerifInput from './VerifyInput'
import "C:/Users/Rani/Desktop/chat-app/myapp/src/components/C-style.css"

const ConfirmCode = () => {
  return (
    <section class="C-BackG">
    <div className="C-box">
        <div className="C-form">
            <h1>We Will Send you a code in a Minute</h1>
        <div className="C-inputBx">
            <input tupe="number" inputMode='numirc' maxLength="1" />
            <input tupe="number" maxLength="1" disabled/>
            <input tupe="number" maxLength="1" disabled/>
            <input tupe="number" maxLength="1" disabled/>
            <input tupe="number" maxLength="1" disabled/>
            <input tupe="number" maxLength="1" disabled/>
        </div>
        <div className="V-inputBx">
            <input type="submit" value="Verify" />
        </div>
        </div>
    </div>
    </section>
  )
}

export default ConfirmCode
