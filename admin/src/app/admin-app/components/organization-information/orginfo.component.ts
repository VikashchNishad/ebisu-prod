import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {OrganizationInfoService} from "./orginfo.service";
import {OrganizationModel} from "./orginfo.model";
import {AlertModel} from "../../../shared/models/alert.model";
import {ValidationService} from "../../../shared/services/validation.service";
import{CountryListService, CountryModel}from "../../../shared/services/countrylist.service";
import{Config}from "../../../shared/configs/general.config";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
@Component({
    selector: 'google-analytics',
    templateUrl: './orginfo.html'
})
export class OrganizationInfoComponent implements OnInit, AfterViewInit {
    objOrg:OrganizationModel = new OrganizationModel();
    objAlert:AlertModel = new AlertModel();
    orgInfoForm:FormGroup;
    objCountyList:CountryModel[];
    isPost:boolean;
    isSubmitted:boolean = false;
    /* Image Upload Handle*/
    imageDeleted:boolean = false;
    file:File;
    fileName:string = "";
    drawImagePath:string = Config.DefaultImage;
    imageFormControl:FormControl = new FormControl('', Validators.required);
    canvasSize:number = ImageCanvasSizeEnum.small;
    /* End Image Upload handle */

    constructor(private _objService:OrganizationInfoService, private _formBuilder:FormBuilder, private countryService:CountryListService) {
        this.orgInfoForm = this._formBuilder.group({
            orgName: ['', Validators.required],
            "country": ['', Validators.required],
            "city": ['', Validators.required],
            "streetAddress": ['', Validators.required],
            "organizationEmail": ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
            "imageFormControl": this.imageFormControl,
            region: [''],
            state: [''],
            addressLine: [''],
            zipAddress: [''],
            postalCode: [''],
            faxNumber: [''],
            phoneNumber: [''],
            mobileNumber: [''],
            fbUrl: ['', ValidationService.urlValidator],
            twitterUrl: ['', ValidationService.urlValidator],
            gplusUrl: ['', ValidationService.urlValidator],
            linkendinUrl: ['', ValidationService.urlValidator],
            youtubeURL: ['', ValidationService.urlValidator],
            instagramURL: ['', ValidationService.urlValidator],
            slogan: ['']
        });
    }

    ngOnInit() {
        this.getCountryList();
        this.getOrgInfo();
        this.objAlert.showAlert("info", "Information", "Please fill the necessary information about the organization.");

    }

    ngAfterViewInit() {
        //let path = Config.DefaultImage;
        //this.drawImageToCanvas(path);
    }

    getCountryList() {
        this.countryService.getCountryList()
            .subscribe(res=> {
                this.objCountyList = res;
            });
    }

    getOrgInfo() {
        this._objService.getOrgInfoDetail()
            .subscribe(res =>this.bindInfo(res),
                error => this.errorMessage(error));
    }

    bindInfo(objOrg:OrganizationModel) {
        let path = Config.DefaultImage;
        if (objOrg) {
            this.objOrg = objOrg;
            if (this.objOrg.logoImageName) {
                this.fileName = this.objOrg.logoImageName;
                let cl = Config.Cloudinary;
                path = cl.url(this.objOrg.logoImageName);
            }
        }
        this.drawImageToCanvas(path);
    }

    saveOrgInfo() {
        this.isSubmitted = true;
        if (this.orgInfoForm.valid) {
            if (!this.objOrg._id) {
                this.isPost = true;
                this._objService.saveOrgInfo(this.objOrg, this.file)
                    .subscribe(res => this.resStatusMessage(res),
                        error => this.errorMessage(error));
            }
            else {
                this.isPost = this.file ? true : false;
                this._objService.updateOrgInfo(this.objOrg, this.file, this.imageDeleted)
                    .subscribe(res => this.resStatusMessage(res),
                        error => this.errorMessage(error));
            }
        }

    }

// validateForm() {
//     if ((this.objOrg.api_Key != "" && typeof this.objOrg.api_Key != "undefined") || (this.objOrg.host != "" && typeof this.objOrg.host != "undefined"))
//         return true;
//     else {
//         this.objAlert.showAlert("danger", "Alert !!", "Please Enter Either Host or API Key");
//
//     }
// }

    resStatusMessage(res:any) {
        if (this.isPost)
            this.getOrgInfo();
        this.file = null;
      swal("Success !", res.message, "success")

    }

    errorMessage(objResponse:any) {
        this.objAlert.showAlert("danger", "Alert !!", objResponse.message, true);
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
          this._objService.deleteImage(this.objOrg.logoImageName, this.objOrg.imageProperties.imageExtension, this.objOrg.imageProperties.imagePath)
            .subscribe(res=> {
                this.imageDeleted = true;
                this.objOrg.logoImageName = "";
                this.drawImageToCanvas(Config.DefaultImage);
                swal("Deleted!", res.message, "success");
              },
              error=> {
                swal("Alert!", error.message, "info");

              });
        });

    }

    /* End Image Handler */
}

