var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var games = [];
var players = [];
//app.use(express.static('dist'));

// app.get('/', function(re1, res) {
//     res.status(200).send('hola mundo puto');
// });

io.on('connection', function(socket) {
    console.log('user connected');

    socket.emit('connection', 'conection done');
    socket.on('new-message', function(data){
        console.log("nuevo mensaje");
        messages.push(data);
        io.sockets.emit('messages', messages);
    });
    socket.on('join-game', function(data){
        players.push(newPlayer(data));
        games.push(newGame(data));
        io.sockets.emit('players', players);
        io.sockets.emit('games', games);
    });
});

server.listen(8080, function() {
    console.log('Servidor corriendo eh http://localhost:8080');
});

function newPlayer(player){
    return {
        id: player.id,
        name: player.name,
    }
}
function newGame(data){
    return {
        id: games.length,
        player1: data.playerId

    }
}