import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPurchasePage } from '../register-purchase/register_purchase';

@Component({
  selector: 'page-distributor-search-result',
  templateUrl: 'result.html'
})
export class DistributorSearchResultPage {
  dealers: any;
  registerPurchase: boolean = false;
  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.dealers = this.navParams.data.dealers;
    this.registerPurchase = this.navParams.data.registerPurchase;
  }

  openPurchaseForm(dealer: any) {
    this.navCtrl.push(RegisterPurchasePage, { dealer: dealer });
  }

  dial(number: any) {
    if(number != null || number != ''){
      window.location.assign('tel:' + number);
    }
  }

  mailClient(email: any) {
    if(email != null || email != ''){
      window.location.assign('mailto:' + email);
    }
  }
}
