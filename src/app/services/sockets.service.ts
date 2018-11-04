import { Jugador, Juego, Jugadores } from './../models/juego';
import { JuegoService } from './juego.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketsService implements OnDestroy {
  private games = [];
  private game = null;
  private players = [];
  private player = new Jugador();

  constructor(
    private socket: Socket,
    private juego: JuegoService,
  ) {
    this.connect();
  }

  private connect() {
    this.socket.connect();
    this.socket.on('new-player', player => {
      this.player = new Jugador(player.id, player.name);
      this.juego.iniciarJugador(this.player);
    });

    this.socket.on('game', game => {
      this.juego.borrarJuego();
      let rojo = new Jugador(game.jugadores.rojo.id, game.jugadores.rojo.name);
      let azul = game.jugadores.azul ? new Jugador(game.jugadores.azul.id, game.jugadores.azul.name) : null;
      this.game = new Juego(this.player.id, new Jugadores(rojo, azul));
      this.juego.crearJuego(this.game);
      if (azul){
        this.juego.iniciarJuego();
      }
    });

    this.socket.on('players', players => {
      this.players = players;
      this.juego.actualizarJugadores(this.players);
    });
    this.socket.on('games', games => {
      this.games = [];
      games.forEach(g => {
        this.games.push(new Juego(g.id, new Jugadores(g.jugadores.rojo, g.jugadores.azul)));
      });
      this.juego.actualizarJuegos(this.games);
    });
    this.socket.on('mover-ficha', data => {
      this.juego.moverFicha(data.juego, data.tablero, data.fichas, data.i);
    });
    this.socket.on('tirar-ficha', data => {
      this.juego.tirarFicha(data.juego, data.tablero, data.fichas, data.i);
    });
  }

  newPlayer(username) {
    this.socket.emit('new-player', username);
  }

  newGame(){
    this.socket.emit('new-game', this.player.id)
  }

  joinGame(id){
    this.socket.emit('join-game', {gameId: id, playerId: this.player.id});
  }
  moverFichaTouch(event, j, t, fichas, i){
    
    console.log("TOUCCH");
    console.log(event);
    this.juego.notify();
    if (!this.juego.tirando){
      this.juego.moverFicha(j, t, fichas, i);
      let data = {
        juego: j,
        tablero: t,
        fichas: fichas,
        i: i
      }
      this.socket.emit('mover-ficha', data);
    }
    event.preventDefault();
  }
  moverFicha(j, t, fichas, i){
    // this.juego.notify();
    // if (!this.juego.tirando){
    //   this.juego.moverFicha(j, t, fichas, i);
    //   let data = {
    //     juego: j,
    //     tablero: t,
    //     fichas: fichas,
    //     i: i
    //   }
    //   this.socket.emit('mover-ficha', data);
    // }
  }

  tirarFicha(j, t, fichas, i){
    if (!this.juego.tirando){
      this.juego.tirando = true;
      this.juego.tirarFicha(j, t, fichas, i);
      let data = {
        juego: j,
        tablero: t,
        fichas: fichas,
        i: i
      }
      this.socket.emit('tirar-ficha', data);
    }
  }

  disconnect() {
    this.socket.disconnect();
  }
  ngOnDestroy() {
    this.disconnect();
  }
}
