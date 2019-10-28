// load express library
var express = require('express');
// create the app
var app = express();
// define the port where client files will be provided
var port = process.env.PORT || 3000;
// start to listen to that port
var server = app.listen(port);
// provide static access to the files
// in the "public" folder
app.use(express.static('public'));
// load socket library
var socket = require('socket.io');
// create a socket connection
var io = socket(server);
// define which function should be called
// when a new connection is opened from client
io.on('connection', newConnection);
// callback function: the paramenter (in this case socket)
// will contain all the information on the new connection
function newConnection(socket){
	//when a new connection is created, print its id
	console.log('socket:', socket.id);

	//define what to do on different kind of messages
	socket.on('mouse', mouseMessage);

	function mouseMessage(data){
		socket.broadcast.emit('mouseBroadcast', data);
		console.log(data);
	}
}

console.log('node server is running')
