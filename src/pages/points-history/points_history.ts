import { Component } from '@angular/core';
import { LoadingController, NavController, AlertController } from 'ionic-angular';
import { UserService } from '../../service/user.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-points-history',
  templateUrl: 'points_history.html'
})
export class PointsHistoryPage {
  history: any;
  availablePoints: any;
  creditBalance: any;
  debitBalance: any;
  constructor(private navCtrl: NavController,
              private userService: UserService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private localStorageService: LocalStorageService) {
    this.availablePoints = this.localStorageService.get('available_points');
  }

  ionViewWillEnter() {
    this.getPointStatement();
  }

  getPointStatement() {
    let self = this;
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      loadingDialog.dismiss();
      return;
    }

    this.userService.getPointStatement(token).then(function(res) {
      loadingDialog.dismiss();
      self.localStorageService.set('available_points', res.available_balance);
      self.availablePoints = res.available_balance
      self.history = res.trnasc_list;
      self.creditBalance = res.credit_balance
      self.debitBalance = res.debit_balance
    }).catch(function(error) {
      loadingDialog.dismiss();
      if (!error.isTokenValid) {
        self.navCtrl.setRoot(LoginPage);
        return;
      }
      self.getErrorAlert(
        'Some Error Has Occured',
        error.message
      ).present();
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
}
