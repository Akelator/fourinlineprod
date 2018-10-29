import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent {

  @Output() onJoin = new EventEmitter<string>();
  private form: FormGroup;

  public get username(){
    return this.form.get('username');
  }

  constructor(private fb: FormBuilder,){
    this.form = this.fb.group({
      username: [null, Validators.required],
    })
  }

  join(){
    this.onJoin.emit(this.username.value);
  }

}
