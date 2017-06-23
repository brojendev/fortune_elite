import { Component } from '@angular/core';
import { LoadingController, NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ActionSheetController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalStorageService } from 'angular-2-local-storage';
import { DealerService } from '../../service/dealer.service';

import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-sales-approval',
  templateUrl: 'sales_approval.html'
})
export class SalesApprovalPage {
  dealers: any;
  selectedProduct: any;
  quantity: any;
  date: any;
  attachedImage: any;
  purchaseData: any = {};
  multiSelect: boolean = false;
  selectedItemCount: number = 0
  selectedDealer: number[];
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              public platform: Platform,
              private toast: Toast,
              private toastCtrl: ToastController,
              private DealerService: DealerService,
              private loadingCtrl: LoadingController,
              private localStorageService: LocalStorageService,
              private alertCtrl: AlertController) {
    /*this.dealers = [{id: 1, name: "Brojendra Nath Das", mobile: 9002293496, email: 'brojendra.das@mjunction.in', purchaseData: '2017-06-20', purchaseQty: 20},
                    {id: 2, name: "Brojendra Nath Das", mobile: 9002293496, email: 'brojendra.das@mjunction.in', purchaseData: '2017-06-20', purchaseQty: 20},
                    {id: 3, name: "Brojendra Nath Das", mobile: 9002293496, email: 'brojendra.das@mjunction.in', purchaseData: '2017-06-20', purchaseQty: 20}];*/
    this.getSaleList();
    this.selectedDealer = [];
    this.dealers = [];

  }


  getSaleList(){
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();
    let token = this.getToken();
    if (!token) {
      this.navCtrl.setRoot(LoginPage);
      return;
    }

    let self = this;
    this.DealerService.getInfluencerSaleList(token).then(function(res) {
      loadingDialog.dismiss();
      //console.log(res)
      self.dealers = res.children_rec;
    }).catch(function(error) {
      loadingDialog.dismiss();
      if (!error.isTokenValid) {
        self.navCtrl.setRoot(LoginPage);
        return;
      }

      self.getErrorAlert(
        'Alert',
        error.message,
        error.message_code
      ).present();

    });
  }

  ionViewCanLeave(){
    console.log('Test');
    if(this.multiSelect == true){
      this.multiSelect = false;
      return false
    } else{
      return true
    }
  }

  hardBackClick(){
    if(this.multiSelect == true){
      this.multiSelect = false;
    } else{
      this.navCtrl.pop();
    }
  }

  enableMultiselect(selectedDealer){
    console.log(selectedDealer);
    this.multiSelect = true;
    this.selectedDealer = [];
    this.selectedItemCount = 0;
  }

  approveDealer(selectedSales: any,event: any){
    //this.selectedSales=[dealer.sale_id];
    let token = this.getToken();
      if (!token) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }

      if(event=='approve'){
      let res_mode = '1';

      if(selectedSales==''){
        this.getErrorAlert(
            'Alert',
            'Please select atleast one sale'
          ).present();
      }else{
        let alert = this.alertCtrl.create({
          title: 'Confirm purchase',
          message: 'Do you want to accept this sale?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Accept',
              handler: () => {
              console.log('approved   '+selectedSales);
               this.updateDealerSale(selectedSales,res_mode);
              }
            }
          ]
        });
        alert.present();
      }


      }else{
      let res_mode = '0';

      if(selectedSales==''){
        this.getErrorAlert(
            'Alert',
            'Please select atleast one sale'
          ).present();
      }else{
      let alert = this.alertCtrl.create({
        title: 'Confirm purchase',
        message: 'Do you want to reject this sale?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Reject',
            handler: () => {
            console.log('rejected   '+selectedSales);
              this.updateDealerSale(selectedSales,res_mode);
            }
          }
        ]
      });
      alert.present();
      }

      }
  }


  updateDealerSale(selectedSales: any,res_mode: any){
    let loadingDialog = this.getLoadingDialog();
    loadingDialog.present();

    let token = this.getToken();
      if (!token) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }

      let self = this;

      this.DealerService.SaleConfirm(token,selectedSales,res_mode).then(function(res) {
        loadingDialog.dismiss();
        console.log(res)
        self.dealers = res.sale_data;
        if(res.sale_data.length <= 0){
          //self.navCtrl.setRoot(self.navCtrl.getActive().component);
          self.navCtrl.pop();
        }
      }).catch(function(error) {
      console.log('error: '+error);
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
      //console.log(selectedSales);
  }

  selectDealer(dealer: any){
    if(dealer){
      let index = this.selectedDealer.indexOf(dealer.sale_id);
      if(index > -1){
         this.selectedDealer.splice(index, 1);
         this.selectedItemCount --;
      } else{
        this.selectedDealer.push(dealer.sale_id);
        this.selectedItemCount ++;
      }
    }
    if(this.selectedItemCount == 0){
      this.multiSelect = false;
    }
    //console.log(this.selectedDealer);
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

  getErrorAlert(title: string, message: string, msg_code: string = '') {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          if(msg_code=='msg_0091'){
            this.navCtrl.pop();
          }
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
