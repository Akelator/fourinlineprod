import { Color } from './ficha';

export class Juego {
  constructor(
    public id: string,
    public jugadores: Jugadores,
    public ganador: Jugador = new Jugador(),
    public turno: Color = Color.azul,
    public nFicha: number = -1,
    public sCol: number = 3,
    public fin: boolean = false
  ) {}
}
export class Jugadores {
  constructor(public rojo: Jugador, public azul: Jugador) {}
}

export class Jugador {
  constructor(public id?: string, public name?: string) {}
}
