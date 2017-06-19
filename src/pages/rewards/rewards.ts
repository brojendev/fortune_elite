import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RewardDetailsPage } from '../reward-details/reward_details';
import { FiltersModal } from './filters';
import { RewardService } from '../../service/reward.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Toast } from '@ionic-native/toast';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-rewards',
  templateUrl: 'rewards.html'
})
export class RewardsPage {
  rewards: any;
  category: any = 1;
  rangeStart: any = 0;
  rangeEnd: any = 10000;
  pageNumber: any = 1;
  filter: any
  noProduct: any = 1;
  cartCount: any;
  constructor(public navCtrl: NavController,
              public platform: Platform,
              private modalCtrl: ModalController,
              private rewardService: RewardService,
              private localStorageService: LocalStorageService,
              private toast: Toast,
              public alertCtrl: AlertController) {

    this.filter = [];
    this.pageNumber = 1;
    this.fetchCatalogProduct();
  }

  ionViewDidEnter(){

    this.cartCount = this.localStorageService.get('cartCount')
  }

  fetchCatalogProduct(loadType: any = ''){
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }

    let self = this;
    this.rewardService.fetchCatalogProduct(token, this.pageNumber, this.filter).then(function(res) {
      if(loadType == 'loadMoreProduct'){
        self.rewards = self.rewards.concat(res.products);
      } else {
        self.rewards = res.products;
      }
      self.noProduct = 0;
      console.log(self.rewards)
      let minMax = res.minMax;
      self.localStorageService.set('category', res.categories);
      self.localStorageService.set('rangeStart', minMax.min);
      self.localStorageService.set('rangeEnd', minMax.max);

    }).catch(function(error) {
      console.log(error);
      if (!error.isTokenValid) {
        self.navCtrl.setRoot(LoginPage);
        return;
      }
      if(error.message_code == 'msg_1048'){
        self.noProduct = 1;
        if(loadType != 'loadMoreProduct'){
          self.rewards = [];
        }
        if(self.platform.is('cordova')){
          self.toast.show(error.message, '2000', 'bottom').subscribe(
            toast => {
              console.log(toast);
            }
          );
        }
        return;
      }
      self.getErrorAlert(
        'Alert',
        error.message
      ).present();
    });
  }

  loadMoreProduct(infiniteScroll){
    this.pageNumber++;
    this.fetchCatalogProduct('loadMoreProduct')
    setTimeout(() => {
      infiniteScroll.complete();
    },500);
  }

  openFilters() {
    let body = {
      categories: this.localStorageService.get('category'),
      rangeStart: this.localStorageService.get('rangeStart'),
      rangeEnd: this.localStorageService.get('rangeEnd'),
      filter: this.filter
    };
    console.log(body);
    let modal = this.modalCtrl.create(FiltersModal, body);

    modal.present();

    let self = this;
    modal.onDidDismiss(function(data) {
      if (!data) {
        return;
      }
      self.filter = { categoryId: data.category,
                      minPrice: data.rangeStart,
                      maxPrice: data.rangeEnd,
                    }
      self.pageNumber = 1;
      self.fetchCatalogProduct();

    })
  }

  getErrorAlert(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    });
  }
  getToken() {
    return this.localStorageService.get('token');
  }
  openRewardDetails(reward) {
    this.navCtrl.push(RewardDetailsPage, reward);
  }
  goToCart(){
    this.navCtrl.push(CartPage);
  }
}
