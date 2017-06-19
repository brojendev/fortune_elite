import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './app.config';
import { ResponseService } from './response.service';
import { Utils } from './utils';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class OrderService {
  constructor(private http: Http, private appConfig: AppConfig, private responseService: ResponseService, private utils: Utils) { }

  myOrdersUrl = this.appConfig.baseUrl + '/fortune_demo_req/myorders';
  addToCartUrl = this.appConfig.baseUrl + '/fortune_demo_req/addcart';


  defaultHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  myOrders(token: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.myOrdersUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

}
