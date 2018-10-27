import { Component } from '@angular/core';

@Component({
  selector: 'tablero',
  template: `
    <div class="tablero">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 710px;
      height: 600px;
      background: white;
      margin: auto auto auto auto;
      border-top:1px solid #3a3a3a;
    }
    
    :host .tablero {
      display: block;
      position: relative;
      width: 700px;
      height: 600px;
      margin: 0px 5px 0px 5px;
    }

    ::ng-deep .col {
      display: block;
      position: absolute;
      padding: 5px;
      margin:-5px 0px 0px -5px;
      width: 100px;
      height: 600px;
    }

    ::ng-deep .row {
      display: block;
      position: absolute;
      padding: 5px;
      margin:0px 0px 0px -5px;
      width: 699px;
      height: 90px;
      
    }
    ::ng-deep .even {
      background:#DFEAED;
    }
    ::ng-deep .col:hover{
      // background: #DFEAED;
      cursor: pointer;
    }
  
    ::ng-deep .col.rojo.highlight{
      border-top: 4px solid #F0A322;
    }

    ::ng-deep .col.azul.highlight{
      border-top: 4px solid #1b709f;
    }
  `]
})
export class TableroComponent { }
