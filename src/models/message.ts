import {User} from "./user";

export class Message {
  id?: number;
  chatId?: number;
  userId?: number;
  createdAt?: string;
  media?: string[];   // not sure if string but dunno
  message?: {};
  user?: User;
  message_type?: string;
  read?: boolean;
}

