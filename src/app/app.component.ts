import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';

import { Fichas } from './models/ficha';
import { Juego, Jugador } from './models/juego';
import { SOUND } from './models/sounds';
import { CELL, Tablero } from './models/tablero';
import { ChatService } from './services/chat.service';
import { JuegoService } from './services/juego.service';
import { SocketsService } from './services/sockets.service';
import { SoundsService } from './services/sounds.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  jugador_$: Observable<Jugador | null>;
  jugadores_$: Observable<Jugador[] | null>;
  juegos_$: Observable<Juego[] | null>;
  tablero_$: Observable<Tablero>;
  fichas_$: Observable<Fichas>;

  isTouchDevice: boolean = false;
  cell: number = CELL;
  cellSize: SafeStyle | undefined;
  displayChat: boolean = false;
  alerts: null[] = [];

  private notificationSub: any;

  constructor(
    public juegoService: JuegoService,
    public ws: SocketsService,
    private deviceService: DeviceDetectorService,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private soundsService: SoundsService
  ) {
    this.jugador_$ = this.juegoService.jugador_$;
    this.jugadores_$ = this.juegoService.jugadores_$;
    this.juegos_$ = this.juegoService.juegos_$;
    this.tablero_$ = this.juegoService.tablero_$;
    this.fichas_$ = this.juegoService.fichas_$;
    this.setCellSize();
    this.updateCellSize();
    this.listenNotifications();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateCellSize(event.target.innerWidth, event.target.innerHeight);
  }

  get juego(): Juego | undefined {
    return this.juegoService.juego;
  }

  get juegoEnCurso(): boolean {
    return (
      !!this.juego && !!this.juego.jugadores.rojo && !!this.juego.jugadores.azul
    );
  }

  get alert(): boolean {
    return this.chatService.alert;
  }

  ngOnInit() {
    this.isTouchDevice =
      this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  restart() {
    this.ws.restartGame();
  }

  newUser(username: any) {
    this.ws.newPlayer(username);
  }

  newGame() {
    this.ws.newGame();
  }

  joinGame(id: string) {
    this.ws.joinGame(id);
  }

  cancelWait(): void {
    this.ws.cancelWait();
  }

  toggleChat(toggle: boolean): void {
    if (toggle) this.removeAlerts();
    this.chatService.closed = !toggle;
    this.displayChat = toggle;
    setTimeout(() => this.updateCellSize(), 300);
  }

  private setCellSize(size: number = CELL): void {
    this.cell = size;
    this.cellSize = this.sanitizer.bypassSecurityTrustStyle(
      `--cell: ${this.cell}px`
    );
  }

  private updateCellSize(
    width: number = window.innerWidth,
    height: number = window.innerHeight
  ): void {
    const fixToWidth = width < height;
    const size = fixToWidth ? width : height;
    if (size >= 1000) {
      if (this.cell < 100) this.setCellSize();
    } else {
      const finalSize =
        fixToWidth && this.displayChat
          ? Math.round((size - 230) / 10)
          : Math.round(size / 10);
      this.setCellSize(finalSize);
    }
  }

  private listenNotifications(): void {
    this.notificationSub = this.chatService.notification$.subscribe(
      (notification) => {
        if (notification) this.showAlert();
      }
    );
  }
  private showAlert(): void {
    this.soundsService.play(SOUND.alert);
    this.alerts.push(null);
  }

  private removeAlerts(): void {
    this.chatService.alert = false;
    this.alerts = [];
  }

  ngOnDestroy(): void {
    if (this.notificationSub) this.notificationSub.unsubscribe();
  }
}
