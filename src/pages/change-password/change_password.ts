import { Component} from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { UserService } from '../../service/user.service';
import { LoginPage } from '../login/login';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change_password.html'
})
export class ChangePasswordPage {
  passwordData: any = {
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined
  }
  showmenu = true;
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private userService: UserService,
    private localStorageService: LocalStorageService) {

      if(this.localStorageService.get('force_pass_chaged') == 1){
        this.showmenu = false;
      }
  }

  validateForm() {
    if (!this.passwordData.oldPassword) {
      return 'Please enter old password';
    }

    if (!this.passwordData.newPassword) {
      return 'Please enter new password';
    }

    if (!this.passwordData.confirmPassword) {
      return 'Please confirm new password';
    }

    if (this.passwordData.newPassword != this.passwordData.confirmPassword) {
      return 'New password and confirmed password must be same';
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

    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }

    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();

    let self = this;
    this.userService.changePassword(this.passwordData, token).then(function(res) {
      loadingDialog.dismiss();
      self.afterChangePassword(res);
    }).catch(function(error) {
      loadingDialog.dismiss();
      if (!error.isTokenValid) {
        self.navCtrl.setRoot(LoginPage);
        return;
      }
      self.getErrorAlert(
        'Error',
        error.message
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
      buttons: ['Dismiss']
    })
  }

  goBack() {
    this.navCtrl.pop();
  }

  getToken() {
    return this.localStorageService.get('token');
  }

  afterChangePassword(res: any) {
    this.alertCtrl.create({
      title: 'Change Password',
      message: res.message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.navCtrl.setRoot(LoginPage);
        }
      }]
    }).present();
  }
}
