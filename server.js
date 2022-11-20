const { Socket } = require("engine.io");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "sammybammy2004",
    database: "signin/wl",
  },
});

const bodyParser = require("body-parser");
const { Console } = require("console");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

//create account
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/createAccount.html");
});

app.get("/createAccount", (req, res) => {
  res.sendFile(__dirname + "/public/createAccount.html");
});

app.post("/createAccount", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(username);
  console.log(password);
  res.send(`Username: ${username} Password: ${password}`);
});

app.get("/homepage", (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
  console.log("on the homepage");
});

knex
  .insert({ description: username, user_id: 4 })
  .into("username")
  .returning("id");
console.log(username);

knex
  .insert({ description: password, user_id: 4 })
  .into("password")
  .returning("id");
console.log(password);

io.on("connection", (Socket) => {
  console.log("User connected:" + Socket.id);

  Socket.broadcast.emit("userConnected");

  Socket.on("message", (data) => {
    Socket.broadcast.emit("message", data);
    console.log(data);
  });

  Socket.on("broadcastStartGame", () => {
    Socket.broadcast.emit("startGame");
  });

  Socket.on("broadcastMove", (move, castling) => {
    Socket.broadcast.emit("receiveMove", move, castling);
    console.log(move);
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
