import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { FacebookService } from '../../../services/facebook.service';

@Component({
  selector: 'new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent {


  @Input() fbUser_$: Observable<any>;
  @Output() onJoin = new EventEmitter<string>();
  public form: FormGroup;
  
  public get username(){
    return this.form.get('username');
  }

  constructor(
    private fb: FormBuilder,
  ){
    this.form = this.fb.group({
      username: [null, Validators.required],
    })
    this.fbUser_$.subscribe(user => {
      this.form.patchValue({username: user.name},{emitEvent: false});
    })
  }

  join(){
    console.log(this.username.value);
    this.onJoin.emit(this.username.value);
  }

}
