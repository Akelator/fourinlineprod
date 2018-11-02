import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "end-game-form",
  templateUrl: "./end-game-form.component.html",
  styleUrls: ["./end-game-form.component.css"]
})
export class EndGameFormComponent {
  @Input() game;
  @Output() onRestart = new EventEmitter<string>();

  restart(){
    this.onRestart.next(this.game.id);
  }
}
