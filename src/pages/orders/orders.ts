import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { OrderDetailsPage } from './order_details';
import { SharedService } from '../../service/shared.service';
import { OrderService } from '../../service/order.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html'
})
export class OrdersPage {
  orders: any;
  status: any;
  constructor(public navCtrl: NavController,
              public platform: Platform,
              private modalCtrl: ModalController,
              private orderService: OrderService,
              private localStorageService: LocalStorageService,
              public loadingCtrl: LoadingController,
              private toast: Toast,
              private sharedService: SharedService,
              public alertCtrl: AlertController,
              params: NavParams) {
    this.orders = [];
    this.status = this.sharedService.orderStatusList();
  }

  ionViewDidEnter(){
    this.getOrders();
  }

  getOrders(){
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }

    let self = this;
    this.orderService.myOrders(token).then(function(res) {
      loadingDialog.dismiss();
      console.log(res)
      self.orders = res.order_details;
    }).catch(function(error) {
      loadingDialog.dismiss();
      if (!error.isTokenValid) {
        self.navCtrl.setRoot(LoginPage);
        return;
      }

      self.getErrorAlert(
        'Alert',
        error.message
      ).present();

    });
  }

  getErrorAlert(title: string, message: string, goBack: number = 0) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          if(goBack == 1){
            this.navCtrl.setRoot(HomePage);;
          }
        }
      }]
    });
  }
  getToken() {
    return this.localStorageService.get('token');
  }

  getLoadingDialog() {
    return this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="loading-box">
          <img src="assets/loading.png"><br>
          Loading, please wait...
        </div>`
    });
  }

  openDetailsPage(order: any) {
    this.navCtrl.push(OrderDetailsPage, order);
  }
}
