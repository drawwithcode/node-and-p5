// Create a new connection using socket.io (imported in index.html)
// make sure you added the following line to index.html:
// <script src="/socket.io/socket.io.js"></script>
let clientSocket = io();

// define the function that will be called on a new newConnection
clientSocket.on("connect", newConnection);

function newConnection() {
  console.log("your id:", clientSocket.id);
}

// Define which function should be called when a new message
// comes from the server with type "mouseBroadcast"
clientSocket.on("mouseBroadcast", otherMouse);

// Callback function called when a new message comes from the server
// Data parameters will contain the received data
function otherMouse(dataReceived) {
  fill("yellow");
  circle(dataReceived.x, dataReceived.y, 20);
}

// when the mouse is moved, draw it and send a message to the server
function mouseMoved() {
  fill("red");
  circle(mouseX, mouseY, 10);

  let message = {
    id: clientSocket.id,
    x: mouseX,
    y: mouseY,
  };

  clientSocket.emit("mouse", message);
}

// create the artboard
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
}

// draw the circle
function draw() {}
