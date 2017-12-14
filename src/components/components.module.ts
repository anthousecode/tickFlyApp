import { NgModule } from '@angular/core';
import { PostPreviewComponent } from './post-preview/post-preview';
import {IonicModule} from "ionic-angular";
import { ChatMessageComponent } from './chat-message/chat-message';
@NgModule({
	declarations: [PostPreviewComponent,
    ChatMessageComponent],
	imports: [IonicModule],
	exports: [PostPreviewComponent,
    ChatMessageComponent]
})
export class ComponentsModule {}
