import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Juego } from 'src/app/models/juego';

@Component({
  selector: 'new-game-form',
  templateUrl: './new-game-form.component.html',
  styleUrls: ['./new-game-form.component.scss'],
})
export class NewGameFormComponent {
  @Input() juegos: Juego[] | null = [];
  @Output() onNew = new EventEmitter<string | null>();
  @Output() onJoin = new EventEmitter<string>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      game: [null, Validators.required],
    });
  }

  get game() {
    return this.form.get('game');
  }

  newGame(): void {
    this.onNew.emit(null);
  }

  joinGame(id: string): void {
    this.onJoin.emit(id);
  }
}
