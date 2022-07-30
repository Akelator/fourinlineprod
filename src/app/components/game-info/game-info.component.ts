import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
})
export class GameInfoComponent {
  @Input() game: any;
  @Input() player: any;
}
