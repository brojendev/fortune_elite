import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

@Injectable()
export class ResponseService {
  extractData(res: Response) {
    let body = res.json();
    console.log("RESPONSE_BODY::", body);
    if (!body.bstatus) {
      return Promise.reject(res);
    }
    return body || { };
  }

  handleError(error: any) {
    let errMsg = (error.json().message) ? error.json().message :
      error.status ? `${error.status} - ${error.statusText}` : 'Please check your internet connection';
      console.log("ERROR_MESSAGE_PARSED::", errMsg);
    return Promise.reject(errMsg);
  }

  handleAuthError(error: any) {
    let errMsg = (error.json().message) ? error.json().message :
      error.status ? `${error.status} - ${error.statusText}` : 'Please check your internet connection';
      console.log("ERROR_MESSAGE_PARSED::", errMsg);
    return Promise.reject({
      message: errMsg,
      message_code: error.json().msg_code,
      isTokenValid: (error.json().is_valid_token == undefined || error.json().is_valid_token == 1) ? true : false
    });
  }
}
