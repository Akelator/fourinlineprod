import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SocketsService } from './../../../services/sockets.service';

@Component({
  selector: 'new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.scss'],
})
export class NewUserFormComponent {
  @Output() onJoin = new EventEmitter<string>();
  form: FormGroup;

  constructor(private fb: FormBuilder, private socketsService: SocketsService) {
    this.form = this.fb.group({
      username: [null, Validators.required],
    });
  }

  get unavailableName(): boolean {
    return this.socketsService.unavailableName;
  }

  get username() {
    return this.form.get('username');
  }

  join(): void {
    if (this.form.valid) this.onJoin.emit(this.username?.value);
  }
}
