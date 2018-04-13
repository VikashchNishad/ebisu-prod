import {NgModule}      from '@angular/core';
import {StoreService} from "./store.service";
import {StoreEditorComponent} from"./store-editor.component";
import {StoreComponent} from"./store-list.component";

import {SharedModule} from '../../../shared/shared.module';

@NgModule({
    imports: [SharedModule],
    declarations: [StoreComponent, StoreEditorComponent],
    providers: [StoreService]
})

export class StoreModule {
}