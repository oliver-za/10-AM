import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import queryString from 'query-string';

import './Main.css';


const ENDPOINT = '/'; 
let socket;
 
const Main = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
 
  const messageArea = useRef()
  const inputArea = useRef()   
 
  useEffect(() => { 
    const { name, room } = queryString.parse(location.search);
 
    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    }); 
  }, [location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
      messageArea.current.scrollTop = messageArea.current.scrollHeight;
    });

    inputArea.current.focus()
    
}, []); 

  const onChangeHandler = (event) => {
    setMessage(event.target.value)
  }

  const onKeyPressHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      if(message) {
        socket.emit('sendMessage', message, () => setMessage(''));
      }
    }
  }
 

  return (
    <div className="Main__Container">
      <section className="Main__Section">
        <div className="Main__Brand"> 
         <h1>Room: #{room}</h1>
        </div>
      <div ref={messageArea} className="Main__MessageArea">
          {
            messages.map((msg, i) =>
            name.trim().toLowerCase() === msg.user ?
            (<div className="Main__Sent" key={i}>
              <h4>{name}</h4> 
              <p>{msg.text}</p> 
            </div>)    
           : msg.user.trim().toLowerCase() === 'automoderator' ?

            (<div className="Main__Automoderator" key={i}>
              <p>{msg.text}</p> 
            </div>) :
            (<div className="Main__Received" key={i}>
              <h4>{msg.user.charAt(0).toUpperCase() + msg.user.slice(1)}</h4> 
              <p>{msg.text}</p>   
            </div>)
            )
          }   
      </div> 
      <div> 
            <textarea id="textarea" cols="30" rows="1" placeholder="Type something..." ref={inputArea}    value={message}
      onChange={onChangeHandler}
      onKeyPress={onKeyPressHandler}></textarea>
      </div>  
      </section>
    </div>
  );
}

export default Main;
