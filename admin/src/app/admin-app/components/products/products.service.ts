import {ProductsModel, ProductsCategoryModel, ProductsSubcategoryModel, ProductsResponse, ProductsImageModel, ProductsImageResponse} from './products.model';
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import{Config} from "../../../shared/configs/general.config";
import{API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';

@Injectable()
export class ProductsService {
    ProductsCategoryApiRoute:string = "productscategory";
    ProductsSubCategoryApiRoute:string = "productssubcategory";
    productsApiRoute:string = "products";
    productsImageApi:string = "productsimage";
    progressObserver:any;
    progress:any;

    constructor(private _http:Http, private fileService:FileOperrationService) {
        this.progress = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
    }


    /*---------------------------------- products Category-------------------------------- */

    // saveProductsCategory(objProductsCat:ProductsCategoryModel) {
    //     let body = JSON.stringify(objProductsCat);
    //     return this._http.post(API_URL + this.ProductsCategoryApiRoute, body)
    //         .map(res => res.json())
    //         .catch(this.handleError);
    // }
 


    saveProductsCategory(objProductsCat:ProductsCategoryModel, file:File):Observable<any> {
        return Observable.create(observer => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            if (file) {
                formData.append('imageName', file);
            }
            formData.append('data', JSON.stringify(objProductsCat));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                        console.log(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.open('POST', API_URL + this.ProductsCategoryApiRoute, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }


    // updateProductsCategory(objProductsCat:ProductsCategoryModel) {
    //     let body = JSON.stringify(objProductsCat);
    //     return this._http.put(API_URL + this.ProductsCategoryApiRoute + "/" + objProductsCat._id, body)
    //         .map(res => res.json())
    //         .catch(this.handleError);
    // }



     updateProductsCategory(objProducts:ProductsCategoryModel, file:File, imageDeleted:boolean):Observable<any> {
        return Observable.create(observer => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            if (file) {
                formData.append('imageName', file);
            }
            formData.append('data', JSON.stringify(objProducts));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                        console.log(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.open('PUT', API_URL + this.ProductsCategoryApiRoute + "/" + objProducts._id + "?imagedeleted=" + imageDeleted, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }



    getProductsCategoryList(active?:boolean):Observable < ProductsCategoryModel[]> {
        var queryString = "";
        if (active)
            queryString = "?active=true";
        return this._http.get(API_URL + this.ProductsCategoryApiRoute + queryString)
            .map(res =><ProductsCategoryModel[]>res.json())
            .catch(this.handleError);
    }

    getProductsCategoryDetail(objId:string):Observable < ProductsCategoryModel> {
        return this._http.get(API_URL + this.ProductsCategoryApiRoute + "/" + objId)
            .map(res =><ProductsCategoryModel>res.json())
            .catch(this.handleError);
    }

    deleteProductsCategory(objDel:ProductsCategoryModel):Observable<any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.ProductsCategoryApiRoute + "/" + objDel._id, body)
            .map(res => res.json())
            .catch(this.handleError);
    }

    /*------------------------------ End products Category-------------------------------------------- */




    /*---------------------------------- products SubCategory-----------------------------------------*/

    saveProductsSubCategory(objProductsSubCat:ProductsSubcategoryModel) {
        let body = JSON.stringify(objProductsSubCat);
        return this._http.post(API_URL + this.ProductsSubCategoryApiRoute, body)
            .map(res => res.json())
            .catch(this.handleError);
    }
 


    // saveProductsSubCategory(objProductsSubCat:ProductsSubcategoryModel, file:File):Observable<any> {
    //     return Observable.create(observer => {
    //         let formData:FormData = new FormData(),
    //             xhr:XMLHttpRequest = new XMLHttpRequest();

    //         if (file) {
    //             formData.append('imageName', file);
    //         }
    //         formData.append('data', JSON.stringify(objProductsSubCat));
    //         xhr.onreadystatechange = () => {
    //             if (xhr.readyState === 4) {
    //                 if (xhr.status === 200) {
    //                     observer.next(JSON.parse(xhr.response));
    //                     observer.complete();
    //                 } else {
    //                     observer.error(JSON.parse(xhr.response));
    //                     console.log(xhr.response);
    //                 }
    //             }
    //         };
    //         xhr.upload.onprogress = (event) => {
    //             this.progress = Math.round(event.loaded / event.total * 100);
    //             //this.progressObserver.next(this.progress);
    //         };
    //         xhr.open('POST', API_URL + this.ProductsSubCategoryApiRoute, true);
    //         xhr.setRequestHeader("Authorization", Config.AuthToken);
    //         xhr.send(formData);
    //     });
    // }


    updateProductsSubCategory(objProductsSubCat:ProductsSubcategoryModel) {
        let body = JSON.stringify(objProductsSubCat);
        return this._http.put(API_URL + this.ProductsSubCategoryApiRoute + "/" + objProductsSubCat._id, body)
            .map(res => res.json())
            .catch(this.handleError);
    }



    //  updateProductsSubCategory(objProductsSubCat:ProductsSubcategoryModel, file:File, imageDeleted:boolean):Observable<any> {
    //     return Observable.create(observer => {
    //         let formData:FormData = new FormData(),
    //             xhr:XMLHttpRequest = new XMLHttpRequest();

    //         if (file) {
    //             formData.append('imageName', file);
    //         }
    //         formData.append('data', JSON.stringify(objProductsSubCat));
    //         xhr.onreadystatechange = () => {
    //             if (xhr.readyState === 4) {
    //                 if (xhr.status === 200) {
    //                     observer.next(JSON.parse(xhr.response));
    //                     observer.complete();
    //                 } else {
    //                     observer.error(xhr.response);
    //                     console.log(xhr.response);
    //                 }
    //             }
    //         };
    //         xhr.upload.onprogress = (event) => {
    //             this.progress = Math.round(event.loaded / event.total * 100);
    //             //this.progressObserver.next(this.progress);
    //         };
    //         xhr.open('PUT', API_URL + this.ProductsSubCategoryApiRoute + "/" + objProductsSubCat._id + "?imagedeleted=" + imageDeleted, true);
    //         xhr.setRequestHeader("Authorization", Config.AuthToken);
    //         xhr.send(formData);
    //     });
    // }



    getProductsSubCategoryList(active?:boolean):Observable < ProductsSubcategoryModel[]> {
        var queryString = "";
        if (active)
            queryString = "?active=true";
        return this._http.get(API_URL + this.ProductsSubCategoryApiRoute + queryString)
            .map(res =><ProductsSubcategoryModel[]>res.json())
            .catch(this.handleError);
    }

    getProductsSubCategoryDetail(objId:string):Observable < ProductsSubcategoryModel> {
        return this._http.get(API_URL + this.ProductsSubCategoryApiRoute + "/" + objId)
            .map(res =><ProductsSubcategoryModel>res.json())
            .catch(this.handleError);
    }

    deleteProductsSubCategory(objDel:ProductsSubcategoryModel):Observable<any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.ProductsSubCategoryApiRoute + "/" + objDel._id, body)
            .map(res => res.json())
            .catch(this.handleError);
    }

    /*------------------------------ End products SubCategory-------------------------------------------- */




    /*------------------------------------- products---------------------------------------------------- */
    saveProducts(objProducts:ProductsModel, file:File):Observable<any> {
        return Observable.create(observer => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            if (file) {
                formData.append('imageName', file);
            }
            formData.append('data', JSON.stringify(objProducts));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                        console.log(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.open('POST', API_URL + this.productsApiRoute, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    updateProducts(objProducts:ProductsModel, file:File, imageDeleted:boolean):Observable<any> {
        return Observable.create(observer => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            if (file) {
                formData.append('imageName', file);
            }
            formData.append('data', JSON.stringify(objProducts));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                        console.log(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.open('PUT', API_URL + this.productsApiRoute + "/" + objProducts._id + "?imagedeleted=" + imageDeleted, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    getProductsList(perPage:number, currentPage:number, categoryId?:string):Observable < ProductsResponse > {
        let queryString:string = "";
        queryString += perPage ? "?perpage=" + perPage : "";
        queryString += currentPage ? "&page=" + currentPage : "";
        queryString += categoryId ? "&categoryid=" + categoryId : "";
        return this._http.get(API_URL + this.productsApiRoute + queryString)
            .map(res =><ProductsResponse>res.json())
            .catch(this.handleError);
    }

    getProductsDetail(id:string):Observable < ProductsModel > {
        return this._http.get(API_URL + this.productsApiRoute + "/" + id)
            .map(res =><ProductsModel>res.json())
            .catch(this.handleError);
    }

    deleteProducts(objUpdate:ProductsModel) {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.productsApiRoute + "/" + objUpdate._id, body)
            .map(res => res.json())
            .catch(this.handleError);
        ;
    }

    /*---------------------------------------- End products----------------- ------------------*/



    deleteImage(fileName:string, orgExt:string, path:string):Observable < any > {
        return this.fileService.deleteFile(fileName, orgExt, path, "image");

    }


    /*---------------------------products Image------------------------------------------------ */

    saveProductsImage(productsId:string, objSave:ProductsImageModel, file:File):Observable<any> {
        return Observable.create(observer => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            if (file) {
                formData.append('imageName', file);
            }
            formData.append('data', JSON.stringify(objSave));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response))
                        console.log(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.open('POST', API_URL + this.productsImageApi + "/" + productsId, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    updateProductsImage(productsId:string, objUpdate:ProductsImageModel, file:File, imageDeleted:boolean):Observable<any> {
        return Observable.create(observer => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            if (file) {
                formData.append('imageName', file);
            }
            formData.append('data', JSON.stringify(objUpdate));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                        console.log(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.open('PUT', API_URL + this.productsImageApi + "/" + productsId + "/" + objUpdate._id + "?imagedeleted=" + imageDeleted, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    updateProductsCoverImage(productsId:string, prevCoverImageID:string, objProductsImage:ProductsImageModel) {
        let body = JSON.stringify(objProductsImage);
        return this._http.patch(API_URL + this.productsImageApi + "/" + productsId + "/" + prevCoverImageID, body)
            .map(res => res.json())
            .catch(this.handleError);

    }

    getProductsImageList(productsId:string):Observable < ProductsImageResponse> {
        return this._http.get(API_URL + this.productsImageApi + "/" + productsId)
            .map(res =><ProductsImageResponse>res.json())
            .catch(this.handleError);
    }


    getProductsImageDetail(productsId:string, productsImageId:string):Observable < ProductsImageModel> {
        return this._http.get(API_URL + this.productsImageApi + "/" + productsId + "/" + productsImageId)
            .map(res =><ProductsImageModel>res.json())
            .catch(this.handleError);
    }

    deleteProductsImage(productsId:string, productsImageId:string):Observable < any> {
        return this._http.delete(API_URL + this.productsImageApi + "/" + productsId + "/" + productsImageId)
            .map(res =><any>res.json())
            .catch(this.handleError);
    }

    /*-------------------------- End products Image---------------------------------------------------*/

    handleError(error) {
        console.log(error.json());
        return Observable.throw(error.json() || 'server error');
    }

}
