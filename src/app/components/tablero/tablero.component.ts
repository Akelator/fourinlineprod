import { Component, OnInit, ElementRef, Renderer2, HostListener, ChangeDetectorRef } from '@angular/core';
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
      background: var(--white);
      margin: auto auto auto auto;
      border-top:1px solid var(--grey);
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
      margin:-110px 0px 0px 0px;
      padding-top:110px;
      width: 100px;
      height: 600px;
      cursor: pointer;
    }

    ::ng-deep .row {
      display: block;
      position: absolute;
      padding: 5px;
      margin:0px 0px 0px -5px;
      width: 699px;
      height: 90px;
    }

    ::ng-deep .inner-col {
      margin:0px 0px 0px 0px;
      width: 100px;
      height: 600px;
    }

    ::ng-deep .col.rojo.highlight .inner-col{
      margin-top: -4px;
      border-top: 4px solid var(--red);
    }

    ::ng-deep .col.azul.highlight .inner-col{
      margin-top: -4px;
      border-top: 4px solid var(--blue);
    }
  `]
})
export class TableroComponent implements OnInit {
  public isTouchDevice: boolean = false;
  constructor(
    private changes: ChangeDetectorRef,
    private renderer: Renderer2,
    private element: ElementRef,
    private deviceService: DeviceDetectorService
  ) { }
  ngOnInit() {
    this.isTouchDevice = this.deviceService.isMobile() || this.deviceService.isTablet();
    this.adjustTable();
    this.changes.detectChanges();
  }

  adjustTable() {
      const scaleX = (window.outerWidth < 710) ? window.outerWidth / 710 : 1;
      const scaleY = (window.outerHeight < 800) ? window.outerHeight / 800 : 1;
      const scale = (scaleX < scaleY) ? scaleX : scaleY;
      const anchorPoint = (scaleX < scaleY) ? 'top left' : 'top center';
      this.renderer.setStyle(this.element.nativeElement, 'transform-origin', anchorPoint);
      this.renderer.setStyle(this.element.nativeElement, 'transform', 'scale(' + scale + ')');
      this.renderer.setStyle(this.element.nativeElement, 'margin', 'calc(100vh / 8) auto 0px auto');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.adjustTable();
  }
}
