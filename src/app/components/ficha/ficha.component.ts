import { Component } from '@angular/core';

@Component({
  selector: 'ficha',
  template: `<div class="ficha"></div>`,
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
    
    ::ng-deep .rojo .ficha {
      background: var(--red);
    }
    
    ::ng-deep .azul .ficha {
      background: var(--blue);
    }
  `]
})
export class FichaComponent { }
