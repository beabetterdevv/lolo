import './App.css';
import React, { useRef, useState } from 'react';

const URL = ""; //Change me!

function App() {
  const [name, setName] = React.useState("");
  const [joined, setJoined] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [socket, setSocket] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  const connect = () => {
    let skt = new WebSocket(URL);

    setSocket(skt);
    skt.onmessage = function(event) {
      let data = JSON.parse(event.data);
      data["received"] = true;
      if ('name' in data) {
        setMessages(messages => [...messages, data]);
      }

    }
  }

  const handleJoin = (event) => {
    setJoined(true);
    connect();
  }

  const handleName = (event) => {
    setName(event.target.value);
  }

  const handleMessage = (event) => {
    setMessage(event.target.value);
  }

  const handleSend = (data) => {
    let currentMessage = {"name": name, "message": message}
    socket.send(JSON.stringify(currentMessage));
    setMessages(messages => [...messages, currentMessage]);
    setMessage("");
  }


  return (
    <div className="App">
      <section>
        { joined ? <ChatRoom onClick={handleSend} onChange={handleMessage} messages={messages} message={message}/> 
        : <Join onClick={handleJoin} onChange={handleName} /> }
      </section>
        
    </div>
  );
}

const ChatRoom = ({onClick, onChange, messages, message}) => {
  return (
    <>
      <ChatMessages messages={messages} />
      <input
        type="text"
        placeholder="Send a message..."
        onChange={onChange}
        className="text-input-field txt-input"
        value={message}
      />
      <button className="btn" onClick={onClick}>Send Message</button>
    </>
  )
}

const ChatMessages = ({messages}) => {
  return (
    <>
      <div>
        {
          messages.map((m,idx) => (
            <p className={m.received === true ? "received" : "sent"} key={idx} >{m.name}: {m.message}</p>
          ))
        }
      </div>
    </>
  )
}


const Join = ({ onClick, onChange}) => {
  return (
    <>
    <br/>
    <br/>
    <input
        type="text"
        placeholder="Enter your name..."
        onChange={onChange}
        className="text-input-field txt-input"
      />
      <button className="btn" onClick={onClick}>Join Chat Room</button>
    </>
  )
}

export default App;
