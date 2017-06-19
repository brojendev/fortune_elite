import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './app.config';
import { ResponseService } from './response.service';
import { Utils } from './utils';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GeneralService {
  constructor(private http: Http, private appConfig: AppConfig, private responseService: ResponseService,  private utils: Utils) { }

  stateDistrictUrl = this.appConfig.baseUrl + '/fortune_demo_req/state_district_list';
  identificationListUrl = this.appConfig.baseUrl + '/fortune_demo_req/identity_list';
  contentUrl = this.appConfig.baseUrl + '/fortune_demo_req/content';

  defaultHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  getStateDistrictList(): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.stateDistrictUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleError);
  }

  getIdentificationList(): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.identificationListUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleError);
  }

  getGeneralContent(token: any, contentCode: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      contentCode: contentCode,
      programId: this.appConfig.programId
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.contentUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }
}
