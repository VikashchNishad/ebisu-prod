import {Component, EventEmitter, Output, Input, AfterViewInit, OnInit} from '@angular/core';
import {ProductsCategoryModel, ProductsModel, ProductsSubcategoryModel} from "./products.model";
import {ProductsService} from "./products.service";
import{Config} from "../../../shared/configs/general.config";
import{ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
import {FormGroup, FormControl, Validators, FormBuilder,FormArray} from "@angular/forms";

 var productVariants = new FormArray([]);

@Component({
    selector: 'products-editor',
    templateUrl: './products-editor.html'
})
export class ProductsEditorComponent implements AfterViewInit,OnInit {
    objProducts:ProductsModel = new ProductsModel();
    
    objCatList:ProductsCategoryModel[];
    objSubCatList:ProductsSubcategoryModel[];

    @Input() productsId:string;
    @Output() showListEvent:EventEmitter<any> = new EventEmitter();
    productsForm:FormGroup;
    id:string = "";
    editorFormControl:FormControl = new FormControl('', Validators.required);
    isSubmitted:boolean = false;
        // console.log(this.objProducts);

    /* Image Upload Handle*/
    imageDeleted:boolean = false;
    file:File;
    fileName:string = "";
    drawImagePath:string = Config.DefaultImage;
    imageFormControl:FormControl = new FormControl('', Validators.required);
    canvasSize:number = ImageCanvasSizeEnum.small;
    /* End Image Upload handle */


    constructor(private _objService:ProductsService, private _formBuilder:FormBuilder) {
        // var productVariants = new FormArray([]);

        this.objProducts.productsDate = new Date().toLocaleDateString();
        this.productsForm = this._formBuilder.group({
            "productsTitle": ['', Validators.required],
            "productsModel": ['', Validators.required],
            "productsSummary": ['', Validators.required],
            "productsAuthor": ['', Validators.required],
            "productsMobileImage": ['', Validators.required],
            "chooseYourOption": ['', Validators.required],
            "editorFormControl": this.editorFormControl,
            "selectCategory": ['', Validators.required],
            "selectSubCategory": ['', Validators.required],
            "productsDate": ['', Validators.required],
            "imageFormControl": this.imageFormControl,
            "active": [''],
            'variants': productVariants
        });

    }

  onAddVariants() {
      (<FormArray>this.productsForm.get('variants')).push(
        new FormGroup({
          'KeyVariant': new FormControl(),
          'Value': new FormControl(),
          'color': new FormControl(),
          'ImageURL': new FormControl(),
          'Body': new FormControl(),
          'Bridge': new FormControl(),
          'Description': new FormControl(),
          'Type': new FormControl(),
          'Finish': new FormControl()
        })
        ); 
    }


    ngAfterViewInit() {
        if (!this.productsId)
            this.drawImageToCanvas(Config.DefaultImage);
    }


    ngOnInit() {
        this.productsForm.value.variants.forEach(i=>{ 
            (<FormArray>this.productsForm.get('variants')).removeAt(i);
        });

        this.productsForm.value.variants.forEach(i=>{ 
            this.objProducts.variants.splice(i);
        });

        this.getCategoryList();
        this.getSubCategoryList();
        if (this.productsId) {
            this.getProductsDetail();
        }
    }


    getCategoryList() {
        this._objService.getProductsCategoryList(true)/*active*/
            .subscribe(res=>this.objCatList = res,
                error=>this.errorMessage(error)
            )
    }


    getSubCategoryList() {
        this._objService.getProductsSubCategoryList(true)/*active*/
            .subscribe(res=>this.objSubCatList = res,
                error=>this.errorMessage(error)
            )
    }


    getProductsDetail() {
        this._objService.getProductsDetail(this.productsId)
            .subscribe(res =>this.bindDetail(res),
                error => this.errorMessage(error));
    }


    bindDetail(objRes:ProductsModel) {
        this.objProducts = objRes;
        
          if(this.objProducts['variants']) {
                  for(let variant of this.objProducts.variants) {
                      productVariants.push(
                          new FormGroup({
                              'KeyVariant': new FormControl(variant.KeyVariant),
                              'Value': new FormControl(variant.Value),
                              'color': new FormControl(variant.color),
                              'ImageURL': new FormControl(variant.ImageURL),
                              'Bridge': new FormControl(variant.Bridge),
                              'Body': new FormControl(variant.Body),
                              'Description': new FormControl(variant.Description),
                              'Type': new FormControl(variant.Type),
                              'Finish': new FormControl(variant.Finish),
                          })
                      );
                  }
              }

        this.objProducts.productsDate = new Date(this.objProducts.productsDate).toLocaleDateString();
        this.editorFormControl.patchValue(objRes.productsDescription);
        this.imageFormControl.patchValue(objRes.image[0].imageName);
        this.fileName = objRes.image[0].imageName;
        let path:string = "";
        if (this.objProducts.image[0]) {
            var cl = Config.Cloudinary;
            path = cl.url(this.objProducts.image[0].imageName);

        }
        else
            path = Config.DefaultImage;
        this.drawImageToCanvas(path);
    }


    saveProducts() {
        this.isSubmitted = true; 
        this.productsForm.value.variants.forEach(i=>{ 
        this.objProducts.variants.splice(i);
        });

        this.productsForm.value.variants.forEach(i=>{ 
        this.objProducts.variants.push(
           {
            "KeyVariant":i.KeyVariant,
            "Value":i.Value,
            "color":i.color,
            "ImageURL":i.ImageURL,
            "Body":i.Body,
            "Bridge":i.Bridge,
            "Description":i.Description,
            "Type":i.Type,
            "Finish":i.Finish,

           });
        });
        (<FormControl>this.productsForm.controls["editorFormControl"]).patchValue(this.objProducts.productsDescription ? this.objProducts.productsDescription : "");
        if (this.productsForm.valid) {
            if (!this.productsId) {
                this._objService.saveProducts(this.objProducts, this.file)
                    .subscribe(res => this.resStatusMessage(res),
                        error => this.errorMessage(error));
            }
            else {
                this._objService.updateProducts(this.objProducts, this.file, this.imageDeleted)
                    .subscribe(res => this.resStatusMessage(res),
                        error => this.errorMessage(error));
            }
        }

    }


    onDeleteVariants(index: number) {
        this.productsForm.value.variants.splice(index);
         this.objProducts.variants.splice(index);
        (<FormArray>this.productsForm.get('variants')).removeAt(index);

    }


    resStatusMessage(objSave:any) {
        this.showListEvent.emit(false); // is Form Canceled
      swal("Success !", objSave.message, "success")
    }


    editorValueChange(args) {
        this.objProducts.productsDescription = args;
        // (<FormControl>this.productsForm.controls["editorFormControl"]).updateValue(args);
    }


    triggerCancelForm() {
        let isCanceled = true;
        this.showListEvent.emit(isCanceled);
    }


    errorMessage(objResponse:any) {
      swal("Alert !", objResponse.message, "info");
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

    /* End Image Handler */
}

 