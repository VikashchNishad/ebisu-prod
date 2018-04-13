import {ImageModel} from "../../../shared/models/image.model";
export class ProductsCategoryModel {
    constructor() {
        this.active = false;
    }


    _id:string;
    categoryName:string;
    categoryDescription:string;
    image:ProductsCategoryImageModel [];
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}
export class ProductsCategoryResponse {
    dataList:ProductsCategoryModel[];
    totalItems:number;
    currentPage:number;
}



export class ProductsSubcategoryModel {
    constructor() {
        this.active = false;
        this.categoryID="";
    }

    _id:string;
    subCategoryName:string;
    subCategoryDescription:string;
    categoryID:string;
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}
export class ProductsSubcategoryResponse {
    dataList:ProductsSubcategoryModel[];
    totalItems:number;
    currentPage:number;
}



export class ProductsModel {
    constructor() {
        this.active = false;
        this.categoryID="";
        this.subCategoryID="";
        this.productsDescription="";
    }
    _id:string;
    productsTitle:string;
    productsModel:string;
    urlSlog:string;
    categoryID:string;
    subCategoryID:string;
    productsSummary:string;
    productsDescription:string;
    productsAuthor:string;
    productsMobileImage:string;
    chooseYourOption:string;
    
    productsDate:any;
    image:ProductsImageModel [];
    pageViews:number;
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
    variants: Array<{KeyVariant: string, Value: number,  Bridge: string, color: string, ImageURL: string, Body: string, Description: string,
     Type: string, Finish: string}> = [];
}

export class ProductsResponse {
    dataList:ProductsModel[];
    totalItems:number;
    currentPage:number;
}

export class ProductsCategoryImageModel {
    constructor() {
        this.active = false;
    }
    _id:string;
    imageName:string;
    imageTitle:string;
    imageAltText:string;
    coverImage:boolean;
    imageProperties:ImageProperties;
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}

export class ProductsImageModel {
    constructor() {
        this.active = false;
    }
    _id:string;
    imageName:string;
    imageTitle:string;
    imageAltText:string;
    coverImage:boolean;
    imageProperties:ImageProperties;
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}

class ImageProperties {
    imageExtension:string;
    imageMimeType:string;
    imageSize:string;
    imageOriginalName:string;
    imagePath:string;
}

export class ProductsImageResponse {
    image:ProductsImageModel[];
}

export class ProductsCategoryImageResponse {
    image:ProductsCategoryImageModel[];
}


// export class variant {
    
//     constructor(public size: string, public Bridge: string) {
//         // code...
//     }

 

// }