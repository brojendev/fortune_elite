import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './app.config';
import { ResponseService } from './response.service';
import { Utils } from './utils';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  constructor(private http: Http, private appConfig: AppConfig, private responseService: ResponseService, private utils: Utils) { }

  profileUrl = this.appConfig.baseUrl + '/fortune_demo_req/profile';
  changePasswordUrl = this.appConfig.baseUrl + '/fortune_demo_req/changepassword';
  changeProfilePicUrl = this.appConfig.baseUrl + '/fortune_demo_req/change_profile_image';
  editaddressUrl = this.appConfig.baseUrl + '/fortune_demo_req/update_address';
  pointStatementUrl = this.appConfig.baseUrl + '/fortune_demo_req/pointstatements';

  defaultHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  getProfile(token: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      contentCode: 'sitareContactUs'
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.profileUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  getPointStatement(token: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.pointStatementUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  changePassword(passwordData: any, token: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      old_password: passwordData.oldPassword,
      new_password: passwordData.newPassword,
      confirm_password: passwordData.confirmPassword
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.changePasswordUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  editAddress(addressData: any, token: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      address_line1: addressData.addressLine1,
      address_line2: addressData.addressLine2,
      state_id: addressData.selectedState,
      city_id: addressData.selectedDistrict,
      post_code: addressData.pincode,
      address_id: addressData.addressId
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.editaddressUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  changeProfilePic(imageData: any, token: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      orgId: this.appConfig.orgId,
      program_id: this.appConfig.programId,
      token: token,
      c_file: imageData
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.changeProfilePicUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }
}
