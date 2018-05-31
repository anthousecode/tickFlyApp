import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CreatePostPage} from './create-post';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CreatePostPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(CreatePostPage),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class CreatePostPageModule {
}
