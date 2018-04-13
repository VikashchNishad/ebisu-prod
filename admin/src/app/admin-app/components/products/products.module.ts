import {NgModule}      from '@angular/core';
import {ProductsCategoryEditorComponent} from "./products-category-editor.component";
import {ProductsSubCategoryEditorComponent} from "./products-subcategory-editor.component";

import {ProductsCategoryListComponent} from"./products-category-list.component";
import {ProductsSubCategoryListComponent} from"./products-subcategory-list.component";

import {ProductsEditorComponent} from"./products-editor.component";
import {ProductsListComponent} from"./products-list.component";
import {ProductsImageEditorComponent} from"./products-image-editor.component";
import {ProductsImageListComponent} from"./products-image-list.component";
import {ProductsService} from './products.service'
import {SharedModule} from '../../../shared/shared.module';
import {ProductsManagementComponent} from "./products-management.component";

@NgModule({
    imports: [SharedModule],
    declarations: [ProductsImageListComponent,
        ProductsImageEditorComponent,
        ProductsManagementComponent,
        ProductsListComponent,
        ProductsEditorComponent,
        ProductsCategoryListComponent,
        ProductsSubCategoryListComponent,
        ProductsCategoryEditorComponent,
        ProductsSubCategoryEditorComponent
    ],
    providers: [ProductsService]
})

export class ProductsModule {
}
