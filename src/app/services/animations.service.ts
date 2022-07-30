import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Ficha, Pos } from '../models/ficha';
import { Columna, Casilla } from '../models/tablero';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';

@Injectable()
export class AnimationsService {
  private intervaloMover: any;

  public mover(f: Ficha, col: Columna, d: number) {
    //d = 1;
    clearInterval(this.intervaloMover);
    const from = new Pos(f.pos.x, f.pos.y);
    const to = new Pos(col.x, f.pos.y);
    const c = new Pos(to.x - from.x, to.y - from.y);
    const t0 = this.current();
    let t;
    this.intervaloMover = setInterval(() => {
      t = this.current() - t0;
      if (t >= d) {
        clearInterval(this.intervaloMover);
        f.pos = to;
      } else {
        t /= d / 2;
        if (t < 1) {
          let x = (c.x / 2) * t * t * t + from.x;
          let y = (c.y / 2) * t * t * t + from.y;
          f.pos = new Pos(x, y);
        } else {
          t -= 2;
          let x = (c.x / 2) * (t * t * t + 2) + from.x;
          let y = (c.y / 2) * (t * t * t + 2) + from.y;
          f.pos = new Pos(x, y);
        }
      }
    }, 1);
  }

  public tirar(f: Ficha, cas: Casilla, d: number): Observable<any> {
    //d = 2;
    const from = new Pos(cas.pos.x, f.pos.y);
    const to = new Pos(cas.pos.x, cas.pos.y);
    const move = new Pos(to.x - from.x, to.y - from.y);
    const t0 = this.current();
    return interval().pipe(
      map(() => {
        const tc = this.current() - t0;
        const t = tc / d;
        const x = move.x * t * t * t + from.x;
        const y = move.y * t * t * t + from.y;
        f.pos = tc < d ? new Pos(x, y) : to;
        return tc >= d;
      })
    );
  }

  private current(): number {
    return new Date().getTime() / 1000;
  }
}
