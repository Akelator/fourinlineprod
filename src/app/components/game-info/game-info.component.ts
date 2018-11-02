import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css']
})
export class GameInfoComponent {
  @Input() game;
  @Input() player;
}
