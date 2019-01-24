import { Tablero } from './models/tablero';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Fichas } from './models/ficha';
import { JuegoService } from './services/juego.service';
import { Juego, Jugador } from './models/juego';
import { SocketsService } from './services/sockets.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FacebookService } from './services/facebook.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  fbUser_$: Observable<any>;

  jugador_$: Observable<Jugador>;
  jugadores_$: Observable<Jugador[]>;
  juegos_$: Observable<Juego[]>;
  juego_$: Observable<Juego>
  tablero_$: Observable<Tablero>;
  fichas_$: Observable<Fichas>;
  
  public isTouchDevice: boolean = false;

  constructor(
    private facebook: FacebookService,
    public juego: JuegoService,
    public ws: SocketsService,
    private deviceService: DeviceDetectorService,
  ) {
    this.fbUser_$ = this.facebook.user_$;
    this.jugador_$ = this.juego.jugador_$;
    this.jugadores_$ = this.juego.jugadores_$;
    this.juegos_$ = this.juego.juegos_$;
    this.juego_$ = this.juego.juego_$;
    this.tablero_$ = this.juego.tablero_$;
    this.fichas_$ = this.juego.fichas_$;
  }
  ngOnInit(){
    this.isTouchDevice = this.deviceService.isMobile() || this.deviceService.isTablet();
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
