// Create a new connection using socket.io
let clientSocket = io();

// setup handpose
let facemesh;
let video;
let myMouth;
let myColor;
let mouths = {};

//define all the possible colors
let neonColors = [
  "#4deeea",
  "#74ee15",
  "#ffe700",
  "#f000ff",
  "#001eff",
  "#ff00ff",
  "#00ffff",
  "#ffff00",
];

// define the function that will be called on a new newConnection
clientSocket.on("connect", newConnection);

// callback function for "connect" messages
function newConnection() {
  console.log("your id:", clientSocket.id);
}

// Define which function should be called when a new message
// comes from the server with type "mouseBroadcast"
clientSocket.on("faceBroadcast", otherFace);

// Callback function called when a new message comes from the server
// Data parameters will contain the received data
function otherFace(dataReceived) {
  mouths[dataReceived.id] = dataReceived;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);

  //define the user color
  myColor = random(neonColors);
  console.log(myColor);
  //video.size(width, height);

  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", (results) => {
    myMouth = getMouth(results);
    //prepare the message
    let message = {
      id: clientSocket.id,
      color: myColor,
      shape: myMouth,
    };

    //send the message
    clientSocket.emit("face", message);
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  //image(video, 0, 0, width, height);

  background("black");

  noFill();
  stroke(myColor);
  circle(100, 100, 100);

  // if there is data on the mouth, draw it.
  if (myMouth) {
    drawMouth(myMouth);
  }

  for (id in mouths) {
    let otherMouth = mouths[id];
    stroke(otherMouth.color);
    drawMouth(otherMouth.shape);
  }
}

function drawMouth(mouth) {
  mouth.forEach((line) => {
    beginShape();
    line.forEach((point) => {
      vertex(point.x, point.y);
    });
    endShape();
  });
}

// A function to draw ellipses over the detected keypoints
function getMouth(predictions) {
  //scale the webcam image according to window width
  let vscale = width / video.width;
  //create a variable that will collect all the points
  let shapes = [];

  // for each face, get the data
  predictions.forEach((face) => {
    // define the part that we want to extract
    let parts = [
      "lipsLowerInner",
      "lipsLowerOuter",
      "lipsUpperInner",
      "lipsUpperOuter",
    ];

    // for each part, get the points
    parts.forEach((part) => {
      let points = face.annotations[part];

      // create a variable for the shape
      let shape = [];

      points.forEach((point) => {
        // load x and y poisition
        // add to the shape and object
        shape.push({ x: point[0] * vscale, y: point[1] * vscale });
      });

      // add the shape to the shapes array
      shapes.push(shape);
    });

    // return the shapes
  });

  return shapes;
}
