import { Component } from '@angular/core';

@Component({
  selector: 'ficha',
  template: `<div class="ficha" [ngClass]="color"></div>`,
  styles: [`
    :host {
      display: block;
      position: absolute;
      width: 100px;
      height: 100px;
      pointer-events: none;
    }
    
    ::ng-deep .hidden {
      display: none;
    }
    
    :host .ficha {
      display: block;
      position: absolute;
      top: 10px;
      left: 10px;
      width: 80px;
      height: 80px;
      border-radius: 30px;
    }
    
    ::ng-deep .rojo div {
      background: rgb(255, 80, 50);
      background: #F0A322;
    }
    
    ::ng-deep .azul div {
      background: rgb(50, 80, 255);
      background: #1b709f;
    }
  `]
})
export class FichaComponent { }
