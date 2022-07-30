import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Color, Ficha, Fichas, Pos, WINMODE } from '../models/ficha';
import { LINE, MOVEMENTS } from './../models/dev';
import { Juego, Jugador } from './../models/juego';
import { Casilla, Columna, Tablero } from './../models/tablero';
import { AnimationsService } from './animations.service';

@Injectable()
export class JuegoService {
  tirando = false;

  private _juego: Juego | undefined;
  private empieza: 'rojo' | 'azul' = 'rojo';

  set juego(juego: Juego | undefined) {
    this._juego = juego;
  }

  get juego(): Juego | undefined {
    return this._juego;
  }

  get playersIds(): string[] {
    if (!this._juego?.jugadores.rojo || !this._juego.jugadores.azul) return [];
    return Object.values(this._juego?.jugadores).map((jugador) => jugador.id);
  }

  get playersNames(): string[] {
    if (!this._juego?.jugadores.rojo || !this._juego.jugadores.azul) return [];
    return Object.values(this._juego?.jugadores).map((jugador) => jugador.name);
  }

  get playerColor(): 'rojo' | 'azul' {
    if (this._juego?.jugadores.rojo.name === this._jugador.value?.name)
      return 'rojo';
    else return 'azul';
  }

  get jugador(): Jugador | null {
    return this._jugador.value;
  }

  private _jugadores = new BehaviorSubject<Jugador[] | null>(null);
  jugadores_$ = this._jugadores.asObservable();
  private _jugador = new BehaviorSubject<Jugador | null>(null);
  jugador_$ = this._jugador.asObservable();
  private _juegos = new BehaviorSubject<Juego[] | null>(null);
  juegos_$ = this._juegos.asObservable();
  private _tablero = new BehaviorSubject<Tablero>(new Tablero());
  tablero_$ = this._tablero.asObservable();
  private _fichas = new BehaviorSubject<Fichas>(new Fichas());
  fichas_$ = this._fichas.asObservable();

  private jugadores = this._jugadores.value;
  private juegos = this._juegos.value;
  private tablero = this._tablero.value;
  private fichas = this._fichas.value;

  constructor(private anim: AnimationsService) {
    this.iniciarTablero(this.tablero);
  }

  actualizarJugadores(jugadores: Jugador[]): void {
    this.jugadores = jugadores;
    this._jugadores.next(this.jugadores);
  }

  actualizarJuegos(juegos: Juego[]): void {
    this.juegos = juegos;
    this._juegos.next(this.juegos);
  }

  iniciarJugador(jugador: Jugador): void {
    this._jugador.next(jugador);
  }

  crearJuego(juego: Juego): void {
    this.juego = juego;
  }

  removeJuego(): void {
    this.juego = undefined;
  }

  iniciarJuego(): void {
    this.iniciarFichas(this.fichas);
    this.avanzarFicha(this.juego as Juego, this.fichas);
  }

  borrarJuego(): void {
    this.tablero = new Tablero();
    this.fichas = new Fichas();
    this._tablero.next(this.tablero);
    this._fichas.next(this.fichas);
    this.iniciarTablero(this.tablero);
  }

  restart(): void {
    this.tablero = new Tablero();
    this.fichas = new Fichas();
    if (this.juego) {
      this.empieza = this.juego.turno === 'rojo' ? 'azul' : 'rojo';
      this.juego.fin = false;
      this.juego.nFicha = -1;
      this.juego.ganador = {};
      this._tablero.next(this.tablero);
      this._fichas.next(this.fichas);
      this.iniciarTablero(this.tablero);
      this.iniciarFichas(this.fichas);
      this.avanzarFicha(this.juego as Juego, this.fichas);
    }
  }

  moverFicha(j: Juego, t: Tablero, fs: Fichas, col: number): void {
    this.juego = j;
    this._tablero.next(t);
    this._fichas.next(fs);
    if (!j.fin) {
      j.sCol = col;
      this.anim.mover(fs[j.turno][j.nFicha], t.col[col], 0.1);
    }
  }

  tirarFicha(j: Juego, t: Tablero, fs: Fichas, col: number): boolean {
    this.juego = j;
    this._tablero.next(t);
    this._fichas.next(fs);
    j.sCol = col;
    let row = this.getFreeRow(t.col[col]);
    const puedeTirar = row >= 0;
    if (puedeTirar) {
      this.anim
        .tirar(fs[j.turno][j.nFicha], t.col[col].row[row], 0.1 + row * 0.04)
        .pipe(
          takeWhile((fin) => {
            if (fin) {
              t.col[col].row[row].ficha = fs[j.turno][j.nFicha];
              j.fin =
                this.hayGanador(j, t, col, row) || !this.avanzarFicha(j, fs);
              this.tirando = false;
            }
            return !fin;
          })
        )
        .subscribe();
    }
    return puedeTirar;
  }

  private avanzarFicha(juego: Juego, fichas: Fichas): boolean {
    juego.nFicha =
      juego.turno === this.empieza ? juego.nFicha : juego.nFicha + 1;
    juego.turno = juego.turno === Color.rojo ? Color.azul : Color.rojo;
    if (juego.nFicha > MOVEMENTS) {
      return false;
    } else {
      fichas[juego.turno][juego.nFicha].visible = true;
      fichas[juego.turno][juego.nFicha].pos = new Pos(juego.sCol, -1.1);
      return true;
    }
  }

