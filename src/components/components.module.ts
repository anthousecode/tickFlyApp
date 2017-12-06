import { NgModule } from '@angular/core';
import { PostPreviewComponent } from './post-preview/post-preview';
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [PostPreviewComponent],
	imports: [IonicModule],
	exports: [PostPreviewComponent]
})
export class ComponentsModule {}
