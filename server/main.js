var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var messages = [{
    id: 1,
    text: 'User Connected',
    author: 'Four In Line'
}];

//app.use(express.static('public'));

app.get('/', function(re1, res) {
    res.status(200).send('hola mundo puto');
});

io.on('connection', function(socket) {
    console.log('user connected');
    socket.emit('messages', messages);
    socket.on('new-message', function(data){
        console.log("nuevo mensaje");
        messages.push(data);
        io.sockets.emit('messages', messages);
    });
});

server.listen(8080, function() {
    console.log('Servidor corriendo eh http://localhost:8080');
})