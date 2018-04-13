import {Component, ElementRef, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import {ProductsService} from "./products.service";
import {ProductsModel, ProductsCategoryModel, ProductsResponse} from "./products.model";

@Component({
    selector: 'products-list',
    templateUrl: './products-list.html'
})

export class ProductsListComponent implements OnInit,OnChanges {

    objListResponse:ProductsResponse = new ProductsResponse();
    objCatList:ProductsCategoryModel[];
    @Input() showList:boolean;
    showForm:boolean = false;
    productsId:string;
    @Output() showImageListEvent:EventEmitter<any> = new EventEmitter();
    showSpinner:boolean = true;
    /* Pagination */
    perPage:number = 10;
    currentPage:number = 1;
    totalPage:number = 1;
    first:number = 0;
    bindSort:boolean = false;
    preIndex:number = 0;
    /* End Pagination */


    ngOnInit() {
        this.perPage = 10;
        this.currentPage = 1;
        //if (!this.isCanceled)
        this.getProductsList();
        this.getCategoryList();
    }

    ngOnChanges() {
        if (this.showList) {
            this.showForm = !this.showList;
            this.getCategoryList();
        }
    }

    constructor(private _objService:ProductsService) {
    }

    getCategoryList() {
        this._objService.getProductsCategoryList(true)/*active*/
            .subscribe(res=>this.objCatList = res,
                error=>this.errorMessage(error)
            )
    }

    categoryFilter(args) {
        let categoryId = (<HTMLSelectElement>args.srcElement).value;
        this.currentPage = 1;
        this._objService.getProductsList(this.perPage, this.currentPage, categoryId)
            .subscribe(res => this.bindList(res),
                error=>this.errorMessage(error));
    }

    getProductsList() {
        this._objService.getProductsList(this.perPage, this.currentPage)
            .subscribe(objRes =>this.bindList(objRes),
                error => this.errorMessage(error));
    }

    errorMessage(objResponse:any) {
      swal("Alert !", objResponse.message, "info");

    }

    bindList(objRes:ProductsResponse) {
        this.showSpinner = false;
        this.objListResponse = objRes;
        this.preIndex = (this.perPage * (this.currentPage - 1));
        if (objRes.dataList.length > 0) {
            let totalPage = objRes.totalItems / this.perPage;
            this.totalPage = totalPage > 1 ? Math.ceil(totalPage) : 1;
            if (!this.bindSort) {
                this.bindSort = true;
                this.sortTable();
            }
            else
                jQuery("table").trigger("update", [true]);
        }
        else
            jQuery(".tablesorter").find('thead th').unbind('click mousedown').removeClass('header headerSortDown headerSortUp');
    }

    sortTable() {
        setTimeout(()=> {
            jQuery('.tablesorter').tablesorter({
                headers: {
                    3: {sorter: false},
                    4: {sorter: false}
                }
            });
        }, 50);
    }

    addProducts() {
        // this.showFormEvent.emit(null);
        this.showForm = true;
        this.productsId = null;
    }


    edit(id:string) {
        // this.showFormEvent.emit(id);
        this.showForm = true;
        this.productsId = id;
    }

    showProductsList(args) {
        if (!args) {
            this.getProductsList();
        }
        this.showForm = false;
        this.sortTable();
    }

    showImageList(productsId:string) {
        this.showImageListEvent.emit(productsId);
    }

    delete(id:string) {
      swal({
          title: "Are you sure?",
          text: "You will not be able to recover this Products !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        ()=> {
          let objTemp:ProductsModel = new ProductsModel();
          objTemp._id = id;
          objTemp.deleted = true;
          this._objService.deleteProducts(objTemp)
            .subscribe(res=> {
                this.getProductsList();
                swal("Deleted!", res.message, "success");
              },
              error=> {
                swal("Alert!", error.message, "info");

              });
        });

    }

    pageChanged(event) {
        this.perPage = event.rows;
        this.currentPage = (Math.floor(event.first / event.rows)) + 1;
        this.first = event.first;
        if (event.first == 0)
            this.first = 1;
        this.getProductsList();
    }

}

