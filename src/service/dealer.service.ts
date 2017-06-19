import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './app.config';
import { ResponseService } from './response.service';
import { Utils } from './utils';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DealerService {
  constructor(private http: Http, private appConfig: AppConfig, private responseService: ResponseService,  private utils: Utils) { }

  distributorSearchUrl = this.appConfig.baseUrl + '/fortune_demo_req/search_distributor_for_sale_data';
  registerPurchaseUrl = this.appConfig.baseUrl + '/fortune_demo_req/enter_sale_data';

  defaultHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  getDistributorList(token: any, pageNumber: any, filterData: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
      pageNumber: pageNumber,
      distributor_hier_id: this.appConfig.distributorHierID,
    };

    if(filterData.distributorCompName !== undefined && filterData.distributorCompName !=0){
      body['distributorCompName']= filterData.distributorCompName;
    }
    if(filterData.state_id !== undefined && filterData.state_id !=0){
      body['state_id']= filterData.state_id;
    }
    if(filterData.dist_id !== undefined && filterData.dist_id !=0){
      body['dist_id']= filterData.dist_id;
    }

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.distributorSearchUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  registerPurchase(token: any, purchaseData: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      orgId: this.appConfig.orgId,
      token: token,
      programId: this.appConfig.programId,
      prodMasId: this.appConfig.prodMasId,
      saleQuantity: purchaseData.quantity,
      saleDate: purchaseData.date,
      dealertContactId: purchaseData.dealertContactId,
    };

    if(purchaseData.invoice !== undefined && purchaseData.invoice !=0){
      body['c_file']= purchaseData.invoice;
    }

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.registerPurchaseUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

}
