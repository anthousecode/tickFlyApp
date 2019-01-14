import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ChatPage} from './chat';
import {ComponentsModule} from "../../components/components.module";
// import {AlertController} from "ionic-angular";

@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ChatPage),
    // AlertController
  ],
})
export class ChatPageModule {
}
