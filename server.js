const { Socket } = require("engine.io");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const bodyParser = require("body-parser");
const { Console } = require("console");
const { sign } = require("crypto");
const e = require("express");

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

app.post("/login", (req, res) => {
  let userSignin = req.body.username;
  let passSignin = req.body.password;
});

app.get("/createAccount", (req, res) => {
  res.sendFile(__dirname + "/public/createAccount.html");
});

//Globalizing All Usernames and All passwords

var allUsernames = [];
var allPasswords = [];

app.post("/createAccount", (req, res) => {
  let userCreated = req.body.username;
  let passCreated = req.body.password;
  db.select("usernames", "pass")
    .from("signin")
    .then((signin) => {
      for (let index = 0; index < signin.length; index++) {
        allUsernames.push(signin[index].usernames);
        allPasswords.push(signin[index].pass);
      }
      //checks if username is taken, if it is then dont do anything
      if (allUsernames.indexOf(userCreated) === -1) {
        console.log("User Allowed");
        db("signin")
          .insert(
            {
              usernames: userCreated,
              pass: passCreated,
            },
            ["usernames", "pass"]
          )
          .then((signin) => console.log("Username Added to DB"));
      } else {
        console.log("Username taken");
        e.preventDefault();
      }
    });
});

app.get("/homepage", (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
});

io.on("connection", (Socket) => {
  console.log("User connected:" + Socket.id);

  Socket.broadcast.emit("userConnected");

  Socket.on("message", (data) => {
    Socket.broadcast.emit("message", data);
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


server.listen(3000, () => {
  console.log("listening on 3000");
});
