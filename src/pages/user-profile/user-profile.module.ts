import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';
import { UserComponent } from "../../components/user/user";

@NgModule({
  declarations: [
    UserProfilePage,
    UserComponent
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
    IonicPageModule.forChild(UserComponent)
  ],
})
export class UserProfilePageModule {}
