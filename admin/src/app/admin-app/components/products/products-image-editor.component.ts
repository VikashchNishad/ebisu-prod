import {Component, EventEmitter, Output, Input, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import {ProductsImageModel} from "./products.model";
import {ProductsService} from "./products.service";
import {Config} from "../../../shared/configs/general.config";
import {FormGroup, FormControl, Validators, FormBuilder} from "@angular/forms";


@Component({
    selector: 'products-image-editor',
    templateUrl: './products-image-editor.html'
    // styles: [style]
})
export class ProductsImageEditorComponent implements OnInit,AfterViewInit {
    objProductsImage:ProductsImageModel = new ProductsImageModel();
    @Input() productsImageId:string;
    @Input() productsId:string;
    @Output() showImageListEvent:EventEmitter<any> = new EventEmitter();
    productsImageForm:FormGroup;
    isSubmitted:boolean = false;

    /* Image Upload Handle*/
    imageDeleted:boolean = false;
    file:File;
    fileName:string = "";
    drawImagePath:string = Config.DefaultImage;
    imageFormControl:FormControl = new FormControl('', Validators.required);
    /* End Image Upload handle */


    constructor(private _objService:ProductsService, private _formBuilder:FormBuilder) {
        this.productsImageForm = this._formBuilder.group({
            "imageTitle": ['', Validators.required],
            "imageAltText": ['', Validators.required],
            "imageFormControl": this.imageFormControl,
            active: ['']
        });

    }

    ngAfterViewInit() {
        if (!this.productsImageId)
            this.drawImageToCanvas(Config.DefaultImage);
    }

    ngOnInit() {
        if (this.productsImageId)
            this.getProductsImageDetail();
    }

    getProductsImageDetail() {
        this._objService.getProductsImageDetail(this.productsId, this.productsImageId)
            .subscribe(res =>this.bindDetail(res),
                error => this.errorMessage(error));
    }

    bindDetail(objRes:ProductsImageModel) {
        this.objProductsImage = objRes;
        let path:string = "";
        if (this.objProductsImage.imageName) {
            var cl = Config.Cloudinary;
            path = cl.url(this.objProductsImage.imageName);
        }
        else
            path = Config.DefaultImage;
        this.drawImageToCanvas(path);
    }


    saveProductsImage() {
        this.isSubmitted = true;
        if (this.productsImageForm.valid) {
            if (!this.productsImageId) {
                this._objService.saveProductsImage(this.productsId, this.objProductsImage, this.file)
                    .subscribe(res => this.resStatusMessage(res),
                        error => this.errorMessage(error));
            }
            else {
                this._objService.updateProductsImage(this.productsId, this.objProductsImage, this.file, this.imageDeleted)
                    .subscribe(res => this.resStatusMessage(res),
                        error => this.errorMessage(error));
            }

        }
    }

    resStatusMessage(objSave:any) {
        this.showImageListEvent.emit(false); // is Form Canceled
      swal("Success !", objSave.message, "success")

    }

    triggerCancelForm() {
        let isCanceled = true;
        this.showImageListEvent.emit(isCanceled);
    }

    errorMessage(objResponse:any) {
      swal("Alert !", objResponse.message, "info");

    }

    /*Image handler */
    changeFile(args) {
        this.file = args;
        if (this.file)
            this.fileName = this.file.name;
    }

    drawImageToCanvas(path:string) {
        this.drawImagePath = path;
    }

    deleteImage(id:string) {
      swal({
          title: "Are you sure?",
          text: "You will not be able to recover this Image !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        ()=> {
          this._objService.deleteImage(this.objProductsImage.imageName, this.objProductsImage.imageProperties.imageExtension, this.objProductsImage.imageProperties.imagePath)
            .subscribe(res=> {
                this.imageDeleted = true;
                this.objProductsImage.imageName = "";
                this.drawImageToCanvas(Config.DefaultImage);
                swal("Deleted!", res.message, "success");
              },
              error=> {
                swal("Alert!", error.message, "info");

              });
        });

    }


    /* End ImageHandler */
}

