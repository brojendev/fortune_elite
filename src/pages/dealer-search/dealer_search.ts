import { Component } from '@angular/core';
import { LoadingController, NavController, AlertController, NavParams } from 'ionic-angular';
import { GeneralService } from '../../service/general.service';
import { DealerService } from '../../service/dealer.service';
import { LoginPage } from '../login/login';
import { DealerSearchResultPage } from './result';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-dealer-search',
  templateUrl: 'dealer_search.html'
})
export class DealerSearchPage {
  states: any = [];
  districts: any = [];
  selectedState: any;
  selectedDistrict: any;
  dealerCompName: any;
  pageNumber: number = 1;
  filter: any;

  registerPurchase: boolean = false;
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private generalService: GeneralService,
    private dealerService: DealerService,
    private loadingCtrl: LoadingController,
    private localStorageService: LocalStorageService,
    private alertCtrl: AlertController) {
      this.registerPurchase = this.navParams.data ? !!this.navParams.data.registerPurchase : false;
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

  searchByLocation() {
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }
    let validationError = this.validateForm(1);
    if (validationError) {
      this.getErrorAlert(
        'Incorrect Information',
        validationError
      ).present();
      return;
    }

    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    this.filter = {state_id: this.selectedState, dist_id: this.selectedDistrict}
    // Search API call then pass data to next page
    let self = this;
    this.dealerService.getDealerList(token, this.pageNumber, this.filter).then(function(res) {
      loadingDialog.dismiss();
      self.openResults(res.sale_data_contacts);
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

  searchByDealerCompanyName() {
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }
    let validationError = this.validateForm(0);
    if (validationError) {
      this.getErrorAlert(
        'Incorrect Information',
        validationError
      ).present();
      return;
    }

    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    this.filter = {dealerCompName: this.dealerCompName}
    // Search API call then pass data to next page
    let self = this;
    this.dealerService.getDealerList(token, this.pageNumber, this.filter).then(function(res) {
      loadingDialog.dismiss();
      self.openResults(res.sale_data_contacts);
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

  validateForm(type: any) {
    if (type == 1 && !this.selectedState) {
      return 'Please select state';
    }

    if (type == 1 && !this.selectedDistrict) {
      return 'Please select district';
    }

    if (type == 0 && !this.dealerCompName) {
      return 'Please enter company name';
    }

    if (type == 0 && this.dealerCompName.length < 3) {
      return 'Please enter at lease 3 charecter';
    }

    return null;
  }


  getErrorAlert(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          //this.navCtrl.pop();
        }
      }]
    });
  }
  getToken() {
    return this.localStorageService.get('token');
  }

  openResults(data: any) {
    this.navCtrl.push(DealerSearchResultPage, { dealers: data, registerPurchase: this.registerPurchase });
  }
}
