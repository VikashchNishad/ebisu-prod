import {Component} from '@angular/core';
import{ProductsManagementComponent} from "./products-management.component";
import {FadeInDirective}from '../../../shared/directives/fadeInDirective';

//import {EmailTemplateEditorComponent} from "./email-template-editor.component";
@Component({
    selector: 'products',
    template: '<router-outlet></router-outlet>'
})

export class ProductsComponent {
    constructor() {
    }
}	