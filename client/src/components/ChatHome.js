import React from 'react'
import SideBar from './SideBar'
import Chat from './Chat'
import "C:/Users/Rani/Desktop/chat-app/myapp/src/components/CH-style.css"
import HorizNavBar from './HorizNavBar'
import Right_Bar from './Right_Bar'


const ChatHome = () => {
  return (
    <div className="Home">
        <div className="Container">
        <HorizNavBar/>
            <div className='InsideContainer'>
            <SideBar/>
            <Chat/>
            <Right_Bar/>
            </div>
        </div>
    </div>
  )
}

export default ChatHome
