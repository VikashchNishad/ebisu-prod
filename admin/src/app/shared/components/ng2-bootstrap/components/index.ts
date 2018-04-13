import {NgModule} from '@angular/core';


import {DropdownModule} from './dropdown/dropdown.module';
import {ComponentsHelper} from './utils/components-helper.service';
import {TypeaheadModule} from "./typeahead/typeahead.module";

@NgModule({
    exports: [
        DropdownModule,
        TypeaheadModule
    ],
    providers: [
        {provide: ComponentsHelper, useClass: ComponentsHelper}
    ]
})
export class Ng2BootstrapModule {
}
