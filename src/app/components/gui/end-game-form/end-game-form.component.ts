import { JuegoService } from './../../../services/juego.service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Juego } from 'src/app/models/juego';

@Component({
  selector: 'end-game-form',
  templateUrl: './end-game-form.component.html',
  styleUrls: ['./end-game-form.component.scss'],
})
export class EndGameFormComponent implements OnInit {
  @Input() game: Juego | null = null;
  @Output() onRestart = new EventEmitter<string>();

  winner: boolean = false;
  isTie: boolean = false;
  msg: string = '';

  constructor(private juegoService: JuegoService) {}

  ngOnInit(): void {
    this.isTie = !this.game?.ganador.name;
    if (!this.isTie)
      this.winner = this.juegoService.jugador?.name === this.game?.ganador.name;
    this.msg = this.winner ? 'YOU WIN THE GAME' : 'YOU LOST THE GAME';
  }

  restart() {
    this.onRestart.next(this.game?.id as string);
  }
}
