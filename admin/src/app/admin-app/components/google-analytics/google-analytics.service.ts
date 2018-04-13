import {GoogleAnalyticsModel} from './google-analytics.model';
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import{API_URL} from "../../../shared/configs/env.config";
import{Config} from '../../../shared/configs/general.config'
import {FileOperrationService} from '../../../shared/services/fileOperation.service';

@Injectable()
export class GoogleAnalyticsService {
    apiRoute:string = "analytics"; 
    progressObserver:any;
    progress:any;

    constructor(private _http:Http, private fileService:FileOperrationService) {

    }

    saveGoogleAnalytics(objSave:GoogleAnalyticsModel, file:File):Observable<any> {
        return Observable.create(observer => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            if (file) {
                formData.append('documentName', file);
            }
            formData.append('data', JSON.stringify(objSave));
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
            xhr.open('POST', API_URL + this.apiRoute, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    updateGoogleAnalytics(objUpdate:GoogleAnalyticsModel, file:File):Observable<any> {
        return Observable.create(observer => {
            let formData:FormData = new FormData(),
                xhr:XMLHttpRequest = new XMLHttpRequest();

            if (file) {
                formData.append('documentName', file);
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
            xhr.open('PUT', API_URL + this.apiRoute + "/" + objUpdate._id, true);
            xhr.setRequestHeader("Authorization", Config.AuthToken);
            xhr.send(formData);
        });
    }

    getAnalyticsDetail():Observable < GoogleAnalyticsModel > {
        return this._http.get(API_URL + this.apiRoute)
            .map(res =><GoogleAnalyticsModel>res.json())
            .catch(this.handleError);
    }

    deleteFile(fileName:string, path:string):Observable < any > {
        return this.fileService.deleteFile(fileName, ".json", path, "doc");
    }

    handleError(error) {
        console.log(error.json());
        return Observable.throw(error.json() || 'server error');
    }

}
