var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var messages = [{
    id: 1,
    text: 'hola soy u mensaje',
    author: 'Adrian Riera'
}];

app.use(express.static('public'));

app.get('/hello', function(re1, res) {
    res.status(200).send('hola mundo puto');
});

io.on('connection', function(socket) {
    console.log('alguien se ha conectado');
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