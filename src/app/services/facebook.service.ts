import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class FacebookService {
  
  private _user = new BehaviorSubject<any>(null);
  user_$ = this._user.asObservable();
  
  constructor() {
    this.fbLogin();
  }

  fbLogin(){
      $.getScript('https://connect.facebook.net/es_ES/sdk.js',()=>{
        let FB = window['FB'];
        FB.init({
          appId: '2007635909533836',
          version: 'v2.7' // or v2.1, v2.2, v2.3, ...
        });     
        FB.login(res => {
          console.log(res);
          if (res.status === 'connected'){
            FB.api('/me',{fields: "id,name,picture"}, user => {
              this._user.next(user);
            });
          }
        });
      });
  }

}
