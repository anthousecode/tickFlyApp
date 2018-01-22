import {Component, Input} from '@angular/core';
import {Message} from "../../models/message";

@Component({
  selector: 'chat-message',
  templateUrl: 'chat-message.html',
})
export class ChatMessageComponent {
  @Input() message: Message;

  constructor() {
  }
}
