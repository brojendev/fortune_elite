import { Component } from '@angular/core';
import { LoadingController, NavController, AlertController } from 'ionic-angular';
import { UserService } from '../../service/user.service';
import { SharedService } from '../../service/shared.service';
import { LoginPage } from '../login/login';
import { ChangePasswordPage } from '../change-password/change_password';
import { LocalStorageService } from 'angular-2-local-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { PointsHistoryPage } from '../points-history/points_history';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  profileImage: string = 'assets/profile_placeholder.png';
  profile = {};
  availablePoints: any;
  content: any = '';

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private sharedService: SharedService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private _DomSanitizationService: DomSanitizer,
    private localStorageService: LocalStorageService) {
  }

  ionViewWillEnter() {
    this.getProfileData();
  }

  getProfileData() {
    let self = this;
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      loadingDialog.dismiss();
      return;
    }
    this.userService.getProfile(token).then(function(res) {
      loadingDialog.dismiss();
      self.afterProfileFetch(res);
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


  getToken() {
    return this.localStorageService.get('token');
  }

  afterProfileFetch(res: any) {
    for (let list of res.content_details){
      if(list.title == 'mobile'){
        this.content = this.strip(list.details)
      }
    }
    this.profile = res.profile;
    this.profileImage = this.profile['BaseUrl'] + this.profile['profile_pic'];
    this.localStorageService.set('profile_pic', this.profileImage);
    this.availablePoints = this.localStorageService.get('available_points')
    this.sharedService.broadcast({ 'name': 'profile_update' });
  }

  strip(html: string) {
  	return html.replace(/<(?:.|\n)*?>/gm, '');
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

  editAddressAlert(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          //this.navCtrl.pop();
        }
      }]
    });
  }

  openChangePasswordPage() {
    this.navCtrl.push(ChangePasswordPage);
  }

  openEditAddress() {
    // this.navCtrl.push(AddressPage, this.profile);
    this.editAddressAlert('Alert', 'Please contact tollfree no '+this.content).present();
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
      self.uploadProfilePic(imageData);
    }, (err) => {
      console.log(err);
      this.toastCtrl.create({
        message: err,
        duration: 3000
      }).present();
    });
  }


  uploadProfilePic(imageData) {
    let self = this;
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }
    console.log(imageData);
    this.userService.changeProfilePic(imageData, token).then(function(res) {
      loadingDialog.dismiss();
      self.getProfileData();
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

  logout() {
    this.localStorageService.remove('force_pass_chaged');
    this.localStorageService.remove('cartCount')
    this.navCtrl.setRoot(LoginPage);
  }

  showPointsHistory() {
    this.navCtrl.push(PointsHistoryPage);
  }
}
