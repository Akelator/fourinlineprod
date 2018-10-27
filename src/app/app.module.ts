import { AnimationsService } from './services/animations.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FichaComponent } from './components/ficha/ficha.component';
import { TableroComponent } from './components/tablero/tablero.component';
import { JuegoService } from './services/juego.service';
import { GuiComponent } from './components/gui/gui.component';


@NgModule({
  declarations: [
    AppComponent,
    FichaComponent,
    TableroComponent,
    GuiComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [JuegoService, AnimationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
