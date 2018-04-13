import {Component, EventEmitter, Output, Input, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import {PartnerModel} from "./partner.model";
import {PartnerService} from "./partner.service";
import{Config} from "../../../shared/configs/general.config";
import{ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
import {FormGroup, FormControl, Validators, FormBuilder} from "@angular/forms";
import {ValidationService} from "../../../shared/services/validation.service";

@Component({
    selector: 'partner-editor',
    templateUrl: './partner-editor.html'
})
export class PartnerEditorComponent implements OnInit,AfterViewInit {
    objPartner:PartnerModel = new PartnerModel();
    @Input() partnerId:string;
    @Output() showPartnerListEvent:EventEmitter<any> = new EventEmitter();
    partnerForm:FormGroup;
    isSubmitted:boolean = false;

    /* Image Upload Handle*/
    imageDeleted:boolean = false;
    file:File;
    fileName:string = "";
    drawImagePath:string = Config.DefaultImage;
    imageFormControl:FormControl = new FormControl('', Validators.required);
    canvasSize:number = ImageCanvasSizeEnum.small;
    /* End Image Upload handle */


    constructor(private _objService:PartnerService, private _formBuilder:FormBuilder) {
        this.partnerForm = _formBuilder.group({
            "partnerName": ['', Validators.required],
            "imageAltText": ['', Validators.required],
            "linkURL": ['', Validators.compose([Validators.required, ValidationService.urlValidator])],
            "active": [''],
            "imageFormControl": this.imageFormControl
        });
    }

    ngAfterViewInit() {
        if (!this.partnerId)
            this.drawImageToCanvas(Config.DefaultImage);
    }

    ngOnInit() {
        if (this.partnerId)
            this.getImageDetail();
    }

    getImageDetail() {
        this._objService.getPartnerDetail(this.partnerId)
            .subscribe(res =>this.bindDetail(res),
                error => this.errorMessage(error));
    }

    bindDetail(objRes:PartnerModel) {
        this.objPartner = objRes;
        this.fileName = this.objPartner.imageName;
        (<FormControl>this.partnerForm.controls['imageFormControl']).patchValue(this.fileName);
        let path:string = "";
        if (this.objPartner.imageName) {
            var cl = Config.Cloudinary;
            path = cl.url(this.objPartner.imageName);
        }
        else
            path = Config.DefaultImage;
        this.drawImageToCanvas(path);
    }


    savePartner() {
        this.isSubmitted = true;
        (<FormControl>this.partnerForm.controls['imageFormControl']).patchValue(this.fileName);

        if (this.partnerForm.valid) {
            if (!this.partnerId) {
                this._objService.savePartner(this.objPartner, this.file)
                    .subscribe(res => this.resStatusMessage(res),
                        error => this.errorMessage(error));
            }
            else {
                this._objService.updatePartner(this.objPartner, this.file, this.imageDeleted)
                    .subscribe(res => this.resStatusMessage(res),
                        error => this.errorMessage(error));
            }
        }
    }

    resStatusMessage(objSave:any) {
        this.showPartnerListEvent.emit(false); // is Form Canceled
      swal("Success !", objSave.message, "success")

    }

    triggerCancelForm() {
        let isCanceled = true;
        this.showPartnerListEvent.emit(isCanceled);
    }

    errorMessage(objResponse:any) {
        jQuery.jAlert({
            'title': 'Alert',
            'content': objResponse.message,
            'theme': 'red'
        });
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
          this._objService.deleteImage(this.objPartner.imageName, this.objPartner.imageProperties.imageExtension, this.objPartner.imageProperties.imagePath)
            .subscribe(res=> {
                this.imageDeleted = true;
                this.objPartner.imageName = "";
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

