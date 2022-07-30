export interface ChatMsg {
  msg: string;
  owner: boolean;
  playerName: string;
}

export interface ChatEvent {
  addresseeId: string;
  msg: string;
}
