require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const db = require("./db");

const app = express();


// MIDDLEWARE
app.use(cors());

app.use(express.json());


// ROUTES
app.use("/api/auth", authRoutes);


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running");
});


// CREATE HTTP SERVER
const server = http.createServer(app);


// SOCKET SERVER
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


// STORE ONLINE USERS
let onlineUsers = [];


// SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log("User connected");



  // JOIN ROOM
  socket.on("joinRoom", ({ username, room }) => {

    socket.join(room);

    // ADD USER
    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
    }

    // SEND ONLINE USERS
    io.to(room).emit(
      "onlineUsers",
      onlineUsers
    );

    // SYSTEM MESSAGE
    io.to(room).emit("message", {
      username: "System",
      message: `${username} joined ${room}`
    });

  });



  // SEND MESSAGE
  socket.on(
    "sendMessage",
    ({ room, username, message }) => {

      // SAVE MESSAGE TO SQLITE
      db.run(
        `
        INSERT INTO messages
        (roomId, username, message)
        VALUES (?, ?, ?)
        `,
        [room, username, message],

        (err) => {

          if (err) {
            console.log(err);
          }

        }
      );

      // SEND TO ALL USERS IN ROOM
      io.to(room).emit("message", {
        username,
        message
      });

    }
  );



  // TYPING INDICATOR
  socket.on(
    "typing",
    ({ username, room }) => {

      socket.to(room).emit(
        "typing",
        `${username} is typing...`
      );

    }
  );



  // DISCONNECT
  socket.on("disconnect", () => {

    console.log("User disconnected");

  });

});



// START SERVER
const PORT = 5000;

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});