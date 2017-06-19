import { Component } from '@angular/core';
import { LoadingController, NavController, AlertController } from 'ionic-angular';
import { GeneralService } from '../../service/general.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'page-fabricator-register',
  templateUrl: 'register.html'
})
export class FabricatorRegisterPage {
  states: any = [];
  districts: any = [];
  identifications: any = [];
  dob = new Date().toISOString();
  selectedState: any;
  selectedDistrict: any;
  registerData: any = {};
  constructor(
    private navCtrl: NavController,
    private generalService: GeneralService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }

  ionViewWillEnter() {
    this.getAsyncData();
  }

  getAsyncData() {
    let self = this;
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    this.generalService.getStateDistrictList().then(function(res) {
      self.states = res.states;
      self.generalService.getIdentificationList().then(function(res) {
        self.identifications = res.identifications;
        loadingDialog.dismiss();
        //self.dob = '1988-02-25'
      }).catch(function(error) {
        loadingDialog.dismiss();
        self.getCloseErrorAlert(
          'Some Error Has Occured',
          error
        ).present();
      });
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

    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();

    let self = this;
    this.authService.register(this.registerData).then(function(res) {
      loadingDialog.dismiss();
      self.afterRegistration(res);
    }).catch(function(error) {
      loadingDialog.dismiss();
      self.getErrorAlert(
        'Some Error Has Occured',
        error
      ).present();
    });
  }

  validateForm() {
    if (!this.registerData.firstName) {
      return 'Please enter first name';
    }

    if (!this.registerData.lastName) {
      return 'Please enter last name';
    }

    if (!this.registerData.dob) {
      return 'Please enter date of birth';
    }

    if (!this.registerData.phoneNumber) {
      return 'Please enter 10 digit mobile number';
    }

    if (!this.registerData.identificationType) {
      return 'Please select identification type';
    }

    if (!this.registerData.identificationValue) {
      return 'Please select identification value';
    }

    if (!this.registerData.addressLine1) {
      return 'Please enter address line 1';
    }

    if (!this.registerData.selectedState) {
      return 'Please select state';
    }

    if (!this.registerData.selectedDistrict) {
      return 'Please select district';
    }

    if (!this.registerData.pincode) {
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

  afterRegistration(res: any) {
    this.alertCtrl.create({
      title: 'Fabricator Registration',
      message: res.message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.goBack();
        }
      }]
    }).present();
  }
}
