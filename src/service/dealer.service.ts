import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './app.config';
import { ResponseService } from './response.service';
import { Utils } from './utils';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DealerService {
  constructor(private http: Http, private appConfig: AppConfig, private responseService: ResponseService,  private utils: Utils) { }

  dealerSearchUrl = this.appConfig.baseUrl + '/sitare_req/search_dealer_for_sale_data';
  registerPurchaseUrl = this.appConfig.baseUrl + '/sitare_req/enter_sale_data';

  defaultHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  getDealerList(token: any, pageNumber: any, filterData: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
      pageNumber: pageNumber,
      dealer_hier_id: this.appConfig.dealerHierID,
    };

    if(filterData.dealerCompName !== undefined && filterData.dealerCompName !=0){
      body['dealerCompName']= filterData.dealerCompName;
    }
    if(filterData.state_id !== undefined && filterData.state_id !=0){
      body['state_id']= filterData.state_id;
    }
    if(filterData.dist_id !== undefined && filterData.dist_id !=0){
      body['dist_id']= filterData.dist_id;
    }

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.dealerSearchUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
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
