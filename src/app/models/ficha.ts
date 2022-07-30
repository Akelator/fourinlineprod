export enum Color {
  rojo = 'rojo',
  azul = 'azul',
}

export class Pos {
  constructor(public x: number = 0, public y: number = 0) {}
}
export enum WINMODE {
  first = 0,
  horizontal = 1,
  vertical = 2,
  diagonal1 = 3,
  diagonal2 = 4,
}
export class Ficha {
  constructor(
    public id: number,
    public color: Color,
    public pos: Pos,
    public visible: boolean = false,
    public winner?: boolean,
    public winMode?: WINMODE
  ) {}
}

export class Fichas {
  constructor(
    public rojo: Ficha[] = new Array<Ficha>(),
    public azul: Ficha[] = new Array<Ficha>()
  ) {}
}
