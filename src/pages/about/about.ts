import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { GeneralService } from '../../service/general.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-faq',
  templateUrl: 'about.html'
})
export class AboutPage {
  about: any;
  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private localStorageService: LocalStorageService,
              public generalService: GeneralService ) {
      this.about = {}
  }

  ionViewDidEnter(){
    this.getAbout();
  }

  getAbout(){
    let token = this.getToken();
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      loadingDialog.dismiss();
      return;
    }

    let self = this;
    this.generalService.getGeneralContent(token, this.navParams.data.keyword).then(function(res) {
      loadingDialog.dismiss();
      self.about = res.content_details[0];
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
