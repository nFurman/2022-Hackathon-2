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
    port: "5432",
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

let user;
let pass;

app.post("/createAccount", (req, res) => {
  user = req.body.username;
  pass = req.body.password;
  console.log(username);
  console.log(password);
  res.send(`Username: ${username} Password: ${password}`);
});

app.get("/homepage", (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
  console.log(user);
  console.log(pass);
});

// knex.insert({ description: user, user_id: 4 }).into("username").returning("id");
// console.log(username);

// knex.insert({ description: pass, user_id: 4 }).into("password").returning("id");
// console.log(password);

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
