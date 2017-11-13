import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPublicPage } from './user-public';

@NgModule({
  declarations: [
    UserPublicPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPublicPage),
  ],
})
export class UserPublicPageModule {}
