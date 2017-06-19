import { Component } from '@angular/core';
import { LoadingController, NavController, AlertController, NavParams } from 'ionic-angular';
import { GeneralService } from '../../service/general.service';
import { UserService } from '../../service/user.service';
import { LoginPage } from '../login/login';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html'
})
export class AddressPage {
  states: any = [];
  districts: any = [];
  selectedState: any;
  selectedDistrict: any;
  addressData: any = {};
  constructor(
    private navCtrl: NavController,
    private generalService: GeneralService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private localStorageService: LocalStorageService,
    private navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.getAsyncData();
    console.log(this.navParams.get('addrLine1'))
  }

  getAsyncData() {
    let self = this;
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    this.generalService.getStateDistrictList().then(function(res) {
      self.states = res.states;
      self.addressData.addressLine1 = self.navParams.get('addrLine1');
      self.addressData.addressLine2 = self.navParams.get('addrLine2');
      self.addressData.selectedState = self.navParams.get('state_id');
      self.updateDistrictList(self.navParams.get('state_id'));
      self.addressData.selectedDistrict = self.navParams.get('city_id');
      self.addressData.pincode = self.navParams.get('Pin');
      self.addressData.addressId = self.navParams.get('address_id');
      loadingDialog.dismiss();
    }).catch(function(error) {
      loadingDialog.dismiss();
      self.getCloseErrorAlert(
        'Some Error Has Occured',
        error
      ).present();
    });
  }

  getCloseErrorAlert(title: string, message: string) {
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

  updateDistrictList(state_id) {
    this.districts = this.states.find((state) => state.id == state_id).district_list;
    this.selectedDistrict = undefined;
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
    this.userService.editAddress(this.addressData, token).then(function(res) {
      loadingDialog.dismiss();
      self.afterEditAddress(res);
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

  getToken() {
    return this.localStorageService.get('token');
  }

  validateForm() {
    if (!this.addressData.addressLine1) {
      return 'Please enter address line 1';
    }

    if (!this.addressData.selectedState) {
      return 'Please select state';
    }

    if (!this.addressData.selectedDistrict) {
      return 'Please select district';
    }

    if (!this.addressData.pincode) {
      return 'Please enter pincode';
    }

    return null;
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

  afterEditAddress(res: any) {
    this.alertCtrl.create({
      title: 'Success',
      message: res.message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.goBack();
        }
      }]
    }).present();
  }
}
