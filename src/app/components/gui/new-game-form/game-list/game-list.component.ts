import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent{

  @Input()juegos;
  @Output()onJoin = new EventEmitter<string>();

  join(gameId){
    this.onJoin.next(gameId);
  }


}
