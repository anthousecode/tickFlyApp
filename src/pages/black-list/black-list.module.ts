import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlackListPage } from './black-list';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    BlackListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BlackListPage),
  ],
})
export class BlackListPageModule {}
