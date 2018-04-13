import {Component, OnInit} from '@angular/core';
import {StoreService} from "./store.service";
import{StoreModel, StoreResponse} from "./store.model";

@Component({
    selector: 'store-list',
    templateUrl: './store-list.html'
})

export class StoreComponent implements OnInit {

    objListResponse:StoreResponse;
    error:any;
    showForm:boolean = false;
    storeId:string;
    /* Pagination */
    perPage:number = 10;
    currentPage:number = 1;
    totalPage:number = 1;
    first:number = 0;
    bindSort:boolean = false;
    preIndex:number = 0;
    /* End Pagination */
    ngOnInit() {
        this.getStoreList();
    }

    constructor(private _objService:StoreService) {
    }

    getStoreList() {
        this._objService.getStoreList(this.perPage, this.currentPage)
            .subscribe(objRes =>this.bindList(objRes),
                error => this.errorMessage(error));
    }

    errorMessage(objResponse:any) {
      swal("Alert !", objResponse.message, "info");

    }

    bindList(objRes:StoreResponse) {
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

    edit(id:string) {
		console.log(id);
        this.showForm = true;
        this.storeId = id;
    }

    addStore() {
        this.showForm = true;
        this.storeId = null;
    }

    delete(id:string) {
      swal({
          title: "Are you sure?",
          text: "You will not be able to recover this Testimonial !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        ()=> {
          let objSlider:StoreModel = new StoreModel();
          objSlider._id = id;
          objSlider.deleted = true;
          this._objService.deleteStore(objSlider)
            .subscribe(res=> {
                this.getStoreList();
                swal("Deleted!", res.message, "success");
              },
              error=> {
                swal("Alert!", error.message, "info");

              });
        });

    }

    showList(arg) {
        if (!arg) // is not Canceled
        {
            this.getStoreList();
        }
        this.showForm = false;
        this.sortTable();
    }


    pageChanged(event) {
        this.perPage = event.rows;
        this.currentPage = (Math.floor(event.first / event.rows)) + 1;
        this.first = event.first;
        if (event.first == 0)
            this.first = 1;
        this.getStoreList();
    }


}

