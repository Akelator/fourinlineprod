import { Tablero } from './models/tablero';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Fichas } from './models/ficha';
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
  jugadores_$: Observable<Jugador[]>;
  juegos_$: Observable<Juego[]>;
  juego_$: Observable<Juego>
  tablero_$: Observable<Tablero>;
  fichas_$: Observable<Fichas>;
  mierda_$: Observable<boolean>;
  

  constructor(
    public juego: JuegoService,
    public ws: SocketsService,
  ) {
    this.jugador_$ = this.juego.jugador_$;
    this.jugadores_$ = this.juego.jugadores_$;
    this.juegos_$ = this.juego.juegos_$;
    this.juego_$ = this.juego.juego_$;
    this.tablero_$ = this.juego.tablero_$;
    this.fichas_$ = this.juego.fichas_$;
    this.mierda_$ = this.juego.mierda_$;
  }
  
  restart() {
    this.juego.restart();
  }

  newUser(username) {
    this.ws.newPlayer(username);
  }

  newGame(){
    this.ws.newGame();
  }

  joinGame(id){
    this.ws.joinGame(id);
  }
}
