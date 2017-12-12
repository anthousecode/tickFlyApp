export class Message {
  id?: number;
  chatId?: number;
  userId?: number;
  createdAt?: string;
  media?: string[];   // not sure if string but dunno
  message?: string;
  message_type?: string;
  read?: boolean;
}

