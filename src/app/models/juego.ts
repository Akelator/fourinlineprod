import { Color } from './ficha';



export class Juego {
    constructor(
        public turno: Color = Color.azul,
        public nFicha: number = -1,
        public sCol: number = 3,
        public fin: boolean = false,
        public jugadores: Jugadores = new Jugadores(),
        public ganador: Jugador = new Jugador(),
    ) { }
}
export class Jugadores {
    constructor(
        public rojo: Jugador = new Jugador(1, 'Adrian'),
        public azul: Jugador = new Jugador(2, 'Miguel'),
    ) { }
}

export class Jugador {
    constructor(
        public id: number = 0,
        public name: string = '',
    ) { }
}