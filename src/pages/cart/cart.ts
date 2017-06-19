import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RewardService } from '../../service/reward.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Toast } from '@ionic-native/toast';
import { OrderSummaryPage } from '../order-summary/order_summary';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  address: string = "405, SJR Residency, Devarabisanahalli, Bangalore - 560103";
  cartItems: any;
  cartId: any;
  grandTotal: any;
  userAddress: any;
  lockQtyUpdate: any;
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
      this.lockQtyUpdate = 0;
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
      self.localStorageService.set('cartCount', res.control.total_count)
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

  increaseQty(item: any){
    item.quantity++;
    this.saveCartQty(item);
  }

  decreaseQty(item: any){
    item.quantity--;
    this.saveCartQty(item);
  }

  saveCartQty(item: any){
    if(this.lockQtyUpdate == 0){
      this.lockQtyUpdate = 1;
      let loadingDialog = this.getLoadingDialog();
      loadingDialog.present();

      let token = this.getToken();
      if (!token) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }

      let self = this;
      this.rewardService.UpdateCartQty(token, this.cartId, item).then(function(res) {
        console.log(res)
        loadingDialog.dismiss();
        self.cartItems = res.cart_details.row_items;
        self.grandTotal = res.cart_details.control.grandtotal_in_point;
        self.lockQtyUpdate = 0;
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
        self.getErrorAlert(
          'Alert',
          error.message
        ).present();
        self.lockQtyUpdate = 0;
      });
    }
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
      self.localStorageService.set('cartCount', res.total_count);
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

  getErrorAlert(title: string, message: string, goBack: number = 0) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          if(goBack == 1){
            this.navCtrl.pop();
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

  goToSummary() {
    this.navCtrl.push(OrderSummaryPage);
  }
}
