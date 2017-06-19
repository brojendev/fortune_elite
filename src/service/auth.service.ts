import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './app.config';
import { ResponseService } from './response.service';
import { Utils } from './utils';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  constructor(private http: Http, private appConfig: AppConfig, private responseService: ResponseService, private utils: Utils) { }

  loginUrl = this.appConfig.baseUrl + '/fortune_demo_req/auth';
  forgotPasswordUrl = this.appConfig.baseUrl + '/fortune_demo_req/forgot_password';
  registerUrl = this.appConfig.baseUrl + '/fortune_demo_req/registration';

  defaultHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  login(userModel: any): Promise<any> {
    let body = {
      userName: userModel.userName,
      passwd: userModel.password,
      deviceId: userModel.deviceId,
      os_type: this.appConfig.OSType,
      os_version: this.appConfig.OSVersion,
      APIkey: this.appConfig.APIKey,
      orgId: this.appConfig.orgId,
      contactHierId: this.appConfig.contactHierId
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.loginUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleError);
  }

  forgotPassword(userName: string): Promise<any> {
    let body = {
      user_name: userName,
      os_type: this.appConfig.OSType,
      os_version: this.appConfig.OSVersion,
      APIkey: this.appConfig.APIKey,
      orgId: this.appConfig.orgId,
      programId: this.appConfig.programId
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.forgotPasswordUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleError);
  }

  register(data: any): Promise<any> {
    let body = {
      first_name: data.firstName,
      last_name: data.lastName,
      dob: this.utils.parseDate(data.dob),
      phone_number: data.phoneNumber,
      identification_type: data.identificationType,
      identification_value: data.identificationValue,
      address_line1: data.addressLine1,
      state_id: data.selectedState,
      city_id: data.selectedDistrict,
      post_code: data.pincode,
      os_type: this.appConfig.OSType,
      os_version: this.appConfig.OSVersion,
      APIkey: this.appConfig.APIKey,
      orgId: this.appConfig.orgId,
      contactHierId: this.appConfig.contactHierId,
      program_id: this.appConfig.programId
    };

    if (data.email) {
      body['email_address'] = data.email;
    }

    if (data.addressLine2) {
      body['address_line2'] = data.addressLine2;
    }

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.registerUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleError);
  }
}
