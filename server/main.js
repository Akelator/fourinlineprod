var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var games = [];
var players = [];

//app.use(express.static('dist'));

io.on('connection', function (socket) {
  socket.on('new-player', function (username) {
    console.log('TRY TO ADD PLAYER');
    var id = this.client.id;
    if (!players.find(p => p.id === id || p.name === username)) {
      var newPlayer = {
        id: this.client.id,
        name: username
      }
      socket.emit('new-player', newPlayer);
      players.push(newPlayer);
      io.sockets.emit('games', games);
      io.sockets.emit('players', players);
      console.log("- PLAYER ADDED");
    } else {
      console.log("- ALREDY EXISTS");
    }
  });

  socket.on('disconnect', function () {
      console.log("PLAYER REMOVED");
      var id = this.client.id;
      players.splice((players.indexOf(players.find(p => p.id === id)), 1));
      io.sockets.emit('players', players);
  });
});

server.listen(8080, function () {
  console.log('SERVER RUNNING ON http://localhost:8080');
});