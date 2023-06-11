import React from 'react'
import "C:/Users/Rani/Desktop/chat-app/myapp/src/components/CH-style.css"

import Search from './Search'
import MyChat from './MyChat'

const SideBar = () => {
  return (
    <div className="SideBar">
        <div className='Srch'>
        <Search/>
        </div>
        <div>
          <MyChat/>
        </div>
    </div>
  )
}

export default SideBar
