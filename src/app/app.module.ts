import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from './../environments/environment';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { FichaComponent } from './components/ficha/ficha.component';
import { GameInfoComponent } from './components/game-info/game-info.component';
import { EndGameFormComponent } from './components/gui/end-game-form/end-game-form.component';
import { GuiComponent } from './components/gui/gui.component';
import { GameListComponent } from './components/gui/new-game-form/game-list/game-list.component';
import { NewGameFormComponent } from './components/gui/new-game-form/new-game-form.component';
import { NewUserFormComponent } from './components/gui/new-user-form/new-user-form.component';
import { WaitingDialogComponent } from './components/gui/waiting-dialog/waiting-dialog.component';
import { TableroComponent } from './components/tablero/tablero.component';
import { HammertimeDirective } from './directives/hammertime.directive';
import { AnimationsService } from './services/animations.service';
import { JuegoService } from './services/juego.service';
import { SocketsService } from './services/sockets.service';

const config: SocketIoConfig = {
  url: environment.server,
  options: { reconnection: true },
};
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
    HammertimeDirective,
    WaitingDialogComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [JuegoService, AnimationsService, SocketsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
