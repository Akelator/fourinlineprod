import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[hammertime]',
})
export class HammertimeDirective {
  @Output() simpleTap = new EventEmitter();
  @Output() doubleTap = new EventEmitter();
  constructor() {}
  @HostListener('tap', ['$event'])
  onTap(e: any) {
    if (e.tapCount === 1) {
      this.simpleTap.emit(e);
    }
    if (e.tapCount === 2) {
      this.doubleTap.emit(e);
    }
  }
}
