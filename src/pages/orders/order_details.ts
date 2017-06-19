import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'page-order-details',
  templateUrl: 'order_details.html'
})
export class OrderDetailsPage {
  order: any;
  status: any;
  constructor(public navCtrl: NavController, private sharedService: SharedService, private navParams: NavParams) {
    this.order = this.navParams.data;

    this.status = this.sharedService.orderStatusList();
  }
}
