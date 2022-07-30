import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Juego } from 'src/app/models/juego';

@Component({
  selector: 'game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent {
  @Input() juegos: Juego[] = [];
  @Output() onJoin = new EventEmitter<string>();

  join(gameId: string) {
    this.onJoin.next(gameId);
  }
}
