import {Component, EventEmitter, Output, Input, AfterViewInit, OnInit} from '@angular/core';
import {FormControlMessages} from "../../../shared/components/control-valdation-message.component";
import {ProductsSubcategoryModel, ProductsCategoryModel} from "./products.model";
import {ProductsService} from "./products.service";
import {FormGroup, Validators, FormBuilder,} from "@angular/forms";

@Component({
    selector: 'products-subcategory-editor',
    templateUrl: './products-subcategory-editor.html'
})

export class ProductsSubCategoryEditorComponent implements OnInit {
    objProductsSubCat:ProductsSubcategoryModel = new ProductsSubcategoryModel();
    objCatList:ProductsCategoryModel[];

    isValidImage:boolean = true;
    productsSubCategoryForm:FormGroup;
    id:string = "";
    isSubmitted:boolean = false;
    @Input() productsSubCategoryId:string;
    @Output() showListEvent:EventEmitter<any> = new EventEmitter();


    constructor(private _objService:ProductsService, private _formBuilder:FormBuilder) {
        this.productsSubCategoryForm = this._formBuilder.group({
                "productsSubCategory": ['', Validators.required],
                "selectCategory": ['', Validators.required],
                "productsSubCategoryDescription": ['', Validators.required],
                "active": ['']
            }
        );
    }

    ngOnInit() {
        this.getCategoryList();
        if (this.productsSubCategoryId)
            this.getProductsSubCategoryDetail();
    }
    
    getCategoryList() {
        this._objService.getProductsCategoryList(true)/*active*/
            .subscribe(res=>this.objCatList = res,
                error=>this.errorMessage(error)
            )
    }

    getProductsSubCategoryDetail() {
        this._objService.getProductsSubCategoryDetail(this.productsSubCategoryId)
            .subscribe(objRes =>this.bindList(objRes),
                error => this.errorMessage(error));
    }
    
    bindList(objRes:ProductsSubcategoryModel) {
        this.objProductsSubCat = objRes;
    }

    saveProductsCategory() {
        this.isSubmitted = true;
        if (this.productsSubCategoryForm.valid) {
            if (!this.productsSubCategoryId) {
                this._objService.saveProductsSubCategory(this.objProductsSubCat)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
            else {
                this._objService.updateProductsSubCategory(this.objProductsSubCat)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
        }
    }

    resStatusMessage(res:any) {
        this.showListEvent.emit(false); // * isCanceled = false
      swal("Success !", res.message, "success")

    }

    errorMessage(objResponse:any) {
      swal("Alert !", objResponse.message, "info");

    }

    triggerCancelForm() {
        let isCanceled = true;
        this.showListEvent.emit(isCanceled);
    }


}

