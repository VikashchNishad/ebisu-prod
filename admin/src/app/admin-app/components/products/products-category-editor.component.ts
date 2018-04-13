import {Component, EventEmitter, Output, Input, AfterViewInit, OnInit} from '@angular/core';
import {FormControlMessages} from "../../../shared/components/control-valdation-message.component";
import {ProductsCategoryModel} from "./products.model";
import {ProductsService} from "./products.service";
import{Config} from "../../../shared/configs/general.config";

import{ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
import {FormGroup, FormControl, Validators, FormBuilder,} from "@angular/forms";

@Component({
    selector: 'products-category-editor',
    templateUrl: './products-category-editor.html'
})

export class ProductsCategoryEditorComponent implements OnInit {
    objProductsCat:ProductsCategoryModel = new ProductsCategoryModel();
    isValidImage:boolean = true;
    productsCategoryForm:FormGroup;
    isSubmitted:boolean = false;
    imageDeleted:boolean = false;
    
    @Input() productsCategoryId:string;
    @Output() showListEvent:EventEmitter<any> = new EventEmitter();
    file:File;
    fileName:string = "";
    drawImagePath:string = Config.DefaultImage;

    imageFormControl:FormControl = new FormControl('', Validators.required);
    canvasSize:number = ImageCanvasSizeEnum.small;



    constructor(private _objService:ProductsService, private _formBuilder:FormBuilder) {
        this.productsCategoryForm = this._formBuilder.group({
                "productsCategory": ['', Validators.required],
                "imageFormControl": this.imageFormControl,
                "productsCategoryDescription": ['', Validators.required],
                "active": ['']
            }
        );
    }

 ngAfterViewInit() {
        if (!this.productsCategoryId)
            this.drawImageToCanvas(Config.DefaultImage);
    }
    ngOnInit() {
        if (this.productsCategoryId)
            this.getProductsCategoryDetail();

    }

    getProductsCategoryDetail() {
        this._objService.getProductsCategoryDetail(this.productsCategoryId)
            .subscribe(res =>this.bindDetail(res),
                error => this.errorMessage(error));

    }


    bindDetail(objRes:ProductsCategoryModel) {
        this.objProductsCat = objRes;
        this.imageFormControl.patchValue(objRes.image[0].imageName);
        this.fileName = objRes.image[0].imageName;
        let path:string = "";
        if (this.objProductsCat.image[0]) {
            var cl = Config.Cloudinary;
            path = cl.url(this.objProductsCat.image[0].imageName);
        }
        else
            path = Config.DefaultImage;
        this.drawImageToCanvas(path);
    }



    saveProductsCategory() {
        this.isSubmitted = true;
        
        if (this.productsCategoryForm.valid) {
            if (!this.productsCategoryId) {
                this._objService.saveProductsCategory(this.objProductsCat, this.file)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
            else {
                this._objService.updateProductsCategory(this.objProductsCat, this.file, this.imageDeleted)
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

    /*Image Handler */
    changeFile(args) {
        this.file = args;
        if (this.file)
            this.fileName = this.file.name;
    }
    
    drawImageToCanvas(path:string) {
        this.drawImagePath = path;
    }


}
