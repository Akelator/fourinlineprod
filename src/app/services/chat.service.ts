import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { ChatMsg } from './../models/chat';
import { JuegoService } from './juego.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _chatList: ChatMsg[] = [];
  closed = true;

  private _notification = new BehaviorSubject<boolean>(false);
  notification$ = this._notification.asObservable();

  private _alert = false;

  get alert(): boolean {
    return this._alert;
  }

  set alert(alert: boolean) {
    this._alert = alert;
  }

  constructor(private juegoService: JuegoService) {}

  get chat(): ChatMsg[] {
    return this._chatList;
  }

  get ownerName(): string {
    const names = this.juegoService.playersNames;
    return names.find((name) => name === this.juegoService.jugador?.name) || '';
  }

  get oponentName(): string {
    const names = this.juegoService.playersNames;
    return names.find((name) => name !== this.juegoService.jugador?.name) || '';
  }

  addMsg(msg: string): void {
    this._chatList.push({ msg, owner: true, playerName: this.ownerName });
  }

  receiveMsg(msg: string): void {
    this._chatList.push({ msg, owner: false, playerName: this.oponentName });
    if (this.closed) this.emitAlert();
  }

  clearChat(): void {
    this._chatList = [];
  }

  private emitAlert(): void {
    this._alert = true;
    this._notification.next(true);
  }
}
