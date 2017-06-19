import { Injectable } from '@angular/core';

@Injectable()
export class Utils {
  transformRequest(obj) {
    var str = [];
    for(var p in obj) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
  }

  getAccessToken() {
    return "";
  }

  parseDate(date) {
    console.log(date);
    return date;
  }
}