  private iniciarTablero(tablero: Tablero) {
    for (let c = 0; c < 7; c++) {
      tablero.col.push(new Columna(c));
      for (let r = 0; r < 6; r++) {
        tablero.col[c].row.push(new Casilla(new Pos(c, r)));
      }
    }
  }

  private iniciarFichas(fichas: Fichas) {
    for (let f: number = 1; f < 22; f++) {
      fichas.rojo.push(new Ficha(f, Color.rojo, new Pos(0, -1.1)));
      fichas.azul.push(new Ficha(f, Color.azul, new Pos(0, -1.1)));
    }
  }

  private getFreeRow(col: Columna): number {
    let row = -1;
    for (let r = col.row.length - 1; r >= 0; r--) {
      if (!col.row[r].ficha) {
        row = r;
        break;
      }
    }
    return row;
  }

  private hayGanador(j: Juego, t: Tablero, col: number, row: number) {
    this.match(j, t, col, row, WINMODE.first);
    let nH = 1;
    let nV = 1;
    let nD1 = 1;
    let nD2 = 1;
    for (let x = col + 1; x <= 6; x++) {
      if (this.match(j, t, x, row, WINMODE.horizontal)) nH++;
      else break;
    }
    for (let x = col - 1; x >= 0; x--) {
      if (this.match(j, t, x, row, WINMODE.horizontal)) nH++;
      else break;
    }
    for (let y = row + 1; y <= 5; y++) {
      if (this.match(j, t, col, y, WINMODE.vertical)) nV++;
      else break;
    }
    for (let y = row - 1; y >= 0; y--) {
      if (this.match(j, t, col, y, WINMODE.vertical)) nV++;
      else break;
    }
    let x = col;
    let y = row;
    while (x < 6 && y < 5) {
      x++;
      y++;
      if (this.match(j, t, x, y, WINMODE.diagonal1)) nD1++;
      else x = 6;
    }
    x = col;
    y = row;
    while (x > 0 && y > 0) {
      x--;
      y--;
      if (this.match(j, t, x, y, WINMODE.diagonal1)) nD1++;
      else x = 0;
    }
    x = col;
    y = row;
    while (x < 6 && y > 0) {
      x++;
      y--;
      if (this.match(j, t, x, y, WINMODE.diagonal2)) nD2++;
      else x = 6;
    }
    x = col;
    y = row;
    while (x > 0 && y < 5) {
      x--;
      y++;
      if (this.match(j, t, x, y, WINMODE.diagonal2)) nD2++;
      else x = 0;
    }
    let hayGanador = nH >= LINE || nV >= LINE || nD1 >= LINE || nD2 >= LINE;
    if (hayGanador) {
      j.ganador = j.jugadores[j.turno];
      this.removeNotWinnerModes(
        {
          nH: nH >= LINE,
          nV: nV >= LINE,
          nD1: nD1 >= LINE,
          nD2: nD2 >= LINE,
        },
        j.turno
      );
    } else this.removeWinnerMovements();
    return hayGanador;
  }

  private removeNotWinnerModes(
    modes: {
      nH: boolean;
      nV: boolean;
      nD1: boolean;
      nD2: boolean;
    },
    turno: 'rojo' | 'azul'
  ) {
    const fichas =
      turno === 'rojo' ? this._fichas.value.rojo : this._fichas.value.azul;
    fichas.forEach((f) => {
      if (f.winner) {
        if (!modes.nH && f.winMode === WINMODE.horizontal) f.winner = false;
        if (!modes.nV && f.winMode === WINMODE.vertical) f.winner = false;
        if (!modes.nD1 && f.winMode === WINMODE.diagonal1) f.winner = false;
        if (!modes.nD2 && f.winMode === WINMODE.diagonal2) f.winner = false;
      }
    });
  }

  private match(
    j: Juego,
    t: Tablero,
    x: number,
    y: number,
    mode: WINMODE
  ): boolean {
    const coincide =
      (t.col[x].row[y].ficha && t.col[x].row[y].ficha?.color === j.turno) ||
      false;
    if (coincide) {
      const id = t.col[x].row[y].ficha?.id as number;
      this.setWinnerMovement(j.turno, id, mode);
    }
    return coincide;
  }

  private setWinnerMovement(
    turno: 'azul' | 'rojo',
    id: number,
    mode: WINMODE
  ): void {
    if (turno === 'rojo') {
      const ficha = this._fichas.value.rojo.find((f) => f.id === id);
      if (ficha) {
        ficha.winner = true;
        ficha.winMode = mode;
      }
    }
    if (turno === 'azul') {
      const ficha = this._fichas.value.azul.find((f) => f.id === id);
      if (ficha) {
        ficha.winner = true;
        ficha.winMode = mode;
      }
    }
  }

  private removeWinnerMovements(): void {
    this._fichas.value.rojo.forEach((f) => (f.winner = false));
    this._fichas.value.azul.forEach((f) => (f.winner = false));
  }
}
