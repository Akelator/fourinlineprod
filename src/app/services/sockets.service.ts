import { Jugador } from './../models/juego';
import { JuegoService } from './juego.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketsService implements OnDestroy {
  private games = [];
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
    this.socket.on('players', players => {
      this.players = players;
      console.log(this.players);
    });
    this.socket.on('games', games => {
      this.games = games;
    });
  }

  newPlayer(username) {
    this.socket.emit('new-player', username);
  }

  disconnect() {
    this.socket.disconnect();
  }
  ngOnDestroy() {
    this.disconnect();
  }
}
