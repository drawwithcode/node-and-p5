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
  //
  socket.on('mouseBroadcast', newDrawing)
}

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

	var data = {
		x: mouseX,
		y: mouseY
	}

	socket.emit('mouse', data)

	ellipse(mouseX, mouseY, 20)
}

function draw() {
  // put drawing code here
  background(0,5);
}
