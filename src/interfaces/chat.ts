export enum ISenderType {
  BOT = "bot",
  USER = "user",
}

export interface IChatMessage {
  text: string;
  sender: ISenderType;
}
