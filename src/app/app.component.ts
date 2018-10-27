import { Tablero } from './models/tablero';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, timeInterval, tap } from 'rxjs/operators';
import { Ficha, Fichas } from './models/ficha';
import { JuegoService } from './services/juego.service';
import { Juego } from './models/juego';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  juego_$: Observable<Juego>
  tablero_$: Observable<Tablero>;
  fichas_$: Observable<Fichas>

  constructor(
    public juego: JuegoService
  ) {
    this.juego_$ = this.juego.juego_$;
    this.tablero_$ = this.juego.tablero_$;
    this.fichas_$ = this.juego.fichas_$;
  }
  
  jugar() {
    this.juego.restart();
  }
}
