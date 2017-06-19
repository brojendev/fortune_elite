import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { GeneralService } from '../../service/general.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html'
})
export class FaqPage {
  faqs: Array<{title: string, description: string}>;
  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private localStorageService: LocalStorageService,
              public generalService: GeneralService ) {

  }

  ionViewDidEnter(){
    this.getFaqs();
  }

  getFaqs(){
    let token = this.getToken();
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      loadingDialog.dismiss();
      return;
    }

    let self = this;
    this.generalService.getGeneralContent(token, 'sitareFAQs').then(function(res) {
      loadingDialog.dismiss();
      self.faqs = res.content_details;
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
}
