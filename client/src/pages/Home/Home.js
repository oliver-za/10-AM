import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
 
import './Home.css';

export default function SignIn() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');  

  const history = useHistory();
  const nameInput = useRef()

  useEffect(() => {
    nameInput.current.focus()
  }, [])

  const validateHandler = (event) => {
    if (!name || !room) {
      event.preventDefault()
    } else { 
      return 
    } 
  } 

  const onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      if (!name || !room) {
        return
      } else {
        history.push(`/main?name=${name}&room=${room}`)
      } 
    }
  }

  return ( 
    <div className="Home__Bg">
    <div className="Home__OuterContainer"> 
      <div className="Home__InnerContainer">
        <h1 className="Home__Heading">10am.</h1>
        <div>  
          <input ref={nameInput} placeholder="Name" className="Home__Input" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Room" className="Home__Input mt-20" type="text" onChange={(event) => setRoom(event.target.value)} onKeyDown={onKeyDownHandler} />
        </div>
        <Link onClick={validateHandler} to={`/main?name=${name}&room=${room}`}>
          <button className={'Home__Button mt-20'} type="submit">Join</button>
        </Link>  
      </div>
    </div>
    </div>
  );
}
