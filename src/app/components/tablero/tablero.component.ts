import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

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
export class TableroComponent implements OnInit {
  public isTouchDevice: boolean = false;
  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private deviceService: DeviceDetectorService
  ) { }
  ngOnInit() {
    this.isTouchDevice = this.deviceService.isMobile() || this.deviceService.isTablet();
    this.adjustTable();
  }

  adjustTable() {
    //if (this.isTouchDevice) {
      const scaleX = (window.outerWidth < 710) ? window.outerWidth / 710 : 1;
      const scaleY = (window.outerHeight < 800) ? window.outerHeight / 800 : 1;
      const scale = (scaleX < scaleY) ? scaleX : scaleY;
      const anchorPoint = (scaleX < scaleY) ? 'top left' : 'top center';
      this.renderer.setStyle(this.element.nativeElement, 'transform-origin', anchorPoint);
      this.renderer.setStyle(this.element.nativeElement, 'transform', 'scale(' + scale + ')');
      this.renderer.setStyle(this.element.nativeElement, 'margin', 'calc(100vh / 8) auto 0px auto');
    //}
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.adjustTable();
  }

}
