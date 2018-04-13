import {ImageProperties} from "../../../shared/models/image.model";
export class StoreModel {
    constructor(){
        this.active=false;
    }
    _id:string;
    storeName:string;
    addressLine1:string;
    addressLine2:string;
	storeArea:string;
	pincode:string;
	latitude:string;
	longitude:string;
	email:string;
    facebookURL:string;
    websiteURL:string;
    StoreDate:string;
    imageName:string;
    imageTitle:string;
    imageAltText:string;
    imageProperties:ImageProperties;
    active:boolean = false;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}

export class StoreResponse {
    dataList:StoreModel[];
    totalItems:number;
    currentPage:number;
}