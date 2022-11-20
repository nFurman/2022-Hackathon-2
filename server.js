const { Socket } = require("engine.io");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/createAccount", (req, res) => {
  res.sendFile(__dirname + "/public/createAccount.html");
});

app.post("/createAccount", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  res.send(`Username: ${username} Password: ${password}`);
});

app.get("/homepage", (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
  console.log("on the homepage");
});

let usersConnected = [];
io.on("connection", (Socket) => {
  usersConnected.push(Socket.id);
  console.log("User connected:" + usersConnected);

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
