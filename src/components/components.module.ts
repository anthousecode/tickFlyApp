import {NgModule} from '@angular/core';
import {PostPreviewComponent} from './post-preview/post-preview';
import {IonicModule} from "ionic-angular";
import {ChatMessageComponent} from './chat-message/chat-message';
import {HeaderComponent} from './header/header';
import {MultiImageUpload} from "./multi-image-upload/multi-image-upload";
import {CreatePostFirstStepComponent} from "./create-post-first-step/create-post-first-step";
import {CreatePostSecondStepComponent} from "./create-post-second-step/create-post-second-step";

@NgModule({
  declarations: [PostPreviewComponent,
    ChatMessageComponent,
    HeaderComponent,
    MultiImageUpload,
    CreatePostFirstStepComponent,
    CreatePostSecondStepComponent
  ],
  imports: [IonicModule],
  exports: [PostPreviewComponent,
    ChatMessageComponent,
    HeaderComponent,
    MultiImageUpload]
})
export class ComponentsModule {
}
