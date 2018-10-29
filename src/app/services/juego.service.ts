import { SocketsService } from './sockets.service';
import { map } from 'rxjs/operators';
import { Juego, Jugador, Jugadores } from './../models/juego';
import { Tablero, Columna, Casilla } from './../models/tablero';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Ficha, Color, Pos, Fichas } from '../models/ficha';
import { AnimationsService } from './animations.service';

@Injectable()
export class JuegoService {
  private _jugadores = new BehaviorSubject<Jugador[]>(null);
  jugadores_$ = this._jugadores.asObservable();
  private _jugador = new BehaviorSubject<Jugador>(null);
  jugador_$ = this._jugador.asObservable();
  private _juegos = new BehaviorSubject<Juego[]>(null);
  juegos_$ = this._juegos.asObservable();
  private _juego = new BehaviorSubject<Juego>(null);
  juego_$ = this._juego.asObservable();
  private _tablero = new BehaviorSubject<Tablero>(new Tablero());
  tablero_$ = this._tablero.asObservable();
  private _fichas = new BehaviorSubject<Fichas>(new Fichas());
  fichas_$ = this._fichas.asObservable();

  private jugadores = this._jugadores.value;
  private jugador = this._jugador.value;
  private juegos = this._juegos.value;
  private juego = this._juego.value;
  private tablero = this._tablero.value;
  private fichas = this._fichas.value;

  constructor(
    private anim: AnimationsService,
  ) {
    this.iniciarTablero(this.tablero);
    //this.startGame();
  }
  public actualizarJugadores(jugadores){
    this.jugadores = jugadores;
    this._jugadores.next(this.jugadores);
  }
  public actualizarJuegos(juegos){
    this.juegos = juegos;
    this._juegos.next(this.juegos);
  }
  public iniciarJugador(jugador: Jugador){
    this.jugador = jugador;
    this._jugador.next(this.jugador);
  }

  public crearJuego(juego){
    this.juego = juego;
    this._juego.next(this.juego);
  }

  public iniciarJuego(){
    this.iniciarFichas(this.fichas);
    this.avanzarFicha(this.juego, this.fichas);
  }

  public borrarJuego(){
    this.tablero = new Tablero();
    this.fichas = new Fichas(),
    this._juego.next(this.juego);
    this._tablero.next(this.tablero);
    this._fichas.next(this.fichas);
    this.iniciarTablero(this.tablero);
  }

  public restart(){
    this.tablero = new Tablero();
    this.fichas = new Fichas(),
    this._juego.next(this.juego);
    this._tablero.next(this.tablero);
    this._fichas.next(this.fichas);
    this.iniciarTablero(this.tablero);
    this.iniciarFichas(this.fichas);
    this.avanzarFicha(this.juego, this.fichas);
  }
  public tirando = false;
  public moverFicha(j: Juego, t: Tablero, fs: Fichas, col: number) {
    this._juego.next(j);
    this._tablero.next(t);
    this._fichas.next(fs);
    if (!j.fin) {
      j.sCol = col;
      this.anim.mover(fs[j.turno][j.nFicha], t.col[col], 0.1);
    }
  }

  public tirarFicha(j: Juego, t: Tablero, fs: Fichas, col: number) {
    this._juego.next(j);
    this._tablero.next(t);
    this._fichas.next(fs);
    j.sCol = col;
    let row = this.getFreeRow(t.col[col]);
    if (row >= 0) {
      this.anim.tirar(fs[j.turno][j.nFicha], t.col[col].row[row], 0.1 + row * 0.04)
        .takeWhile(fin => {
          if (fin) {
            t.col[col].row[row].ficha = fs[j.turno][j.nFicha];
            j.fin = this.hayGanador(j, t, col, row) || !this.avanzarFicha(j, fs);
            this.tirando = false;
          }
          return !fin
        }).subscribe();
    }
  }

  private avanzarFicha(juego: Juego, fichas: Fichas): boolean {
    juego.nFicha = (juego.turno === Color.rojo) ? juego.nFicha : juego.nFicha + 1;
    juego.turno = (juego.turno === Color.rojo) ? Color.azul : Color.rojo;
    if (juego.nFicha > 20) {
      return false;
    }
    else {
      fichas[juego.turno][juego.nFicha].visible = true;
      fichas[juego.turno][juego.nFicha].pos = new Pos(juego.sCol * 100, -110);
      return true;
    }
  }



  private iniciarTablero(tablero: Tablero) {
    for (let c = 0; c < 7; c++) {
      tablero.col.push(new Columna(c * 100));
      for (let r = 0; r < 6; r++) {
        tablero.col[c].row.push(new Casilla(new Pos(c * 100, r * 100)));
      }
    }
  }

  private iniciarFichas(fichas: Fichas) {
    for (let f: number = 1; f < 22; f++) {
      fichas.rojo.push(new Ficha(f, Color.rojo, new Pos(0, -110)));
      fichas.azul.push(new Ficha(f, Color.azul, new Pos(0, -110)));
    }
  }

  private mostrarFicha(j: Juego, fs: Fichas) {
    fs[j.turno][j.nFicha].pos = new Pos(j.sCol * 100, -110);
    fs[j.turno][j.nFicha].visible = true;

  }

  private getFreeRow(col: Columna): number {
    let row = -1
    for (let r = col.row.length - 1; r >= 0; r--) {
      if (!col.row[r].ficha) {
        row = r;
        break;
      }
    }
    return row;
  }

  private hayGanador(j: Juego, t: Tablero, col: number, row: number) {
    let nH = 1; let nV = 1; let nD1 = 1; let nD2 = 1;
    for (let x = col + 1; x <= 6; x++) {
      if (this.match(j, t, x, row)) nH++;
      else break;
    }
    for (let x = col - 1; x >= 0; x--) {
      if (this.match(j, t, x, row)) nH++;
      else break;
    }
    for (let y = row + 1; y <= 5; y++) {
      if (this.match(j, t, col, y)) nV++;
      else break;
    }
    for (let y = row - 1; y >= 0; y--) {
      if (this.match(j, t, col, y)) nV++;
      else break;
    }
    let x = col; let y = row;
    while (x < 6 && y < 5) {
      x++; y++;
      if (this.match(j, t, x, y)) nD1++;
    }
    x = col; y = row;
    while (x > 0 && y > 0) {
      x--; y--;
      if (this.match(j, t, x, y)) nD1++;
    }
    x = col; y = row;
    while (x < 6 && y > 0) {
      x++; y--;
      if (this.match(j, t, x, y)) nD2++;
    }
    x = col; y = row;
    while (x > 0 && y < 5) {
      x--; y++;
      if (this.match(j, t, x, y)) nD2++;
    }
    let hayGanador = nH >= 4 || nV >= 4 || nD1 >= 4 || nD2 >= 4
    if (hayGanador) j.ganador = j.jugadores[j.turno];
    return hayGanador;
  }

  private match(j: Juego, t: Tablero, x: number, y: number) {
    return t.col[x].row[y].ficha && t.col[x].row[y].ficha.color === j.turno;
  }
}
