import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Ficha, Pos } from '../models/ficha';
import { Columna, Casilla } from '../models/tablero';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';

@Injectable()
export class AnimationsService {
  private intervaloMover: any;

  mover(f: Ficha, col: Columna, d: number): void {
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
        if (t < 1) f.pos = this.updatePosition1(c, t, from);
        else f.pos = this.updatePosition2(c, t, from);
      }
    }, 1);
  }

  tirar(f: Ficha, cas: Casilla, d: number): Observable<boolean> {
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

  private updatePosition1(c: Pos, t: number, from: Pos): Pos {
    const x = (c.x / 2) * t * t * t + from.x;
    const y = (c.y / 2) * t * t * t + from.y;
    return new Pos(x, y);
  }

  private updatePosition2(c: Pos, t: number, from: Pos): Pos {
    t -= 2;
    const x = (c.x / 2) * (t * t * t + 2) + from.x;
    const y = (c.y / 2) * (t * t * t + 2) + from.y;
    return new Pos(x, y);
  }
}
