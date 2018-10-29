import { AnimationsService } from './services/animations.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FichaComponent } from './components/ficha/ficha.component';
import { TableroComponent } from './components/tablero/tablero.component';
import { JuegoService } from './services/juego.service';
import { GuiComponent } from './components/gui/gui.component';
import { SocketsService } from './services/sockets.service';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'ws://www.porraeurocopa.com/chat.php', options: {'forceNew': true}};

@NgModule({
  declarations: [
    AppComponent,
    FichaComponent,
    TableroComponent,
    GuiComponent,
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [JuegoService, AnimationsService, SocketsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
