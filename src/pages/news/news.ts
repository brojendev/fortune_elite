import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { NewsDetailModal } from './news_detail';
import { GeneralService } from '../../service/general.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  news: Array<{title: string, date: any, description: string}>;
  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private localStorageService: LocalStorageService,
              public generalService: GeneralService) {
    this.news = [];
  }

  ionViewDidEnter(){
    this.getNews();
  }

  getNews(){
    let token = this.getToken();
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      loadingDialog.dismiss();
      return;
    }

    let self = this;
    this.generalService.getGeneralContent(token, 'newsNUpdates').then(function(res) {
      loadingDialog.dismiss();
      self.news = res.content_details;
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
          this.navCtrl.pop();
        }
      }]
    });
  }

  getToken() {
    return this.localStorageService.get('token');
  }

  openNewsModal(item: any) {
    this.modalCtrl.create(NewsDetailModal, item).present();
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

  getDate(item: any) {
    return new Date(item.contentDate);
  }
}
