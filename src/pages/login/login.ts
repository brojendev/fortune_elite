import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ForgotPasswordPage } from '../forgot-password/forgot_password';
import { ChangePasswordPage } from '../change-password/change_password';
import { FabricatorRegisterPage } from '../fabricator-register/register';
import { AuthService } from '../../service/auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { SharedService } from '../../service/shared.service';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  userName: string;
  password: string;
  isRoot: boolean = false;
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService) {
      if (!this.navCtrl.parent) {
        this.isRoot = true;
      }
  }

  ngOnInit() {
    this.localStorageService.remove('token', 'profile_pic');
    this.sharedService.broadcast({ 'name': 'logout' });
  }

  validateForm() {
    if (!this.userName) {
      return 'Please enter correct username';
    }

    if (!this.password) {
      return 'Please enter correct password';
    }

    return null;
  }

  login() {
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
    this.authService.login({
      userName: this.userName,
      password: this.password,
      deviceId: this.localStorageService.get('device_id')
    }).then(function(res) {
      loadingDialog.dismiss();
      self.afterLogin(res);
    }).catch(function(msg) {
      loadingDialog.dismiss();
      self.getErrorAlert(
        'Some Error Has Occured',
        msg
      ).present();
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

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
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

  afterLogin(res: any) {
    this.localStorageService.set('token', res.token);
    this.localStorageService.set('profile_pic', res.BaseUrl + res.profile_pic);
    this.localStorageService.set('available_points', res.available_points);
    this.localStorageService.set('first_name', res.first_name);
    this.localStorageService.set('cartCount', res.total_count);
    if(res.force_pass_chaged == 1){
      this.localStorageService.set('force_pass_chaged', res.force_pass_chaged);
      this.navCtrl.setRoot(ChangePasswordPage);
    }else{
      this.sharedService.broadcast({ 'name': 'login' });
      if (this.isRoot) {
        this.navCtrl.setRoot(HomePage);
      } else {
        this.goBack();
      }
    }

  }

  openRegistrationPage() {
    this.navCtrl.push(FabricatorRegisterPage);
  }

  showPassword(input: any){
   input.type = input.type === 'password' ?  'text' : 'password';
  }
}
