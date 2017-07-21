import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { GeneralService } from '../../service/general.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  number: string;
  email: string;
  about: string;
  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private localStorageService: LocalStorageService,
              public generalService: GeneralService) {

  }

  ionViewDidEnter(){
    this.getContactus();
  }

  getContactus(){
    let token = this.getToken();
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      loadingDialog.dismiss();
      return;
    }

    let self = this;
    this.generalService.getGeneralContent(token, 'eliteContactUs').then(function(res) {
      loadingDialog.dismiss();
      //self.faqs = res.content_details;
      for (let list of res.content_details){
        if(list.title == 'email'){
          self.email = self.strip(list.details)
        } else if(list.title == 'mobile'){
          self.number = self.strip(list.details)
        } else {
          self.about = list.details;
        }
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

  strip(html: string) {
  	return html.replace(/<(?:.|\n)*?>/gm, '');
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

  getToken() {
    return this.localStorageService.get('token');
  }

  dial() {
    window.location.assign('tel:' + this.number);
  }

  mailClient() {
    window.location.assign('mailto:' + this.email);
  }
}
