import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'new-game-form',
  templateUrl: './new-game-form.component.html',
  styleUrls: ['./new-game-form.component.css']
})
export class NewGameFormComponent {

  @Input() juegos;
  @Output() onNew = new EventEmitter<string>();
  @Output() onJoin = new EventEmitter<string>();
  
  private form: FormGroup;

  public get game(){
    return this.form.get('game');
  }

  constructor(private fb: FormBuilder,){
    this.form = this.fb.group({
      game: [null, Validators.required],
    })
  }

  newGame(){
    this.onNew.emit(null);
  } 

  joinGame(id){
    this.onJoin.emit(id);
  }

}
