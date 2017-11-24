import { NgModule } from '@angular/core';
import { PostPreviewComponent } from './post-preview/post-preview';
import { HeaderComponent } from './header/header';
@NgModule({
	declarations: [PostPreviewComponent,
    HeaderComponent],
	imports: [],
	exports: [PostPreviewComponent,
    HeaderComponent]
})
export class ComponentsModule {}
