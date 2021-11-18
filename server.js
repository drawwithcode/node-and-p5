console.log("hello world!");

const { Socket } = require("engine.io");
// load express
let express = require("express");

// create an app
let app = express();

// define the port where client files will be provided
let port = process.env.PORT || 3000;

// start to listen to that port
let server = app.listen(port);

// print the link in the terminal
console.log("running server on http://localhost:" + port);

// provide static access to the files
// in the "public" folder
app.use(express.static("public"));

// load socket library
let serverSocket = require("socket.io");

// create a socket connection
let io = serverSocket(server);

// define which function should be called
// when a new connection is opened from client
io.on("connection", newConnection);

// callback function: the paramenter (in this case socket)
// will contain all the information on the new connection
function newConnection(newSocket) {
  // log the connection in terminal
  console.log("new connection:", newSocket.id);

  // tell to all the others that a new user connected
  newSocket.on("mouse", incomingMouseMessage);

  // callback function run when the "mouse" message is received
  function incomingMouseMessage(dataReceived) {
    // send it to all the clients
    newSocket.broadcast.emit("mouseBroadcast", dataReceived);
  }
}
