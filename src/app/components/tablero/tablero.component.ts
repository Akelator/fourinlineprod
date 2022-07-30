import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss'],
})
export class TableroComponent implements OnInit {
  public isTouchDevice: boolean = false;

  constructor(
    private changes: ChangeDetectorRef,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isTouchDevice =
      this.deviceService.isMobile() || this.deviceService.isTablet();
    this.changes.detectChanges();
  }
}
