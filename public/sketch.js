function preload(){
  // put preload code here
}

var socket;

function setup() {
  createCanvas(windowWidth,windowHeight)
  // put setup code here
  createCanvas(400,400);
  background('red');
  // Create a new connection using socket.io (imported in index.html)
  socket = io();
  // Define which function should be called when a new message
  // comes from the server with type "mouseBroadcast"
  socket.on('mouseBroadcast', newDrawing)
}
// Callback function called when a new message comes from the server
// Data parameters will contain the received data
function newDrawing(data){
	console.log('received:', data)
	noStroke();
	fill('yellow');
	ellipse(data.x, data.y, 20);
}

function mouseDragged() {
	console.log('sending: ',mouseX, mouseY);
	noStroke();
	fill(255);

	// create an object containing the mouse position
	var data = {
		x: mouseX,
		y: mouseY
	}
	// send the object to server,
	// tag it as "mouse" event
	socket.emit('mouse', data)

	ellipse(mouseX, mouseY, 20)
}

function draw() {
  // put drawing code here
  background(0,5);
}
