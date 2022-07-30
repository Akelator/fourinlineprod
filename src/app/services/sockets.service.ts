import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ChatEvent } from './../models/chat';
import { Juego, Jugador, Jugadores } from './../models/juego';
import { ChatService } from './chat.service';
import { JuegoService } from './juego.service';

@Injectable()
export class SocketsService implements OnDestroy {
  private games = new Array<Juego>();
  private game: Juego | null = null;
  private players = [];
  private player = new Jugador();
  private _unavailableName = false;

  get unavailableName(): boolean {
    return this._unavailableName;
  }

  constructor(
    private socket: Socket,
    private juegoService: JuegoService,
    private chatService: ChatService
  ) {
    this.connect();
  }

  private connect() {
    this.socket.connect();
    this.socket.on('new-player', (player: Jugador) => {
      this.player = new Jugador(player.id, player.name);
      this.juegoService.iniciarJugador(this.player);
      this._unavailableName = false;
    });

    this.socket.on('game', (game: Juego) => {
      this.juegoService.borrarJuego();
      this.chatService.clearChat();
      let rojo = new Jugador(
        game?.jugadores?.rojo?.id,
        game?.jugadores?.rojo?.name
      );
      let azul = game.jugadores.azul
        ? new Jugador(game.jugadores.azul.id, game.jugadores.azul.name)
        : undefined;
      this.game = new Juego(
        this.player.id as string,
        new Jugadores(rojo, azul as Jugador)
      );
      this.juegoService.crearJuego(this.game);
      if (azul) {
        this.juegoService.iniciarJuego();
      }
    });

    this.socket.on('players', (players: any) => {
      this.players = players;
      this.juegoService.actualizarJugadores(this.players);
    });

    this.socket.on('games', (games: Juego[]) => {
      this.games = new Array<Juego>();
      games.forEach((g) => {
        this.games.push(
          new Juego(g.id, new Jugadores(g.jugadores.rojo, g.jugadores.azul))
        );
      });
      this.juegoService.actualizarJuegos(this.games);
    });

    this.socket.on('mover-ficha', (data: any) => {
      this.juegoService.moverFicha(
        data.juego,
        data.tablero,
        data.fichas,
        data.i
      );
    });

    this.socket.on('tirar-ficha', (data: any) => {
      this.juegoService.tirarFicha(
        data.juego,
        data.tablero,
        data.fichas,
        data.i
      );
    });

    this.socket.on('restart-game', (juegoId: string) => {
      if (this.juegoService.juego?.id === juegoId) this.juegoService.restart();
    });

    this.socket.on('name-in-use', () => {
      if (!this.player.id) this._unavailableName = true;
    });

    this.socket.on('chat-event', (msg: string) => {
      this.chatService.receiveMsg(msg);
    });
  }

  newPlayer(username: string) {
    this.socket.emit('new-player', username);
  }

  newGame() {
    this.socket.emit('new-game', this.player.id);
  }

  joinGame(id: string) {
    this.socket.emit('join-game', { gameId: id, playerId: this.player.id });
  }

  moverFicha(j: any, t: any, fichas: any, i: any) {
    if (!this.juegoService.tirando) {
      this.juegoService.moverFicha(j, t, fichas, i);
      let data = {
        juego: j,
        tablero: t,
        fichas: fichas,
        i: i,
      };
      this.socket.emit('mover-ficha', data);
    }
  }

  tirarFicha(j: any, t: any, fichas: any, i: any): void {
    if (!this.juegoService.tirando) {
      this.juegoService.tirando = true;
      const puedeTirar = this.juegoService.tirarFicha(j, t, fichas, i);
      if (puedeTirar) {
        let data = {
          juego: j,
          tablero: t,
          fichas: fichas,
          i: i,
        };
        this.socket.emit('tirar-ficha', data);
      } else {
        this.juegoService.tirando = false;
      }
    }
  }

  restartGame(): void {
    if (this.juegoService.juego)
      this.socket.emit('restart-game', this.juegoService.juego.id);
  }

  cancelWait(): void {
    this.juegoService.removeJuego();
    this.socket.emit('cancel-wait', this.player.id);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  sendMsg(msg: string): void {
    const playersIds = this.juegoService.playersIds;
    const oponentId = playersIds.find((id) => id !== this.player.id);
    const chatEvent: ChatEvent = { msg: msg, addresseeId: oponentId as string };
    this.chatService.addMsg(msg);
    this.socket.emit('chat-msg', chatEvent);
  }
}
