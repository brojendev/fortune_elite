import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { RewardService } from '../../service/reward.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-order-summary',
  templateUrl: 'order_summary.html'
})
export class OrderSummaryPage {
cartItems: any;
cartId: any;
grandTotal: any;
userAddress: any;
  constructor(public navCtrl: NavController,
              public platform: Platform,
              private modalCtrl: ModalController,
              private rewardService: RewardService,
              private localStorageService: LocalStorageService,
              public loadingCtrl: LoadingController,
              private toast: Toast,
              public alertCtrl: AlertController,
              params: NavParams) {
    this.cartItems = [];
  }

  ionViewDidEnter(){
    this.getCartDetails();
  }

  getCartDetails(){
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }

    let self = this;
    this.rewardService.getCartDetails(token).then(function(res) {
      loadingDialog.dismiss();
      self.cartItems = res.row_items;
      self.cartId = res.control.cart_id;
      self.grandTotal = res.control.grandtotal_in_point;
      self.userAddress = res.address;
    }).catch(function(error) {

      loadingDialog.dismiss();
      if (!error.isTokenValid) {
        self.navCtrl.setRoot(LoginPage);
        return;
      }
      if(error.message_code == 'msg_1054'){
        self.getErrorAlert(
          'Alert',
          error.message,
          1
        ).present();
      } else {
        self.getErrorAlert(
          'Alert',
          error.message
        ).present();
      }
    });
  }

  removeCartItem(item: any){
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();

    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }

    let self = this;
    this.rewardService.removeCartItem(token, this.cartId, item).then(function(res) {
      loadingDialog.dismiss();
      console.log(res);
      self.cartItems = res.carts;
      self.grandTotal = res.grand_total;
      if(self.platform.is('cordova')){
        self.toast.show(res.message, '2000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }
    }).catch(function(error) {
      loadingDialog.dismiss();
      if (!error.isTokenValid) {
        self.navCtrl.setRoot(LoginPage);
        return;
      }
      if(error.message_code == 'msg_1054'){
        self.localStorageService.set('cartCount', 0);
        self.getErrorAlert(
          'Alert',
          error.message,
          1
        ).present();
      } else {
        self.getErrorAlert(
          'Alert',
          error.message
        ).present();
      }
    });
  }

  placeOrder(){
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();

    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }

    let self = this;
    this.rewardService.placeOrder(token, this.cartId).then(function(res) {
      loadingDialog.dismiss();
      console.log(res);
      self.afterOrderPlace(res);
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

  afterOrderPlace(res: any) {
    this.localStorageService.remove('cartCount')
    this.alertCtrl.create({
      title: 'Success',
      message: res.message,
      buttons: [{
        text: 'Done',
        handler: () => {
          this.navCtrl.setRoot(HomePage);
        }
      }]
    }).present();
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

  getTotalPoints() {
    return this.cartItems.control.grandtotal_in_point;
  }
}
