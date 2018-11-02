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
import { NewUserFormComponent } from './components/gui/new-user-form/new-user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewGameFormComponent } from './components/gui/new-game-form/new-game-form.component';
import { GameListComponent } from './components/gui/new-game-form/game-list/game-list.component';
import { EndGameFormComponent } from './components/gui/end-game-form/end-game-form.component';
import { GameInfoComponent } from './components/game-info/game-info.component';

const config: SocketIoConfig = { url: 'ws://localhost:8080', options: {'forceNew': true}};

@NgModule({
  declarations: [
    AppComponent,
    FichaComponent,
    TableroComponent,
    GuiComponent,
    NewUserFormComponent,
    NewGameFormComponent,
    GameListComponent,
    EndGameFormComponent,
    GameInfoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [JuegoService, AnimationsService, SocketsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
