import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './app.config';
import { ResponseService } from './response.service';
import { Utils } from './utils';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FabricatorRegistrationService {
  constructor(private http: Http, private appConfig: AppConfig, private responseService: ResponseService, private utils: Utils) { }

  fabricatorRegistrationUrl = this.appConfig.baseUrl + '/fortune_demo_req/registration';

  defaultHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  registerFabricator(data: any): Promise<any> {
    let body = {
      os_type: this.appConfig.OSType,
      os_version: this.appConfig.OSVersion,
      APIkey: this.appConfig.APIKey,
      orgId: this.appConfig.orgId,
      contactHierId: this.appConfig.contactHierId,
      program_id: this.appConfig.programId,
      first_name: data.firstName,
      last_name: data.lastName,
      dob: data.dob,
      phone_number: data.phoneNumber,
      email_address: data.emailAddress,
      address_line1: data.addressLine1,
      address_line2: data.addressLine2,
      state_id: data.stateId,
      city_id: data.cityId,
      post_code: data.postCode
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.fabricatorRegistrationUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleError);
  }
}
