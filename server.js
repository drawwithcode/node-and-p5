console.log("hello world!");

const { Socket } = require("engine.io");
// load express
let express = require("express");

// create an app
let app = express();

let port = process.env.PORT || 3000;

let server = app.listen(port);

console.log("running server on http://localhost:" + port);

app.use(express.static("public"));

let serverSocket = require("socket.io");

let io = serverSocket(server);

io.on("connection", newConnection);

function newConnection(newSocket) {
  console.log("new connection:", newSocket.id);

  newSocket.on("mouse", incomingMouseMessage);

  function incomingMouseMessage(dataReceived) {
    newSocket.broadcast.emit("mouseBroadcast", dataReceived);
  }
}
