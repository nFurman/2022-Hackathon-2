const { Socket } = require("engine.io");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const bodyParser = require("body-parser");
const { Console } = require("console");
const { sign } = require("crypto");

// const db = require("knex")({
//   client: "pg",
//   connection: {
//     host: "localhost",
//     user: "zachary",
//     password: "2048",
//     database: "main_database",
//     port: 5432,
//   },
// });

// app.set("db", db);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

//create account
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/startpage.html");
});

//globalizing login grab from database
var usernames;
var passwords;

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
  // db.select("usernames", "pass")
  //   .from("signin")
  //   .then((signin) => {
  //     usernames = signin[0].usernames;
  //     passwords = signin[0].pass;
  //     console.log(usernames);
  //   });
});

app.post("/", (req, res) => {
  let userSignin = req.body.username;
  let passSignin = req.body.password;
});

app.get("/createAccount", (req, res) => {
  console.log("hi im here");
  res.sendFile(__dirname + "/public/createAccount.html");
});

app.post("/createAccount", (req, res) => {
  let userCreated = req.body.username;
  let passCreated = req.body.password;
});

// function myValidation(user, pass) {
//   if (user ===) {
//     alert("Oops! Validation failed!");
//     returnToPreviousPage();
//     return false;
//   }
//   alert("Validations successful!");
//   return true;
// }

app.get("/homepage", (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
  console.log("on the homepage");
  console.log(usernames);
  console.log(passwords);
});

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

  Socket.on("broadcastMove", (move, castling, datenow, checkmateStatus) => {
    Socket.broadcast.emit(
      "receiveMove",
      move,
      castling,
      datenow,
      checkmateStatus
    );
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
