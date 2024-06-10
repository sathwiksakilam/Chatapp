const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/Userroutes");
const messageRoute = require("./routes/MessageRoute");
const socket = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// CORS configuration for Express
const corsOptions = {
  origin: "http://localhost:3000", // Make sure this matches your frontend origin
  credentials: true, // Allows cookies to be sent from/to the frontend
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));

const server = app.listen(process.env.PORT, () => {
  console.log(`Server connected on Port ${process.env.PORT}`);
});

// CORS configuration for socket.io
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // Corrected origin value
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
