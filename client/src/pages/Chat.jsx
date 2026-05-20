import { useEffect, useState } from "react";

import { socket } from "../services/socket";

function Chat() {

  // MESSAGE INPUT
  const [message, setMessage] =
    useState("");

  // ALL CHAT MESSAGES
  const [messages, setMessages] =
    useState([]);

  // TYPING TEXT
  const [typing, setTyping] =
    useState("");

  // ONLINE USERS
  const [onlineUsers, setOnlineUsers] =
    useState([]);

  // CURRENT ROOM
  const [room, setRoom] =
    useState("general");


  // USERNAME
  const username =
    localStorage.getItem("username");


  // AVAILABLE ROOMS
  const rooms = [
    "general",
    "tech",
    "random"
  ];



  // SOCKET CONNECTION
  useEffect(() => {

    // JOIN ROOM
    socket.emit("joinRoom", {
      username,
      room
    });


    // RECEIVE MESSAGE
    socket.on("message", (data) => {

      setMessages((prev) => [
        ...prev,
        data
      ]);

    });


    // RECEIVE TYPING
    socket.on("typing", (msg) => {

      setTyping(msg);

      setTimeout(() => {

        setTyping("");

      }, 1000);

    });


    // RECEIVE ONLINE USERS
    socket.on(
      "onlineUsers",
      (users) => {

        setOnlineUsers(users);

      }
    );


    // CLEANUP
    return () => {

      socket.off("message");

      socket.off("typing");

      socket.off("onlineUsers");

    };

  }, [room]);



  // SEND MESSAGE
  const sendMessage = () => {

    if (!message.trim()) return;

    socket.emit("sendMessage", {
      room,
      username,
      message
    });

    setMessage("");

  };



  return (

    <div className="chat-layout">


      {/* SIDEBAR */}
      <div className="sidebar">

        <h2>Rooms</h2>

        {rooms.map((r) => (

          <button
            key={r}
            className={
              room === r
                ? "active-room"
                : ""
            }

            onClick={() => {

              setMessages([]);

              setRoom(r);

            }}
          >
            {r}
          </button>

        ))}


        <h2>Online Users</h2>

        <ul>

          {onlineUsers.map(
            (user, index) => (

              <li key={index}>
                🟢 {user}
              </li>

            )
          )}

        </ul>

      </div>



      {/* CHAT AREA */}
      <div className="chat-container">

        <h1>
          Room: {room}
        </h1>


        {/* MESSAGES */}
        <div className="messages">

          {messages.map(
            (msg, index) => (

              <div
                key={index}
                className="message"
              >

                <strong>
                  {msg.username}
                </strong>

                <p>
                  {msg.message}
                </p>

              </div>

            )
          )}

        </div>


        {/* TYPING */}
        <p className="typing">
          {typing}
        </p>


        {/* INPUT */}
        <div className="input-area">

          <input
            type="text"

            value={message}

            placeholder="Type message..."

            onChange={(e) => {

              setMessage(
                e.target.value
              );

              socket.emit("typing", {
                username,
                room
              });

            }}

            onKeyDown={(e) => {

              if (e.key === "Enter") {
                sendMessage();
              }

            }}
          />


          <button
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );

}

export default Chat;