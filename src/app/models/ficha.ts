export enum Color {
    rojo = 'rojo',
    azul = 'azul',
}

export class Pos {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) { }

}

export class Ficha {
    constructor(
        public id: number,
        public color: Color,
        public pos: Pos,
        public visible: boolean = false,
    ) { }
}

export class Fichas {
    constructor(
        public rojo: Ficha[] = new Array<Ficha>(),
        public azul: Ficha[] = new Array<Ficha>(),
    ) { }
}