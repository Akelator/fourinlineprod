import { Tablero } from './models/tablero';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, timeInterval, tap } from 'rxjs/operators';
import { Ficha, Fichas } from './models/ficha';
import { JuegoService } from './services/juego.service';
import { Juego, Jugador } from './models/juego';
import { SocketsService } from './services/sockets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  jugador_$: Observable<Jugador>;
  juego_$: Observable<Juego>
  tablero_$: Observable<Tablero>;
  fichas_$: Observable<Fichas>

  constructor(
    public juego: JuegoService,
    public ws: SocketsService,
  ) {
    this.jugador_$ = this.juego.jugador_$;
    this.juego_$ = this.juego.juego_$;
    this.tablero_$ = this.juego.tablero_$;
    this.fichas_$ = this.juego.fichas_$;
  }
  
  jugar() {
    this.juego.restart();
  }

  newUser(username) {
    this.ws.newPlayer(username);
  }
}
