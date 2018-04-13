
import{Component}from'@angular/core';


@Component({
    selector: 'products-management',
    templateUrl: './products-management.html'
})
export class ProductsManagementComponent {
    isCatList:boolean = true;
    isSubCatList:boolean = true;
    isProductsList:boolean = false;
    isImageList:boolean = false;
    id:string;
    isCanceled:boolean = false;
    showForm:boolean = false;

    constructor() {
    }


    showCategoryList(args) {
        this.hideAll();
        this.isCatList = true;
        this.isCanceled = args;
    }

    showSubCategoryList(args) {
        this.hideAll();
        this.isSubCatList = true;
        this.isCanceled = args;
    }

    showProductsList(args) {
        this.hideAll();
        this.isProductsList = true;
        this.isCanceled = args;
    }

    showImageList(args) {
        this.hideAll();
        this.isImageList = true;
        this.id = args;
    }

    hideAll() {
        this.isCatList = false;
        this.isSubCatList = false;

        this.isProductsList = false;
        this.isImageList = false;
    }

     public tabSwitch(args) {
        if (1 == args.index) {
            this.hideAll();
            this.isSubCatList = true;
        } else if (2 == args.index) {
            this.hideAll();
            this.isProductsList = true;
        } else {
            this.hideAll();
            this.isCatList = true;

        }

    }


}

