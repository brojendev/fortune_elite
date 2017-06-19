import { Component} from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'page-forget-password',
  templateUrl: 'forgot_password.html'
})
export class ForgotPasswordPage {
  userName: string;
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, private authService: AuthService) {
  }

  validateForm() {
    if (!this.userName) {
      return 'Please enter a valid username';
    }

    return null;
  }

  submit() {
    let validationError = this.validateForm();
    if (validationError) {
      this.getErrorAlert(
        'Incorrect Information',
        validationError
      ).present();
      return;
    }

    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();

    let self = this;
    this.authService.forgotPassword(this.userName).then(function(res) {
      loadingDialog.dismiss();
      self.afterForgotPassword(res);
    }).catch(function(msg) {
      loadingDialog.dismiss();
      self.getErrorAlert(
        'Alert',
        msg
      ).present();
      return;
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

  getErrorAlert(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.userName = '';
        }
      }]
    })
  }

  goBack() {
    this.navCtrl.pop();
  }

  afterForgotPassword(res: any) {
    this.alertCtrl.create({
      title: 'Success',
      message: res.message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    }).present();
  }
}
