import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-waiting-dialog',
  templateUrl: './waiting-dialog.component.html',
  styleUrls: ['./waiting-dialog.component.scss'],
})
export class WaitingDialogComponent {
  @Output() cancel = new EventEmitter<void>();
  onCancel(): void {
    this.cancel.emit();
  }
}
