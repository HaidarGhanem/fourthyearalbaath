import React from 'react'
import 'C:/Users/Rani/Desktop/chat-app/myapp/src/components/CH-style.css'
const Search = () => {
  return (
      <form className='Search'>
        <input className='Find' type="text" placeholder="Search"/>
        <button type="submit">
          <ion-icon name="search" size="large"></ion-icon>
        </button>
      </form>
  )
}

export default Search
