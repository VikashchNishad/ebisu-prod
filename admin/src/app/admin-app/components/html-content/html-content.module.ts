import {NgModule}      from '@angular/core';
import {HtmlContentService} from "./html-content.service";
import {HtmlContentComponent} from"./html-content-list.component";
import {HtmlContentEditorComponent} from"./html-content-editor.component";
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
    imports: [SharedModule],
    declarations: [HtmlContentEditorComponent, HtmlContentComponent],
    providers: [HtmlContentService]
})

export class HtmlContentModule {
}