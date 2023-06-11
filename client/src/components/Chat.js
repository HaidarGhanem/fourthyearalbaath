import React, { useEffect } from 'react'
import "C:/Users/Rani/Desktop/chat-app/myapp/src/components/CH-style.css"
import Message from './Message'
import MessageTable from './MessageTable'
import { BrowserRoute , Route} from 'react-router-dom'
import io from 'socket.io-client'
import { useState } from 'react'

const socket = io.connect("");   //////////////////



function send ( { socket , username , room }){
  const [ currentMessage , setCurrentMessage] = useState("");
  const sendMessage = async() => {
    if(currentMessage !== ""){
      const messageData = { 
        room : room,
        author : username,
        message : currentMessage,
        time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("Send_Message" ,messageData);
    }
  };

  useEffect(()=>{
    socket.on("receive_message",(data)=>{
      console.log(data);
    })
  },[socket]);
}

const Chat  = () => {
  return (
    <div className='Chat'>
      <div className='ChatInfo'>
        <div className="UserInfo">
          <div className='profile'>
          <img className='UserPhoto' src='' alt=' '/>
           <p>User Name</p>
           </div>
           <p>Online</p>
        </div>
        <div className='ChatFeat'>
          <button type='submit' alt='Voice Call'>
          <ion-icon name="call" size="large" ></ion-icon>
          </button>
          <button type='submit' alt='Video Call'>
          <ion-icon name="videocam" size="large"></ion-icon>
          </button>
          <button type='submit' alt='Camera'>
          <ion-icon name="camera" size="large"></ion-icon>
          </button>
        </div>
      </div>
      <div className='Message owner'>
        <MessageTable/>
      </div>
      <div className='Typing'>
        <div  className='Ty'>
          <input type='text' 
                 placeholder='Type' 
                 name='T'
                 onChange={(e)=>{
                  setCurrentMessage(e.target.value);
                 }}/>
          <button type='submit' onClick={sendMessage}>
          <ion-icon name="send" size="large"></ion-icon>
          </button>
        </div>
        <div className='Fea'>
        <button type='submit'>
        <ion-icon name="mic" size="large"></ion-icon>
        </button>
        <button type='submit'>
        <ion-icon name="ellipsis-vertical" size="large"></ion-icon>
        </button>
       </div>
      </div>
    </div>
  )
}

export default Chat
