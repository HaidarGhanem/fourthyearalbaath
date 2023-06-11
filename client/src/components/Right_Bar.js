import React, { Component } from 'react'
import 'C:/Users/Rani/Desktop/chat-app/myapp/src/components/R-Bar-style.css'
import { useEffect } from 'react'

const Right_Bar = () => {
  return (
    <div className='R-Bar'>
      <div className='MenuInfo'>
        menu info
      </div>
      <div className="Menu">
          <ul>
            <li class="List active">
              <a href='#'>
                <span className='icon'>
                  <ion-icon name="home-outline"></ion-icon>
                </span>
                <span className='text'>Home</span>
              </a>
              </li>
              <li class="List">
              <a href='#'>
                <span className='icon'>
                <ion-icon name="person-outline"></ion-icon>
                </span>
                <span className='text'>Profile</span>
              </a>
              </li>
              <li class="List">
              <a href='#'>
                <span className='icon'>
                <ion-icon name="settings-outline"></ion-icon>
                </span>
                <span className='text'>Settings</span>
              </a>
              </li>
              <li class="List">
              <a href='#'>
                <span className='icon'>
                <ion-icon name="star-half-outline"></ion-icon>
                </span>
                <span className='text'>Rate us</span>
              </a>
              </li>
              <div class="indicator"></div>
          </ul>
      </div>
    </div>
  )
}

export default Right_Bar
