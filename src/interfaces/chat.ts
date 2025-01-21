export enum ISenderType {
  BOT = "bot",
  USER = "user",
}

export interface IChatMessage {
  id: string;
  text: string;
  sender: ISenderType;
  timestamp: Date;
}
