var express = require("express");
var app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

var games = [];
var players = [];

app.use(express.static("./public"));

io.on("connection", function (socket) {
  const findGameById = (gameId) => {
    return games.find((game) => game.id === gameId);
  };

  const getGameIndex = (gameId) => {
    return games.indexOf(findGameById(gameId));
  };

  socket.on("new-player", function (name) {
    var id = this.id;
    const exists = players.find((p) => p.id === id || p.name === name);
    if (!exists) {
      var newPlayer = {
        id: this.id,
        name: name,
      };
      socket.emit("new-player", newPlayer);
      players.push(newPlayer);
      io.sockets.emit("players", players);
      io.sockets.emit("games", games);
      console.log("- PLAYER ADDED");
    } else {
      io.sockets.emit("name-in-use");
      console.log("- ALREDY EXISTS");
    }
  });

  socket.on("new-game", function (playerId) {
    var player = players.find((p) => p.id === playerId);
    var newGame = {
      id: playerId,
      jugadores: {
        rojo: player,
        azul: null,
      },
    };
    socket.emit("game", newGame);
    games.push(newGame);
    io.sockets.emit("games", games);
  });

  socket.on("restart-game", function (gameId) {
    io.sockets.emit("restart-game", gameId);
  });

  socket.on("join-game", function (data) {
    var player = players.find((p) => p.id === data.playerId);
    var game = findGameById(data.gameId);
    game.jugadores.azul = player;
    socket.to(data.gameId).emit("game", game);
    socket.emit("game", game);
    io.sockets.emit("games", games);
  });

  socket.on("mover-ficha", function (data) {
    let listenerId =
      data.juego.turno === "rojo"
        ? data.juego.jugadores.azul.id
        : data.juego.jugadores.rojo.id;
    socket.to(listenerId).emit("mover-ficha", data);
  });

  socket.on("tirar-ficha", function (data) {
    let listenerId =
      data.juego.turno === "rojo"
        ? data.juego.jugadores.azul.id
        : data.juego.jugadores.rojo.id;
    socket.to(listenerId).emit("tirar-ficha", data);
  });

  socket.on("cancel-wait", function (gameId) {
    var gameIndex = getGameIndex(gameId);
    games.splice(gameIndex, 1);
    io.sockets.emit("games", games);
  });

  socket.on("chat-msg", function (msgEvent) {
    console.log(msgEvent);
    socket.to(msgEvent.addresseeId).emit("chat-event", msgEvent.msg);
  });

  socket.on("disconnect", function () {
    var id = this.id;
    var playerIndex = players.indexOf(players.find((p) => p.id === id));
    if (playerIndex >= 0) {
      players.splice(playerIndex, 1);
      io.sockets.emit("players", players);
    }

    var gameIndex = getGameIndex(id);
    if (gameIndex >= 0) {
      if (games[gameIndex].jugadores.azul) {
        games[gameIndex].id = games[gameIndex].jugadores.azul.id;
        games[gameIndex].jugadores.rojo = games[gameIndex].jugadores.azul;
        games[gameIndex].jugadores.azul = null;
        socket.to(games[gameIndex].id).emit("game", games[gameIndex]);
        io.sockets.emit("games", games);
      } else {
        games.splice(gameIndex, 1);
        io.sockets.emit("games", games);
      }
    } else {
      gameIndex = games.indexOf(
        games.find((g) => {
          return g.jugadores.azul ? g.jugadores.azul.id === id : null;
        })
      );
      if (gameIndex >= 0) {
        games[gameIndex].jugadores.azul = null;
        socket.to(games[gameIndex].id).emit("game", games[gameIndex]);
        io.sockets.emit("games", games);
      }
    }
  });
});

server.listen(process.env.PORT, function () {
  console.log("SERVER RUNNING ON " + process.env.PORT);
});
