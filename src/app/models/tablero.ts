import { Pos, Ficha } from "./ficha";


export class Casilla {
    constructor(
        public pos: Pos,
        public ficha: Ficha = null,
    ) { }
}

export class Columna {
    constructor(
        public x: number,
        public row: Casilla[] = new Array<Casilla>()
    ) { }
}

export class Tablero {
    constructor(
        public col: Columna[] = new Array<Columna>()
    ) { }
}