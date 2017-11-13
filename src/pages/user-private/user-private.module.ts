import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPrivatePage } from './user-private';

@NgModule({
  declarations: [
    UserPrivatePage,
  ],
  imports: [
    IonicPageModule.forChild(UserPrivatePage),
  ],
})
export class UserPrivatePageModule {}
