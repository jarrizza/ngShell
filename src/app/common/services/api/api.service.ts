import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Typed Data models
import { AppInfo } from '../../models/appinfo';

@Injectable()
export class ApiService{

  // Resolve HTTP using the constructor
  constructor (private http: Http) {}

  public apiUp = true;
  public inProgress = false;
  public token = null;

  // private instance variable to hold base url
  private port = 3003;
  private baseUrl = 'http://localhost:'+this.port.toString()+'/api/';


  //////////////////////////////////////////////

  // api error catcher for program control

  processError(service: any, error: any): Observable<AppInfo> {
    let message = '';
    if (error.status === 0) {
      console.log("NO API CONNECTION", error);
      message = "NO API CONNECTION";
      service.apiUp = false;
    }
    else if (error.status === 404 ) {
      console.log("INVALID REQUEST", error);
      message = "INVALID REQUEST";
      service.apiUp = true;
    }
    service.inProgress = false;
    return Observable.throw(error.json().error || message);
  }

  // api success catcher for program control

  processSuccess(service: any, url: string, res: Response): any {
    console.log('RESPONSE FOR: '+ url);
    console.log(res.json());
    service.apiUp = true;
    service.inProgress = false;
    return res.json();
  }

  // api call start stuff for program control

  processStart(service: any, url: string, payload: any, method: string ): any {
    console.log('CALLING: '+ method + ' ' + url);
    service.apiUp = true;
    service.inProgress = true;
  }

  //////////// http setup and calls (currently only using GET and POST)

  createHeaders(method) {
    let headers = new Headers();
    if (method === 'POST') {
      headers.append('Content-Type', 'application/json');
    }
    if (this.token) {
      headers.append('Token', this.token);
    }
    headers.append('Cache-Control', 'no-cache');
    headers.append('Pragma', 'no-cache');
    return headers;
  }


  callget(service: any, url: string, args: any) : Observable<any> {
    let options = new RequestOptions(this.createHeaders('GET'));
    this.processStart(this, url, {}, 'GET');
    return this.http.get(url, options)
      .map((res: Response) => service.processSuccess(service, url, res))
      .catch((error:any) => service.processError(service, error));
  }

  callpost(service: any, url: string, payload: any) : Observable<any> {
    let options = new RequestOptions(this.createHeaders('POST'));
    let jsonstrPayload = JSON.stringify(payload);
    this.processStart(this, url, jsonstrPayload, 'POST');
    return this.http.post(url, jsonstrPayload, options)
      .map((res: Response) => service.processSuccess(service, url, res))
      .catch((error:any) => service.processError(service, error));
  }

  ////////////////////////////////////////////// ENDPOINTS

  getAppInfo() : Observable<AppInfo> {
    return this.callget(this, this.baseUrl + 'info', {});
  }

  //////////// COMMON RECORD CRUD

  // This is a common function to save a single new DATA record passed the url and the new record
  public addRecord(addUrl: string, newRecord: any): Observable<any> {
    return this.callpost(this, this.baseUrl + addUrl, newRecord);
  }

  // This is a common function to load an array of DATA records based on a filter, passed the url and the filter record
  public loadRecords(loadUrl: string, filterRecord: any): Observable<any> {
    return this.callpost(this, this.baseUrl + loadUrl, filterRecord);
  }

  // This is a common function to re-save an array of records passed the url and the filter record
  public updateRecords(saveUrl: string, records: Array<any>, totals: any) {
    return this.callpost(this, this.baseUrl + saveUrl, records);
  }

  // This is a common function to delete a single DATA record passed the url and the record to be deleted
  public deleteRecord(deleteUrl: string, oldRecord: any): Observable<any> {
    return this.callpost(this, this.baseUrl + deleteUrl, oldRecord);
  }


}

/* This works
 let self = this;
 let url = this.baseUrl + 'info';
 this.processStart(this, url, {}, 'GET');
 return this.http.get(url)
 .map((res:Response) => self.processSuccess(self, url, res))
 .catch((error:any) => self.processError(self, error));
 */

/*
 let self = this;
 let payload = JSON.stringify(filterRecord);
 let url = this.baseUrl + loadUrl;
 let options = this.stdPostOptions();
 this.processStart(this, url, {}, 'POST');
 return this.http.post(url, payload, options)
 .map((res: Response) => self.processSuccess(self, url, res))
 .catch((error:any) => self.processError(self, error));
 */
