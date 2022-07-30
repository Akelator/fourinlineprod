import { JuegoService } from './../../services/juego.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { ChatMsg } from './../../models/chat';
import { ChatService } from './../../services/chat.service';
import { SocketsService } from './../../services/sockets.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() display = false;
  @Output() close = new EventEmitter<void>();
  currentMsg: string = '';
  chatTitle: string = 'CHAT WITH HOLA';
  playerColor: 'azul' | 'rojo' = 'rojo';

  constructor(
    private chatService: ChatService,
    private juegoService: JuegoService,
    private socketsService: SocketsService
  ) {}

  get chatList(): ChatMsg[] {
    return this.chatService.chat;
  }

  ngOnInit(): void {
    this.chatTitle = `CHAT WITH ${this.chatService.oponentName}`.toUpperCase();
    this.playerColor = this.juegoService.playerColor;
  }

  sendMsg(): void {
    if (!this.currentMsg || !this.currentMsg.length) return;
    this.socketsService.sendMsg(this.currentMsg);
    this.currentMsg = '';
  }

  onClose(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.close.emit();
  }
}
