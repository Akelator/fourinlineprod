var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var games = [];
var players = [];

app.use(express.static('./public'));

io.on('connection', function (socket) {
  socket.on('new-player', function (username) {
    console.log('TRY TO ADD PLAYER');
    var id = this.id;
    if (!players.find(p => p.id === id || p.name === username)) {
      var newPlayer = {
        id: this.id,
        name: username
      }
      socket.emit('new-player', newPlayer);
      players.push(newPlayer);
      io.sockets.emit('players', players);
      io.sockets.emit('games', games);
      console.log("- PLAYER ADDED");
    } else {
      console.log("- ALREDY EXISTS");
    }
  });

  socket.on('new-game', function (playerId) {
    var player = players.find(p => p.id === playerId);
    var newGame = {
      id: playerId,
      jugadores: {
        rojo: player,
        azul: null,
      }
    };
    socket.emit('game', newGame);
    games.push(newGame);
    io.sockets.emit('games', games);
  });

  socket.on('join-game', function (data) {
    var player = players.find(p => p.id === data.playerId);
    var game = games.find(g => g.id === data.gameId);
    game.jugadores.azul = player;
    io.sockets.connected[data.gameId].emit('game', game);
    socket.emit('game', game);
    io.sockets.emit('games', games);
  });

  socket.on('mover-ficha', function (data) {
    let listenerId = (data.juego.turno === 'rojo') ? data.juego.jugadores.azul.id : data.juego.jugadores.rojo.id;
    io.sockets.connected[listenerId].emit('mover-ficha', data);
  });
  socket.on('tirar-ficha', function (data) {
    let listenerId = (data.juego.turno === 'rojo') ? data.juego.jugadores.azul.id : data.juego.jugadores.rojo.id;
    io.sockets.connected[listenerId].emit('tirar-ficha', data);
  });
  socket.on('disconnect', function () {

    var id = this.id;
    var playerIndex = players.indexOf(players.find(p => p.id === id));
    if (playerIndex >= 0) {
      players.splice(playerIndex, 1);
      io.sockets.emit('players', players);
      console.log("PLAYER " + playerIndex + " REMOVED");
    }

    var gameIndex = games.indexOf(games.find(g => g.id === id));
    if (gameIndex >= 0) {
      if (games[gameIndex].jugadores.azul) {
        games[gameIndex].id = games[gameIndex].jugadores.azul.id;
        games[gameIndex].jugadores.rojo = games[gameIndex].jugadores.azul;
        games[gameIndex].jugadores.azul = null;
        io.sockets.connected[games[gameIndex].id].emit('game', games[gameIndex]);
        io.sockets.emit('games', games);
        console.log("GAME " + gameIndex + " SWAP BLUE TO RED");
      } else {
        games.splice(gameIndex, 1);
        io.sockets.emit('games', games);
        console.log("GAME " + gameIndex + " REMOVED");
      }
    } else {
      gameIndex = games.indexOf(games.find(g => {
        return g.jugadores.azul ? g.jugadores.azul.id === id : null;
      }));
      if (gameIndex >= 0) {
        games[gameIndex].jugadores.azul = null;
        io.sockets.connected[games[gameIndex].id].emit('game', games[gameIndex]);
        io.sockets.emit('games', games);
        console.log("GAME " + gameIndex + " LEAVE BLUE FREE");
      }
    }
  });


});

server.listen(process.env.PORT, function () {
  console.log('SERVER RUNNING ON ' + process.env.PORT);
});