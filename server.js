const { Socket } = require("engine.io");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/createAccount", (req, res) => {
  res.sendFile(__dirname + "/public/createAccount.html");
});

app.get("/homepage", (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
  console.log("on the homepage");
});

io.on("connection", (Socket) => {
  console.log("User connected:" + Socket.id);
  //console.log(Socket);

  Socket.on("message", (data) => {
    Socket.broadcast.emit("message", data);
    console.log(data);
  });

  Socket.on("broadcastMove", (move) => {
    Socket.broadcast.emit("receiveMove", move);
    console.log(move);
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
