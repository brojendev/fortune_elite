import { Component } from '@angular/core';
import { LoadingController, NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ActionSheetController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalStorageService } from 'angular-2-local-storage';
import { DealerService } from '../../service/dealer.service';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-register-purchase',
  templateUrl: 'register_purchase.html'
})
export class RegisterPurchasePage {
  dealer: any;
  selectedProduct: any;
  quantity: any;
  date: any;
  attachedImage: any;
  purchaseData: any = {};
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              public platform: Platform,
              private toast: Toast,
              private toastCtrl: ToastController,
              private dealerService: DealerService,
              private loadingCtrl: LoadingController,
              private localStorageService: LocalStorageService,
              private alertCtrl: AlertController) {
    this.dealer = this.navParams.data.dealer;
    this.purchaseData.dealertContactId = this.dealer.contact_id
  }

  submit() {
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }
    console.log(this.purchaseData);

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
    this.dealerService.registerPurchase(token, this.purchaseData).then(function(res) {
      loadingDialog.dismiss();
      self.removeAttachedImage();
      self.purchaseData.quantity = '';
      self.purchaseData.date = '';
      if(self.platform.is('cordova')){
        self.toast.show(res.message, '2000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }
    }).catch(function(error) {
      loadingDialog.dismiss();
      self.getErrorAlert(
        'Alert',
        error.message
      ).present();
    });
  }

  validateForm() {
    if (!this.purchaseData.quantity) {
      return 'Please enter quantity';
    }
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
          //this.navCtrl.pop();
        }
      }]
    });
  }
  getToken() {
    return this.localStorageService.get('token');
  }

  openImageDialog() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Select from gallery',
          handler: () => {
            this.getPicture(0);
          }
        },{
          text: 'Take photo',
          handler: () => {
            this.getPicture(1);
          }
        },{
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  getPicture(type) {
    let options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: true,
      sourceType: type,
    }

    let self = this;

    this.camera.getPicture(options).then((imageData) => {
      self.purchaseData.invoice = imageData;
    }, (err) => {
      console.log(err);
      this.toastCtrl.create({
        message: err,
        duration: 3000
      }).present();
    });
  }

  removeAttachedImage() {
    this.purchaseData.invoice = undefined;
  }
}
