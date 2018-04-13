import {Component, ElementRef, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {ProductsService} from "./products.service";
import {ProductsImageModel, ProductsImageResponse} from "./products.model";

@Component({
    selector: 'products-image-list',
    templateUrl: './products-image-list.html'
})

export class ProductsImageListComponent implements OnInit {

    objListResponse:ProductsImageResponse;
    error:any;
    @Input() productsId:string;
    @ViewChild('prevCoverImage') prevCoverImage:ElementRef;
    @Output() showProductsListEvent:EventEmitter<any> = new EventEmitter();
    showImageForm:boolean = false;
    imageId:string;
    /* Pagination */
    // perPage:number = 10;
    // currentPage:number = 1;
    // totalPage:number = 1;
    // first:number = 0;
    /* End Pagination */


    constructor(private _objService:ProductsService, private eleRef:ElementRef) {
    }

    ngOnInit() {
        this.getProductsImageList();
    }

    getProductsImageList() {
        this._objService.getProductsImageList(this.productsId)
            .subscribe(objRes =>this.bindList(objRes),
                error => this.errorMessage(error));
    }

    errorMessage(objResponse:any) {
      swal("Alert !", objResponse.message, "info");

    }

    bindList(objRes:ProductsImageResponse) {
        this.objListResponse = objRes;
        if (objRes.image.length > 0) {
            this.sortTable();
        }
    }

    sortTable() {
        setTimeout(()=> {
            jQuery('.tablesorter').tablesorter({
                headers: {
                    2: {sorter: false},
                    3: {sorter: false},
                    4: {sorter: false}
                }
            });
        }, 50);
    }

    edit(id:string) {
        this.showImageForm = true;
        this.imageId = id;
    }

    addImage() {
        this.showImageForm = true;
        this.imageId = null;
    }

    delete(id:string) {
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

          this._objService.deleteProductsImage(this.productsId, id)
            .subscribe(res=> {
                this.getProductsImageList();
                swal("Deleted!", res.message, "success");
              },
              error=> {
                swal("Alert!", error.message, "info");

              });
        });

    }

    back() {
        this.showProductsListEvent.emit(true); // cancelled true
    }

    showImageList(arg) {
        if (!arg) // is not Canceled
            this.getProductsImageList();
        this.showImageForm = false;
        this.sortTable();
    }

    changeCoverImage(args) {
        let productsImageId = args.target.value;
        jQuery.jAlert({
            'type': 'confirm',
            'title': 'Alert',
            'confirmQuestion': 'Are you sure to change cover image ?',
            'theme': 'red',
            'onConfirm': (e, btn)=> {
                e.preventDefault();
                // let prevCoverImage:ProductsImageModel[] = this.objListResponse.image.filter(function (img:ProductsImageModel) {
                //     return img.coverImage == true;
                // });
                // if (prevCoverImage.length > 0)
                //  prevCoverImageId = prevCoverImage[0]._id;
                let prevCoverImageId = this.prevCoverImage ? this.prevCoverImage.nativeElement.value : "";
                let objProductsImage:ProductsImageModel = new ProductsImageModel();
                objProductsImage._id = productsImageId;
                objProductsImage.coverImage = true;
                this._objService.updateProductsCoverImage(this.productsId, prevCoverImageId, objProductsImage)
                    .subscribe(res=> {
                            this.getProductsImageList();
                            jQuery.jAlert({
                                'title': 'Success',
                                'content': res.message,
                                'theme': 'green'
                            });
                        },
                        error=> {
                            jQuery.jAlert({
                                'title': 'Alert',
                                'content': error.message,
                                'theme': 'red'
                            });
                        });
            },
            "onDeny": (e)=> {
                let prevCoverImageId = "";
                if (this.prevCoverImage.nativeElement.value)
                    jQuery('input[name=rdbCoverImage][value=' + this.prevCoverImage.nativeElement.value + ']').prop('checked', true);
                //    this.eleRef.nativeElement.querySelector('input:radio').value = this.prevCoverImage.nativeElement.value;
            }
        });
    }

    // vppChanged(event:Event) {
    //     this.perPage = Number((<HTMLSelectElement>event.srcElement).value);
    //     this.getProductsImageList();
    // }
    //
    // pageChanged(arg) {
    //     if (arg != this.nextPage) {
    //         this.nextPage = arg;
    //         this.currentPage = arg;
    //         this.getProductsImageList();
    //     }
    // }


}

