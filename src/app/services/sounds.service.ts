import { Injectable } from '@angular/core';
import { SOUND } from '../models/sounds';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  constructor() {}

  play(sound: SOUND): void {
    let audio = new Audio();
    audio.src = sound;
    audio.load();
    audio.play();
  }
}
