import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowedPage } from './followed';

@NgModule({
  declarations: [
    FollowedPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowedPage),
  ],
})
export class FollowedPageModule {}
