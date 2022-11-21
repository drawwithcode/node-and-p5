// Create a new connection using socket.io
let clientSocket = io();

// setup facemesh
let facemesh;
let video;
let myMouth;

// variables for colors
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
// comes from the server with type "faceBroadcast"
clientSocket.on("faceBroadcast", otherFace);

// Callback function called when a new message comes from the server
// Data parameters will contain the received data
function otherFace(dataReceived) {
  // add to the mouths object a new entry, using the received id
  // containing the received data.
  // this allows to store all the incoming mouths and use later in the draw()
  // function
  mouths[dataReceived.id] = dataReceived;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);

  //define the user color
  myColor = random(neonColors);

  // setup facemesh, define the callback function
  // that will be called when the model is ready
  facemesh = ml5.facemesh(video, modelReady);

  // when facemesh find a face, get the data
  // in the 'results' variable
  facemesh.on("predict", (results) => {
    // use the getMouth() function to filter
    // only mouth points

    myMouth = getMouth(results);

    //prepare the message for the server
    let message = {
      id: clientSocket.id,
      color: myColor,
      shape: myMouth,
    };

    //send the message to the server
    clientSocket.emit("face", message);
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background("black");

  noFill();
  stroke(myColor);
  circle(100, 100, 100);

  // if there is data on the mouth, draw it.
  if (myMouth) {
    drawMouth(myMouth);
  }

  // for every mouth stored in the 'mouths' variable
  // draw it
  for (id in mouths) {
    let otherMouth = mouths[id];
    stroke(otherMouth.color);
    drawMouth(otherMouth.shape);
  }
}

// function for drawing a mouth
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
