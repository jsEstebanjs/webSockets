import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

function App() {
  const ref = useRef();
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);

  useEffect(() => {
    ref.current = io("http://localhost:8080");

    ref.current.on("message", (data) => {
      console.log("WELCOME:", data.message);
    });

    ref.current.on("broadcast", (data) => {
      setAllMessage((prev) => [...prev, data]);
    });

    return () => {
      ref.current.close();
      ref.current.removeAllListeners();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(message.length > 0){
      ref.current.emit("message", { name, val: message });
      setMessage("");
    }

  };

  return (
    <div className="App">
      {isVisible ? (
        <>
          <div className="opacity"></div>
          <div className="main-container-modal-name-user">
            <label htmlFor="name-user">Your Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              placeholder="type your name"
              type="text"
              id="name-user"
              className="input-modal-name-user"
            />
            <button
              onClick={() => {
                if (name.length >= 3) {
                  setIsVisible(false);
                }
              }}
              type="button"
              className="btn-modal-name-user"
            >
              Guardar
            </button>
          </div>
        </>
      ) : null}
      <div className="main-container-live-chat">
        <div className="container-live-chat-view">
          {allMessage.map((item) => (
            <p key={item.val}>
              {item.name}: {item.val}
            </p>
          ))}
        </div>
        <form
          className="container-live-chat-input"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="live-chat-input"
            type="text"
            placeholder="message"
          />
          <button className="live-chat-btn" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
