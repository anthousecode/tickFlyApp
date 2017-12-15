import { NgModule } from '@angular/core';
import { PostPreviewComponent } from './post-preview/post-preview';
import {IonicModule} from "ionic-angular";
import { ChatMessageComponent } from './chat-message/chat-message';
import { HeaderComponent } from './header/header';
@NgModule({
	declarations: [PostPreviewComponent,
    ChatMessageComponent,
    HeaderComponent],
	imports: [IonicModule],
	exports: [PostPreviewComponent,
    ChatMessageComponent,
    HeaderComponent]
})
export class ComponentsModule {}
