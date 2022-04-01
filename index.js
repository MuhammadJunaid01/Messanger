const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/usersRoute");
const messageRoute = require("./routes/messagesRoute");
const http = require("http");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const { Server } = require("socket.io");
const fileuploader = require("express-fileupload");
const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const server = http.createServer(app);

app.use("/public", express.static("public/userProfilePicture"));
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successfull!"))
  .catch((error) => console.log("mongoose error", error));

// start socket
const io = new Server(server, {
  cors: {
    origins: "http://localhost:3000",
    methods: ["GET", "POST"],

    credentials: true,
  },
});
const users = [];
io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    users.push(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendmessage = users.filter((user) => user.id === data.id);
    if (sendmessage) {
      socket.to(sendmessage).emit("msg-recieve", data.message);
    }
  });
});
//start route
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
app.get("/", (req, res) => {
  res.send("<h1>Messanger Server Running</h1>");
});
server.listen(PORT, () =>
  console.log(`messanger server running on port ${PORT}`)
);
