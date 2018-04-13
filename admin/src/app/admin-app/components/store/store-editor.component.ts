import {Component, EventEmitter, Output, Input, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import {FormControlMessages} from "../../../shared/components/control-valdation-message.component";
import {StoreModel} from "./store.model";
import {StoreService} from "./store.service";
import{Config} from "../../../shared/configs/general.config";
import{ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
import {ValidationService} from "../../../shared/services/validation.service";
import {ImageUploader} from "../../../shared/components/image-uploader.component";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";

@Component({
  selector: 'store-editor',
  templateUrl: './store-editor.html'
  // styles: [style]
})
export class StoreEditorComponent implements OnInit,AfterViewInit {
  objStore:StoreModel = new StoreModel();
  @Input() storeId:string;
  @Output() showListEvent:EventEmitter<any> = new EventEmitter();
  storeForm:FormGroup;
  isSubmitted:boolean = false;

  /* Image Upload Handle*/
  imageDeleted:boolean = false;
  file:File;
  fileName:string = "";
  drawImagePath:string = Config.DefaultAvatar;
  imageFormControl:FormControl = new FormControl('', Validators.required);
  canvasSize:number = ImageCanvasSizeEnum.small;
  /* End Image Upload handle */


  constructor(private _objService:StoreService, private _formBuilder:FormBuilder) {
   //this.objStore.storeDate = new Date().toLocaleDateString();
    this.storeForm = this._formBuilder.group({
      "storeName": ['', Validators.required],
      "addressLine1": ['', Validators.required],
      "addressLine2": ['', Validators.required],
      "storeArea": ['', Validators.required],
      "pincode": ['', Validators.required],
      "latitude": ['', Validators.required],
      "longitude": ['', Validators.required],
      "email": ['', ValidationService.emailValidator],
      "imageFormControl": this.imageFormControl,
      designation: [''],
      fbUrl: ['', ValidationService.urlValidator],
      websiteURL: ['', ValidationService.urlValidator],
      active: ['']
    });

  }

  ngAfterViewInit() {
    if (!this.storeId)
      this.drawImageToCanvas(Config.DefaultAvatar);
  }

  ngOnInit() {
    if (this.storeId)
      this.getStoreDetail();
  }

  getStoreDetail() {
    this._objService.getStoreDetail(this.storeId)
      .subscribe(res =>this.bindDetail(res),
        error => this.errorMessage(error));
  }

  bindDetail(objRes:StoreModel) {
    this.objStore = objRes;
   // this.objStore.storeDate = new Date(this.objStore.storeDate).toLocaleDateString();
    let path:string = "";
    if (this.objStore.imageName) {
      var cl = Config.Cloudinary;
      path = cl.url(this.objStore.imageName);
    }
    else
      path = Config.DefaultAvatar;
    this.drawImageToCanvas(path);
  }


  saveStore() {
    this.isSubmitted = true;
    if (this.storeForm.valid) {
      if (!this.storeId) {
        this._objService.saveStore(this.objStore, this.file)
          .subscribe(res => this.resStatusMessage(res),
            error => this.errorMessage(error));
      }
      else {
        this._objService.updateStore(this.objStore, this.file, this.imageDeleted)
          .subscribe(res => this.resStatusMessage(res),
            error => this.errorMessage(error));
      }
    }
  }

  resStatusMessage(objSave:any) {
    this.showListEvent.emit(false); // is Form Canceled
    swal("Success !", objSave.message, "success")

  }

  triggerCancelForm() {
    let isCanceled = true;
    this.showListEvent.emit(isCanceled);
  }

  errorMessage(objResponse:any) {
    swal("Alert !", objResponse.message, "info");

  }

  /*Image handler */

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
        this._objService.deleteImage(this.objStore.imageName, this.objStore.imageProperties.imageExtension, this.objStore.imageProperties.imagePath)
          .subscribe(res=> {
              this.imageDeleted = true;
              this.objStore.imageName = "";
              this.drawImageToCanvas(Config.DefaultAvatar);
              swal("Deleted!", res.message, "success");
            },
            error=> {
              swal("Alert!", error.message, "info");

            });
      });
  }

  changeFile(args) {
    this.file = args;
    if (this.file)
      this.fileName = this.file.name;
  }

  drawImageToCanvas(path:string) {
    this.drawImagePath = path;
  }

  /* End ImageHandler */
}

