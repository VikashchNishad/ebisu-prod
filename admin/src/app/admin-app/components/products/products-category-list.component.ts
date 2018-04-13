import {Component, ElementRef, OnInit, Output, Input, EventEmitter, OnChanges} from '@angular/core';
import {ProductsService} from "./products.service";
import {ProductsModel, ProductsCategoryModel, ProductsResponse} from "./products.model";
import {Paginator} from 'primeng/primeng';
import {ProductsCategoryEditorComponent} from  "./products-category-editor.component";

@Component({
    selector: 'products-category-list',
    templateUrl: './products-category-list.html'
})

export class ProductsCategoryListComponent implements OnInit,OnChanges {
    objListResponse:ProductsCategoryModel[];
    error:any;
    @Input() showList:boolean;
    @Output() showFormEvent:EventEmitter<any> = new EventEmitter();
    categoryId:string;
    showForm:boolean = false;
    /* Pagination */
    perPage:number = 10;
    currentPage:number = 1;
    totalPage:number = 1;
    first:number = 0;

    ngOnInit() {
        this.perPage = 10;
        this.currentPage = 1;
        //   if (!this.isCanceled)
        this.getProductsCategoryList();
    }

    ngOnChanges() {
        if (this.showList)
            this.showForm = !this.showList;
    }

    constructor(private _objService:ProductsService) {
    }

    getProductsCategoryList() {
        this._objService.getProductsCategoryList()
            .subscribe(objRes =>this.bindList(objRes),
                error => this.errorMessage(error));
    }

    errorMessage(objResponse:any) {
      swal("Alert !", objResponse.message, "info");

    }

    bindList(objRes:ProductsCategoryModel[]) {
        this.objListResponse = objRes;
        if (objRes.length > 0) {
            this.sortTable();
        }
    }

    sortTable() {
        setTimeout(()=> {
            jQuery('.tablesorter').tablesorter({
                headers: {
                    2: {sorter: false},
                    3: {sorter: false}
                }
            });
        }, 50);
    }

    edit(id:string) {
        //  this.showFormEvent.emit(id);
        this.showForm = true;
        this.categoryId = id;
    }

    addCategory() {
        // this.showFormEvent.emit(null);
        this.showForm = true;
        this.categoryId = null;
    }

    showCategoryList(args) {
        if (!args) // is Cancelled
            this.getProductsCategoryList();
        this.showForm = false;
        this.sortTable();
    }

    delete(id:string) {
      swal({
          title: "Are you sure?",
          text: "You will not be able to recover this  products Category !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        ()=> {
          let objTemp:ProductsCategoryModel = new ProductsCategoryModel();
          objTemp._id = id;
          objTemp.deleted = true;
          this._objService.deleteProductsCategory(objTemp)
            .subscribe(res=> {
                this.getProductsCategoryList();
                swal("Deleted!", res.message, "success");
              },
              error=> {
                swal("Alert!", error.message, "info");

              });
        });

    }

    vppChanged(event:Event) {
        this.perPage = Number((<HTMLSelectElement>event.srcElement).value);
        this.getProductsCategoryList();
    }

    pageChanged(arg) {

        this.currentPage = arg;
        this.getProductsCategoryList();

    }

}

