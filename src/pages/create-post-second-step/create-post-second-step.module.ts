import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatePostSecondStepPage } from './create-post-second-step';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CreatePostSecondStepPage,

  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(CreatePostSecondStepPage),
  ],
})
export class CreatePostSecondStepPageModule {}
