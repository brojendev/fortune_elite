import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RewardService } from '../../service/reward.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Toast } from '@ionic-native/toast';
import { RewardOverviewPage } from './overview';
import { RewardScreenshotPage } from './screenshot';
import { RewardSpecsPage } from './specs';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-reward-details',
  templateUrl: 'reward_details.html'
})
export class RewardDetailsPage {
  reward: any = {};
  quantity: number = 1;
  rewardOverviewPage = RewardOverviewPage;
  rewardScreenshotPage = RewardScreenshotPage;
  rewardSpecsPage = RewardSpecsPage;
  cartCount: any;
  constructor(public navCtrl: NavController,
              public platform: Platform,
              private modalCtrl: ModalController,
              private rewardService: RewardService,
              private localStorageService: LocalStorageService,
              public loadingCtrl: LoadingController,
              private toast: Toast,
              public alertCtrl: AlertController,
              params: NavParams) {
    this.reward = params.data;
    this.quantity = 1;
    this.cartCount = this.localStorageService.get('cartCount')
  }

  ionViewDidEnter(){
    this.cartCount = this.localStorageService.get('cartCount')
  }

  increaseQty(){
    this.quantity++;
  }

  decreaseQty(){
    this.quantity--;
  }

  addToCart(rewards: any){
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }

    let self = this;
    this.rewardService.addToCart(token, rewards, this.quantity).then(function(res) {
      loadingDialog.dismiss();
      console.log(res);
      self.localStorageService.set('cartCount', res.control.total_count)
      self.cartCount = res.control.total_count;
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
    });
  }

  getErrorAlert(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          //this.navCtrl.pop();
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

  goToCart(){
    this.navCtrl.push(CartPage);
  }

}
