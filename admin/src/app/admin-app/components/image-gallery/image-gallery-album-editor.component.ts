import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {FormControlMessages} from "../../../shared/components/control-valdation-message.component";
import {ImageAlbumModel} from "./image-gallery.model";
import {ImageGalleryService} from "./image-gallery.service";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'image-gallery-album-editor',
  templateUrl: './image-gallery-album-editor.html'
})

export class ImageAlbumEditorComponent implements OnInit {
  objAlbum:ImageAlbumModel = new ImageAlbumModel();
  @Input() albumId:string;
  imageAlbumForm:FormGroup;
  @Output() showListEvent:EventEmitter<any> = new EventEmitter();
  isSubmitted:boolean = false;


  constructor(private _objService:ImageGalleryService, private _formBuilder:FormBuilder) {
    this.imageAlbumForm = this._formBuilder.group({
        "albumName": ['', Validators.required],
        "albumDescription": ['', Validators.required],
        "active": ['']
      }
    );
  }

  ngOnInit() {
    if (this.albumId)
      this.getImageAlbumDetail();
  }

  getImageAlbumDetail() {
    this._objService.getImageAlbumDetail(this.albumId)
      .subscribe(res => {
          this.objAlbum = res;
        },
        error => this.errorMessage(error));
  }


  saveAlbum() {
    this.isSubmitted = true;
    if (this.imageAlbumForm.valid) {
      if (!this.albumId) {
        this._objService.saveImageAlbum(this.objAlbum)
          .subscribe(res => this.resStatusMessage(res),
            error =>this.errorMessage(error));
      }
      else {
        this._objService.updateImageAlbum(this.objAlbum)
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

