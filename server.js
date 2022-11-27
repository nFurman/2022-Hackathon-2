const { Socket } = require("engine.io");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const bodyParser = require("body-parser");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "zachary",
    password: "2048",
    database: "main_database",
    port: 5432,
  },
});

app.set("db", db);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {});

//Globalizing All Usernames and All passwords

var allUsernames = [];
var allPasswords = [];

//started using /start as first route because the / route wont grab db data
//but we need globalized data of the usernames and passwords so we will use
///start to get them and start the page
app.get("/start", (req, res) => {
  res.sendFile(__dirname + "/public/startpage.html");
  db.select("usernames", "pass")
    .from("signin")
    .then((signin) => {
      for (let index = 0; index < signin.length; index++) {
        allUsernames.push(signin[index].usernames);
        allPasswords.push(signin[index].pass);
      }
    });
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
  console.log(allUsernames);
  console.log(allPasswords);
});

app.post("/login", (req, res) => {
  let userSignin = req.body.username;
  let passSignin = req.body.password;

  if (allUsernames.indexOf(userSignin) === -1) {
    console.log("username doesnt exist");
  } else {
    let passwordIndex = allUsernames.indexOf(userSignin);
    let correctPassword = allPasswords[passwordIndex];

    if (passSignin === correctPassword) {
      console.log("Username and password are correct");
      res.redirect("http://localhost:3000/homepage");
    } else {
      console.log(
        "Username is correct, however you have an incorrect password"
      );
    }
  }
});

app.get("/createAccount", (req, res) => {
  res.sendFile(__dirname + "/public/createAccount.html");
});

//create account
app.post("/createAccount", (req, res) => {
  let userCreated = req.body.username;
  let passCreated = req.body.password;
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
    res.redirect("http://localhost:3000/homepage");
  } else {
    console.log("Username taken");
  }
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

  Socket.on("broadcastMove", (moveData) => {
    Socket.broadcast.emit("receiveMove", moveData);
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
