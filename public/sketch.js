let letters = [];

// Create a new connection using socket.io (imported in index.html)
// make sure you added the following line to index.html:
// <script src="/socket.io/socket.io.js"></script>
let clientSocket = io();

// define the function that will be called on a new newConnection
clientSocket.on("connect", newConnection);

// callback function for "connect" messages
function newConnection() {
  console.log("your id:", clientSocket.id);
}

// Define which function should be called when a new message
// comes from the server with type "mouseBroadcast"
clientSocket.on("newLetter", addLetter);

// Callback function called when a new message comes from the server
// Data parameters will contain the received data
function addLetter(dataReceived) {
  letters.push(dataReceived);
}

// define a list of color couples,
// one for the foreground, one for the background
colors = [
  ["white", "#52444c"],
  ["#3b2c1f", "#cec0b3"],
  ["#4a442a", "#efc768"],
  ["#e7e2d8", "#565986"],
  ["#d7473f", "#efece6"],
  ["#305c9c", "#f3b11b"],
];

// list of web-safe font faces
fontFaces = [
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
];

// when a key is typed, define its properties and send to the server
function keyTyped() {
  let rotation = random(-5, 5);
  let color = random(colors);
  if (key == " ") {
    color = ["#dcdcdc", "#dcdcdc"];
  }
  let letterHeight = random(30, 50);
  let letterWidth = random(20, 30);

  // create the message and send it to the server
  let message = {
    id: clientSocket.id,
    key: key,
    rotation: rotation,
    bg: color[1],
    fg: color[0],
    w: letterWidth,
    h: letterHeight,
    fontSize: letterWidth * random(0.7, 0.9),
    fontFace: random(fontFaces),
  };

  // send the object to server,
  // tag it as "mouse" event
  clientSocket.emit("letter", message);
}

// create the artboard
function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#dcdcdc");
  angleMode(DEGREES);
}

// draw the letters
function draw() {
  // set up two variables as cursors for drawing the letters
  let xcur = 15;
  let ycur = 30;

  textAlign(CENTER, CENTER);
  textSize(50);
  noStroke();
  fill(200);
  text("[press any key]", width / 2, height / 2);

  // drew ehac letter in the 'letters' array,
  // received from the server
  letters.forEach((letter) => {
    push();
    translate(xcur, ycur);
    rotate(letter.rotation);
    rectMode(CENTER);
    noStroke();
    fill(letter.bg);
    rect(0, 0, letter.w, letter.h);

    fill(letter.fg);

    textSize(letter.fontSize);
    textFont(letter.fontFace);
    text(letter.key, 0, 0);
    pop();

    // update cursors variables
    xcur += letter.w;
    if (xcur > width) {
      xcur = 15;
      ycur += 50;
    }
  });
}
