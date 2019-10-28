var express = require('express');

var app = express();

var port = 3000;

var server = app.listen(port);

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

io.on('connection', newConnection);

function newConnection(socket){
	console.log('socket:', socket.id);

	//define what to do on different kind of messages
	socket.on('mouse', mouseMessage);

	function mouseMessage(data){
		socket.broadcast.emit('mouseBroadcast', data);
		console.log(data);
	}
}

console.log('node server is running')
