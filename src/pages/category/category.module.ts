import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryPage } from './category';
import {PostPreviewComponent} from "../../components/post-preview/post-preview";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CategoryPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(CategoryPage),
  ],
})
export class CategoryPageModule {}
